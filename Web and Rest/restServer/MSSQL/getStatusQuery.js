var sql = require("mssql");

var getStatusQuery = function(callback) {

    var config = {
        "server": "microsoft-sql-database.cgkepgzez06k.us-east-2.rds.amazonaws.com",
        "user": "admin",
        "password": "password",
        "database": "READER"
    };

    sql.connect(config, err => {
        new sql.Request().query('SELECT * FROM STATUS', (err, results) => {
            if(err) {
                callback(err, null);
                sql.close();
            }
            else {
                callback(null, results['recordset']);
                sql.close();
            }
        })
    });
};

exports.query = getStatusQuery;
