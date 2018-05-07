var sql = require("mssql");

var getLessonsByBookId = function(num, callback) {

    var config = {
        "server": "microsoft-sql-database.cgkepgzez06k.us-east-2.rds.amazonaws.com",
        "user": "admin",
        "password": "password",
        "database": "READER"
    };

    sql.connect(config, err => {
        new sql.Request().input('bookId', sql.Int, num)
        .query('SELECT * FROM LESSONS WHERE LESSONS.BOOK_ID = @bookId', (err, results) => {
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

exports.query = getLessonsByBookId;
