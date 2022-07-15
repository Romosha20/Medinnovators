const UserSymptoms = require("../models/userSymptoms.model.js");

exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    const userSymptoms = new UserSymptoms({
        id: req.body.id || null,
        user_id: req.body.user_id,
        symptoms_id: req.body.symptoms_id
    });
    UserSymptoms.create(userSymptoms, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the user."
            });
        else {
        res.send(data);
        }
    }
    );
}
exports.findAllByUserId = (req, res) => {
    UserSymptoms.findAllByUserId(req.body.user_id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the user."
            });
        else res.send(data);
    }
    );
}

exports.findAll = (req, res) => {
    UserSymptoms.findAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the user."
            });
        else res.send(data);
    }
    );
}