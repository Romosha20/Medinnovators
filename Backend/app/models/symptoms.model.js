const sql = require("./db.js");

const Symptoms = function(symptoms) {
    this.sym_id = symptoms.sym_id;
    this.symptoms = symptoms.symptoms;
    this.severity = symptoms.severity;
}

Symptoms.create = (newSymptoms, result) => {
    sql.query("INSERT INTO symptoms SET ?", newSymptoms, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        // console.log("created symptoms: ", { id: res.insertId, ...newSymptoms });
        result(null, { id: res.insertId, ...newSymptoms });
    });
}

Symptoms.findById = (id, result) => {
    sql.query(`SELECT * FROM symptoms WHERE sym_id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            // console.log("found symptoms: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found symptoms with the id
        result({ kind: "not_found" }, null);
    });
}
Symptoms.findAll = (result) => {
    sql.query("SELECT * FROM symptoms", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        // console.log("symptoms: ", res);
        result(null, res);
    });
}
module.exports = Symptoms;