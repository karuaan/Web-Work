var sql = require("mssql");

var sqlQuery = "SELECT USERS.ID, USERS.FIRST_NAME, USERS.LAST_NAME, USERS.EMAIL, STATUS.IS_COMPLETE FROM USERS JOIN GROUPS ON USERS.ID = GROUPS.USER_ID LEFT JOIN STATUS ON STATUS.EMPLOYEE_ID = USERS.ID AND STATUS.ASSIGNMENT_ID= @assignmentId WHERE GROUPS.ID = @groupId";

var getEmployeesStatus = function(groupId, assignmentId, callback) {

    var config = {
        "server": "microsoft-sql-database.cgkepgzez06k.us-east-2.rds.amazonaws.com",
        "user": "admin",
        "password": "password",
        "database": "READER"
    };

    sql.connect(config, err => {
        new sql.Request()
        .input('assignmentId', sql.Int, assignmentId)
        .input('groupId', sql.Int, groupId)
        .query(sqlQuery, (err, results) => {
            if(err) {
                callback(err, null);
                //console.log(err);
                sql.close();
            }
            else {
                callback(null, results['recordset']);
                //console.log(results['recordset'])
                sql.close();
            }
        })
    });
};

exports.query = getEmployeesStatus;
