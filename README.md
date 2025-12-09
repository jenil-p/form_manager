# FormFlow - Dynamic Form Builder & Response Manager

**FormFlow** is a secure, MERN-stack application that allows admins to create dynamic forms, generate unique token-based access links for guests, and manage responses in real-time. It features a clean UI, deadline management, and secure duplicate submission prevention.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 🚀 Features

### 👑 Admin Panel
* **Dynamic Form Builder:** Create forms with various field types (Text, Textarea, Number, Dropdown, Date, Multiselect).
* **Token Generation:** Generate unique, secure links for specific guests (email-mapped).
* **Dashboard:** View all created forms, their status, and creation dates.
* **Response Explorer:** A structured, folder-like interface to view responses (Form -> Guest -> Answer Details).
* **Expiry Management:** Set deadlines for forms. Expired forms automatically block new submissions.

### 👤 Guest Interface
* **Secure Access:** Forms are accessible only via unique, one-time-use tokens.
* **Status Handling:**
    * **Active:** User can fill and submit the form.
    * **Submitted:** "Thank You" screen prevents duplicate entries.
    * **Expired:** "Deadline Missed" screen if the form expiry date has passed.
* **Admin Notes:** View special instructions or notes from the admin at the top of the form.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind-like CSS variables, Lucide React (Icons), Axios.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB, Mongoose.
* **Security:** `crypto` for token generation, strict server-side validation.
