var sql = require("mssql");

var sqlQuery = "@variable";

var generic = function(num, callback) {

    var config = {
        "server": "microsoft-sql-database.cgkepgzez06k.us-east-2.rds.amazonaws.com",
        "user": "admin",
        "password": "password",
        "database": "READER"
    };

    sql.connect(config, err => {
        new sql.Request().input('variable', sql.Int, num)
        .query(sqlQuery, (err, results) => {
            if(err) {
                //callback(err, null);
                console.log(err);
                sql.close();
            }
            else {
                //callback(null, results['recordset']);
                console.log(results['recordset'])
                sql.close();
            }
        })
    });


};

exports.query = generic;
