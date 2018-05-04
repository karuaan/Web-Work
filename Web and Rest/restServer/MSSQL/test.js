var getBooks = require("./getBooksQuery");
var util = require("./util");

var config = {
    "server": "microsoft-sql-database.cgkepgzez06k.us-east-2.rds.amazonaws.com",
    "user": "admin",
    "password": "password",
    "database": "READER"
};

util.log(getBooks.query(config));
