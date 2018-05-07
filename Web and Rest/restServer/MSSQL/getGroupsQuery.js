var sql = require("mssql");

var sqlQuery = "SELECT ID, NAME FROM GROUPS WHERE ADMIN_ID = @adminId;";

var getGroups = function(adminId, callback) {

    var config = {
        "server": "microsoft-sql-database.cgkepgzez06k.us-east-2.rds.amazonaws.com",
        "user": "admin",
        "password": "password",
        "database": "READER"
    };

    sql.connect(config, err => {
        new sql.Request().input('adminId', sql.Int, adminId)
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
                    if(!seen.includes(rec[i]["ID"])) {
                        seen = seen.concat(rec[i]["ID"]);
                        final = final.concat(rec[i]);
                    }
                }

                callback(null, final);
                sql.close();
            }
        })
    });


};

exports.query = getGroups;
