const mysql = require("mysql");


let exportsMethod = {
getBooksQuery(con, callback){
	var bookQuery = con.query('SELECT * FROM BOOKS', function(err, rows, fields) {
		
		if(!err){
			if(rows){
				callback(null, rows);
			}
		}
		else{
			callback(err, null);
			console.log('Error during books query');
		}

	});
},
updateUserComplete(con, user_id, assignment_id, callback){

con.query('SELECT * FROM STATUS WHERE EMPLOYEE_ID=' + mysql.escape(user_id) + ' AND ASSIGNMENT_ID=' + mysql.escape(assignment_id), function(err, rows){
	
		if(!err){
			if(rows[0] === undefined){
				callback("User or assignment does not exist", null);
			}
			else{
				con.query('UPDATE STATUS SET IS_COMPLETE=1 WHERE EMPLOYEE_ID=' + mysql.escape(user_id) + ' AND ASSIGNMENT_ID=' + mysql.escape(assignment_id), function(err2, rows2){
					if(err2){
						callback(err2, null)
					}
					else{
						con.commit(function(err3){
							if(err3){
								callback(err3, null)
							}
							else{
								callback(null, rows2)
							}
						})
					}
				})
			}
		}
		else{
			callback(err, null)
		}
		
	})
},
getGroup(con, userid, groupid, callback){
	con.query('SELECT DISTINCT LESSONS.ID as id, LESSONS.NAME as name, ASSIGNMENTS.DUE_DATE as due_date, ASSIGNMENTS.TIME_TO_COMPLETE as time_to_read, STATUS.IS_COMPLETE  as complete, LESSONS.PDF_FILE as filename FROM USERS, GROUPS, ASSIGNMENTS, LESSONS, STATUS WHERE USERS.ID=' + mysql.escape(userid) + ' AND GROUPS.ID=' + mysql.escape(groupid) + ' AND ASSIGNMENTS.GROUP_ID=GROUPS.ID AND STATUS.GROUP_ID=GROUPS.ID AND STATUS.EMPLOYEE_ID=USERS.ID AND ASSIGNMENTS.LESSON_ID=LESSONS.ID', function(err, rows){
	if(!err){
		callback(null, rows);
	}
	else{
		callback(err, null);
	}
	})
},
getUsersQuery(con, callback){

	var userQuery = con.query('SELECT * FROM USERS', function(err, rows, fields) {
		if(!err){
			if(rows){
				callback(null, rows);
			}
		}
		else{
			callback(err, null);
			console.log('Error getUsers query');
		}
	});

},
isUser(con, email, callback){
	var isUserQuery = con.query('SELECT ID FROM USERS WHERE EMAIL = ' + mysql.escape(email), function(err, rows){
		if(!err){
			if(rows){
				callback(null, rows);
			}
			else{
				callback(null, null);
			}
		}
		else{
			callback(err, null);
			console.log('Error during isUser query')
		}
	});
},
nest(theJson, index, array){
	var assignment = {
	"assignment_id" : theJson.assignment_id,
	"assignment_name" : theJson.assignment_name, 
	"start_page" : theJson.start_page, 
	"end_page" : theJson.end_page, 
	"reading_time" : theJson.reading_time, 
	"due_date" : theJson.due_date, 
	"file" : theJson.file, 
	"complete" : parseInt(theJson.complete.toString('hex')) 
	}
	//console.log(assignment)
	theJson["assignment"] = assignment;
	delete theJson['assignment_id'];
	delete theJson['assignment_name'];
	delete theJson['start_page'];
	delete theJson['end_page'];
	delete theJson['reading_time'];
	delete theJson['due_date'];
	delete theJson['file'];
	delete theJson['complete'];
	
}
	
}

module.exports = exportsMethod;