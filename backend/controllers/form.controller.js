const crypto = require('crypto');
const Form = require('../models/Form.model');
const Guest = require('../models/Guest.model');
const FormGuest = require('../models/FormGuest.model');
const FormResponse = require('../models/FormResponse.model');

// admin apis

exports.createForm = async (req, res) => {
  try {
    const newForm = await Form.create(req.body);
    res.status(201).json(newForm);
  } catch (err) {
    res.status(400).json({ message: 'Error creating form', error: err.message });
  }
};

exports.getAllForms = async (req, res) => {
  try {
    const forms = await Form.find({}).sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching forms', error: err.message });
  }
};

exports.addGuestsAndGenerateLinks = async (req, res) => {
  const { formId } = req.params;
  const { guests } = req.body;

  try {
    const formExists = await Form.findById(formId);
    if (!formExists) return res.status(404).json({ message: 'Form not found' });

    const links = [];

    for (const g of guests) {
      let guest = await Guest.findOne({ email: g.email });
      if (!guest) {
        guest = await Guest.create({ name: g.name, email: g.email });
      }

      const token = crypto.randomBytes(24).toString('hex');

      await FormGuest.create({
        formId,
        guestId: guest._id,
        token
      });

      links.push({ 
        name: g.name, 
        email: g.email, 
        token: token,
        link: `/form/${token}`
      });
    }

    res.json({ success: true, count: links.length, links });
  } catch (err) {
    res.status(500).json({ message: 'Error adding guests and generating links', error: err.message });
  }
};

exports.getFormResponses = async (req, res) => {
  try {
    const responses = await FormResponse.find({ formId: req.params.formId })
      .populate({
        path: 'formGuestId',
        select: 'isSubmitted createdAt guestId',
        populate: {
          path: 'guestId',
          select: 'name email'
        }
      })
      .select('answers submittedAt');
      
    const structuredResponses = responses.map(r => ({
        id: r._id,
        submittedAt: r.submittedAt,
        answers: r.answers,
        guest: {
            id: r.formGuestId.guestId._id,
            name: r.formGuestId.guestId.name,
            email: r.formGuestId.guestId.email,
        }
    }));

    res.json(structuredResponses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching responses', error: err.message });
  }
};


exports.getFormByToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    const accessRecord = await FormGuest.findOne({ token })
      .populate('formId', 'title adminNote fields expiresAt') 
      .populate('guestId', 'name');

    if (!accessRecord) {
      return res.status(404).json({ message: 'Invalid or expired access token.' });
    }

    if (accessRecord.isSubmitted) {
      return res.status(200).json({ 
         status: 'submitted',
         message: 'Response already recorded' 
      });
    }

    if (accessRecord.formId.expiresAt && new Date() > new Date(accessRecord.formId.expiresAt)) {
      return res.status(410).json({
        status: 'expired',
        message: 'The deadline for this form has passed.',
        formTitle: accessRecord.formId.title
      }); 
    }

    res.json({
      status: 'active',
      form: accessRecord.formId,
      guestName: accessRecord.guestId.name,
      formGuestId: accessRecord._id
    });

  } catch (err) {
    res.status(500).json({ message: 'Error retrieving form', error: err.message });
  }
};

exports.deleteForm = async (req , res) => {
  const { formId } = req.params;
  
}

exports.submitFormResponse = async (req, res) => {
  const { formId } = req.params;
  const { formGuestId, answers } = req.body;

  try {
    const accessRecord = await FormGuest.findById(formGuestId);

    if (!accessRecord || accessRecord.formId.toString() !== formId) {
      return res.status(401).json({ message: 'Unauthorized submission attempt.' });
    }
    if (accessRecord.isSubmitted) {
      return res.status(403).json({ message: 'Duplicate submission prevention triggered.' });
    }
    
    await FormResponse.create({
      formId,
      formGuestId,
      answers
    });

    accessRecord.isSubmitted = true;
    await accessRecord.save();

    res.status(201).json({ message: 'Response submitted successfully.' });
  } catch (err) {
    res.status(400).json({ message: 'Submission failed', error: err.message });
  }
};