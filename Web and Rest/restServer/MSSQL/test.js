const sql = require('mssql');

var config = {
    "server": "microsoft-sql-database.cgkepgzez06k.us-east-2.rds.amazonaws.com",
    "user": "admin",
    "password": "password",
    "database": "READER"
};

sql.connect(config, err => {
    new sql.Request().query('SELECT * FROM USERS', (err1, result1) => {
        new sql.Request().query('SELECT * FROM BOOKS', (err2, result2) => {
            console.log(result2);
        })
    })
});
