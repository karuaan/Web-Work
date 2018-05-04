var sql = require("seriate");

var getBooksQuery = function(callback) {

    var config = {
        "server": "microsoft-sql-database.cgkepgzez06k.us-east-2.rds.amazonaws.com",
        "user": "admin",
        "password": "password",
        "database": "READER"
    };

    sql.setDefaultConfig(config);

    sql.execute({
        query: sql.fromFile("./SQL/getBooksQuery")
    }).then(function(results) {
        callback(null, results);
    }, function(err) {
        callback(err, null);
    })
};

exports.query = getBooksQuery;
