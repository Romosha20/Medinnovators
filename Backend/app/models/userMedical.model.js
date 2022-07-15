const sql = require("./db.js");

const UserMedical = function(userMedical) {
    this.id = userMedical.id;
    this.user_id = userMedical.user_id;
    this.name = userMedical.name;
    this.dosage =   userMedical.dosage;
    this.from_date = userMedical.from_date;
    this.to_date = userMedical.to_date;
    this.user_symptoms_ids = userMedical.user_symptoms_ids;
    this.low_risk = userMedical.low_risk;
    this.medium_risk = userMedical.medium_risk;
    this.high_risk = userMedical.high_risk;
    this.medicine = userMedical.medicine;

}


UserMedical.create = (newUserMedical, result) => {
    sql.query("INSERT INTO user_medical_info SET ?", newUserMedical, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        // console.log("created userMedical: ", { id: res.insertId, ...newUserMedical });
        result(null, { id: res.insertId, ...newUserMedical });
    });
}

UserMedical.findAll = (result) => {
    sql.query("SELECT * FROM user_medical_info", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
}
UserMedical.findAllByUserId = (user_id, result) => {
    sql.query(`SELECT * FROM user_medical_info WHERE user_id = ${user_id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
}


module.exports = UserMedical;

