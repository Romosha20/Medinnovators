const Symptoms = require("../models/symptoms.model");

exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const symptoms = new Symptoms({
        symptoms: req.body.symptoms,
        severity: req.body.severity
    });

    symptoms.create(symptoms, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the user."
            });
        else res.send(data);
    });
};

exports.findAll = (req, res) => {
    Symptoms.findAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the user."
            });
        else res.send(data);
    });
}
