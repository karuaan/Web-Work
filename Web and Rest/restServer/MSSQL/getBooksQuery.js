const sql = require('mssql');

var getBooksQuery = function(callback) {

    var config = {
        "server": "microsoft-sql-database.cgkepgzez06k.us-east-2.rds.amazonaws.com",
        "user": "admin",
        "password": "password",
        "database": "READER"
    };

    sql.connect(config, err => {
        new sql.Request().query('SELECT * FROM BOOKS', (err, results) => {
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


exports.query = getBooksQuery;
