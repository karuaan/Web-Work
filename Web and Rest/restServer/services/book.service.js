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



     const addLessonIfNotExists = (lesson,isExist) => {
        return new Promise(async (resolve,reject) => {
            var status = true;
        if(isExist){
            status = false;
        }else{
            status = await checkLessonExist(lesson);
            console.log('status',status);
        }
        
         if(isExist){
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
            
            
            if(isExist){
                console.log('update lesson');
                var data = await updateLesson(lesson);
            }else{
                console.log('new lesson');
                var data = await insertLesson(lesson);
            }
            console.log('data', data);
             if (data.status){
                 resolve({
                    data:data.data,
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
    
    const saveLesssons =(lessons) => {
        return new Promise(async (resolve, reject) => {
            console.log('lessons',lessons);
            var allLesson = [];
            // lessons.forEach((item,key) => {
                for(var i=0;i<lessons.length;i++){
                    if(lessons[i].action == 'new'){
                        var lessonResData = await addLessonIfNotExists(lessons[i],false);
                    }else{
                        var lessonResData = await addLessonIfNotExists(lessons[i],true);
                    }
                    allLesson.push(lessonResData);
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
    
    
    
      var insertLesson = (lesson)=>{
        return new Promise( (resolve, reject) => {
            var insertQuery = "INSERT INTO LESSONS (BOOK_ID, START_PAGE, END_PAGE, NAME, PDF_FILE) VALUES (?,?,?,?,?)";
            console.log('insertQuery',lesson);
                con.query(insertQuery,[
                  lesson.BOOK_ID,
                  lesson.START_PAGE,
                  lesson.END_PAGE,
                  lesson.NAME,
                  lesson.PDF_FILE
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
var oldQ = "INSERT INTO GROUPS (ID,ADMIN_ID, USER_ID, NAME) VALUES (?,?,?,?)";

            con.query(newQ,[
                group.ID,
                group.ADMIN_ID,
                group.USER_ID,
                group.NAME,
                group.NAME,
                group.ADMIN_ID,
                group.USER_ID
            ], (err, rows) => {
                console.log('insertGroup',err, rows);
                if (!err){
                    resolve({
                        status : true,
                        data : group
                    });
                }else {
                    resolve({
                        status : false,
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
                console.log('group request',group.employees);
                if(group.hasOwnProperty('employees') && group.employees.length > 0){
                    
                    var existsId = await checkGroupExist(group.NAME);
                    if(existsId > 0){
                        resolve({
                            status : false,
                            data : existsId,
                            message : 'Group already exists',
                        });
                    }


                    var max_group_data = await getMaxGroupId();
                    var NEW_GROUP_ID = null;
                    if(max_group_data.data){
                        NEW_GROUP_ID = Number(max_group_data.data) + 1;
                    }else{
                        resolve({
                            status : false,
                            data : null,
                            message : 'New group id not found!',
                        });
                    }
                    console.log('NEW_GROUP_ID',NEW_GROUP_ID);
                    var groupEmployees = [];
                    for(var i = 0;i<group.employees.length;i++){
                        var empdata = await saveEmployee(group.employees[i]);    
                        console.log('empdata.data.ID',empdata.data.ID);
                        if(empdata.data && empdata.data.ID){
                            console.log('savedGroupData started');
                            var savedGroupData =  await insertGroup({
                                ID : NEW_GROUP_ID,
                                NAME : group.NAME,
                                USER_ID : empdata.data.ID,
                                ADMIN_ID : 3               
                            });
                            console.log('savedGroupData', savedGroupData);

                            if(savedGroupData.data){
                                groupEmployees.push(savedGroupData.data);
                            }
                        }
                    }

                    if(groupEmployees.length > 0){
                        resolve({
                            status : true,
                            data : groupEmployees,
                            message : 'Group saved',
                        });
                    }else{
                        resolve({
                            status : false,
                            message : 'Enter employee emails',
                        })
                    }

                }else{
                    resolve({
                        status : false,
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
              console.log('insertEmployee == ',employee);

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
                           is_new : false,
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
                console.log('existEmployeeData',existEmployeeData);
                if(existEmployeeData.data != null && existEmployeeData.data){
                    var data = {
                        data : existEmployeeData.data,
                        is_new : false,
                        status : true
                    };
                    resolve(data);
                }
                else{
                    var newdata = await insertEmployee(employee);
                    console.log('insertEmployee data',newdata);
                    resolve(newdata);
                }         
            });
       }
    
    
    
       module_methods.saveLesssons = saveLesssons;
       module_methods.addLessonIfNotExists = addLessonIfNotExists;
       module_methods.checkLessonExist = checkLessonExist;
       module_methods.insertLesson = insertLesson;
       module_methods.lessonSplitPdf = lessonSplitPdf;
       module_methods.newBook = newBook;

       module_methods.saveGroup = saveGroup;
       module_methods.saveEmployee = saveEmployee;
       module_methods.insertGroup=insertGroup;

       return module_methods;
}