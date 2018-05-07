var sql = require("mssql");

var sqlQuery = "SELECT GROUP_USER_TABLE.USER_ID AS USER_ID, GROUP_USER_TABLE.GROUP_ID AS GROUP_ID, GROUP_USER_TABLE.USER_FIRST_NAME AS USER_FIRST_NAME, GROUP_USER_TABLE.USER_LAST_NAME AS USER_LAST_NAME, GROUP_USER_TABLE.USER_EMAIL AS USER_EMAIL, GROUP_USER_TABLE.GROUP_NAME AS GROUP_NAME, STATUS.ASSIGNMENT_ID as ASSIGNMENT_ID, STATUS.IS_COMPLETE as IS_COMPLETE, ASSIGNMENTS.NAME as ASSIGNMENT_NAME FROM (SELECT GROUPS.ID as GROUP_ID, GROUPS.NAME as GROUP_NAME, USERS.ID as USER_ID, USERS.FIRST_NAME as USER_FIRST_NAME, USERS.LAST_NAME as USER_LAST_NAME, USERS.EMAIL as USER_EMAIL FROM GROUPS JOIN USERS ON USERS.ID = GROUPS.USER_ID WHERE GROUPS.ADMIN_ID = @adminId) as GROUP_USER_TABLE LEFT JOIN STATUS ON STATUS.EMPLOYEE_ID=GROUP_USER_TABLE.USER_ID LEFT JOIN ASSIGNMENTS ON STATUS.ASSIGNMENT_ID=ASSIGNMENTS.ID";

var getMasterTable = function(num, callback) {

    var config = {
        "server": "microsoft-sql-database.cgkepgzez06k.us-east-2.rds.amazonaws.com",
        "user": "admin",
        "password": "password",
        "database": "READER"
    };

    sql.connect(config, err => {
        new sql.Request().input('adminId', sql.Int, num)
        .query(sqlQuery, (err, results) => {
            if(err) {
                //callback(err);
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

exports.query = getMasterTable;
