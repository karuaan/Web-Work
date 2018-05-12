module.exports = (app,con,fs,hummus,Busboy,uuid) => {

    const module_methods = {};

    const bookExistsByName = (name) => {
        return new Promise((_resolve, _reject) => {
            const query = 'SELECT count(ID) as books_count FROM BOOKS WHERE BOOKS.NAME=?';
            con.query(query,[name], (err, rows) => {
                if (err){
                    _resolve({
                        count : 0
                    });
                }else{
                    _resolve({
                          count : rows.hasOwnProperty(0) ? rows[0].books_count : 0
                    });
                }
            });
        });
     };

     const insertBook = (bookReq) => {
        return new Promise((resolve,reject) => {
            con.query('INSERT INTO BOOKS (NAME, PDF_FILE,TOTAL_PAGES) VALUES (?,?,?)', [
                bookReq.NAME,
                bookReq.PDF_FILE,
                bookReq.TOTAL_PAGES,
            ],  (err, insertData) =>{
                if (!err) {
                    resolve({
                        status: true,
                        message: 'Saved',
                        data: Object.assign(bookReq,{
                            ID: insertData.insertId,
                        })
                    });
                } else {
                    resolve({
                        status: false,
                        message: 'Bad Request',
                        data: null
                    });
                }

            });
        });
     };

     const newBook = (book) => {
        return new Promise(async (resolve,reject) =>{
            var bookCounts = await bookExistsByName(book.NAME);
            if (bookCounts.count > 0) {
                resolve({
                    status : false,
                    data : null,
                    message : 'Book Already exists.'
                });

                return;
            }
            
            var pdfReader = hummus.createReader(book.PDF_FILE);
            var pdf_pages_counts = pdfReader.getPagesCount();
            book.TOTAL_PAGES = pdfReader.getPagesCount();
            if(book.TOTAL_PAGES > 0){
                var bookRes = await insertBook(book);
                resolve(bookRes);
            }else{
                 resolve({
                    status : false,
                    data : null,
                    message : 'Pdf does not have pages'
                });      
            }
        });
     };

     const deleteFile = (path) => {
         return new Promise(async (resolve,reject)=>{
            fs.unlink(path, (err) => {
                if (err) {
                    resolve(false);
                }else{
                    resolve(true);
                };
            });

         });
     }



     const addLessonIfNotExists = (lesson,group_id) => {
        return new Promise(async (resolve,reject) => {
            var status = true;
        if(lesson.ID != null){
            status = false;
        }else{
            status = await checkLessonExist(lesson);
            console.log('status',status);
        }
        
         if(lesson.ID != null){
           var old_file_deleted =  deleteFile(__basedir+'/'+lesson.PDF_FILE);
         }
         
         var lessonPdfSplit = await lessonSplitPdf(lesson);
       
         if(!(lessonPdfSplit.status && lessonPdfSplit.data)){
             resolve({
                data:lesson,
                status : false,
                message : 'Pdf split issue'
            });
         }

    
     
         if(!status){
             lesson['PDF_FILE'] = lessonPdfSplit.data['file_name'];
            
            
            if(lesson.ID != null){
                console.log('update lesson');
                var data = await updateLesson(lesson);
            }else{
                console.log('new lesson');
                var data = await insertLesson(lesson, group_id);
            }
            console.log('data', data);
             if (data.status){
                 resolve({
                    data:data.data,
                    isExist : lesson.ID != null,
                    status : true,
                    message : lesson.NAME+' saved'
                });
             }else{
                 resolve({
                    data:null,
                    status : false,
                    message : lesson.NAME+' failed'
                });
             }
         }else{
            resolve({
                 data:lesson,
                 status : false,
                 message : lesson.NAME+' Already exists.'
             });
         }
        });
    };
    
    const saveLessons =(lessons, group_id) => {
        return new Promise(async (resolve, reject) => {
            console.log('lessons',lessons);
            var allLesson = [];
            // lessons.forEach((item,key) => {
                for(var i=0;i<lessons.length;i++){
                    var is_exist = lessons[i].action != 'new';
                    var lessonResData = await addLessonIfNotExists(lessons[i],group_id);
                    if(lessonResData.status && lessonResData.data){
                        allLesson.push(Object.assign(lessonResData.data,{
                            action : !is_exist ? 'new' : 'existing'
                        }))
                    }
                    // allLesson.push(lessonResData);
                }
               
            // });
    
            resolve(allLesson);
        });
    };

    
    
    const checkLessonExist = (lesson)=> {
        console.log('checkLessonExist : ',lesson);
        return new Promise((resolve, reject) => {
              con.query("SELECT count(LESSONS.ID) as LESSONS_COUNT FROM LESSONS WHERE LESSONS.NAME=:NAME AND" +
                   " LESSONS.BOOK_ID=" +
                   " :BOOK_ID",{
                      NAME : lesson.NAME,
                      BOOK_ID : lesson.BOOK_ID
               }, (err, rows) => {
                   console.log('rows',rows);
                  if (rows != undefined && rows.length > 0 && rows[0]['LESSONS_COUNT'] > 0){
                      resolve(true);
                  }else {
                      resolve(false);
                  }
              });
        });
      };
    
    
    
      var insertLesson = (lesson, group_id)=>{
        return new Promise( (resolve, reject) => {
            var insertQuery = "INSERT INTO LESSONS (BOOK_ID, START_PAGE, END_PAGE, NAME, PDF_FILE, GROUP_ID) VALUES (?,?,?,?,?)";
            console.log('insertQuery',lesson);
                con.query(insertQuery,[
                  lesson.BOOK_ID,
                  lesson.START_PAGE,
                  lesson.END_PAGE,
                  lesson.NAME,
                  lesson.PDF_FILE,
                  group_id
               ],function(err,results) {
                   if (!err){
                       var data = {
                         data : Object.assign(lesson,{
                             ID : results.insertId
                         }),
                         status : true
                       };
                       resolve(data);
                   }else{
					   console.log("+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-");
					   console.log(err);
					   console.log("+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-");
                       resolve({
                           status : false,
                           data : null
                       });
                   }
                  
               });
        });
      };

      const updateLesson = (lesson)=>{
        return new Promise( (resolve, reject) => {
            var updateQuery = "UPDATE LESSONS SET BOOK_ID = ?, START_PAGE = ?, END_PAGE = ?, NAME = ?, PDF_FILE = ? WHERE LESSONS.ID = ?";
                con.query(updateQuery,[
                    lesson.BOOK_ID,
                    lesson.START_PAGE,
                    lesson.END_PAGE,
                    lesson.NAME,
                    lesson.PDF_FILE,
                    lesson.ID
                ], (err,results,fields) => {
                    console.log('update calll',err,results,fields);
                   if (!err){
                       resolve({
                        data : lesson,
                        status : true
                      });
                   }else{
                       resolve({
                           status : false,
                           data : null
                       });
                   }
               });
        });
      };
    
      const writeToFile = function writeToFile(filePath) {
        return new Promise( (resolve, reject) => {
            console.log('filePath',filePath);
            var file = fs.createWriteStream(filePath, { overwrite: false });
            file.on('finish',function(){
                console.log('finished')
                resolve(true);
            });
            file.end(function(){
                console.log('end called');
                resolve(true);
            });
        });
    }
    
    const lessonSplitPdf = (lesson) => {
        return new Promise(async (resolve,reject) => {
    
               try{
                   const folderId = uuid.v4();
                   var start_page = lesson.START_PAGE;
                   var end_page = lesson.END_PAGE;
                   var file_name = 'public/'+folderId+'_'+start_page+'_'+end_page+'.pdf';
                   
                        var pdfReader = hummus.createReader(lesson.BOOK_FILE_PDF);
                        var pdfWriter = hummus.createWriter(__basedir+'/'+file_name);
                        var pdf_pages_counts = pdfReader.getPagesCount();
        
                        for(var i=0;i<pdf_pages_counts;++i){
                        var currentPage = i + 1;
                        if (currentPage>=start_page && currentPage<=end_page){
                            pdfWriter.createPDFCopyingContext(pdfReader).appendPDFPageFromPDF(i);
                        }
                        }
        
                        pdfWriter.end();
                        resolve({
                            status : true,
                            data : {
                                file_name  : file_name
                            },
                            error : null,
                            message : 'Done',
                        });
                   
    
               }catch (e){
                   console.log('hummus pdf modify error',e);
                   resolve({
                       status : false,
                       data : null,
                       error : null,
                       message : 'Split fail'
                   });
               }   
    
         });
    
       };


       const checkGroupExist = (name)=> {
        console.log('checkGroupExist : ',name);
        return new Promise((resolve, reject) => {
              con.query("SELECT GROUPS.ID as GROUP_ID FROM GROUPS WHERE GROUPS.NAME=? group by GROUPS.ID",[name], (err, rows) => {
                  console.log('checkgroupexists : ',rows);
                  if (rows != undefined && rows.length > 0 && rows[0]['GROUP_ID']){
                      resolve(rows[0]['GROUP_ID']);
                  }else {
                      resolve(0);
                  }
              });
        });
      };
      
      const insertGroup = (group) => {
        return new Promise(async (resolve, reject) => {
            console.log('insertGroup',group);


            


            var newQ = "INSERT INTO GROUPS (ID,ADMIN_ID, USER_ID, NAME) SELECT * FROM (SELECT ?,?,?,?) AS tmp WHERE NOT EXISTS (    SELECT ID FROM GROUPS WHERE NAME = ? AND ADMIN_ID = ?  AND USER_ID = ?) LIMIT 1";
            var newQ = "INSERT INTO GROUPS(ID, ADMIN_ID, USER_ID, NAME) SELECT ID, ADMIN_ID, USER_ID, NAME FROM (SELECT ? as ID, ? as ADMIN_ID, ? as USER_ID, ? as NAME ) AS tmp WHERE NOT EXISTS (SELECT * FROM GROUPS WHERE NAME = ? AND USER_ID = ?)";
            con.query(newQ,[
                group.ID,
                group.ADMIN_ID,
                group.USER_ID,
                group.NAME,
                group.NAME,
                group.USER_ID
            ], (err, rows) => {
                console.log('insertGroup',err, rows);
                if (!err){
                    resolve({
                        status : true,
                        rows : rows,
                        data : group
                    });
                }else {
                    resolve({
                        status : false,
                        rows: null,
                        err : err,
                        data : null
                    });
                }
            });
        });
      };

      const getMaxGroupId = () =>{
        return new Promise((resolve,reject) => {
                con.query('SELECT MAX(ID) as group_id FROM GROUPS',(err,rows) => {
                    if(!err && rows.length >0 && rows[0].group_id){
                        resolve({
                            status : true,
                            data : rows[0].group_id
                        });
                    }else{
                        resolve({
                            status : false,
                            data : null
                        });
                    }
                });


        });
      };


       const saveGroup = (group) => {
            return new Promise(async (resolve,reject) => {
                //var firstname =  email.replace(/@.*$/,"");
                if(group.hasOwnProperty('employees') && group.employees.length > 0){
                    var existsId = await checkGroupExist(group.NAME);

                    // console.log('existsId',existsId);
                    // if(existsId > 0){
                    //     resolve({
                    //         status : false,
                    //         data : existsId,
                    //         message : 'Group already exists',
                    //     });
                    // }

                    // if(!group.hasOwnProperty('GROUP_ID')){

                    // }

                    if(existsId > 0){
                        NEW_GROUP_ID = existsId;
                    }else{
                        var max_group_data = await getMaxGroupId();
                        var NEW_GROUP_ID = null;
                        if(max_group_data.data){
                            NEW_GROUP_ID = Number(max_group_data.data) + 1;
                        }else{
                            NEW_GROUP_ID = 1;
                        }
                    }
                    console.log('NEW_GROUP_ID',NEW_GROUP_ID);

                    var groupEmployees = [];
                    var employees = [];
                    var employee_statuses = [];
                    console.log('group.employees length ',group.employees.length);

                    for(var i = 0;i<group.employees.length;i++){
                        var empdata = await saveEmployee(group.employees[i]);    

                        if(empdata.data && empdata.data.ID){
                       
                            var savedGroupData =  await insertGroup({
                                ID : NEW_GROUP_ID,
                                NAME : group.NAME,
                                USER_ID : empdata.data.ID,
                                ADMIN_ID : 3               
                            });
                        

                            console.log('savedGroupData', savedGroupData);

                            if(savedGroupData.data){
                                groupEmployees.push(savedGroupData.data);
                                employees.push(empdata.data);

                                var ddd = {
                                    GROUP_ID : NEW_GROUP_ID,
                                    EMPLOYEE_ID : empdata.data.ID
                                };
                                var employee_statuses_res =  await attachAssignmentToEmployeeByGroup(ddd);
                                console.log('employee_statuses_res',employee_statuses_res);
                                employee_statuses.push(employee_statuses_res);
                            }

                        }
                    }

                    if(groupEmployees.length > 0){
                        resolve({
                            status : true,
                            data : groupEmployees,
                            employee_statuses : employee_statuses,
                            employees : employees,
                            message : 'Group saved',
                        });
                    }else{
                        resolve({
                            status : false,
                            data : null,
                            employees : null,
                            message : 'Enter employee emails',
                        })
                    }

                }else{
                    resolve({
                        status : false,
                        data : null,
                        employees : null,
                        message : 'Enter employee emails',
                    })
                }
            }); 
       };

       const getEmployeeByEmail = (email) => {
            return new Promise(async (resolve,reject) => {
                con.query('SELECT * FROM USERS WHERE EMAIL = ?',[email],(err,rows) =>{
                    resolve({
                        status : true,
                        data : rows.length > 0 ? rows[0] : null
                    });
                });
            });
       };

       const insertEmployee = (employee) => {
          return new Promise((resolve,reject) => {
            var insertQuery = "INSERT INTO USERS (FIRST_NAME, LAST_NAME, EMAIL,IS_ADMIN) VALUES (?,?,?,0)";
                con.query(insertQuery,[
                    employee.FIRST_NAME,
                    employee.LAST_NAME,
                    employee.EMAIL
               ],function(err,rows) {
                   if (!err){
                       var data = {
                         data : Object.assign(employee,{
                             ID : rows.insertId
                         }),
                         is_new : true,
                         status : true
                       };
                       resolve(data);
                   }else{
                       resolve({
                           is_new : true,
                           status : false,
                           data : null
                       });
                   }
               });

          });
       };

       const saveEmployee = (employee) => {
            return new Promise(async (resolve,reject) => {
                var existEmployeeData = await getEmployeeByEmail(employee.EMAIL);
                if(existEmployeeData.data != null && existEmployeeData.data){
                    console.log('old emp ',existEmployeeData.data);
                    var data = {
                        data : existEmployeeData.data,
                        is_new : false,
                        status : true
                    };
                    resolve(data);
                }
                else{
                    var newdata = await insertEmployee(employee);
                    console.log('new emp ',newdata);
                    resolve(newdata);
                }         
            });
       }

       const insertLessonAssignment = (assignment) => {
        return new Promise(async (resolve, reject) => {
          var insertQuery;
          if (assignment.NOTES){
            insertQuery = "INSERT INTO ASSIGNMENTS (NAME, LESSON_ID, GROUP_ID, DUE_DATE, START_DATE,TIME_TO_COMPLETE, NOTES)" +
                " VALUES (?,?,?,?,?,?,?)";
          }
          else{
            insertQuery = "INSERT INTO ASSIGNMENTS (NAME, LESSON_ID, GROUP_ID, DUE_DATE, START_DATE,TIME_TO_COMPLETE)" +
                " VALUES (?,?,?,?,?,?)";
          }
          var insertions;
          if (assignment.NOTES && assignment.NOTES != ""){
            insertAttrs = [
                  assignment.NAME,
                  assignment.LESSON_ID,
                  assignment.GROUP_ID,
                  assignment.DUE_DATE,
                  assignment.START_DATE,
                  assignment.TIME_TO_COMPLETE,
                  assignment.NOTES
               ];
          }
          else{
            insertAttrs = [
                  assignment.NAME,
                  assignment.LESSON_ID,
                  assignment.GROUP_ID,
                  assignment.DUE_DATE,
                  assignment.START_DATE,
                  assignment.TIME_TO_COMPLETE
               ];
          }
          con.query(insertQuery, insertAttrs,function (err,rows) {
             console.log('rows',rows);
             if (!err){
                 resolve({
                     status : true,
                     data : Object.assign(assignment,{
                         ID : rows.insertId
                     })
                 });
             }else{
                 resolve({
                     status : false,
                     data : null,
                 });
             }
         });
          });
      }


       const getAssignmentsByLessonAndGroupId = (group_id,lesson_id) =>{
                return new Promise(async (resolve,reject) => {
                con.query('SELECT * FROM ASSIGNMENTS WHERE LESSON_ID=? AND GROUP_ID=?',[lesson_id,group_id],
                        function(err, rows){
                            if(!err && rows && rows.length > 0){
                                resolve(rows);
                            }else{
                                resolve([]);
                            }
                    });
                });
        };


        const deleteAssignmentById = (assignmentId) =>{
            return new Promise(async (resolve,reject) => {
                con.query("DELETE FROM ASSIGNMENTS where ID = ? ",assignmentId,function(err2,result){
                    if(!err2){
                        resolve({
                            status : true,
                            deleted : assignmentId,
                            data : result
                        });
                    }else{
                        resolve({
                            status : false,
                            deleted : null,
                            data : null,
                            err : err2
                        });
                    }
                });
            });
    };

        const getGroupUsers = (group_id) => {
            return new Promise((resolve,reject) => {
                con.query('SELECT USER_ID as user_id FROM GROUPS WHERE ID=?',[group_id], function(err, users){
                    if(!err && users && users.length > 0){
                        resolve(users);
                    }else{
                        resolve([]);
                    }
                });

            });
        };



    const addAssignment = (assignment) => {
        
        return new Promise(async(resolve,reject) => {

            console.log('assignmentData',assignment);

            var group_assignments = await getAssignmentsByLessonAndGroupId(assignment.GROUP_ID,assignment.LESSON_ID);
            console.log('group_assignments',group_assignments);
            if(group_assignments && group_assignments[0] && group_assignments[0]['ID']){
                console.log('out');
                resolve({
                    status : false,
                    message : 'An assignment for that lesson and group already exists'
                });
                
            
            }else{
                console.log('in');
                var assignmentData = await insertLessonAssignment(assignment);
                    
                if(!assignmentData.data && (assignmentData.data && !assignmentData.data.ID)){
                        resolve({
                            status : false,
                            message : 'Whoops, something went wrong!'
                        });
                }

                var users = await getGroupUsers(assignment.GROUP_ID);
                console.log('users',users);

                users.forEach((value, index, arr) => {
                        console.log(value.user_id)
                        arr[index] = [Number(assignment.GROUP_ID), Number(value.user_id), assignmentData.data.ID, 0]
                });


                con.query('INSERT INTO STATUS (GROUP_ID, EMPLOYEE_ID, ASSIGNMENT_ID, IS_COMPLETE) VALUES ?', [users], function(err4, rows4){
                        if(!err4){
                            resolve({
                                status : true,
                                data : assignmentData
                            });
                        }else{
                            resolve({
                                status : false,
                                data : assignmentData
                            });
                        }
                });

            }
        
        });

    }

    const deleteStatusByGroupAndAssignmentIds = (groupAndAsssignmentIds) =>{
        return new Promise(async (resolve,reject) =>{
            con.query("DELETE FROM STATUS WHERE GROUP_ID = ? AND ASSIGNMENT_ID = ? ",groupAndAsssignmentIds,function(err2,result){
                    if(!err2){
                        resolve({
                            status : true,
                            deleted : groupAndAsssignmentIds,
                            data : result
                        });
                    }else{
                        resolve({
                            status : false,
                            deleted : null,
                            data : null,
                            err : err2
                        });
                    }
            });
        });
    };

    const removeAssignmentLesson = (data) => {

        var LESSON_ID = data.LESSON_ID;
        var GROUP_ID = data.GROUP_ID;

        return new Promise(async (resolve ,reject) => {
            con.query("SELECT * FROM ASSIGNMENTS WHERE GROUP_ID = ? AND LESSON_ID =? ",[GROUP_ID,LESSON_ID],async (err,rows)=>{
                var deleteStatusArr = [];
                var deleteAssignment = [];
                if(!err && rows && rows!= undefined){
                    for(var i = 0;i<rows.length;i++){
                        var item  = rows[i];
                        var deletedStatus = await deleteStatusByGroupAndAssignmentIds([
                            GROUP_ID,
                            item.ID,
                        ]);
                        
                        var deletedRes = await deleteAssignmentById(item.ID);
                        deleteAssignment.push({
                            ASSIGNMENT_ID : item.ID,
                            res : deletedRes
                        });

                        deleteStatusArr.push({
                            GROUP_ID : GROUP_ID,
                            ASSIGNMENT_ID : item.ID,
                            res : deletedStatus,
                        });
                    }
                   

    
                    resolve({
                        status : true,
                        data : {
                            deleted_assignments : deleteAssignment,
                            delete_assignment_status : deleteStatusArr
                        },
                        message : 'Deleted'
                    });

                }else{
                    resolve({
                        status : false,
                        data : {
                            deleted_assignments : null,
                            delete_assignment_status : null
                        },
                        message : 'No Assignment found!'
                    });
                }
            });
        
        });

    };

    const getAssignmentByGroupId = (groupId) => {
        return new Promise((resolve,reject) => {
             con.query('select * from ASSIGNMENTS WHERE GROUP_ID = ? group by ASSIGNMENTS.ID',[groupId],(err,result)=>{
                 if(!err && result && result != undefined &&  result.length > 0){
                     resolve(result);
                 }else{
                     resolve([]);
                 }
             });
        });
     };

     const insertStatus = (result) => {
        return new Promise((resolve,reject) => {
            con.query('INSERT INTO STATUS (GROUP_ID, EMPLOYEE_ID, ASSIGNMENT_ID, IS_COMPLETE) VALUES ?', [result], function(err4, rows4){
                if(!err4){
                    resolve({
                        status : true,
                        data : {
                            new_status : result,
                            result : rows4,
                        }
                    });
                }else{
                    resolve({
                        status : false,
                        data : null
                    });
                }
            });

        });
    };


    const attachAssignmentToEmployeeByGroup = (data) => {
        return new Promise(async (resolve,reject) => {
            var EMP_ID = data.EMPLOYEE_ID;
            var GROUP_ID = data.GROUP_ID;
            var data2 = [];

            var result2 = await getAssignmentByGroupId(GROUP_ID);
            console.log('result2',result2);

            if(result2.length > 0){
                result2.forEach((value, index, arr) => {
                    console.log(value.ID)
                    data2.push({
                        ASSIGNMENT_ID : value.ID,
                        GROUP_ID: Number(GROUP_ID),
                        EMPLOYEE_ID : Number(EMP_ID),
                    });
                    arr[index] = [Number(GROUP_ID), Number(EMP_ID), value.ID, 0]
               });

               var rs = await insertStatus(result2);
                resolve({
                    status : true,
                    data : {
                        new_status : data2,
                        result : rs,
                    }
                });

            }else{
                resolve({
                    status : false,
                    data : null,
                    err : null,
                    message : 'No assignment available assign'
                });
            }
        });
    };
        


    
    
       module_methods.saveLessons = saveLessons;
       module_methods.addLessonIfNotExists = addLessonIfNotExists;
       module_methods.checkLessonExist = checkLessonExist;
       module_methods.insertLesson = insertLesson;
       module_methods.lessonSplitPdf = lessonSplitPdf;
       module_methods.newBook = newBook;
       module_methods.addAssignment = addAssignment;

       module_methods.removeAssignmentLesson = removeAssignmentLesson;
       
       

       module_methods.saveGroup = saveGroup;
       module_methods.saveEmployee = saveEmployee;
       module_methods.attachAssignmentToEmployeeByGroup = attachAssignmentToEmployeeByGroup;
       module_methods.insertGroup= insertGroup;

       return module_methods;
}