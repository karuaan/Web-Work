const express = require('express')
const bb = require('express-busboy')
const mysql = require('mysql')
const path = require('path')
const fileupload = require('express-fileupload')
const admin_functions = require('./functions/admin_functions')
//const filesys = require('fs')
///*
const debug = false;
var con;

if(!debug){
	con = mysql.createConnection(
		{host: "mysql.cgkepgzez06k.us-east-2.rds.amazonaws.com",
		user: "admin", password: "Stevens2018#MVPHWB",
		port: "3306",
		database: "FEB_2"}
	)
}
else{
	con = mysql.createConnection(
		{host: "localhost", 
		user: "root", //password: "greg1234", 
		port: "3306", 
		database: "test_db"}
	)
}
const nodemailer = require('nodemailer');
const session = require('express-session');
const request = require('request')
var cors = require('cors')
const { ExpressOIDC } = require('@okta/oidc-middleware');

//TODO, refactor for admin/user access
//const user_functions = require('./functions/user_functions.js');
//const admin_functions = require('./functions/admin_functions.js');

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'libertyelevatorreader@gmail.com',
		pass: 'readerreaderreader'
	}
});
var mailOptions = {
	from: 'libertyelevatorreader@gmail.com',
	to: ['jmurphy2@stevens.edu', 'ggoldsht@stevens.edu'],
	subject: 'Test email send from server',
	text: 'Test text'
}

function onAdminLoginOkta(adminOktaId, callback){

	con.query(
"SELECT * FROM USERS INNER JOIN"+
"	(SELECT ID as group_id, USER_ID as user_id, ADMIN_ID as admin_id"+
"	FROM GROUPS WHERE GROUPS.ADMIN_ID IN"+
"		(SELECT ID as admin_id --Gets the admin id for the admin based on okta"+
"		FROM USERS"+
"		WHERE USERS.OKTA_ID=[adminOktaId] "+
"		AND IS_ADMIN=1)"+
"	) as groups_table"+
"ON USERS.ID = groups_table.user_id",
	function(err, rows){
		if(err){

		}
	}
	)

}

function onAdminLogin(adminId, callback){

	con.query(
"SELECT * FROM USERS INNER JOIN"+
"	(SELECT ID as group_id, USER_ID as user_id, ADMIN_ID as admin_id"+
"	FROM GROUPS WHERE GROUPS.ADMIN_ID=" + mysql.escape(adminId) +
"	) as groups_table"+
"ON USERS.ID = groups_table.user_id",
	function(err, rows){
		if(err){

		}
	}
	)

}

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});

const app = express()
bb.extend(app, {
	upload: true,
	path: /*path.join(__dirname, 'public')*/ 'public/'
});

app.get('/test/getallusers', function(req, res){
	con.query('SELECT * FROM USERS', function(err, rows){
		if(err){
			res.json(err);
		}
		else{
			res.json(rows);
		}
	})
})


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(session({

	secret: 'GiantPlushTeddyBear',
	resave: true,
	saveUninitialized: false

}));

function create_all_tables(){

	con.query(
"CREATE TABLE BOOKS                                                        "+
"(ID int unsigned not null auto_increment,                                 "+
"NAME text,                                                                "+
"PDF_FILE text,                                                            "+
"PRIMARY KEY (ID));                                                        "
		, function(err, rows, fields){
		console.log("Create Books")
		console.log(err);
		console.log(rows);
		console.log(fields);
		con.query(
"CREATE TABLE USERS                                                        "+
"(ID int unsigned not null auto_increment,                                 "+
"FIRST_NAME varchar(50),                                                   "+
"LAST_NAME varchar(50),                                                    "+
"EMAIL varchar(255),                                                       "+
"IS_ADMIN bit(1),                                                          "+
"OKTA_ID varchar(50),                                                      "+
"PRIMARY KEY (ID));                                                        "
		, function(err, rows, fields){
		console.log("Create Users");
		console.log(err);
		console.log(rows);
		console.log(fields);
		con.query(
"CREATE TABLE GROUPS                                                       "+
"(ID int unsigned not null,                                                "+
"ADMIN_ID int unsigned,                                                    "+
"USER_ID int unsigned,                                                     "+
"NAME text,                                                                "+
"FOREIGN KEY (ADMIN_ID) REFERENCES USERS(ID) ON DELETE CASCADE,            "+
"FOREIGN KEY (USER_ID) REFERENCES USERS(ID) ON DELETE CASCADE);            "
		, function(err, rows, fields){
		console.log("Create Groups");
		console.log(err);
		console.log(rows);
		console.log(fields);
		con.query(
"CREATE TABLE LESSONS                                                      "+
"(ID int unsigned not null auto_increment,                                 "+
"BOOK_ID int unsigned,                                                     "+
"START_PAGE int unsigned,                                                  "+
"END_PAGE int unsigned,                                                    "+
"NAME text,                                                                "+
"PDF_FILE text,                                                            "+
"PRIMARY KEY (ID),                                                         "+
"FOREIGN KEY (BOOK_ID) REFERENCES BOOKS(ID) ON DELETE CASCADE);            "
		, function(err, rows, fields){
		console.log("Create Lessons");
		console.log(err);
		console.log(rows);
		console.log(fields);
		con.query(
"CREATE TABLE ASSIGNMENTS                                                  "+
"(ID int unsigned not null auto_increment,                                 "+
"NAME text,                                                                "+
"LESSON_ID int unsigned,                                                   "+
"GROUP_ID int unsigned,                                                    "+
"DUE_DATE DATETIME,                                                        "+
"START_DATE DATETIME,                                                      "+
"END_DATE DATETIME,                                                        "+
"TIME_TO_COMPLETE int unsigned,                                            "+
"PRIMARY KEY (ID),                                                         "+
"FOREIGN KEY (LESSON_ID) REFERENCES LESSONS(ID) ON DELETE CASCADE);        "
		, function(err, rows, fields){
		console.log("Create Assignments");
		console.log(err);
		console.log(rows);
		console.log(fields);
		con.query(
"CREATE TABLE STATUS                                                       "+
"(ID int unsigned not null auto_increment,                                 "+
"GROUP_ID int unsigned,                                                    "+
"EMPLOYEE_ID int unsigned,                                                 "+
"ASSIGNMENT_ID int unsigned,                                               "+
"IS_COMPLETE bit(1),                                                       "+
"PRIMARY KEY (ID),                                                         "+
"FOREIGN KEY (EMPLOYEE_ID) REFERENCES USERS(ID) ON DELETE CASCADE,         "+
"FOREIGN KEY (ASSIGNMENT_ID) REFERENCES ASSIGNMENTS(ID) ON DELETE CASCADE);"
		, function(err, rows, fields){
		console.log("Create Status");
		console.log(err);
		console.log(rows);
		console.log(fields);

	});
	});
	});
	});
	});
	});

}

app.get('/createalltables', function(req, res){
	create_all_tables();
	res.json({});
})

const admin_oidc = new ExpressOIDC({
	issuer: 'https://dev-383846.oktapreview.com/oauth2/default',
	client_id: '0oadczot4xyhUxY8Y0h7',
	client_secret: 'FPoYzR_ogea7hxNlYz9AA-HLi_aI32zRY1q-bbW6',
	redirect_uri: 'http://localhost:3000/authorization-code/callback',
	scope: 'openid profile'
})
const user_oidc = new ExpressOIDC({
	issuer: 'https://dev-383846.oktapreview.com/oauth2/default',
	client_id: '0oadfv76nkbkSICaA0h7',
	client_secret: 'UtQJB-S31SHaITwf0qwVlKcgOfHBm3LxQuVW-hy2',
	redirect_uri: 'http://localhost:3000/authorization-code/callback',
	scope: 'openid profile'
})

// commneed the admin_oidc and user_oidc  temporiarly bcz of csrf token error
//app.use(admin_oidc.router);
//app.use(user_oidc.router);




//app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json());

//app.use(fileUp())

//Added the cors to avoid cross origin issue
app.use(cors());

//Example of sending mail with the nodemailer library
/*
app.get('/login', /*admin_oidc.ensureAuthenticated(), function(req, res){


	var bookQuery = con.query('SELECT * FROM USERS WHERE IS_ADMIN = true', function(err, rows, fields) {

			if(!err){
				if(rows){
					console.log(rows)
					//callback(null, rows);
				}
			}
			else{
				//callback(err, null);
				console.log(err);
			}

		});

	res.json({'message': 'Success!'})
})
*/
app.get('/email/test', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
			res.json(error);
		}
		else{
			console.log(info);
			res.json(info);
		}
	})
});

app.get('/testgroupthing', function(req, res){
	con.query("SELECT * FROM GROUPS", function(err, rows){
		console.log(rows);
		res.json("gotcha")

	});
})

//function 

//app.post('/get')

function getLessonPlan(group_id, book_id, callback){
	con.query("SELECT NAME, PAGE_START, PAGE_END, PDF_FILE FROM LESSONS JOIN ASSIGNMENTS WHERE LESSONS.ID=ASSIGNMENTS.LESSON_ID WHERE BOOK_ID="+ mysql.escape(book_id)+" AND GROUP_ID=" + mysql.escape(group_id), function(err, rows){
		if(err){
			callback(err, null);
		}
		else{
			if(rows[0] === undefined){
				callback({"error": "no lesson plan with those parameters"}, null);
			}
			else{
				callback(null, rows);
			}
		}
	})
}

app.post("/getlessonplan", function(req, res){
	getLessonPlan(req.body.group_id, req.body.book_id, function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	})
})

function getStatus(group_id, assignment_id, callback){
	var complete = [];
	var incomplete = [];
	con.query("SELECT IS_COMPLETE, EMPLOYEE_ID FROM STATUS JOIN USERS ON STATUS.EMPLOYEE_ID=USERS.ID WHERE STATUS.GROUP_ID=" + mysql.escape(group_id) + " AND STATUS.ASSIGNMENT_ID=" + mysql.escape(assignment_id),
		function(err, rows){
			if(err){
				callback(err, null)
			}
			else{
				if(rows[0]===undefined){
					callback({"error": "No user/assignment combination"}, null)
				}
				else{
					rows.forEach(function(element, index, array){
						if(Number(element.IS_COMPLETE[0]) == 0){
							incomplete.push(element.EMPLOYEE_ID);
						}
						else{
							complete.push(element.EMPLOYEE_ID);
						}
					})
					callback(null, {
						"complete": complete,
						"incomplete": incomplete
					});
				}
			}
		}
	)
}

app.post("/getstatus", function(req, res){
	getStatus(req.body.group_id, req.body.assignment_id, function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	})
})

//Done
function getBooksQuery(callback){

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

}
//Done
function getUsersQuery(callback){

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

}
//Checks if the person is a user
function isUser(email, callback){
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
}
//Not working
function getGroups(email, callback){

	con.query('SELECT DISTINCT BOOKS.NAME as book_name, BOOKS.PDF_FILE as book_file, GroupTable.group_id, GroupTable.group_name, GroupTable.admin_firstname, GroupTable.admin_lastname, GroupTable.admin_email as admin_email FROM BOOKS, ASSIGNMENTS, LESSONS, (SELECT GROUPS.ID as group_id, GROUPS.NAME as group_name, users2.FIRST_NAME as admin_firstname, users2.LAST_NAME as admin_lastname, users2.EMAIL as admin_email FROM USERS as users1, USERS as users2, GROUPS WHERE users1.ID=GROUPS.USER_ID AND users2.ID=GROUPS.ADMIN_ID AND users1.ID IN (SELECT ID FROM USERS WHERE EMAIL=' + mysql.escape(email) + ')) AS GroupTable WHERE ASSIGNMENTS.GROUP_ID=GroupTable.group_id AND LESSONS.ID=ASSIGNMENTS.LESSON_ID AND BOOKS.ID=LESSONS.BOOK_ID', function(err, rows){
		if(!err){
			callback(null, rows);
		}
		else{
			callback(err, null);
		}
	});

}
//Helper function to get things the way James wants
function nest(theJson, index, array){
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
//May need rework in ordering
function getGroups2(email, callback){

	con.query('SELECT ASSIGNMENTS.NAME as assignment_name, ASSIGNMENTS.ID as assignment_id, LESSONS.START_PAGE as start_page, LESSONS.END_PAGE as end_page, ASSIGNMENTS.TIME_TO_COMPLETE as reading_time, ASSIGNMENTS.DUE_DATE as due_date, LESSONS.PDF_FILE as file, STATUS.IS_COMPLETE as complete, RecordTable.group_name, RecordTable.group_id, RecordTable.book_name, RecordTable.book_file, RecordTable.admin_firstname, RecordTable.admin_lastname, RecordTable.admin_email FROM ASSIGNMENTS, LESSONS, STATUS, (SELECT DISTINCT GroupTable.user_id, BOOKS.NAME as book_name, BOOKS.PDF_FILE as book_file, GroupTable.group_id, GroupTable.group_name, GroupTable.admin_firstname, GroupTable.admin_lastname, GroupTable.admin_email as admin_email FROM BOOKS, ASSIGNMENTS, LESSONS, (SELECT users1.ID as user_id, GROUPS.ID as group_id, GROUPS.NAME as group_name, users2.FIRST_NAME as admin_firstname, users2.LAST_NAME as admin_lastname, users2.EMAIL as admin_email FROM USERS as users1, USERS as users2, GROUPS WHERE users1.ID=GROUPS.USER_ID AND users2.ID=GROUPS.ADMIN_ID AND users1.ID IN (SELECT ID FROM USERS WHERE EMAIL=' + mysql.escape(email) + ')) AS GroupTable WHERE ASSIGNMENTS.GROUP_ID=GroupTable.group_id AND LESSONS.ID=ASSIGNMENTS.LESSON_ID AND BOOKS.ID=LESSONS.BOOK_ID GROUP BY GroupTable.group_id) as RecordTable WHERE RecordTable.user_id=STATUS.EMPLOYEE_ID AND RecordTable.group_id=STATUS.GROUP_ID AND STATUS.ASSIGNMENT_ID=ASSIGNMENTS.ID AND ASSIGNMENTS.LESSON_ID=LESSONS.ID GROUP BY RecordTable.group_id', function(err, rows){
		if(!err){
			rows.forEach(function(element, index, array){
				nest(element, index, array)
				console.log(array)
			})
			callback(null, rows);
		}
		else{
			callback(err, null);
		}
	});

}

//May need rework in ordering
function getGroups3(email, callback){

	con.query('SELECT ASSIGNMENTS.NAME as assignment_name, ASSIGNMENTS.ID as assignment_id, LESSONS.START_PAGE as start_page, LESSONS.END_PAGE as end_page, ASSIGNMENTS.TIME_TO_COMPLETE as reading_time, MIN(ASSIGNMENTS.DUE_DATE) as due_date, LESSONS.PDF_FILE as file, STATUS.IS_COMPLETE as complete, RecordTable.group_name, RecordTable.group_id, RecordTable.book_name, RecordTable.book_file, RecordTable.admin_firstname, RecordTable.admin_lastname, RecordTable.admin_email FROM ASSIGNMENTS, LESSONS, STATUS, (SELECT GroupTable.user_id, BOOKS.NAME as book_name, BOOKS.PDF_FILE as book_file, GroupTable.group_id, GroupTable.group_name, GroupTable.admin_firstname, GroupTable.admin_lastname, GroupTable.admin_email as admin_email FROM BOOKS, ASSIGNMENTS, LESSONS, (SELECT users1.ID as user_id, GROUPS.ID as group_id, GROUPS.NAME as group_name, users2.FIRST_NAME as admin_firstname, users2.LAST_NAME as admin_lastname, users2.EMAIL as admin_email FROM USERS as users1, USERS as users2, GROUPS WHERE users1.ID=GROUPS.USER_ID AND users2.ID=GROUPS.ADMIN_ID AND users1.ID IN (SELECT ID FROM USERS WHERE EMAIL=' + mysql.escape(email) + ')) AS GroupTable WHERE ASSIGNMENTS.GROUP_ID=GroupTable.group_id AND LESSONS.ID=ASSIGNMENTS.LESSON_ID AND BOOKS.ID=LESSONS.BOOK_ID GROUP BY GroupTable.group_id) as RecordTable WHERE RecordTable.user_id=STATUS.EMPLOYEE_ID AND RecordTable.group_id=STATUS.GROUP_ID AND STATUS.ASSIGNMENT_ID=ASSIGNMENTS.ID AND ASSIGNMENTS.LESSON_ID=LESSONS.ID AND STATUS.IS_COMPLETE=0 GROUP BY RecordTable.group_id', function(err, rows){
		if(!err){
			rows.forEach(function(element, index, array){
				nest(element, index, array)
				console.log(array)
			})
			callback(null, rows);
		}
		else{
			callback(err, null);
		}
	});

}
/*
function getLatestAssignment(groupID, callback){

	con.query('SELECT LESSONS.START_PAGE as start_page, LESSONS.END_PAGE as end_page, LESSONS.PDF_FILE as file, ASSIGNMENTS.DUE_DATE as due_date, ASSIGNMENTS.TIME_TO_COMPLETE as reading_time, STATUS.IS_COMPLETE as complete FROM LESSONS, ASSIGNMENTS, GROUPS, STATUS WHERE GROUPS.ID=' + groupID + ' AND STATUS'

}
*/
//Done
function addUser(first_name, last_name, email, callback){

	con.query('SELECT * FROM USERS WHERE USERS.EMAIL=' + mysql.escape(email), function(err, rows){
		if(!err){
			if(rows[0] === undefined){
				console.log("ROWS ARE EMPTY")
				con.query('INSERT INTO USERS (FIRST_NAME, LAST_NAME, EMAIL, IS_ADMIN) VALUES ('+ mysql.escape(first_name) + ',' + mysql.escape(last_name) + ','+ mysql.escape(email) +', 0)', function(err2, result){
					if(!err2){
						con.commit(function(err3){
							if(err3){con.rollback(function(){callback(err3, null)})}
							else{
								callback(null, result)
							}
						});
					}
					else{
						callback(err2, null);
					}
				})
			}
			else{
				console.log(rows)
				callback({'error': 'user already exists'}, null);
			}
		}
		else{
			callback(err, null);
		}
	})

}
//Done
function addAdmin(first_name, last_name, email, callback){

	con.query('SELECT * FROM USERS WHERE USERS.EMAIL=' + mysql.escape(email), function(err, rows){
		if(!err){
			if(rows[0] === undefined){
				console.log("ROWS ARE EMPTY")
				con.query('INSERT INTO USERS (FIRST_NAME, LAST_NAME, EMAIL, IS_ADMIN) VALUES ('+ mysql.escape(first_name) + ',' + mysql.escape(last_name) + ','+ mysql.escape(email) +', 1)', function(err2, result){
					if(!err2){
						con.commit(function(err3){
							if(err3){con.rollback(function(){callback(err3, null)})}
							else{
								callback(null, result)
							}
						});
					}
					else{
						callback(err2, null);
					}
				})
			}
			else{
				console.log(rows)
				callback({'error': 'user already exists'}, null);
			}
		}
		else{
			callback(err, null);
		}
	})

}
//Done
function addBook(name, filename, callback){


	con.query('SELECT * FROM BOOKS WHERE BOOKS.NAME=' + mysql.escape(name), function(err, rows){
		if(!err){
			if(rows[0] === undefined){
				console.log("ROWS ARE EMPTY")
				con.query('INSERT INTO BOOKS (NAME, PDF_FILE) VALUES ('+ mysql.escape(name) + ',' + mysql.escape(filename) + ')', function(err2, result){
					if(!err2){
						con.commit(function(err3){
							if(err3){con.rollback(function(){callback(err3, null)})}
							else{
								callback(null, result)
							}
						});
					}
					else{
						callback(err2, null);
					}
				})
			}
			else{
				console.log(rows)
				callback({'error': 'book already exists'}, null);
			}
		}
		else{
			callback(err, null);
		}
	})

}
//Done
function addLesson(book_id, start_page, end_page, name, filepath, callback){
	console.log('A1');
	con.query("SELECT * FROM LESSONS WHERE LESSONS.NAME=" + mysql.escape(name) + " AND LESSONS.BOOK_ID=" + mysql.escape(book_id), function(err, rows){
		if(!err){
			console.log('B2')
			if(rows[0] === undefined){
				console.log('C3');
				con.query("INSERT INTO LESSONS (BOOK_ID, START_PAGE, END_PAGE, NAME, PDF_FILE) VALUES (" + mysql.escape(book_id) + ", "   + mysql.escape(start_page) + ", "  + mysql.escape(end_page) + ", "  + mysql.escape(name) + ", "  + mysql.escape(filepath) +")", function(err2, result){
					console.log('D4');
					if(!err2){
						/* con.commit(function(err3){
							if(err3){con.rollback(function(){callback(err3, null)})}
							else{
								callback(null, result)
							}
						}); */
						callback(null, result);
						
					}
					else{
						callback(err2, null)
					}
				});
			}
			else{
				callback({'error': 'lesson already exists'}, null);
			}
		}
		else{
			callback(err, null);
		}
	});
}
//Dpme
function addAssignment(lesson_id, group_id, due_date, time_to_complete){
	con.query("SELECT * FROM ASSIGNMENTS WHERE ASSIGNMENTS.LESSON_ID=" + mysql.escape(lesson_id) + " AND ASSIGNMENT.GROUP_ID=" + mysql.escape(group_id), function(err, rows){
		if(!err){
			if(row[0] === undefined){
				con.query("INSERT INTO ASSIGNMENTS (LESSON_ID, GROUP_ID, DUE_DATE, TIME_TO_COMPLETE) VALUES (" + mysql.escape(lesson_id) + ", "   + mysql.escape(group_id) + ", "  + mysql.escape(due_date) + ", "  + mysql.escape(time_to_complete)+")", function(err2, result){
					if(!err2){
						con.commit(function(err3){
							if(err3){con.rollback(function(){callback(err3, null)})}
							else{callback(null, result)}
						})
					}
					else{callback(err2,null)}
				});
			}
			else{
				callback({'error' : 'lesson already exists'}, null)
			}
		}
		else{
			callback(err, null)
		}
	});
}

//Done
function addGroup(admin_id, user_ids, name, callback){
	//console.log(user_ids);
	///*
	//
	usr_mails = []
	for(var i = 0; i < user_ids.length; ++i){
		usr_mails.push(user_ids[i].mail);
	}
	//console.log(mysql.escape(usr_mails));
	con.query("SELECT EMAIL FROM USERS WHERE EMAIL IN (" + mysql.escape(usr_mails) + ");", function(err1, rows1){
		if(rows1.length != usr_mails.length){
			var popped_rows = [];
			for(var i = 0; i < rows1.length; ++i){
				popped_rows.push(rows1[i].EMAIL);
			}
			//console.log(poppedRows);
			//console.log(usr_mails);
			let new_users = usr_mails.filter(x => !popped_rows.includes(x)).map(x => [x]);
			
			con.query("INSERT INTO USERS (EMAIL) VALUES ?", [new_users], function(errNew, rowsNew){
				console.log("-+-");
				console.log(errNew);
				console.log(rowsNew);
				console.log("-+-");
			})
			//DANGER ^^^^^^ WILL NEED TO BE REPLACED BY OKTA CALLS
			
		}
		con.query("SELECT ID FROM USERS WHERE EMAIL IN (" + mysql.escape(usr_mails) + ");", function(err2, rows2){
		var usr_ids = rows2;
		console.log(usr_ids)
		//console.log(name);
		//console.log(admin_id);
		//callback(null, null);
		///*
		con.query("SELECT MAX(ID) as group_id FROM GROUPS", function(error, result){
		if(error){callback(error, null)}
		else{
		console.log(result);

		usr_ids.forEach(function(value, index, arr){arr[index] = [Number(result[0].group_id+1), Number(admin_id), Number(value.ID), name]});
		console.log(usr_ids);
		con.query("INSERT INTO GROUPS (ID, ADMIN_ID, USER_ID, NAME) VALUES ?", [usr_ids], function(err, rows){
			if(!err){
				con.commit(function(err2){
					if(err2){con.rollback(function(){callback(err2, null)})}
					else{callback(null, rows)}
				});
			}
			else{
				callback(err, null)
			}
		})

		}
		});
	});//*/
	});
	/*
	con.query("SELECT MAX(ID) as group_id FROM GROUPS", function(error, result){
		if(error){callback(error, null)}
		else{
		console.log(result);

		user_ids.forEach(function(value, index, arr){arr[index] = [Number(result[0].group_id+1), Number(admin_id), Number(value), name]});
		console.log(user_ids);
		con.query("INSERT INTO GROUPS (ID, ADMIN_ID, USER_ID, NAME) VALUES ?", [user_ids], function(err, rows){
			if(!err){
				con.commit(function(err2){
					if(err2){con.rollback(function(){callback(err2, null)})}
					else{callback(null, rows)}
				});
			}
			else{
				callback(err, null)
			}
		})

		}
	});
	//*/

}
//Change so that users not in the system get invited
function addToGroup(group_id, user_ids, callback){
	con.query("SELECT ADMIN_ID as admin_id, NAME as group_name FROM GROUPS WHERE ID=" + mysql.escape(group_id), function(err, rows){
		console.log(rows)
///*
		if(!err){
			if(rows[0] === undefined){
				callback({'error' : 'group does not exist'}, null)
			}
			else{
				user_ids.forEach(function(value, index, arr){arr[index] = [Number(group_id), Number(rows[0].admin_id), Number(value), rows[0].group_name]})
				console.log(user_ids);
				con.query("INSERT INTO GROUPS (ID, ADMIN_ID, USER_ID, NAME) VALUES ?", [user_ids], function(err2, result){
					if(!err2){
						con.commit(function(err3){
							if(err3){con.rollback(function(){callback(err3, null)})}
							else{callback(null, result)}
						})
					}
					else{callback(err2,null)}
				});
			}
		}
		else{
			callback(err, null)
		}
//*/
	})
}

function updateGroupStatus(group_id, user_ids, callback){
	var retList = []
	con.query("SELECT DISTINCT ASSIGNMENT_ID FROM STATUS WHERE STATUS.GROUP_ID=" + mysql.escape(group_id), function(err3, rows3){
	
		rows3.forEach(function(value, index, arr){
			for(var i = 0; i < user_ids.length; ++i){
				retList.push([Number(group_id), Number(user_ids[i][2]), Number(value.ASSIGNMENT_ID), Number(0)]);
			}
		});
		
		
		con.query("INSERT INTO STATUS (GROUP_ID, EMPLOYEE_ID, ASSIGNMENT_ID, IS_COMPLETE) VALUES ?", [retList], function(err2, rows2){
			console.log(rows2);
			callback(null, rows2);
		})
		/*
		user_ids.forEach(function(value2, index2, arr2){
			
			
			
		});*/
		

	});
	
}

app.get('/test/groupStatus', function(req, res){
	updateGroupStatus(1, [[1, 1, 1, 1],[2, 2, 2, 2],[3, 3, 3, 3]], function(err, result){
		res.json(result);
	})
})

function addUserRecursive(f_name, l_name, email_arr, user_ids, count, callback){
	
	if(count < 1){
		callback({'error' : 'number of new users = 0'}, null)
	}
	if(count === 1){
		addUser(f_name, l_name, email_arr[0], function(err, rows){
			if(err){
				callback(err, null)
			}
			else{
				user_ids.push(Number(rows.insertId));
				callback(null, rows);
			}
		});
	}
	else{
		addUser(f_name, l_name, email_arr[count - 1], function(err, rows){
			if(err){
					callback(err, null);
			}
			else{
				user_ids.push(Number(rows.insertId));
				addUserRecursive(f_name, l_name, email_arr, user_ids, count - 1, callback);
			}
		});
	}
	
}

function addToGroupByEmail(group_id, user_emails, callback){
	//console.log('^^^');
	console.log(user_emails)
	var promise1 = undefined;
	//console.log('^^^');
	con.query("SELECT ADMIN_ID as admin_id, NAME as group_name FROM GROUPS WHERE ID=" + mysql.escape(group_id), function(err, rows){
		console.log(rows)
///*
		if(!err){
			if(rows[0] === undefined){
				callback({'error' : 'group does not exist'}, null)
			}
			else{
				con.query("SELECT ID, EMAIL FROM USERS WHERE USERS.EMAIL=" + mysql.escape(user_emails), function(err1, rows1){
					
					if(err1){
						callback(err1, null)
					}
					else{
						let user_ids = rows1.map(x => [x.ID]);
						if(user_emails.length != rows1.length){
							let mails = rows1.map(x => [x.EMAIL]);
							let new_users = user_emails.filter(function(el){
								return mails.indexOf( el ) < 0;
							});
							console.log(new_users)
							
							addUserRecursive("", "", new_users, user_ids, new_users.length, function(errA, rowsA){
								
								if(errA){
									callback(errA, null);
								}
								else{
									console.log('2EEEE');
									console.log(user_ids);
								
								//TODO - get ids from emails
								
								user_ids.forEach(function(value, index, arr){arr[index] = [Number(group_id), Number(rows[0].admin_id), Number(value), rows[0].group_name]})
								
								console.log(user_ids);
								
								con.query("INSERT INTO GROUPS (ID, ADMIN_ID, USER_ID, NAME) VALUES ?", [user_ids], function(err2, rows2){
									if(!err2){
										console.log('11111');
										console.log(user_ids);
										updateGroupStatus(group_id, user_ids, function(err3, result){
										
											con.commit(function(err4){
												if(err4){con.rollback(function(){callback(err4, null)})}
												else{
													
													
													console.log(result);
													callback(null, result)
													
													}
											});
										
										});
									}
									else{callback(err2,null)}
								});
								}
								
							})
							
							/* promise1 = new Promise(function(){
								
								for(var j = 0; j < new_users.length; ++j){
									addUser("", "", new_users[j], function(er, ro){
										console.log('33333');
										console.log(Number(ro.insertId));
										user_ids.push(Number(ro.insertId));
									})
								}
								
							}) */
						}
						else{
						
						
					console.log('22222');
					console.log(user_ids);
				
				//TODO - get ids from emails
				
				user_ids.forEach(function(value, index, arr){arr[index] = [Number(group_id), Number(rows[0].admin_id), Number(value), rows[0].group_name]})
				
				console.log(user_ids);
				
				con.query("INSERT INTO GROUPS (ID, ADMIN_ID, USER_ID, NAME) VALUES ?", [user_ids], function(err2, rows2){
					if(!err2){
						console.log('11111');
						console.log(user_ids);
						updateGroupStatus(group_id, user_ids, function(err3, result){
						
							con.commit(function(err4){
								if(err4){con.rollback(function(){callback(err4, null)})}
								else{
									
									
									console.log(result);
									callback(null, result)
									
									}
							});
						
						});
					}
					else{callback(err2,null)}
				});
				
						}
				
				}
					
				})
			}
		}
		else{
			callback(err, null)
		}
//*/
	})
}

app.post('/addToGroupEmail', function(req, res){
	console.log(req.body.user_email);
	addToGroupByEmail(req.body.group_id, [req.body.user_email], function(err, result){
		if(err){
			console.log(err);
			res.json(err);
		}
		else{
			console.log(result);
			res.json(result)
		}
	});
})

//Done
function getGroup(userid, groupid, callback){
	con.query('SELECT DISTINCT LESSONS.ID as id, LESSONS.NAME as name, ASSIGNMENTS.DUE_DATE as due_date, ASSIGNMENTS.TIME_TO_COMPLETE as time_to_read, STATUS.IS_COMPLETE  as complete, LESSONS.PDF_FILE as filename FROM USERS, GROUPS, ASSIGNMENTS, LESSONS, STATUS WHERE USERS.ID=' + mysql.escape(userid) + ' AND GROUPS.ID=' + mysql.escape(groupid) + ' AND ASSIGNMENTS.GROUP_ID=GROUPS.ID AND STATUS.GROUP_ID=GROUPS.ID AND STATUS.EMPLOYEE_ID=USERS.ID AND ASSIGNMENTS.LESSON_ID=LESSONS.ID', function(err, rows){
	if(!err){
		callback(null, rows);
	}
	else{
		callback(err, null);
	}
	})
}

app.get('/testNg', function(req, res){
	res.json(
		{
			first_name: 'Jim',
			last_name: 'Jimson',
			email: 'Jim@Jim.Jim'
		}
	);
})

app.get('/test/emailgroup', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){

	emailNewAssignment(5, function(err, result){
		if(err){
			res.json(err)
		}
		else{
			res.json(result[0])
		}
	})

});
/*
var mailOptions = {
	from: 'libertyelevatorreader@gmail.com',
	to: ['jmurphy2@stevens.edu', 'ggoldsht@stevens.edu'],
	subject: 'Test email send from server',
	text: 'Test text'
}
*/

//Function to send out emails upon new assignment
function emailNewAssignment(group_id, callback){

	var rec_list = []
	con.query('SELECT EMAIL FROM USERS a, GROUPS b WHERE b.ID=' + mysql.escape(group_id) + ' AND a.ID=b.USER_ID', function(err, rows){
		if(err){
			console.log(err)
			callback(err, null)
		}
		else{
			if(rows[0] === undefined){
				callback("Group is empty", null)
			}
			else{
				rows.forEach(function(value, index, arr){
					rec_list.push(value['EMAIL'])
				})
				var mailOptions = {
					from: 'libertyelevatorreader@gmail.com',
					to: rec_list,
					subject: 'You have a new assignment!',
					text: 'You may view the new assignment on the Liberty Elevator Reader App.'
				}
				transporter.sendMail(mailOptions, function(error, info){
					if(error){
						console.log(error);
					}
					else{
						callback(null, info)
					}
				});
			}
		}
	})
}
//Done
function addAssignment(name, lesson_id, group_id, due_date, time_to_complete, start_date, callback){

	con.query('SELECT * FROM ASSIGNMENTS WHERE LESSON_ID=' + mysql.escape(lesson_id) + ' AND GROUP_ID=' + mysql.escape(group_id), function(err, rows){

	if(!err){
		if(rows[0]===undefined){
			con.query('INSERT INTO ASSIGNMENTS (NAME, LESSON_ID, GROUP_ID, DUE_DATE, TIME_TO_COMPLETE, START_DATE) VALUES ('+ mysql.escape(name) + ', ' + mysql.escape(lesson_id) + ', ' + mysql.escape(group_id) + ', '  + mysql.escape(due_date) + ', '  + mysql.escape(time_to_complete) + ', ' + mysql.escape(start_date) + ')', function(err2, rows2){
			if(!err2){
				console.log(rows2);
				con.query('SELECT USER_ID as user_id FROM GROUPS WHERE ID=' + mysql.escape(group_id), function(err3, rows3){
					if(!err3){
						console.log(rows3);
						rows3.forEach(function(value, index, arr){
							console.log(value.user_id)
							arr[index] = [Number(group_id), Number(value.user_id), rows2.insertId, 0]
						})
						con.query('INSERT INTO STATUS (GROUP_ID, EMPLOYEE_ID, ASSIGNMENT_ID, IS_COMPLETE) VALUES ?', [rows3], function(err4, rows4){
							if(!err4){
							con.commit(function(err5){
							if(!err5){
								console.log("Successful addAssignment")
								console.log(rows4)
								callback(null, rows4)
							}
							else{con.rollback(function(){callback(err5,null)})}
							})
							}
							else{
								console.log(err4)
								callback(err4, null)
							}
						})
					}
					else{
						console.log(err3);
						callback(err3, null);
					}
				})
			}
			else{
				console.log(err2)
				callback(err2, null)
			}
		})
		}
		else{
			callback({'error': 'An assignment for that lesson and group already exists'}, null);
		}
	}
	else{
		callback(err, null)
	}

	})

}

function updateUserComplete(user_id, assignment_id, callback){

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

}
function deleteUserByEmail(email, callback){

	con.query("DELETE FROM USERS WHERE EMAIL=" + mysql.escape(email), function(err, res){

		if(err){
			callback(err, null);
		}
		else{
			callback(null, res);
		}

	});

}

function deleteUserById(user_id, callback){
	con.query("DELETE FROM USERS WHERE ID=" + mysql.escape(user_id), function(err, res){
		if(err){
			callback(err, null)
		}
		else{

			callback(null, res)
		}
	})
}

function deleteAssignmentById(assignment_id, callback){
	con.query("DELETE FROM ASSIGNMENTS WHERE ID=" + mysql.escape(assignment_id), function(err, res){
		if(err){
			callback(err, null)
		}
		else{
			callback(null, res)
		}
	})
}
function deleteLessonById(lesson_id, callback){
	con.query("DELETE FROM LESSONS WHERE ID=" + mysql.escape(lesson_id), function(err, res){
		if(err){
			callback(err, null)
		}
		else{
			callback(null, res)
		}
	})
}
function deleteBookById(book_id, callback){
	con.query("DELETE FROM BOOKS WHERE ID=" + mysql.escape(book_id), function(err, res){
		if(err){
			callback(err, null)
		}
		else{
			callback(null, res)
		}
	})
}

app.delete('/userById', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	deleteUserById(req.body.user_id, function(err, result){
		if(err){
			res.json(err)
		}
		else{
			if(!res.headersSent){res.json(result)}else{}
		}
	})
});

app.delete('/assignmentById', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	deleteAssignmentById(req.body.user_id, function(err, result){
		if(err){
			res.json(err)
		}
		else{
			if(!res.headersSent){res.json(result)}else{}
		}
	})
});

app.delete('/lessonById', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	deleteLessonById(req.body.user_id, function(err, result){
		if(err){
			res.json(err)
		}
		else{
			if(!res.headersSent){res.json(result)}else{}
		}
	})
});

app.delete('/bookById', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	deleteBookById(req.body.user_id, function(err, result){
		if(err){
			res.json(err)
		}
		else{
			if(!res.headersSent){res.json(result)}else{}
		}
	})
});

app.post('/update/status', /*user_oidc.ensureAuthenticated(),*/ function(req, res){
	let updateData = req.body
	updateUserComplete(updateData.user_id, updateData.assignment_id, function(err, result){
		if(err){
			res.json(err)
		}
		else{
			if(!res.headersSent){res.json(result)}else{}
		}
	})
})

//Done
app.post('/new/assignment', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){

	let assignmentData = req.body
	addAssignment(assignmentData.name, assignmentData.lesson_id, assignmentData.group_id, assignmentData.due_date, assignmentData.time_to_complete, assignmentData.start_date, function(err, result){
		if(err){
			console.log(err)
			res.json(err)
		}
		else{
			emailNewAssignment(assignmentData.group_id, function(err2, result2){
				if(err2){
					res.json(err2)
				}
				else{
					res.json(result2)
				}
			})
			//if(!res.headersSent){res.json(result)}else{}
		}
	})

})
//Done
app.post('/add/togroup', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	let groupData = req.body
	addToGroup(groupData.group_id, groupData.user_ids, function(err, result){
		if(err){
			console.log(err);
			res.json(err);
		}
		else{
			if(!res.headersSent){res.json(result)}else{};
		}
	})
})
//Done
app.post('/new/group', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	let groupData = req.body
	addGroup(groupData.admin_id, groupData.user_ids, groupData.group_name, function(err, result){
		if(err){
			console.log(err);
			res.json(err);
		}
		else{
			if(!res.headersSent){res.json(result)}else{};
		}
	})
})
app.use(express.static('public'));

app.get('/', (req, res) => res.json(req.body));
//For debug
app.get('/code', (req, res) => res.sendFile('index.js', {root: __dirname}));
//Done
app.get('/test/getgroup', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){

	getGroup(26, 5, function(err, result){
		if(err){
			console.log(err);
			res.json(err);
		}
		else{
			if(!res.headersSent){res.json(result)}else{}
		}
	});

});
//Echo
app.post('/', (req, res) => res.json(req.body));

app.get('/books', /*user_oidc.ensureAuthenticated(),*/ function(req, res) {
	getBooksQuery(function(err, result){
		if(err){
			console.log(err);
		}
		res.json({books: result});
	});

});
//Done
app.post('/new/book', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	console.log(req.body);
	/*
	let bookfile = req.files.book_file
	addBook(req.body.book_name, bookfile.file, function(err, result){
		if(err){
			console.log(err);
			res.json(err);
		}
		else{
			if(!res.headersSent){res.json(result)}else{};
		}
	
	*/
});

app.post('/new/lesson', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	let lessonData = req.body
	console.log(lessonData)
	addLesson(lessonData.book_id, 
			lessonData.start_page, 
			lessonData.end_page, 
			lessonData.name, 
			req.files.lesson_file.file, 
			function(err, result){
		if(err){
			console.log(err);
			res.json(err);
		}
		else{
			if(!res.headersSent){res.json(result)}else{};
		}
	})
})

app.post('/get/group', /*user_oidc.ensureAuthenticated(),*/ function(req, res){
	let userData = req.body
	getGroup(userData.user_id, userData.group_id, function(err, result){
		if(err){
			console.log(err);
			res.json(err);
		}
		else{
			if(!res.headersSent){res.json(result)}else{};
		}
	});
});

app.delete('/userByEmail', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	deleteUserByEmail(req.body.email, function(err, result){
		if(err){
			res.json(err)
		}
		else{
			if(!res.headersSent){res.json(result)}else{};
		}
	})

})

app.post('/new/user', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	let userData = req.body;
	addUser(userData.first_name, userData.last_name, userData.email, function(err, result){
		///*
		if(err){
			console.log(err);
			res.json(err);
		}
		else{
			var options = {
				url: 'https://dev-383846.oktapreview.com/api/v1/users?activate=true',
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'SSWS 00Sf_mZYUteEpe-evfHB0U9Wqi1bag9rLSZirF9qU4'
				},
				json: {
					"profile": {
						"firstName": userData.first_name,
						"lastName": userData.last_name,
						"email": userData.email,
						"login": userData.email
					},
					"groupIds": [
						"00gdd1390y9VL6Dki0h7"
					]
				}
			};
/*
			request(options, function(err, httpr, body){
				console.log(err)
				console.log(body)
				if(err){
					res.json(err)
				}
				else{
					res.json(body)
				}
			})*/
			//if(!res.headersSent){res.json(result)}else{};
		}
	});
});
app.post('/new/adminOkta', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	let userData = req.body;

	var options = {
		url: 'https://dev-383846.oktapreview.com/api/v1/users?activate=true',
		method: 'post',
		family: 4,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'SSWS 00Sf_mZYUteEpe-evfHB0U9Wqi1bag9rLSZirF9qU4'
		},
		json: {
			"profile": {
				"firstName": userData.first_name,
				"lastName": userData.last_name,
				"email": userData.email,
				"login": userData.email
			},
			"groupIds": [
				"00gdd1390y9VL6Dki0h7",
				"00gdd1385jAAcutid0h7"
			]
		}
	};

	request(options, function(err1, httpr, body){
		console.log(err1)
		console.log(body)
		if(err1){
			res.json(err1)
		}
		else{
			admin_functions.addAdmin(con, userData.first_name, userData.last_name, userData.email, body.id, function(err2, result){
			// /*
				if(err2){
					console.log(err2);
					res.json(err2);
				}//*/
				else{
					res.json(result);
				}
			});
		}
	});
});
app.post('/new/userOkta', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	let userData = req.body;

	var options = {
				url: 'https://dev-383846.oktapreview.com/api/v1/users?activate=true',
				method: 'post',
				family: 4,
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'SSWS 00Sf_mZYUteEpe-evfHB0U9Wqi1bag9rLSZirF9qU4'
				},
				json: {
					"profile": {
						"firstName": userData.first_name,
						"lastName": userData.last_name,
						"email": userData.email,
						"login": userData.email
					},
					"groupIds": [
						"00gdd1390y9VL6Dki0h7"
					]
				}
			}

	request(options, function(err1, httpr, body){
		console.log(err1)
		console.log(body)
		if(err1){
			res.json(err1)
		}
		else{
			if(body.errorCode===undefined){
				admin_functions.addUser(con, userData.first_name, userData.last_name, userData.email, body.id, function(err2, result){
					if(err2){
						console.log(err2);
						res.json(err2);
					}
					else{
						if(!res.headersSent){res.json(result)}else{};
					}
				});
			}
			else{
				if(!res.headersSent){res.json(body)}else{};
			}
		}
	});
});

function getAssignments(group_id, callback){
	con.query("SELECT DISTINCT ASSIGNMENTS.ID as assignment_id, DUE_DATE, START_DATE, ASSIGNMENTS.NAME, BOOKS.ID as book_id, LESSONS.ID as lesson_id FROM " +
	"(ASSIGNMENTS JOIN GROUPS ON ASSIGNMENTS.GROUP_ID=GROUPS.ID JOIN LESSONS ON LESSONS.ID=ASSIGNMENTS.LESSON_ID " +
	"JOIN BOOKS ON LESSONS.BOOK_ID=BOOKS.ID) "+ 
//	"WHERE ADMIN_ID="+mysql.escape(admin_id) + " AND " +
	"WHERE GROUP_ID=" + mysql.escape(group_id),
		function(err, rows){
			if(err){
				console.log(err);
				callback(err, null);
			}
			else{
				if(rows[0]===undefined){
					console.log(rows);
					callback({'err': 'no results'}, null)
				}
				else{
					console.log(rows);
					callback(null, rows);
				}
			}
		}
	)
}

app.post('/getassignments', function(req, res){
	getAssignments(req.body.group_id, function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
});

app.get('/getassignments', function(req, res){
	getAssignments(1, function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
});



function getEmployees(group_id, callback){
	con.query("SELECT USERS.ID, USERS.FIRST_NAME, USERS.LAST_NAME, USERS.EMAIL FROM USERS JOIN GROUPS ON USERS.ID=GROUPS.USER_ID WHERE GROUPS.ID=" + mysql.escape(group_id), function(err, rows){
		if(err){
			console.log(err);
			callback(err, null);
		}
		else{
			if(rows[0]===undefined){
				console.log(rows);
				callback({"error": "no employees in this group"}, null);
			}
			else{
				console.log(rows)
				callback(null, rows)
			}
		}
	});
}

app.post('/getemployees', function(req, res){
	getEmployees(req.body.group_id, function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	})
});

function getEmployeesStatus(group_id, assignment_id, callback){
	con.query("SELECT USERS.ID, USERS.FIRST_NAME, USERS.LAST_NAME, USERS.EMAIL, STATUS.IS_COMPLETE FROM USERS JOIN GROUPS ON USERS.ID=GROUPS.USER_ID JOIN STATUS ON STATUS.EMPLOYEE_ID=USERS.ID AND STATUS.ASSIGNMENT_ID=" + mysql.escape(assignment_id) + " WHERE GROUPS.ID=" + mysql.escape(group_id), function(err, rows){
		if(err){
			console.log(err);
			callback(err, null);
		}
		else{
			if(rows[0]===undefined){
				console.log(rows);
				callback({"error": "no employees in this group"}, null);
			}
			else{
				console.log(rows)
				callback(null, rows)
			}
		}
	});
}

app.post('/getemployeesstatus', function(req, res){
	getEmployeesStatus(req.body.group_id, req.body.assignment_id, function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	})
});

app.get('/getemployeesstatus', function(req, res){
	getEmployeesStatus(1, 1, function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	})
});

app.post('/new/admin', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	let userData = req.body;
	addAdmin(userData.first_name, userData.last_name, userData.email, function(err, result){
		///*
		if(err){
			console.log(err);
			res.json(err);
		}//*/
		else{
			var options = {
				url: 'https://dev-383846.oktapreview.com/api/v1/users?activate=true',
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'SSWS 00Sf_mZYUteEpe-evfHB0U9Wqi1bag9rLSZirF9qU4'
				},
				json: {
					"profile": {
						"firstName": userData.first_name,
						"lastName": userData.last_name,
						"email": userData.email,
						"login": userData.email
					},
					"groupIds": [
						"00gdd1390y9VL6Dki0h7",
						"00gdd1385jAAcutid0h7"
					]
				}
			};

			request(options, function(err, httpr, body){
				console.log(err)
				console.log(body)
				if(err){
					res.json(err)
				}
				else{
					res.json(body)
				}
			});
			//if(!res.headersSent){res.json(result)}else{};
		}
	});
});

function getUID(user_email, callback){
	con.query("SELECT ID FROM USERS WHERE EMAIL=" + mysql.escape(user_email), function(err, rows){
		if(err){
			callback(err, null);
		}
		else{
			callback(null, rows[0]);
		}
	})
}

app.post('/getUID', function(req, res){
	getUID(req.body.user_email, function(err, result){
		console.log(req.body.user_email);
		console.log(err);
		console.log(result);
		if(err){
			res.json(err)
		}
		else{
			res.json(result)
		}
	})
})

function getAssignmentsUser(user_id, group_id, callback){

	con.query('select STATUS.IS_COMPLETE, LESSONS.START_PAGE, LESSONS.PDF_FILE, LESSONS.END_PAGE, LESSONS.NAME, '+
	'ASSIGNMENTS.TIME_TO_COMPLETE, ASSIGNMENTS.DUE_DATE, ASSIGNMENTS.ID FROM LESSONS '+
	'JOIN ASSIGNMENTS ON LESSONS.ID=ASSIGNMENTS.LESSON_ID JOIN STATUS ON STATUS.ASSIGNMENT_ID='+
	'ASSIGNMENTS.ID WHERE STATUS.EMPLOYEE_ID=' + mysql.escape(user_id) + ' AND STATUS.GROUP_ID='+ mysql.escape(group_id)
//	con.query('Select * FROM USERS '+
//	'JOIN GROUPS ON USERS.ID=GROUPS.USER_ID '+
//	'JOIN ASSIGNMENTS ON ASSIGNMENTS.GROUP_ID=GROUPS.ID '+
//	'JOIN LESSONS ON LESSONS.ID=ASSIGNMENTS.LESSON_ID ' +
//	'JOIN STATUS ON STATUS.EMPLOYEE_ID=USERS.ID '+
//	'WHERE USERS.ID='+mysql.escape(user_id) + ' ' +
//	'AND GROUPS.ID='+mysql.escape(group_id)
		, function(err, rows){
		
		if(err){
			callback(err, null)
		}
		else{
			callback(null, rows)
		}

	})

}

app.get('/getAssignmentsUser', function(req, res){
	getAssignmentsUser(5, 1, function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	})
});

app.post('/getAssignmentsUser', function(req, res){
	getAssignmentsUser(req.body.user_id, req.body.group_id, function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	})

});

app.delete('/logout', function(req, res){
	
	var options = {
				url: 'https://dev-383846.oktapreview.com/api/v1/sessions/' + req.body.sessionId,
				method: 'delete',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'SSWS 00Sf_mZYUteEpe-evfHB0U9Wqi1bag9rLSZirF9qU4'
				}
			};

			request(options, function(err, httpr, body){
				console.log(err)
				console.log(body)
				if(err){
					res.json(err)
				}
				else{

				}
			});
	
});

// added new group call to get the list of groups created by that admin id
app.post('/getgroups',function(req,res){

console.log(req.body.admin_id)
	con.query("SELECT DISTINCT ID, NAME FROM GROUPS WHERE ADMIN_ID = "+mysql.escape(req.body.admin_id)+";",function(err,data,fields){
		if(!err){
			res.json(data);
		}
	});

});
if(false){
app.post('/login', /*user_oidc.ensureAuthenticated(),*/ function(req, res){
	console.log(req.body.email)
	console.log(req.body.password)
	
	var options = {
				url: 'https://dev-383846.oktapreview.com/api/v1/authn',
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'SSWS 00Sf_mZYUteEpe-evfHB0U9Wqi1bag9rLSZirF9qU4'
				},
				json: {
					username: req.body.email,
					password: req.body.password
				}
			};

			request(options, function(err, httpr, body){
				console.log(err)
				console.log(body)
				if(err){
					res.json(err)
				}
				else{
					if(body.errorSummary===undefined){
						con.query("SELECT * FROM USERS WHERE EMAIL=" + mysql.escape(req.body.email),
							function(err2, rows){
								if(err2){
									res.json(err2);
								}
								else{
									console.log({"status": "success",
											"user_data": {
												"first_name": rows[0].FIRST_NAME,
												"last_name": rows[0].LAST_NAME,
												"admin_id": rows[0].ID,
											}
									});
									res.json({"status": "success",
											"user_data": {
												"first_name": rows[0].FIRST_NAME,
												"last_name": rows[0].LAST_NAME,
												"admin_id": rows[0].ID,
											}
									});
								}
							});
						
					}
					else{
						res.json(body.errorSummary);
					}
				}
			});
});
}
else{
app.post('/login', function(req, res){
	res.json({"status": "success",
			"user_data": {
				"first_name": "Greg",
				"last_name": "Goldshteyn",
				"admin_id": 1,
			}
	});
});
}

function getBooksAndLessons(callback){
	con.query('SELECT BOOKS.ID as book_id, BOOKS.PDF_FILE as book_path, BOOKS.NAME as book_name, '+
	'LESSONS.ID as lesson_id, LESSONS.PDF_FILE as lesson_path, LESSONS.NAME as lesson_name, '+
	'LESSONS.START_PAGE, LESSONS.END_PAGE FROM LESSONS JOIN BOOKS ON LESSONS.BOOK_ID=BOOKS.ID',
		function(err, rows){
			if(err){
				callback(err, null);
			}
			else{
				callback(null, rows);
			}
		});
}

app.get('/getBooksAndLessons', function(req, res){
	getBooksAndLessons(function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result)
		}
	});
})

app.post('/getGroupsUser', function(req, res){
	getGroups2(req.body.user_email, function(err, results){
		if(err){
			res.json(err);
		}
		else{
			res.json(results);
		}
	})
})

function emailToList(emailList, text, callback){
	
	var mailOptions = {
		from: 'libertyelevatorreader@gmail.com',
		to: emailList,
		subject: 'Update from Liberty Reader!',
		'text': text
	};
	
	if(emailList === undefined){
		callback({'error': 'emails undefined'}, null);
	}
	else{
		if(emailList[0] === undefined){
			callback({'error': 'emails undefined'}, null);
		}
		else{
			if(text === undefined){
				text = " ";
			}
			transporter.sendMail(mailOptions, function(error, info){
				if(error){
					callback(error, null);
				}
				else{
					callback(null, info);
				}
			});
		}
	}
	
	
	
	
	
}

app.post('/emailToList', function(req, res){
	emailToList(req.body.emailList, req.body.text, function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	})
})


//admin_oidc.on('ready', () => {
//	user_oidc.on('ready', () => {
		app.listen(3000, () => console.log('server running on 3000'))
//	});
//});
