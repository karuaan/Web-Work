const mysql = require('mysql');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({	
	service: 'Gmail',
	auth: {
		user: 'libertyelevatorreader@gmail.com',
		pass: 'readerreaderreader'
	}
});

let exportsMethod = {
addAssignment(con, name, lesson_id, group_id, due_date, time_to_complete, start_date, callback){

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

},
emailNewAssignment(con, group_id, callback){
	
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
},
addToGroup(con, group_id, user_ids, callback){
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
},
addGroup(con, admin_id, user_ids, name, callback){
	console.log(user_ids);
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
},
addUser(con, first_name, last_name, email, okta_id, callback){

	con.query('SELECT * FROM USERS WHERE USERS.EMAIL=' + mysql.escape(email), function(err, rows){
		if(!err){
			if(rows[0] === undefined){
				console.log("ROWS ARE EMPTY")
				con.query('INSERT INTO USERS (FIRST_NAME, LAST_NAME, EMAIL, OKTA_ID, IS_ADMIN) VALUES ('+ mysql.escape(first_name) + ',' + mysql.escape(last_name) + ','+ mysql.escape(email) + ','+ mysql.escape(okta_id) +', 0)', function(err2, result){
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

},
addAdmin(con, first_name, last_name, email, okta_id, callback){

	con.query('SELECT * FROM USERS WHERE USERS.EMAIL=' + mysql.escape(email), function(err, rows){
		if(!err){
			if(rows[0] === undefined){
				console.log("ROWS ARE EMPTY")
				con.query('INSERT INTO USERS (FIRST_NAME, LAST_NAME, EMAIL, OKTA_ID, IS_ADMIN) VALUES ('+ mysql.escape(first_name) + ',' + mysql.escape(last_name) + ','+ mysql.escape(email) + ','+ mysql.escape(okta_id) +', 1)', function(err2, result){
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

},
addBook(con, name, filename, callback){

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

},
addLesson(con, book_id, start_page, end_page, name, filepath, callback){
	con.query("SELECT * FROM LESSONS WHERE LESSONS.NAME=" + mysql.escape(name) + " AND LESSONS.BOOK_ID=" + mysql.escape(book_id), function(err, rows){
		if(!err){
			if(rows[0] === undefined){
				con.query("INSERT INTO LESSONS (BOOK_ID, START_PAGE, END_PAGE, NAME, PDF_FILE) VALUES (" + mysql.escape(book_id) + ", "   + mysql.escape(start_page) + ", "  + mysql.escape(end_page) + ", "  + mysql.escape(name) + ", "  + mysql.escape(filepath) +")", function(err2, result){
					if(!err2){
						con.commit(function(err3){
							if(err3){con.rollback(function(){callback(err3, null)})}
							else{
								callback(null, result)
							}
						});
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
},
addAssignment(con, lesson_id, group_id, due_date, time_to_complete){
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
},
deleteUserByEmail(con, email, callback){
	
	con.query("SELECT OKTA_ID as okta_id FROM USERS WHERE EMAIL = " + mysql.escape(email), function(err1, rows){
		if(err){
			callback(err1, null);
		}
		else{
			if(rows[0]===undefined){
				callback({error: "user does not exist"}, null);
			}
			else{
				var options = {
						url: 'https://dev-383846.oktapreview.com/api/v1/users/' + rows.okta_id,
						method: 'delete',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'Authorization': 'SSWS 00Sf_mZYUteEpe-evfHB0U9Wqi1bag9rLSZirF9qU4'
						}
					};

				request(options, function(err2, httpr, body){
					console.log(err2)
					console.log(body)
					if(err2){
						res.json(err2)
					}
					else{
						con.query("DELETE FROM USERS WHERE EMAIL=" + mysql.escape(email), function(err3, res){
			
							if(err){
								callback(err3, null);
							}
							else{
								callback(null, res);
							}
							
						});
					}
				});
			}
		}
	});
},
deleteUserById(con, user_id, callback){
	con.query("SELECT OKTA_ID as okta_id FROM USERS WHERE ID = " + mysql.escape(user_id), function(err1, rows){
		if(err){
			callback(err1, null);
		}
		else{
			if(rows[0]===undefined){
				callback({error: "user does not exist"}, null);
			}
			else{
				var options = {
						url: 'https://dev-383846.oktapreview.com/api/v1/users/' + rows.okta_id,
						method: 'delete',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'Authorization': 'SSWS 00Sf_mZYUteEpe-evfHB0U9Wqi1bag9rLSZirF9qU4'
						}
					};

				request(options, function(err2, httpr, body){
					console.log(err2)
					console.log(body)
					if(err2){
						res.json(err2)
					}
					else{
						con.query("DELETE FROM USERS WHERE ID=" + mysql.escape(user_id), function(err3, res){
			
							if(err){
								callback(err3, null);
							}
							else{
								callback(null, res);
							}
							
						});
					}
				});
			}
		}
	});
},
deleteAssignmentById(con, assignment_id, callback){
	con.query("DELETE FROM ASSIGNMENTS WHERE ID=" + mysql.escape(assignment_id), function(err, res){
		if(err){
			callback(err, null)
		}
		else{
			callback(null, res)
		}
	})
},
deleteLessonById(con, lesson_id, callback){
	
	con.query("SELECT PDF_FILE as pdf_path FROM LESSONS WHERE ID=" + mysql.escape(lesson_id), function(err1, rows1){
		
		if(err1){
			callback(err1, null)
		}
		else{
			if(rows1[0]===undefined){
				callback({error: "No lesson with that ID"}, null);
			}
			else{
				con.query("DELETE FROM LESSONS WHERE ID=" + mysql.escape(lesson_id), function(err2, rows2){
					if(err2){
						callback(err2, null)
					}
					else{
						fs.unlink(rows1[0].pdf_path, function(err3){
							if(err3){
								callback(err3, null);
							}
							else{
								callback(null, rows2);
							}
						});
					}
				});
			}
		}
	});
},
deleteBookById(con, book_id, callback){
	
	con.query("SELECT PDF_FILE as pdf_path FROM BOOKSS WHERE ID=" + mysql.escape(book_id), function(err1, rows1){
		
		if(err1){
			callback(err1, null)
		}
		else{
			if(rows1[0]===undefined){
				callback({error: "No book with that ID"}, null);
			}
			else{
				con.query("DELETE FROM BOOKS WHERE ID=" + mysql.escape(lesson_id), function(err2, rows2){
					if(err2){
						callback(err2, null)
					}
					else{
						fs.unlink(rows1[0].pdf_path, function(err3){
							if(err3){
								callback(err3, null);
							}
							else{
								callback(null, rows2);
							}
						});
					}
				});
			}
		}
	});
},
adminLogin(con, admin_email, callback){
	con.query(
		"SELECT DISTINCT NAME as group_name, ID as group_id FROM GROUPS WHERE ADMIN_ID IN "+
		"(SELECT ID FROM USERS WHERE EMAIL=" + mysql.escape(admin_email) + ")",
		
		function(err1, rows1){
			if(err1){
				console.log(err1);
				callback(err1, null)
			}
			else{
				console.log(rows1)
				callback(null, rows1)
			}
		}
	);
}
}
module.exports = exportsMethod;