var sql = require("mssql");

var sqlQuery = "SELECT ASSIGNMENTS.ID as assignment_id, DUE_DATE, START_DATE, TIME_TO_COMPLETE, ASSIGNMENTS.NAME, BOOKS.ID as book_id, LESSONS.ID as lesson_id FROM (ASSIGNMENTS JOIN GROUPS ON ASSIGNMENTS.GROUP_ID=GROUPS.ID JOIN LESSONS ON LESSONS.ID=ASSIGNMENTS.LESSON_ID JOIN BOOKS ON LESSONS.BOOK_ID=BOOKS.ID) WHERE ASSIGNMENTS.GROUP_ID = @groupId;";

var getAssignments = function(groupId, callback) {

    var config = {
        "server": "microsoft-sql-database.cgkepgzez06k.us-east-2.rds.amazonaws.com",
        "user": "admin",
        "password": "password",
        "database": "READER"
    };

    sql.connect(config, err => {
        new sql.Request().input('groupId', sql.Int, groupId)
        .query(sqlQuery, (err, results) => {
            if(err) {
                callback(err, null);
                sql.close();
            }
            else {

                var rec = results['recordset'];
                var seen = [];
                var final = [];


                for(var i = 0; i < rec.length; i++) {
                    if(!seen.includes(rec[i]["assignment_id"])) {
                        seen = seen.concat(rec[i]["assignment_id"]);
                        final = final.concat(rec[i]);
                    }
                }

                callback(null, final);
                sql.close();
            }
        })
    });


};

exports.query = getAssignments;
