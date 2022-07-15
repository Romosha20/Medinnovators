var stringify = require('json-stringify');
const sql = require("./db.js");

const UserSymptoms = function(userSymptoms) {
    this.id = userSymptoms.id;
    this.user_id = userSymptoms.user_id;
    this.symptoms_id = userSymptoms.symptoms_id;
};


UserSymptoms.create = (newUserSymptoms, result) => {
    sql.query("INSERT INTO user_symptoms SET ?", newUserSymptoms, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        // console.log("created userSymptoms: ", { id: res.insertId, ...newUserSymptoms });
        let ress = 	(stringify(res,null));
        let id = JSON.parse(ress).insertId;
        let userSymptoms = {...newUserSymptoms };
        userSymptoms.id = id;
        result(null, userSymptoms);
})};

UserSymptoms.findAllByUserId = (user_id, result) => {
    sql.query(`SELECT * FROM user_symptoms WHERE user_id = ${user_id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            // console.log("found userSymptoms: ", res[0]);
            result(null, res);
            return;
        }

        // not found userSymptoms with the id
        result({ kind: "not_found" }, null);
    });
}
UserSymptoms.findAll = (result) => {    
    sql.query("SELECT * FROM user_symptoms", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        // console.log("userSymptoms: ", res);
        result(null, res);
    });
}
module.exports = UserSymptoms;
