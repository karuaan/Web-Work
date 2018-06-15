const express = require('express')
const bb = require('express-busboy')
const uuid = require('uuid');
var Busboy = require('busboy');
var mkdirp = require('mkdirp');
const mysql = require('mysql')
const fs = require('fs');
const path = require('path')
const https = require('https');
const admin_functions = require('./functions/admin_functions');
const hummus = require('hummus');
const splitCA = require('split-ca');
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./firebase_key.json");
const emailReporting = require("./emailOverdueQuery");
const xl = require("excel4node");

var validator = require('express-validator');
var scheduler = require('node-schedule');
var multer = require('multer');
global.__basedir = __dirname;

//const filesys = require('fs')/
///*
const debug = false;
var con;

//local db on Liberty Windows server
/* {host: "127.0.0.1",
		user: "root", password: "Stevens2018#MVPHWB",
		port: "3306",
		database: "TRAINING_DB"} */

		/* {host: "mysql.cgkepgzez06k.us-east-2.rds.amazonaws.com",
		user: "admin", password: "Stevens2018#MVPHWB",
		port: "3306",
		database: "FEB_2"} */

if(!debug){
    console.log('production')
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
        multipleStatements: true,
		user: "root", password: "root",
		port: "3306",
		database: "node_webworkers"}
	)
}
const nodemailer = require('nodemailer');
const session = require('express-session');
const request = require('request')
var cors = require('cors')

//TODO, refactor for admin/user access
//const user_functions = require('./functions/user_functions.js');
//const admin_functions = require('./functions/admin_functions.js');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://safety-book-reader.firebaseio.com"
});

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


function onAdminLogin(adminId, callback){

	con.query(
"SELECT * FROM USERS INNER JOIN"+
"	(SELECT ID as group_id, USER_ID as user_id, ADMIN_ID as admin_id"+
"	FROM USER_GROUPS WHERE USER_GROUPS.ADMIN_ID=" + mysql.escape(adminId) +
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
	path: 'public/'
});

// app.use(fileupload());

app.get('/test/getallusers', function(req, res){
	con.query('SELECT * FROM USERS', function(err, rows){
		if(err){
			res.json(err);
		}
		else{
			res.json(rows);
		}
	})
});

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Range');

	res.setHeader('Access-Control-Expose-Headers', 'Accept-Ranges,Content-Encoding,Content-Length,Content-Range');

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
"TOTAL_PAGES int unsigned,												   "+	
"GROUP_ID int unsigned,														"+												
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
"FIREBASE_ID text,                                                         "+
"PHONE_NUMBER varchar(11),												   "+
"PRIMARY KEY (ID));                                                        "
		, function(err, rows, fields){
		console.log("Create Users");
		console.log(err);
		console.log(rows);
		console.log(fields);
		con.query(
"CREATE TABLE USER_GROUPS                                                       "+
"(ID int unsigned not null,                                    				"+
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
"GROUP_ID int unsigned,													   "+
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
"DUE_DATE DATE,                                                        	   "+
"START_DATE DATE,                                                      	   "+
"END_DATE DATETIME,                                                        "+
"TIME_TO_COMPLETE int unsigned,                                            "+
"NOTES text,															   "+
"AVAILABLE bit(1),														   "+
"PRIMARY KEY (ID),                                                         "+
"FOREIGN KEY (LESSON_ID) REFERENCES LESSONS(ID) ON DELETE CASCADE);        "
		, function(err, rows, fields){
		console.log("Create Assignments");
		console.log(err);
		console.log(rows);
		console.log(fields);
		con.query(
"CREATE TABLE STATUS                                                       "+
"(GROUP_ID int unsigned,                                                    "+
"EMPLOYEE_ID int unsigned,                                                 "+
"ASSIGNMENT_ID int unsigned,                                               "+
"IS_COMPLETE bit(1),                                                       "+
"PRIMARY KEY (GROUP_ID, EMPLOYEE_ID, ASSIGNMENT_ID),					   "+
"FOREIGN KEY (EMPLOYEE_ID) REFERENCES USERS(ID) ON DELETE CASCADE,         "+
"FOREIGN KEY (ASSIGNMENT_ID) REFERENCES ASSIGNMENTS(ID) ON DELETE CASCADE);"
		, function(err, rows, fields){
		console.log("Create Status");
		console.log(err);
		console.log(rows);
		console.log(fields);
		con.query(
"CREATE TABLE ANDROID_VERSION												"+
"(version_number int(11) unsigned,											"+
"version_url varchar(255));													"
		, function(err, rows, fields){
			console.log("Create Android Version");
			console.log(err);
			console.log(rows);
			console.log(fields);
		}

			);

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
});

//Added the cors to avoid cross origin issue
app.use(cors());
app.use(validator());

function sendEmailReport(rows){
	console.log(rows);
	rows.forEach(function(element, index, array){
		let adminName = element.admin_firstname+" "+element.admin_lastname;
		let adminEmail = element.admin_email;
		let groups = element.groups;


		let htmlBody = '<style>td { vertical-align:top;text-align:left;padding:15px;border:1px solid #ddd;} table {border-collapse: collapse;width:100%;}</style>'
		htmlBody+= '<h1>Daily Overdue Report</h1>';

		groups.forEach(function(element, index, array){
			let groupName = element.name;
			let overdueList = element.overdue_assignments;

			htmlBody+='<h2>'+groupName+'</h2>';
			//todo add borders
			htmlBody+='<table >';
			htmlBody+='<tr><th>Assignment</th><th>Employee</th><th>Email</th><th>Phone</th></tr>';

			overdueList.forEach(function(element, index, array){
				let assignmentName = element.name;
				let dueDate = new Date(element.due_date);
				let today = new Date();
				let employees = element.overdue_employees;

				let timeDiff = Math.abs(today.getTime() - dueDate.getTime());
				let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

				let lateText;
				if (diffDays==1){
					lateText='(1 day late)'
				}
				else{
					lateText='('+diffDays+' days late'+')';
				}

				assignCell = assignmentName+'<br/>'+lateText;

				htmlBody+='<tr><td rowspan='+employees.length+'>'+assignCell+'<br/>';

				let emailLink = 'mailto:';

				employeeRows ='';
				employees.forEach(function(element, index, array){
					let employeeName = element.first_name+" "+element.last_name;
					let employeeEmail = element.email;
					let employeePhone = element.phone;

					if (index>0){
						employeeRows+='<tr>'
						emailLink+=',';
					}

					emailLink+=employeeEmail;

					employeeRows+='<td>'+employeeName+'</td> <td>'+employeeEmail+'</td><td>'+employeePhone+'</td></tr>';
				});
				htmlBody+='<br/><a href=\"'+emailLink+'\">Send All</a></td>';
				htmlBody+=employeeRows;
			});
			htmlBody+='</table>';

			htmlBody += '<p>This is an automated email. For more question please send an email to libertyelevatorreader@gmail.com or reply to this email.</p>';
			htmlBody += '<h3>Thank You,</h3>';
			htmlBody += '<h3>Liberty Elevator Safety Training</h3>';

			//send one email per admin
			var mailOptions = {
				from: 'libertyelevatorreader@gmail.com',
				to: 'mr.sketch99@gmail.com',
				subject: '[Liberty Elevator Safety Training] Overdue Report',
				html: htmlBody
			};
			transporter.sendMail(mailOptions, function(error, info){
				if(error){
					console.log(error);
				}
				else{
					callback(null, info)
				}
			});
		});
	});
}

function updateTable(rows){
	let availableQuery = "UPDATE ASSIGNMENTS SET AVAILABLE=1 WHERE";
	rows.forEach(function(element, index, array){
		if (index>0){
			availableQuery+=" AND"
		}
		availableQuery+=" (ID="+mysql.escape(element.assignment_id)+" AND GROUP_ID="+mysql.escape(element.group_id)+")";
	});
	console.log(availableQuery);
	con.query(availableQuery, function(err, result){
		if (!err){
			console.log(result);
			rows.forEach(function(element, index, array){
				//send notification
				let title = element.assignment_name + " now available";
				let minutes = Math.floor(element.reading_time / 60);
				let seconds = element.reading_time - minutes * 60;
				let readingTimeStr = "";
				if (minutes > 0){
					readingTimeStr += minutes + " minutes ";
				}
				if (seconds > 0){
					readingTimeStr += seconds + " seconds";
				}
				let body = "Due "+element.due_date+" \u2022 "+readingTimeStr;
				let notes;
				let notificationType;
				if (element.notes){
					notes = body+"\n"+element.notes;
					type = "expandable";
				} //could be null
				else{
					notes = body;
					type = "standard";
				}
				sendMessageToGroup("group"+element.group_id,title,body, type, element.group_name, element);
			});
		}
		else{
			console.log(err);
		}
	});

}

function sendAssignmentNotifications(){
	let newAssignmentsQuery = "select ASSIGNMENTS.ID as assignment_id, ASSIGNMENTS.NAME as assignment_name, "+
	"ASSIGNMENTS.DUE_DATE as due_date, ASSIGNMENTS.TIME_TO_COMPLETE as reading_time, ASSIGNMENTS.NOTES as notes, "+
	"LESSONS.START_PAGE as start_page, LESSONS.END_PAGE as end_page, "+
	"USER_GROUPS.ID as group_id, USER_GROUPS.USER_ID as user_id, USER_GROUPS.NAME as group_name, "+
	"BOOKS.PDF_FILE as book_pdf "+
	"from ASSIGNMENTS INNER JOIN USER_GROUPS ON USER_GROUPS.ID = ASSIGNMENTS.GROUP_ID "+
	"INNER JOIN LESSONS ON LESSONS.ID = ASSIGNMENTS.LESSON_ID "+
	"INNER JOIN BOOKS ON BOOKS.ID = LESSONS.BOOK_ID "+
	"WHERE ASSIGNMENTS.START_DATE<=CURRENT_DATE() AND ASSIGNMENTS.AVAILABLE IS NULL GROUP BY ASSIGNMENTS.ID, GROUP_ID";
	con.query(newAssignmentsQuery, function(err, assignments){
		if (!err){
			console.log(assignments);
			if (assignments && assignments.length>0){
				let insertStatement = "INSERT INTO STATUS (GROUP_ID, EMPLOYEE_ID, ASSIGNMENT_ID, IS_COMPLETE) ";
				assignments.forEach(function(element, index, array){
					let statusQuery= insertStatement+"(SELECT "+mysql.escape(element.group_id)+", USER_ID, "+mysql.escape(element.assignment_id)+", 0 "+
					"FROM USER_GROUPS WHERE ID="+mysql.escape(element.group_id)+" AND USER_ID!=ADMIN_ID)";
					con.query(statusQuery, function(err, result){
						if (err){
							console.log("Error at line 434:\n\n"+err);
						}
						else{
							console.log(result);
						}
					});
				});
				updateTable(assignments);
			}
		}
		else{
			console.log(err);
		}
	})
}

app.get('/sendEmailReport', function(req, res){
	emailReporting.overdue(function(err, result){
		if (err){
			res.json(err);
		}else{
			res.json(result);
			sendEmailReport(result);

		}
	});
});

app.get('/notify', function(req, res){
	sendAssignmentNotifications();
});

//run every day to add status records for newly available assignments
var makeAssignmentsAvailable = scheduler.scheduleJob('0 8 * * *', function(){
	sendAssignmentNotifications();
});



var sendOverdueReports = scheduler.scheduleJob('0 8 * * *', function(){
	//query goes here
	emailReporting.overdue(function(err, result){
	 	if (err){
	 		res.json(err);
	 	}else{
	 		res.json(result);
		 	sendEmailReport(result);

	 	}
	 });

});

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
	});
});

app.get('/read-pdf', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	console.log('req',req.query.path);
	var filePath = "/"+req.query.path;
	console.log('full url',__basedir + filePath);
	fs.readFile(__basedir + filePath , function (err,data){
		res.contentType("application/pdf");
		if(!err){
			res.send(data);
		}else{
			console.log('err',err);
			res.send('');
		}
	});
});

function getLessons(group_id, callback){
    con.query("SELECT *,(select GROUP_CONCAT(ASSIGNMENTS.GROUP_ID) from ASSIGNMENTS WHERE ASSIGNMENTS.LESSON_ID =" +
	" LESSONS.ID) as ASSIGNMENTS_GROUP_IDS FROM LESSONS WHERE LESSONS.GROUP_ID=" + mysql.escape(group_id), function(err, rows){
		if(err){
			callback(err, null)
		}
		else{
			callback(null, rows)
		}
	})
}

function getLessonsByBookId(book_id,callback){
    con.query("SELECT *,(select GROUP_CONCAT(ASSIGNMENTS.GROUP_ID) from ASSIGNMENTS WHERE ASSIGNMENTS.LESSON_ID =" +
        " LESSONS.ID) as ASSIGNMENTS_GROUP_IDS FROM LESSONS WHERE BOOK_ID = ?",[book_id], function(err, rows){
		if(err){
			callback(err, null)
		}
		else{
			callback(null, rows)
		}
	});
}

app.post('/getlessons', function(req, res){
	getLessons(req.body.group_id, function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	})
});

app.get('/getPercentages', function(req, res) {
    getPercentages(function (err, result) {
        if(err) {
            res.json(err);
        }
        else {
            res.json(result);
        }
    })
});

app.post('/group/activebook', function(req, res){
	let groupId = req.body.group_id;
	let bookId = req.body.book_id;
	setActiveBook(groupId, bookId, function(err, result){
		if (err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
})

function setActiveBook(group_id, book_id, callback){
	con.query('UPDATE BOOKS SET ACTIVE=0 WHERE GROUP_ID='+mysql.escape(group_id), function(err, rows, fields){
		if(!err){
			con.query('UPDATE BOOKS SET ACTIVE=1 WHERE ID='+mysql.escape(book_id), function(err, rows, fields){
				if(!err){
					callback(null, "active book updated");
				}
				else{
					callback(err, null);
					console.log(err);
				}
			});
		}
		else{
			callback(err, null);
		}
	});
}
//Done
function getBooks(group_id, callback){

	var bookQuery = con.query('SELECT * FROM BOOKS WHERE GROUP_ID='+mysql.escape(group_id), function(err, rows, fields) {

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

	con.query('SELECT DISTINCT BOOKS.NAME as book_name, BOOKS.PDF_FILE as book_file, GroupTable.group_id, GroupTable.group_name, GroupTable.admin_firstname, GroupTable.admin_lastname, GroupTable.admin_email as admin_email FROM BOOKS, ASSIGNMENTS, LESSONS, (SELECT USER_GROUPS.ID as group_id, USER_GROUPS.NAME as group_name, users2.FIRST_NAME as admin_firstname, users2.LAST_NAME as admin_lastname, users2.EMAIL as admin_email FROM USERS as users1, USERS as users2, USER_GROUPS WHERE users1.ID=USER_GROUPS.USER_ID AND users2.ID=USER_GROUPS.ADMIN_ID AND users1.ID IN (SELECT ID FROM USERS WHERE EMAIL=' + mysql.escape(email) + ')) AS GroupTable WHERE ASSIGNMENTS.GROUP_ID=GroupTable.group_id AND LESSONS.ID=ASSIGNMENTS.LESSON_ID AND BOOKS.ID=LESSONS.BOOK_ID', function(err, rows){
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
	"id" : theJson.id,
	"name" : theJson.name,
	"start_page" : theJson.start_page,
	"end_page" : theJson.end_page,
	"reading_time" : theJson.reading_time,
	"due_date" : theJson.due_date,
	"lesson_pdf" : theJson.lesson_pdf,
	"complete" : parseInt(theJson.is_complete.toString('hex'))
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

function formatGroupAssignments(group, assignments){
	group.assignments = assignments;
	return group;
}

//May need rework in ordering
function getGroups2(email, callback){

	con.query('SELECT ASSIGNMENTS.NAME as assignment_name, ASSIGNMENTS.ID as assignment_id, LESSONS.START_PAGE as start_page, LESSONS.END_PAGE as end_page, ASSIGNMENTS.TIME_TO_COMPLETE as reading_time, ASSIGNMENTS.DUE_DATE as due_date, LESSONS.PDF_FILE as file, STATUS.IS_COMPLETE as complete, RecordTable.group_name, RecordTable.group_id, RecordTable.book_name, RecordTable.book_file, RecordTable.admin_firstname, RecordTable.admin_lastname, RecordTable.admin_email FROM ASSIGNMENTS, LESSONS, STATUS, (SELECT DISTINCT GroupTable.user_id, BOOKS.NAME as book_name, BOOKS.PDF_FILE as book_file, GroupTable.group_id, GroupTable.group_name, GroupTable.admin_firstname, GroupTable.admin_lastname, GroupTable.admin_email as admin_email FROM BOOKS, ASSIGNMENTS, LESSONS, (SELECT users1.ID as user_id, USER_GROUPS.ID as group_id, USER_GROUPS.NAME as group_name, users2.FIRST_NAME as admin_firstname, users2.LAST_NAME as admin_lastname, users2.EMAIL as admin_email FROM USERS as users1, USERS as users2, USER_GROUPS WHERE users1.ID=USER_GROUPS.USER_ID AND users2.ID=USER_GROUPS.ADMIN_ID AND users1.ID IN (SELECT ID FROM USERS WHERE EMAIL=' + mysql.escape(email) + ')) AS GroupTable WHERE ASSIGNMENTS.GROUP_ID=GroupTable.group_id AND LESSONS.ID=ASSIGNMENTS.LESSON_ID AND BOOKS.ID=LESSONS.BOOK_ID GROUP BY GroupTable.group_id) as RecordTable WHERE RecordTable.user_id=STATUS.EMPLOYEE_ID AND RecordTable.group_id=STATUS.GROUP_ID AND STATUS.ASSIGNMENT_ID=ASSIGNMENTS.ID AND ASSIGNMENTS.LESSON_ID=LESSONS.ID GROUP BY RecordTable.group_id', function(err, rows){
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

	con.query('SELECT ASSIGNMENTS.NAME as assignment_name, ASSIGNMENTS.ID as assignment_id, LESSONS.START_PAGE as start_page, LESSONS.END_PAGE as end_page, ASSIGNMENTS.TIME_TO_COMPLETE as reading_time, MIN(ASSIGNMENTS.DUE_DATE) as due_date, LESSONS.PDF_FILE as file, STATUS.IS_COMPLETE as complete, RecordTable.group_name, RecordTable.group_id, RecordTable.book_name, RecordTable.book_file, RecordTable.admin_firstname, RecordTable.admin_lastname, RecordTable.admin_email FROM ASSIGNMENTS, LESSONS, STATUS, (SELECT GroupTable.user_id, BOOKS.NAME as book_name, BOOKS.PDF_FILE as book_file, GroupTable.group_id, GroupTable.group_name, GroupTable.admin_firstname, GroupTable.admin_lastname, GroupTable.admin_email as admin_email FROM BOOKS, ASSIGNMENTS, LESSONS, (SELECT users1.ID as user_id, USER_GROUPS.ID as group_id, USER_GROUPS.NAME as group_name, users2.FIRST_NAME as admin_firstname, users2.LAST_NAME as admin_lastname, users2.EMAIL as admin_email FROM USERS as users1, USERS as users2, USER_GROUPS WHERE users1.ID=USER_GROUPS.USER_ID AND users2.ID=USER_GROUPS.ADMIN_ID AND users1.ID IN (SELECT ID FROM USERS WHERE EMAIL=' + mysql.escape(email) + ')) AS GroupTable WHERE ASSIGNMENTS.GROUP_ID=GroupTable.group_id AND LESSONS.ID=ASSIGNMENTS.LESSON_ID AND BOOKS.ID=LESSONS.BOOK_ID GROUP BY GroupTable.group_id) as RecordTable WHERE RecordTable.user_id=STATUS.EMPLOYEE_ID AND RecordTable.group_id=STATUS.GROUP_ID AND STATUS.ASSIGNMENT_ID=ASSIGNMENTS.ID AND ASSIGNMENTS.LESSON_ID=LESSONS.ID AND STATUS.IS_COMPLETE=0 GROUP BY RecordTable.group_id', function(err, rows){
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

function getGroups4(user_id, callback){
	let groupQuery = 'SELECT USER_GROUPS.ID as group_id, USER_GROUPS.NAME as group_name, USERS.FIRST_NAME as admin_first_name, USERS.LAST_NAME as admin_last_name, USERS.EMAIL as admin_email '+
					'FROM USER_GROUPS INNER JOIN USERS ON USER_GROUPS.ADMIN_ID=USERS.ID '+
					'INNER JOIN LESSONS ON LESSONS.GROUP_ID = USER_GROUPS.ID '+
					'WHERE USER_GROUPS.USER_ID = '+mysql.escape(user_id)+
					' GROUP BY USER_GROUPS.ID;';
	con.query(groupQuery, function(err, rows){
		if (!err){
			callback(null, rows);
		}
		else{
			callback(err, null);
		}
	})
}
/*
function getLatestAssignment(groupID, callback){

	con.query('SELECT LESSONS.START_PAGE as start_page, LESSONS.END_PAGE as end_page, LESSONS.PDF_FILE as file, ASSIGNMENTS.DUE_DATE as due_date, ASSIGNMENTS.TIME_TO_COMPLETE as reading_time, STATUS.IS_COMPLETE as complete FROM LESSONS, ASSIGNMENTS, USER_GROUPS, STATUS WHERE USER_GROUPS.ID=' + groupID + ' AND STATUS'

}
*/
//Done
function addUser(first_name, last_name, email, callback){

	con.query('SELECT * FROM USERS WHERE USERS.EMAIL=' + mysql.escape(email), function(err, rows){
		if(!err){
			if(rows[0] === undefined){
				console.log("ROWS ARE EMPTY")
				con.query('INSERT INTO USERS (FIRST_NAME, LAST_NAME, EMAIL, IS_ADMIN) VALUES ('+ mysql.escape(first_name) + ',' + mysql.escape(last_name) + ','+ mysql.escape(email) +', 0)', function(err2, result){
					if(err2){
						con.rollback(function(){callback(err2, null)})
					}
					else{
						firebaseAdmin.auth().createUser({
						  'email': email,
						  emailVerified: false,
						  password: "elevatorpass",
						  photoURL: "http://user.com",
						  disabled: false
						}).then((record) => {
							callback(null, record);
						},
						(firebase_err) => {//Rollback DB
							con.query('DELETE FROM USERS WHERE EMAIL=?', [email], function(del_err, result){
								if(del_err){
									callback(del_err, null);
								}
								else{
									callback({'error': 'could not add user to firebase'}, null);
								}
							});
							callback(firebase_err, null);
						});
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
function addAdmin(email, callback){

	con.query('SELECT * FROM USERS WHERE USERS.EMAIL=?', [email], function(err, rows){
		if(!err){
			if(rows[0] === undefined){
				console.log("ROWS ARE EMPTY")
				con.query('INSERT INTO USERS (FIRST_NAME, LAST_NAME, EMAIL, IS_ADMIN) VALUES (?,?,?, ?)', ["","",email,1], function(err2, result){
					if(!err2){
						firebaseAdmin.auth().createUser({
						  'email': email,
						  emailVerified: false,
						  password: "elevatorpass",
						  disabled: false
						}).then((record) => {
							callback(null, record);
						},
						(firebase_err) => {//Rollback DB
							con.query('DELETE FROM USERS WHERE EMAIL=?', [email], function(del_err, result){
								if(del_err){
									callback(del_err, null);
								}
								else{
									callback({'error': 'could not add user to firebase'}, null);
								}
							});
							callback(firebase_err, null);
						});

					}
					else{
						callback(err2, null);
					}
				})
			}
			else{
				console.log(rows);
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
//Done/
function addLesson(plan_id, book_id, start_page, end_page, name, filepath, callback){
	console.log('A1');
	con.query("SELECT * FROM LESSONS WHERE LESSONS.NAME=" + mysql.escape(name) + " AND LESSONS.BOOK_ID=" + mysql.escape(book_id), function(err, rows){
		if(!err){
			console.log('B2')
			if(rows[0] === undefined){
				console.log('C3');
				con.query("INSERT INTO LESSONS (LESSON_PLAN_ID, BOOK_ID, START_PAGE, END_PAGE, NAME, PDF_FILE) VALUES (" + mysql.escape(book_id) + ", "   + mysql.escape(start_page) + ", "  + mysql.escape(end_page) + ", "  + mysql.escape(name) + ", "  + mysql.escape(filepath) +")", function(err2, result){
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


function insertLessonAssignment(id,assignment){
  return new Promise(function (resolve, reject) {
      var insertQuery = "INSERT INTO ASSIGNMENTS (NAME, LESSON_ID, GROUP_ID, DUE_DATE, START_DATE,TIME_TO_COMPLETE)" +
          " VALUES (?,?,?,?,?,?)";
          con.query(insertQuery,[
            assignment.NAME,
            assignment.LESSON_ID,
            assignment.GROUP_ID,
            assignment.DUE_DATE,
            assignment.START_DATE,
            assignment.TIME_TO_COMPLETE
         ],function (err,results,fields) {
             if (!err){
                 resolve({
                     status : true,
                     data : results
                 });
             }else{
                 resolve({
                     status : false,
                     data : null
                 });
             }
         });
  });
}

//Dpme
function addAssignment(lesson_id, group_id, due_date, time_to_complete, notes){
	con.query("SELECT * FROM ASSIGNMENTS WHERE ASSIGNMENTS.LESSON_ID=" + mysql.escape(lesson_id) + " AND ASSIGNMENT.GROUP_ID=" + mysql.escape(group_id), function(err, rows){
		if(!err){
			if(row[0] === undefined){
				con.query("INSERT INTO ASSIGNMENTS (LESSON_ID, GROUP_ID, DUE_DATE, TIME_TO_COMPLETE, NOTES) VALUES (" + mysql.escape(lesson_id) + ", "   + mysql.escape(group_id) + ", "  + mysql.escape(due_date) + ", "  + mysql.escape(time_to_complete)+", " + mysql.escape(notes)+")", function(err2, result){
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

/* function editAssignment(lesson_id, group_id, start_date, due_date, time_to_complete, notes, callback){
	con.query("UPDATE ASSIGNMENTS SET ASSIGNMENT.START_DATE="+ mysql.escape(start_date)  
		+", ASSIGNMENTS.DUE_DATE=" + mysql.escape(due_date)
		+", ASSIGNMENTS.TIME_TO_COMPLETE="+ mysql.escape(time_to_complete) 
		+", ASSIGNMENTS.NOTES=" + mysql.escape(notes) 
		+" WHERE ASSIGNMENTS.LESSON_ID="+ mysql.escape(lesson_id) +"AND ASSIGNMENTS.GROUP_ID=" +mysql.escape(group_id), function(err, rows){
			if(err){
				callback(err, null);
			}
			else{
				callback(null, rows);
			}
	})
} */

function editAssignment(lesson_id, group_id, start_date, due_date, time_to_complete, notes, callback){

	console.log(lesson_id);
	console.log(group_id);
	console.log(start_date);
	console.log(due_date);
	console.log(time_to_complete);
	console.log(notes);
	
	console.log(typeof lesson_id);
	console.log(typeof group_id);
	console.log(typeof start_date);
	console.log(typeof due_date);
	console.log(typeof time_to_complete);
	console.log(typeof notes);
	
	con.query("UPDATE ASSIGNMENTS SET START_DATE=?, "+
		"DUE_DATE=?, "+
		"TIME_TO_COMPLETE=?, "+
		"NOTES=? "+
		"WHERE LESSON_ID=? "+
		"AND GROUP_ID=?", 
		
		[start_date,
		due_date,
		time_to_complete,
		notes,
		lesson_id,
		group_id],
		
		function(err, rows){
			if(err){
				callback(err, null);
			}
			else{
				callback(null, rows);
			}
	})
}


app.put('/editAssignments', function(req, res)
{
	editAssignment(req.body.LESSON_ID, 
					req.body.GROUP_ID,
					req.body.START_DATE,
					req.body.DUE_DATE, 
					req.body.TIME_TO_COMPLETE, 
					req.body.NOTES, 
					function(err, result)
	{
		if (err)
		{
			res.json(err);
		}

		else
		{
			res.json(result);
		}
	})
})

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
			//console.log(usr	con.query('SELECT * FROM USERS WHERE USERS.EMAIL=' + mysql.escape(email), function(err, rows){_mails);
			let new_users = usr_mails.filter(x => !popped_rows.includes(x)).map(x => [x]);

			con.query("INSERT INTO USERS (EMAIL) VALUES ?", [new_users], function(errNew, rowsNew){
				console.log("-+-");
				console.log(errNew);
				console.log(rowsNew);
				console.log("-+-");
			});
			//DANGER ^^^^^^ WILL NEED TO BE REPLACED BY OKTA CALLS

		}
		con.query("SELECT ID FROM USERS WHERE EMAIL IN (" + mysql.escape(usr_mails) + ");", function(err2, rows2){
		var usr_ids = rows2;
		console.log(usr_ids)
		//console.log(name);
		//console.log(admin_id);
		//callback(null, null);
		///*
		con.query("SELECT MAX(ID) as group_id FROM USER_GROUPS", function(error, result){
			if(error){callback(error, null)}
			else{
				console.log(result);

				usr_ids.forEach(function(value, index, arr){arr[index] = [Number(result[0].group_id+1), Number(admin_id), Number(value.ID), name]});
				console.log(usr_ids);
				con.query("INSERT INTO USER_GROUPS (ID, ADMIN_ID, USER_ID, NAME) VALUES ?", [usr_ids], function(err, rows){
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

}
//Change so that users not in the system get invited
function addToGroup(group_id, user_ids, callback){
	con.query("SELECT ADMIN_ID as admin_id, NAME as group_name FROM USER_GROUPS WHERE ID=" + mysql.escape(group_id), function(err, rows){
		console.log(rows)
///*
		if(!err){
			if(rows[0] === undefined){
				callback({'error' : 'group does not exist'}, null)
			}
			else{
				user_ids.forEach(function(value, index, arr){arr[index] = [Number(group_id), Number(rows[0].admin_id), Number(value), rows[0].group_name]})
				console.log(user_ids);
				con.query("INSERT INTO USER_GROUPS (ID, ADMIN_ID, USER_ID, NAME) VALUES ?", [user_ids], function(err2, result){
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
		});

	});

}

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
	con.query("SELECT ADMIN_ID as admin_id, NAME as group_name FROM USER_GROUPS WHERE ID=" + mysql.escape(group_id), function(err, rows){
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

								con.query("INSERT INTO USER_GROUPS (ID, ADMIN_ID, USER_ID, NAME) VALUES ?", [user_ids], function(err2, rows2){
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

				con.query("INSERT INTO USER_GROUPS (ID, ADMIN_ID, USER_ID, NAME) VALUES ?", [user_ids], function(err2, rows2){
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
	con.query('SELECT DISTINCT LESSONS.ID as id, LESSONS.NAME as name, ASSIGNMENTS.DUE_DATE as due_date, ASSIGNMENTS.TIME_TO_COMPLETE as time_to_read, STATUS.IS_COMPLETE  as complete, LESSONS.PDF_FILE as filename FROM USERS, USER_GROUPS, ASSIGNMENTS, LESSONS, STATUS WHERE USERS.ID=' + mysql.escape(userid) + ' AND USER_GROUPS.ID=' + mysql.escape(groupid) + ' AND ASSIGNMENTS.GROUP_ID=USER_GROUPS.ID AND STATUS.GROUP_ID=USER_GROUPS.ID AND STATUS.EMPLOYEE_ID=USERS.ID AND ASSIGNMENTS.LESSON_ID=LESSONS.ID', function(err, rows){
	if(!err){
		callback(null, rows);
	}
	else{
		callback(err, null);
	}
	})
}

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
	con.query('SELECT EMAIL FROM USERS a, USER_GROUPS b WHERE b.ID=' + mysql.escape(group_id) + ' AND a.ID=b.USER_ID', function(err, rows){
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
				con.query('SELECT USER_ID as user_id FROM USER_GROUPS WHERE ID=' + mysql.escape(group_id), function(err3, rows3){
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
//Added back from 5/7
function getUserDetails(user_id, callback){
	con.query("SELECT FIRST_NAME as first_name, LAST_NAME as last_name FROM USERS WHERE ID=" + mysql.escape(user_id)+" LIMIT 1", function(err, res){
		if(err){
			callback(err, null)
		}
		else{
			callback(null, res[0])
		}
	});
}
app.get('/user/:id', (req, res)=>{
	let id = Number(req.params.id);
	getUserDetails(id, function(err, result){
		if (err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
})

app.get('/assignment/:id', (req, res)=>{
	let id = Number(req.params.id);
	getAssignmentById(id, function(err, result){
		if (err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
});
//End add
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

function deleteGroupById(group_id, callback){
	con.query("DELETE FROM USER_GROUPS WHERE ID=?", [group_id], function(err, res){
		if(err){
			callback(err, null);
		}
		else{
			callback(null, res);
		}
	})
}

function removeUserFromGroup(user_id, group_id, callback){
	con.query("DELETE FROM USER_GROUPS WHERE ID=? AND USER_ID=?", [group_id, user_id], function(err, res){
		if(err){
			callback(err, null);
		}
		else{
			callback(null, res);
		}
	})
}

app.post('/removeUserFromGroup', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	removeUserFromGroup(req.body.user_id, req.body.group_id, function(err, result){
		if(err){
			console.log(err);
			res.json(err)
		}
		else{
			console.log(result)
			if(!res.headersSent){res.json(result)}else{}
		}
	})
});

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

app.delete('/userByEmail', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	deleteUserByEmail(req.body.user_email, function(err, result){
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

app.post('/deleteGroupById', function(req, res){
	deleteGroupById(req.body.group_id, function(err, result){
		if(err){
			res.json(err);
			console.log(err);
		}
		else{
			console.log(result)
			if(!res.headersSent){res.json(result)}else{}
		}
	})
})

app.post('/delete/lessons', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){

	var lessons = req.body;
	BookService.deleteLessons(lessons).then(function(results){
		console.log('results',results);
		res.json({
			results: results,
			message : 'All Good'
		});
	}).catch(function(error){
		console.log('error',error);
	});

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
});

app.use(express.static('public'));

app.get('/', (req, res) => res.json(req.body));
//For debug
app.get('/code', (req, res) => res.sendFile('index.js', {root: __dirname}));

//Echo
app.post('/', (req, res) => res.json(req.body));

const BookService = require('./services/book.service')(app,con,fs,hummus,Busboy,uuid, firebaseAdmin, transporter);

app.get('/book/:group_id', function(req, res) {
	let group_id = req.params.group_id;
	getBooks(group_id, function(err, result){
		if(err){
			console.log(err);
		}
		res.json(result);
	});
});

app.get('/getstatuses',function(req,res){

	con.query('SELECT * FROM STATUS',function(err,rows){
		if(!err && rows){
			res.json(rows);
		}else{
			res.json([]);
		}
	});
});

var location = __dirname + "/public/android"
var upload = multer({dest: location});

app.post('/apk', upload.single("file"), function(req, res, next) {
    if(req.files) {
        con.query("SELECT MAX(version_number) AS max FROM ANDROID_VERSION", function(err, rows) {
            if(err) {
                console.log(err);
            }
            var nextVersion = rows[0]["max"] + 1;
			var url = req.files["file"]["uuid"] + "/file/" + req.files["file"]["filename"];
            con.query("INSERT INTO ANDROID_VERSION (version_url, version_number) VALUES (" + mysql.escape(url) + ", " + mysql.escape(nextVersion) + ");", function(err, rows) {
                if(err) {
                    console.log(err);
                }
                else {
                    res.end("New APK Uploaded")
                }
            });
        });
    }
    else {
        res.end("Missing file")
    }

});

app.get("/apk", function(req, res){
	con.query("SELECT version_url FROM ANDROID_VERSION WHERE version_number = (SELECT MAX(version_number)FROM ANDROID_VERSION);", function(err, rows) {
		if(err) {
			res.end(err);
		}
		else {
			url = __dirname + "/public/" + rows[0]["version_url"];
			res.sendFile(url)
		}
	})
});




//Done
app.post('/new/book', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
    if(req.body.book_name =='' || req.body.book_name == null){
           res.status(200).json({
              status : 'fail',
              message : 'name required',
              data : null
          });
           return;
       }

    var busboy = new Busboy({ headers: req.headers });

       // Listen for event when Busboy finds a file to stream.
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            // We are streaming! Handle chunks
            file.on('data', function(data) {
                // Here we can act on the data chunks streamed.
            });
            // Completed streaming the file.
            file.on('end', function() {
                console.log('Finished with ' + fieldname);
            });
        });

        busboy.on('finish', function() {
            try{
				var book = {
					NAME : req.body.book_name,
					PDF_FILE : req.files.book_file.file,
					TOTAL_PAGES : 0,
					GROUP_ID: req.body.group_id
				};

				BookService.newBook(book).then(function(result){
					res.json(result);
				});


            }catch (e){
                res.status(200).json({
                      status : 'fail',
                      message : 'File not valid or not found!',
                      data : null
                  });
            }
        });
        req.pipe(busboy);
});

app.post('/new/lesson', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	let lessonData = req.body
	console.log(lessonData)
	addLesson(lessonData.plan_id,
			lessonData.book_id,
			lessonData.start_page,
			lessonData.end_page,
			lessonData.name,
			"",
			function(err, result){
		if(err){
			console.log(err);
			res.json(err);
		}
		else{
			if(!res.headersSent){res.json(result)}else{};
		}
	})
});



app.post('/groups/:groupId/employees', /*admin_oidc.ensureAuthenticated(),*/ function (req, res) {
	var admin_id = 3;
	// Save employee if not exists , if exists than return employee
	// var employeeDataRes = await BookService.saveEmployee(req.body);


	 BookService.saveGroup({
		ADMIN_ID: req.body.admin_id,
		NAME : req.body.group_name,
		GROUP_ID : req.params.groupId,
		employees : [
			{
				FIRST_NAME: '', //item.value.replace(/@.*$/, '')
				LAST_NAME: '',
				EMAIL: req.body.EMAIL
			}
		]
	}).then(function(data) {
		res.json(data);
	});

});

app.post('/groups/save', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){

	// temp admin id 3

	if(!req.body.NAME){
		res.json({
			message : 'NAME required',
			status : false,
			data : null
		});
	}

	if(req.body.employees.length > 0){
		BookService.saveGroup(req.body).then((data) => {
			res.json(data);
		});
	}
	else{
		res.json({
			message : 'Employee required',
			status : false,
			data : null
		});
	}
});

app.post('/send-invitation', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){

	if(!req.body.email){
		res.json({
			message : 'Please provide email'
		})
	}

	res.json({
		message : 'Invitation send successfull'
	})


});

app.post('/lessons/remove-assignment',function(req,res){

	console.log('req',req.body);

	BookService.removeAssignmentLesson(req.body).then(function(result){
		res.json(result);
	});
});

app.post('/batch-save/lessons', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
    if (req.body.lessons && req.body.lessons.length > 0){
		BookService.saveLessons(req.body.lessons, req.body.group_id).then(function(results){
			console.log('results',results);
			res.json({
				results: results,
				message : 'All Good'
            });
		}).catch(function(error){
			console.log('error',error);
		});
    }else{
        res.json({
           results: null,
           message : 'Please provide lessons'
       });
    }
})

app.get('/books/:id/lessons', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
    getLessonsByBookId(req.param('id'),function(err, result){
        if(err){
            res.json(err);
        }
        else{
            res.json(result)
        }
    });
})

app.post('/lessons/:id/assignment', /*admin_oidc.ensureAuthenticated(),*/ function(req, res){
	let assignment = req.body;
	BookService.addAssignment(assignment).then((data) => {
		if(data.data){
			let assignStartDate = new Date(assignment.START_DATE);
			if (assignStartDate <= new Date()){
				//send notification

				//TOPIC 
				let topic = "group"+assignment.GROUP_ID;

				//TITLE
				let title = assignment.NAME + " now available";

				//BODY
				let minutes = Math.floor(assignment.TIME_TO_COMPLETE / 60);
				let seconds = assignment.TIME_TO_COMPLETE - minutes * 60;
				let readingTimeStr = "";
				if (minutes > 0){
					readingTimeStr += minutes + " minutes ";
				}
				if (seconds > 0){
					readingTimeStr += seconds + " seconds";
				}
				let body = "Due "+assignment.DUE_DATE+" \u2022 "+readingTimeStr;
				let notes;
				let notificationType;
				if (assignment.NOTES){
					type = "expandable";
				} //could be null
				else{
					type = "standard";
				}

				let groupName = assignment.GROUP_NAME;
				sendMessageToGroup(topic, title, body, type, groupName, assignment);

			}

			res.json(data.data);
		}else{
			res.json(data);
		}
	});
});

function getAssignments(group_id, callback){
	con.query("SELECT DISTINCT ASSIGNMENTS.ID as assignment_id, DUE_DATE, START_DATE, TIME_TO_COMPLETE, ASSIGNMENTS.NAME, BOOKS.ID as book_id, LESSONS.ID as lesson_id FROM " +
	"(ASSIGNMENTS JOIN USER_GROUPS ON ASSIGNMENTS.GROUP_ID=USER_GROUPS.ID JOIN LESSONS ON LESSONS.ID=ASSIGNMENTS.LESSON_ID " +
	"JOIN BOOKS ON LESSONS.BOOK_ID=BOOKS.ID) "+
//	"WHERE ADMIN_ID="+mysql.escape(admin_id) + " AND " +
	"WHERE ASSIGNMENTS.GROUP_ID=" + mysql.escape(group_id),
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

function getAssignmentById(assignId, callback){
	con.query('select LESSONS.START_PAGE as start_page, LESSONS.PDF_FILE as lesson_pdf, LESSONS.END_PAGE as end_page, LESSONS.NAME as name, '+
	'ASSIGNMENTS.TIME_TO_COMPLETE as reading_time, ASSIGNMENTS.DUE_DATE as due_date, ASSIGNMENTS.ID as id, ASSIGNMENTS.GROUP_ID as group_id, BOOKS.PDF_FILE as book_pdf FROM LESSONS '+
	'JOIN ASSIGNMENTS ON LESSONS.ID=ASSIGNMENTS.LESSON_ID JOIN STATUS ON STATUS.ASSIGNMENT_ID='+
	'ASSIGNMENTS.ID JOIN BOOKS ON LESSONS.BOOK_ID = BOOKS.ID WHERE ASSIGNMENTS.ID='+ mysql.escape(assignId),
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
					console.log(rows[0]);
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

function getAssignments2(group_id, callback){
	con.query(
	"SELECT assignment_id, DUE_DATE, START_DATE, TIME_TO_COMPLETE, NAME, book_id, lesson_id, percent_complete, NOTES "+
	"FROM (SELECT SUM(IS_COMPLETE)/COUNT(*) as percent_complete, " +
		"ASSIGNMENT_ID as join_assignment_id " + 
		"FROM STATUS WHERE GROUP_ID=" + mysql.escape(group_id) + " GROUP BY ASSIGNMENT_ID) as PERCENT_TABLE JOIN " + 
	
	"(SELECT DISTINCT ASSIGNMENTS.ID as assignment_id, DUE_DATE, START_DATE, TIME_TO_COMPLETE, ASSIGNMENTS.NAME as NAME, BOOKS.ID as book_id, LESSONS.ID as lesson_id, ASSIGNMENTS.NOTES as NOTES FROM " +
	"(ASSIGNMENTS JOIN USER_GROUPS ON ASSIGNMENTS.GROUP_ID=USER_GROUPS.ID JOIN LESSONS ON LESSONS.ID=ASSIGNMENTS.LESSON_ID " +
	"JOIN BOOKS ON LESSONS.BOOK_ID=BOOKS.ID) "+
//	"WHERE ADMIN_ID="+mysql.escape(admin_id) + " AND " +
	"WHERE ASSIGNMENTS.GROUP_ID=" + mysql.escape(group_id) + ") as ASSIGNMENTS_TABLE ON PERCENT_TABLE.join_assignment_id=ASSIGNMENTS_TABLE.assignment_id",
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
app.post('/getassignments2', function(req, res){
	getAssignments2(req.body.group_id, function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
});

function getEmployees(group_id, callback){
	con.query("SELECT USERS.ID, USERS.FIRST_NAME, USERS.LAST_NAME, USERS.EMAIL FROM USERS JOIN USER_GROUPS ON USERS.ID=USER_GROUPS.USER_ID WHERE USER_GROUPS.ID=" + mysql.escape(group_id), function(err, rows){
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
	con.query("SELECT USERS.ID, USERS.FIRST_NAME, USERS.LAST_NAME, USERS.EMAIL, STATUS.IS_COMPLETE FROM USERS JOIN USER_GROUPS ON USERS.ID=USER_GROUPS.USER_ID LEFT JOIN STATUS ON STATUS.EMPLOYEE_ID=USERS.ID AND STATUS.ASSIGNMENT_ID=" + mysql.escape(assignment_id) + " WHERE USER_GROUPS.ID=" + mysql.escape(group_id), function(err, rows){
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

function getAssignmentsUser(user_id, group_id){

	return new Promise(function(resolve, reject){
		con.query('select STATUS.IS_COMPLETE as is_complete, LESSONS.START_PAGE as start_page, LESSONS.PDF_FILE as lesson_pdf, LESSONS.END_PAGE as end_page, LESSONS.NAME as name, '+
		'ASSIGNMENTS.TIME_TO_COMPLETE as reading_time, ASSIGNMENTS.DUE_DATE as due_date, ASSIGNMENTS.ID as id, ASSIGNMENTS.GROUP_ID as group_id, BOOKS.PDF_FILE as book_pdf FROM LESSONS '+
		'JOIN ASSIGNMENTS ON LESSONS.ID=ASSIGNMENTS.LESSON_ID JOIN STATUS ON STATUS.ASSIGNMENT_ID='+
		'ASSIGNMENTS.ID JOIN BOOKS ON LESSONS.BOOK_ID = BOOKS.ID WHERE ASSIGNMENTS.START_DATE<=CURRENT_DATE() AND STATUS.EMPLOYEE_ID=' + mysql.escape(user_id) + ' AND STATUS.GROUP_ID='+ mysql.escape(group_id)
			, function(err, rows){
				if(err){
					reject(err);
				}
				else{
					rows.forEach(function(element, index, array){
						element.is_complete = element.is_complete[0]===1;
					});
					resolve(rows);
				}
			});


	});

}
function updateReadingStatus(status, user_id, callback){
	let query = 'UPDATE STATUS SET IS_COMPLETE=1 ';
	query+=' WHERE EMPLOYEE_ID='+mysql.escape(user_id)+ ' AND (';

	for (var i = 0; i < status.length; i++){
		if (i>0){
			query+=' OR';
		}
		query+=' ASSIGNMENT_ID='+mysql.escape(Number(status[i]));
	}
	query+=')';
	console.log(query);
	con.query(query, function(err, rows){
		if (!err){
			callback(null, rows);
		}else
		{
			callback(err, null);
		}

	});
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

// added new group call to get the list of groups created by that admin id
app.post('/getgroups',function(req,res){

	console.log(req.body.admin_id)
	con.query("SELECT DISTINCT ID, NAME FROM USER_GROUPS",function(err,data,fields){
		if(!err){
			res.json(data);
		}
		else{
			res.json(err);
		}
	});

});

app.post('/groups/:user_id', function(req, res){
	getGroups4(Number(req.params.user_id), function(err, groups){
		if(err){
			res.json(err);
		}
		else{
			if (req.body.completed_assignments){
				updateReadingStatus(req.body.completed_assignments, Number(req.params.user_id), function(err, result){
					if (!err){
						let assignmentPromises = [];
						groups.forEach(function(element, index, array){
							assignmentPromises.push(getAssignmentsUser(Number(req.params.user_id), element.group_id).then(function(assignments){
								return formatGroupAssignments(element, assignments);
							}, function(error){
								return error;
							}));

						});
						return Promise.all(assignmentPromises).then(function(array){
							res.json(array);
						});
					}
					else{
						res.json(err);
					}
				});

			}
			else{
				let assignmentPromises = [];
				groups.forEach(function(element, index, array){
					assignmentPromises.push(getAssignmentsUser(req.params.user_id, element.group_id).then(function(assignments){
						return formatGroupAssignments(element, assignments);
					}, function(error){
						return error;
					}));

				});
				return Promise.all(assignmentPromises).then(function(array){
					res.json(array);
				});
			}
		}
	});
});

app.get('/groups/:id', function(req, res){
	console.log(Number(req.params.id));
	getGroups4(req.param('id'), function(err, groups){
		if(err){
			res.json(err);
		}
		else{
			let assignmentPromises = [];
			groups.forEach(function(element, index, array){
				assignmentPromises.push(getAssignmentsUser(Number(req.params.id), element.group_id).then(function(assignments){
					console.log(element, assignments);
					if (!assignments || assignments.length==0){
						assignments = [];
					}
					return formatGroupAssignments(element, assignments);
				}, function(error){
					return error;
				}));

			});
			return Promise.all(assignmentPromises).then(function(array){
				console.log(array);
				res.json(array);
			});
		}
	});

});

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
			console.log(err);
			res.json(err);

		}
		else{
			console.log(result);
			res.json(result);
		}
	})
})

function getLatestVersion(callback)
{
	con.query
	(
		"select version_number, version_url FROM ANDROID_VERSION WHERE version_number IN (SELECT MAX(version_number) FROM ANDROID_VERSION)", function (err, rows)
		{
			if (err)
			{
				callback(err, null);
			}
			else
			{
				if (rows[0]){
					callback(null, rows);
				}
				else{
					callback(null, [{version_url: "NONE", version_number:0}]);
				}			
			}
		}

	);
}

function updateVersionAPK(versionNumber, versionUrl, callback)
{
	con.query
	("INSERT INTO ANDROID_VERSION(version_number, version_url) VALUES ("+mysql.escape(versionNumber) + ',' + mysql.escape(versionUrl) +")", function(err, rows)
	{
		if (err)
		{
			callback(err, null);
		}

		else
		{
			callback(null, rows);
		}
	});
}

app.post('/androidVersionTable', function(req, res)
{
	updateVersionAPK(req.body.versionNumber, req.body.versionUrl, function(err, result)
	{
		if (err)
		{
			console.log(err);
			res.json(err);
		}

		else
		{
			console.log(result);
			res.json(result);
		}
	});
});

app.get('/androidVersionTable', function(req, res)
{
	getLatestVersion(function(err, rows)
	{
		if (err)
		{
			res.json(err);
		}

		else
		{
			res.json(rows[0]);
		}
	});
});

function getAdminID(email, callback){
	con.query("SELECT ID FROM USERS WHERE USERS.IS_ADMIN=1 AND USERS.EMAIL=" + mysql.escape(email), function(err, rows){
		if(err){
			callback(err, null);
		}
		else{
			callback(null, rows);
		}
	})
}

function getMasterTable(admin_id, callback){

	con.query(
		"SELECT " +
		  "GROUP_USER_TABLE.USER_ID AS USER_ID, " +
		  "GROUP_USER_TABLE.GROUP_ID AS GROUP_ID, "  +
		  "GROUP_USER_TABLE.USER_FIRST_NAME AS USER_FIRST_NAME, " +
		  "GROUP_USER_TABLE.USER_LAST_NAME AS USER_LAST_NAME, " +
		  "GROUP_USER_TABLE.USER_EMAIL AS USER_EMAIL, " +
		  "GROUP_USER_TABLE.GROUP_NAME AS GROUP_NAME, " +
		  "STATUS.ASSIGNMENT_ID as ASSIGNMENT_ID, " +
		  "STATUS.IS_COMPLETE as IS_COMPLETE, " +
		  "ASSIGNMENTS.NAME as ASSIGNMENT_NAME " +
		"FROM " +
		"(SELECT " +
		  "USER_GROUPS.ID as GROUP_ID, " +
		  "USER_GROUPS.NAME as GROUP_NAME, " +
		  "USERS.ID as USER_ID, " +
		  "USERS.FIRST_NAME as USER_FIRST_NAME, " +
		  "USERS.LAST_NAME as USER_LAST_NAME, " +
		  "USERS.EMAIL as USER_EMAIL " +
		 "FROM USER_GROUPS JOIN USERS ON USERS.ID=USER_GROUPS.USER_ID " +
		 ") as GROUP_USER_TABLE " +
		 "LEFT JOIN STATUS ON STATUS.EMPLOYEE_ID=GROUP_USER_TABLE.USER_ID " +
		 "LEFT JOIN ASSIGNMENTS ON STATUS.ASSIGNMENT_ID=ASSIGNMENTS.ID ",
		function(err, rows){
			if(err){
				callback(err, null);
			}
			else{
				callback(null, rows);
			}
		}
	);
}

app.post('/getMasterTable', function(req, res){
	getMasterTable(req.body.admin_id, function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	})
})



app.post('/getAdminID', function(req, res){
	getAdminID(req.body.email, function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	})

})


app.post('/getUserDetails', function(req,res){
	if (req.body.hasOwnProperty("email") && req.body.hasOwnProperty("firebase_token")){

			con.query("update  USERS  set FIREBASE_ID = '"+ req.body.firebase_token+"' WHERE EMAIL = '"+req.body.email+"';");

			con.query("SELECT * FROM USERS WHERE EMAIL='"+req.body.email+"';", function(err, rows){
			if(err){
				res.json(err);
			}else if (rows.length === 0){
				res.status(204);
				res.send('No user found');

			}
			else{
				var userData = rows[0];
				con.query("SELECT ID FROM USER_GROUPS WHERE USER_ID='"+userData["ID"]+"';", function(err, rows){
					//  suscribe_to_topics  is an array as user belongs to multiple groups

					var suscribe_to_topics = [];
					if (err){
						console.log(err)
						// do nothing
					}else {
						for (var i = 0; i < rows.length; i++) {
						suscribe_to_topics.push("group"+rows[i]["ID"].toString());
					}
					// currently added a dummy group1 as i dont belong to any group
					// remove the below line
					suscribe_to_topics.push("group1");
					userData["SUSCRIBE_TOPICS"] = suscribe_to_topics;
					res.json(userData);
					}
				})

			}
		})

	}else {
		res.status(302);
		res.send('Bad request');

	}


})
app.post('/sendNotification', function(req,res){
	// 52 is user id of mamidi.nilesh@gmail.com
	// add the user ids in in clause to get and send to multple users at once

			con.query("SELECT FIREBASE_ID  FROM USERS WHERE ID IN (52);", function(err, rows){
			if(err){
				res.json(err);
			}
			else{
				console.log(rows.toString())
				var firebase_tokens = [];
				for (var i = 0; i < rows.length; i++) {
						firebase_tokens.push(rows[i]["FIREBASE_ID"].toString());

				}
				;
				//notification_type: currently handling 2 type normal and expandable
				sendMessageToUser(firebase_tokens,"Safety Reader","Please complete your assignment", "expandable")
				res.status(200)
				res.json("Notification sent");
			}
		})



})



function sendMessageToUser(deviceIds, title, body,notification_type) {
  request({
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: {
      'Content-Type' :' application/json',
      'Authorization': 'key=AIzaSyD_eYHs27nVu8f94PJRIXHVw7zcu-UTyAA'
    },
    body: JSON.stringify(
      { "data": {
      	"body": body,
        "title": title,
        "notification_type": notification_type
      },
        "registration_ids": deviceIds
      }
    )
  }, function(error, response, body) {
    if (error) {
    	//res.json(error);
      console.error(error, response, body);
    }
    else if (response.statusCode >= 400) {
    	//res.status(302);
      console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body);
    }
    else {
      console.log('Done!')
      //res.status(200);
    }
  });
}
app.post('/sendMessageToGroup', function(req,res){
				sendMessageToGroup("group1","TOPIC - Safety Reader","Please complete your assignment", "expandable")
				res.status(200)
				res.json("Notification sent");

});



function sendMessageToGroup(topic, title, body, notification_type, group_name, assignmentData) {
  request({
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: {
      'Content-Type' :' application/json',
      'Authorization': 'key=AIzaSyD_eYHs27nVu8f94PJRIXHVw7zcu-UTyAA'
    },
    body: JSON.stringify(
      { "data": {
      	"body": body,
        "title": title,
		"group_name": group_name,
		"assignment_id": assignmentData.ID,
		"group_id": assignmentData.GROUP_ID,
		"name":assignmentData.NAME,
		"due_date":assignmentData.DUE_DATE,
		"start_page":assignmentData.START_PAGE,
		"end_page":assignmentData.END_PAGE,
		"reading_time":assignmentData.TIME_TO_COMPLETE,
		"book_pdf":assignmentData.BOOK_PDF,
		"notes":assignmentData.NOTES,
        "notification_type": notification_type
      },
        "to": "/topics/"+topic
      }
    )
  }, function(error, response, body) {
    if (error) {
    	//res.json(error);
      console.error(error, response, body);
    }
    else if (response.statusCode >= 400) {
    	//res.status(302);
      console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body);
    }
    else {
      console.log('Done!')
      //res.status(200);
    }
  });
}





//admin_oidc.on('ready', () => {
//	user_oidc.on('ready', () => {
//app.listen(3000, () => console.log('server running on 3000'))
//	});
//});
function makepass() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 20; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

app.post('/inviteAdmin', function(req, res){
	addAdmin(req.body.email, function(err, result){
		if(err){
			res.json(err);
		}
		else{
/* 			var mailOptions = {
				from: 'libertyelevatorreader@gmail.com',
				to: [req.body.email],
				subject: 'You have been added to Liberty Elevator Reader app!',
				text: 'Please login using your email address at this address https://safetytraining.libertyelevator.com/ and this temporary password: ' + req.body.pass
			}
			transporter.sendMail(mailOptions, function(error, info){
				if(error){
					console.log(error);
					res.json(error);
				}
				else{
					console.log(info);
					res.json(info);
				}
			}); */
			res.json(result);
		}
	});
});

app.post('/inviteUser', function(req, res){
	console.log(req.body.email);
	if(req.body.email!=null){
		addUser('', '', req.body.email, function(err, result){
			if(err){
				res.json(err)
			}
			else{
				res.json(result)
			}
		});
	}
	else{
		res.json({'err': 'requires email'}, null);
	}
});

function getUserByEmail(email, callback){
	con.query("SELECT * FROM USERS WHERE EMAIL=" + mysql.escape(email), function(err, rows){
		if(err){
			callback(err, null);
		}
		else{
			callback(null, rows);
		}
	});
}

app.post('/getUserByEmail', function(req, res){
	getUserByEmail(req.body.email, function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	})
});

function generateReport(callback){
	/*
	con.query("SELECT ASSIGNMENTS.NAME as assignment_name, ASSIGNMENTS.ID as assignment_id, USER_GROUPS.NAME as group_name, USER_GROUPS.ID as group_id, USERS.EMAIL as email, USERS.ID as user_id, STATUS.IS_COMPLETE as is_complete " +
			"FROM USER_GROUPS " +
				"JOIN USERS ON USER_GROUPS.USER_ID = USERS.ID " +
				"JOIN STATUS ON STATUS.EMPLOYEE_ID = USERS.ID " + 
				"JOIN ASSIGNMENTS ON ASSIGNMENTS.ID = STATUS.ASSIGNMENT_ID " + 
			"ORDER BY group_id, user_id, assignment_id", 
			function(err, rows){
		if(err){
			callback(err, null);
		}
		else{
			callback(null, rows);
		}
	})
	*/
	///*
 	con.query("SELECT DISTINCT ID, NAME FROM USER_GROUPS", function(err, rows){
		
		var workbook = new xl.Workbook();
		var worksheets = [];
		var groupIDs = [];
		
		if(err){
			callback(err, null);
		}
		else{
			for(group in rows){
				worksheets.push(workbook.addWorksheet(rows[group].NAME));
				groupIDs.push(rows[group].ID);
			}
			con.query("SELECT EMAIL, USERS.ID, USER_GROUPS.ID FROM (USERS JOIN USER_GROUPS ON USER_GROUPS.USER_ID=USERS.ID)", function(err2, rows2){
				if(err2){
					callback(err2, null);
				}
				else{
					console.log(rows2);
					//callback(null, rows);
				}
			})
			//callback(null, rows);
		}
	}); //*/
}

app.get('/testExcelReport', function(req, res){
	generateReport(function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	})
});

function updateUserNamesByEmail(email, first_name, last_name, phone_number, callback){
	con.query("UPDATE USERS SET FIRST_NAME=" + mysql.escape(first_name) + ", LAST_NAME=" + mysql.escape(last_name) + ", PHONE_NUMBER=" + mysql.escape(phone_number) + " WHERE USERS.EMAIL=" + mysql.escape(email), function(err, rows){
		if(err){
			callback(err, null);
		}
		else{
			callback(null, rows);
		}
	})
}

app.put('/updateUserNamesByEmail', function(req, res){
	updateUserNamesByEmail(req.body.email, req.body.first_name, req.body.last_name, req.body.phone_number, function(err, result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	})
})
function registerUsers(first_name, last_name, email, phone_number, callback){
	con.query("UPDATE USERS SET FIRST_NAME= "+ mysql.escape(first_name)  +", LAST_NAME=" + mysql.escape(last_name)+ ", PHONE_NUMBER="+ mysql.escape(phone_number) + " WHERE USERS.EMAIL="+ mysql.escape(email), function(err, rows){
			if(err){
				callback(err, null);
			}
			else{
				callback(null, rows);
			}
	})
}

app.put('/registerUser', function(req, res)
{
	registerUsers(req.body.first_name, req.body.last_name, req.body.email, function(err, result)
	{
		if (err)
		{
			res.json(err);
		}

		else
		{
			res.json(result);
		}
	})
});

const CAs = fs.readFileSync('../ssl/ca-bundle.crt').toString().split(/(?=-----BEGIN CERTIFICATE-----)/);

const sslOptions = {
  key: fs.readFileSync('../ssl/key.pem'),
  cert: fs.readFileSync('../ssl/cert.crt'),
  ca: splitCA('../ssl/ca-bundle.crt'),
/*  requestCert: true,*/
  rejectUnauthorized: false
};

//http.createServer(app).listen(80);

//https.createServer(sslOptions, app).listen(3000);

app.listen(3000, () => console.log('server running on 3000'));
