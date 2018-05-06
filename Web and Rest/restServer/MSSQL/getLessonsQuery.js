var sql = require("mssql");

var config = {
    "server": "microsoft-sql-database.cgkepgzez06k.us-east-2.rds.amazonaws.com",
    "user": "admin",
    "password": "password",
    "database": "READER"
};

var getLessonsQuery = function(callback) {

    sql.connect(config, err => {
        new sql.Request().query('SELECT LESSONS.ID, LESSONS.BOOK_ID, LESSONS.START_PAGE, LESSONS.END_PAGE, LESSONS.NAME, LESSONS.GROUP_ID, LESSONS.PDF_FILE, ASSIGNMENTS.GROUP_ID AS ASSIGNMENTS_GROUP_IDS FROM LESSONS LEFT JOIN ASSIGNMENTS ON LESSONS.ID = ASSIGNMENTS.LESSON_ID',
            (err, lessons) => {
                if(err) {
                    callback(err, null);
                }
                else {

                    var rec = lessons["recordset"];
                    var master = {};
                    var seen = [];
                    var final = [];

                    for(var i = 0; i < rec.length; i++) {
                        if(master[rec[i]['ID']] == undefined) {
                            master[rec[i]['ID']] = [];
                            master[rec[i]['ID']] = master[rec[i]['ID']].concat(rec[i]['ASSIGNMENTS_GROUP_IDS']);
                        }
                        else {
                            master[rec[i]['ID']] = master[rec[i]['ID']].concat(rec[i]['ASSIGNMENTS_GROUP_IDS']);
                            master[rec[i]['ID']] = Array.from(new Set(master[rec[i]['ID']]));
                        }
                    }

                    for(var i = 0; i < rec.length; i++) {
                        rec[i]['ASSIGNMENTS_GROUP_IDS'] = master[rec[i]['ID']].toString()
                    }

                    for(var i = 0; i < rec.length; i++) {
                        if(seen.includes(rec[i]['ID']) == false) {
                            final = final.concat(rec[i]);
                            seen = seen.concat(rec[i]['ID'])
                        }
                    }

                    callback(null, final);

                }
            })
        });
    };



exports.query = getLessonsQuery;
