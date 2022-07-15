const UserMedical = require("../models/userMedical.model");

exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const userMedical = new UserMedical({
        user_id: req.body.user_id,
        name: req.body.name,
        dosage: req.body.dosage,
        from_date: req.body.from_date,
        to_date: req.body.to_date,
        user_symptoms_ids: req.body.user_symptoms_ids,
        low_risk: req.body.low_risk,
        medium_risk: req.body.medium_risk,
        high_risk: req.body.high_risk,
        medicine: req.body.medicine
    });

    UserMedical.create(userMedical, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the user."
            });
        else res.send(data);
    });
};

exports.findAll = (req, res) => {
    UserMedical.findAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the user."
            });
        else res.send(data);
    }
    );
}

exports.findAllByUserId = (req, res) => {
    UserMedical.findAllByUserId(req.body.user_id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the user."
            });
        else res.send(data);
    }
    );
}
