module.exports = app => {
  const user = require("../controllers/user.controller.js");
  const symptoms = require("../controllers/symptoms.controller.js");
  const userSymptoms = require("../controllers/userSymptoms.controller.js");
  const userMedical = require("../controllers/userMedical.controller.js");


  var router = require("express").Router();

  router.post("/signup", user.create);
  router.post("/signin", user.signin);
  router.get("/:id", user.findOne);

  router.post("/symptoms/create", symptoms.create);
  router.get("/symptoms/findAll", symptoms.findAll);

  router.post("/userSymptoms/create", userSymptoms.create);
  router.get("/userSymptoms/findAll", userSymptoms.findAll);
  router.post("/userSymptoms/findAllByUserId", userSymptoms.findAllByUserId);

  router.get("/userMedical/find", userMedical.findAll);
  router.post("/userMedical/create", userMedical.create);
  router.post("/userMedical/findAllByUserId", userMedical.findAllByUserId);

  router.post('/email/send', function (req, res, next) {

    let htmlContent = "<h1 style=\"color: #5e9ca0;\">Medicover&nbsp;</h1> <h2 style=\"color: #2e6c80;\"><span style=\"text-decoration: underline;\">Medication Info Report</span></h2><h3 style=\"color: #2e6c80;\"><span style=\"color: #993366;\">Patient Name : "+ req.body.patientName +"</span></h3><p><span style=\"color: #808000;\"><strong>Dosage Name : " + req.body.medicine + "</strong></span></p><p><span style=\"color: #ff9900;\"><strong>Dosage Time :  " + req.body.dosage + "</strong></span></p><p><span style=\"color: #333333;\"><strong>Symptoms: "+ req.body.symptoms +"</strong></span></p><h3><span style=\"color: #993366;\"><strong>RISK Factors</strong></span></h3><p><span style=\"color: #00ff00; background-color: #999999;\"><strong>Low Risk: "+ req.body.lowRisk +" %</strong></span></p><p><span style=\"color: #ffff00; background-color: #999999;\"><strong>Medium Risk: "+ req.body.mediumRisk +" %</strong></span></p><p><span style=\"color: #ffffff; background-color: #ff0000;\"><strong>High Risk: "+ req.body.highRisk +" %</strong></span></p><p><strong>&nbsp;</strong></p>";

    const sgMail = require('@sendgrid/mail');
    // const API_KEY = "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";
    const API_KEY = "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";
    sgMail.setApiKey(API_KEY);
    const message = {
      to: "vikasnrgowda@gmail.com",
      from: "vikasnrgowda.1rn16me157@gmail.com",
      subject: "Medication Report",
      text: " ",
      html: htmlContent
    };

    sgMail
      .send(message)
      .then((response) => {
        res.sendStatus(response[0].statusCode);
      })
      .catch((error) => {
        res.send(error)
      })
  });

  app.use('/api', router);
};
