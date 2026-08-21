const cds = require('@sap/cds');
const licenseStore = require('./license/licenseStore');

module.exports = srv => {

  // Accessing STUDENT entity from the service
  const { STUDENT } = srv.entities;

  // Run BEFORE create → validate license and limits 
  srv.before('CREATE', STUDENT, req => {
    const license = licenseStore.get();    // Fetch current license state

     // Block creation if license is expired
    if (new Date() > new Date(license.validity.validTill)) {
      req.reject(403, 'License expired');
    }

    if (license.student.used >= license.student.limit) {
      req.reject(409, 'Student creation limit exceeded');
    }
  });

   // Increment EXACTLY ONCE (side effect)
  srv.after('CREATE', STUDENT, () => {
    licenseStore.incrementStudentCount();
  });

  // 📤 Populate virtual field on ALL reads (UI safe)
  srv.after(['READ', 'CREATE'], STUDENT, data => {
    const license = licenseStore.get();
    const remaining = license.student.limit - license.student.used;

    if (Array.isArray(data)) {
      data.forEach(d => d.remaining = remaining);
    } else if (data) {
      data.remaining = remaining;
    }
  });
};

