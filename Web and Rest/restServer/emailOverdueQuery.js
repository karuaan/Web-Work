const mysql = require('mysql');

con = mysql.createConnection(
	{host: "mysql.cgkepgzez06k.us-east-2.rds.amazonaws.com",
	user: "admin", password: "Stevens2018#MVPHWB",
	port: "3306",
	database: "FEB_2"}
)


function dailyOverdueReport(callback){

    getAllOverdue = "SELECT * FROM STATUS JOIN ASSIGNMENTS ON ASSIGNMENTS.ID = STATUS.ASSIGNMENT_ID JOIN USERS ON STATUS.EMPLOYEE_ID = USERS.ID WHERE STATUS.IS_COMPLETE = 0 AND USERS.IS_ADMIN = 0 AND ASSIGNMENTS.DUE_DATE < CURRENT_DATE();";

    assignments_seen = [];
    groups_seen = [];
    admins_seen = [];
    final = []
    assignments = {};
    groups = {};
    admins = {}

	con.query(getAllOverdue,
	function(err, rows){
		if(err){

		}
        //console.log(rows[0]);

        for(var i = 0; i < rows.length; i++)
        {
            if(!assignments_seen.includes(rows[i]["ASSIGNMENT_ID"]))
            {
                assignments_seen = assignments_seen.concat(rows[i]["ASSIGNMENT_ID"]);
                assignments[rows[i]["ASSIGNMENT_ID"]] = {"due_date": rows[i]["DUE_DATE"], "name": "", "overdue_employees": []};
            }
        }

        for(var i = 0; i < rows.length; i++) {
            assignments[rows[i]["ASSIGNMENT_ID"]]["overdue_employees"] =
            assignments[rows[i]["ASSIGNMENT_ID"]]["overdue_employees"].concat(
                {"first_name": rows[i]["FIRST_NAME"],
                "last_name": rows[i]["LAST_NAME"],
                "email": rows[i]["EMAIL"]
            });
        }

        for (var key in assignments) {
            if(assignments[key]["overdue_employees"].length == 0) {
                delete assignments[key];
            }
        }

        con.query("SELECT * FROM ASSIGNMENTS",
        function(err, rows) {
            if(err) {
                console.log(err);
            }

            for(var i = 0; i < rows.length; i++) {
                if(!groups_seen.includes(rows[i]["GROUP_ID"]))
                {
                    groups_seen = groups_seen.concat(rows[i]["GROUP_ID"]);
                    groups[rows[i]["GROUP_ID"]] = {"name": "", "overdue_assignments": []};
                }
            }

            for(var i = 0; i < rows.length; i++) {
                if(rows[i]['ID'] in assignments) {
                    assignments[rows[i]["ID"]]["name"] = rows[i]["NAME"];
                    groups[rows[i]['GROUP_ID']]["overdue_assignments"] =
                    groups[rows[i]['GROUP_ID']]["overdue_assignments"].concat(assignments[rows[i]["ID"]]);
                }
            }

            for (var key in groups) {
                if(groups[key]["overdue_assignments"].length == 0) {
                    delete groups[key];
                }
            }

            con.query("SELECT * FROM GROUPS",
            function(err, rows) {
                if(err) {
                    console.log(err)
                }
                for(var i = 0; i < rows.length; i++) {
                    if(!admins_seen.includes(rows[i]["ADMIN_ID"])) {
                        admins_seen = admins_seen.concat(rows[i]["ADMIN_ID"]);
                        admins[rows[i]["ADMIN_ID"]] =
                        {"admin_first": "",
                        "admin_last": "",
                        "admin_email": "",
                        "groups": []};
                    }
                }

                groups_seen = []

                for(var i = 0; i < rows.length; i++) {
                    if(rows[i]["ID"] in groups && !groups_seen.includes(rows[i]["ID"])) {
                        groups_seen = groups_seen.concat(rows[i]["ID"]);
                        groups[rows[i]["ID"]]["name"] = rows[i]["NAME"];
                        admins[rows[i]["ADMIN_ID"]]["groups"] =
                        admins[rows[i]["ADMIN_ID"]]["groups"].concat(groups[rows[i]["ID"]]);
                    }
                }

                for (var key in admins) {
                    if(admins[key]["groups"].length == 0) {
                        delete admins[key];
                    }
                }

                con.query("SELECT * FROM USERS",
                function(err, rows) {
                    if(err) {
                        console.log(err);
                    }
                    for(var i = 0; i < rows.length; i++) {
                        if(rows[i]["ID"] in admins) {
                            admins[rows[i]["ID"]]["admin_first"] = rows[i]["FIRST_NAME"];
                            admins[rows[i]["ID"]]["admin_last"] = rows[i]["LAST_NAME"];
                            admins[rows[i]["ID"]]["admin_email"] = rows[i]["EMAIL"];
                        }
                    }
                    for (var key in admins) {
                        final = final.concat(admins[key]);
                    }

                    console.log(final);

                    callback(null, final);

                }
            );
            }
        );

    });




});
}

exports.dailyOverdueReport = dailyOverdueReport;
