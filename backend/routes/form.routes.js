const express = require('express');
const router = express.Router();
const formController = require('../controllers/form.controller');

// admin
router.post('/forms', formController.createForm); 
router.get('/forms', formController.getAllForms); 
router.post('/forms/:formId/guests', formController.addGuestsAndGenerateLinks);
router.get('/forms/:formId/responses', formController.getFormResponses);

// guest
router.get('/forms/token/:token', formController.getFormByToken);
router.post('/forms/:formId/response', formController.submitFormResponse);

module.exports = router;