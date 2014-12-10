module.exports = function (app, db, mongojs) {

    app.get("/getCollections",function(req,res){

        db.quiz.find( function (err, doc) {

                result = { "error": 0, "info": doc };
                res.json(result);
            });

    });


    app.post("/createUser", function (req, res) {
        var new_user = req.body;
        console.log("new user " + new_user);
        var type = new_user.type;
        var result;
        if (type == "prof") {
            
           
            var pdocs = db.professor.find({ 'email': new_user.user.email }).count(function (error, pdocs) {
                if (pdocs == 0) {
                    db.professor.insert(new_user, function (err, doc) {

                        console.log("added user : "+doc);

                        result = { "error": 0, "info": doc };
                        res.json(result);
                    });                    
                } else {
                    console.log("user exist");
                    res.json({ "error":  1 , "info" : "user exists"});
                }
                   
            });


        } else {
            // add student 

            var sdocs = db.student.find({ 'email': new_user.user.email }).count(function (error, sdocs) {
                if (sdocs == 0) {
                    console.log("student does not exist");
                    console.log(new_user);
                    db.student.insert(new_user, function (err, doc) {

                        console.log("added user : ");
                        console.log(doc);

                        result = { "error": 0, "info": doc };
                        res.json(result);
                    });

                } else{
                    console.log("user exist");
                    res.json({ "error":  1 , "info" : "user exists"});
                }


            });

        }
    });

    /* delete a user with id */
    app.delete("/createUser/:id", function (req, res) {
        var uid = req.params.id;
        console.log(uid)
        if (!professorExist(user)) {
            console.log("valid new user");
            res.send(user);
            //db.professor.delete
        } else {
            // delete from students
            res.json({ "error": "user already exist." });
        }

    });


    /* Select a user with id */
    app.get("/createUser/:info", function (req, res) {
        console.log("inside select one user");
        var uinfo = JSON.parse(req.params.info);
        console.log(uinfo);
        var type = uinfo.type;
        if(type == 'prof'){
            db.professor.find({'_id' : mongojs.ObjectId(uinfo.id)},function(error,docs){
                if(typeof docs !== 'undefined' && error == null){
                    var result = { "error": 0, "info": docs };
                    res.json(result);
                }else{
                    var result = { "error": 0, "info": "user not exist" };
                    res.json(result);
                }
            });
        }else{

            db.student.find({'_id' : mongojs.ObjectId(uinfo.id)},function(error,docs){
                if(typeof docs !== 'undefined' && error == null){
                    result = { "error": 0, "info": docs };
                    res.json(result);
                }else{
                    var result = { "error": 0, "info": "user not exist" };
                    res.json(result);
                }
            });
        }


    });


    /* Update a user with id */
    app.put("/createUser", function (req, res) {

        console.log("inside update one user : server ");
        console.log(req.body);
        var type = req.body.type;
        if(type == 'prof'){

            db.professor.findAndModify({
                // find the object by id
                query: { _id: mongojs.ObjectId(req.body.id) },
                // new values are in req.body, update it's name
                update: { $set: { 'user' : req.body.updatedUser  } },
                // single one
                new: true
            }, function (err, doc, lastErrorObject) {
                // respond with the new document
                console.log("user updated ");
                console.log(doc);
                if(err == null){
                    var result = { "error": 0, "info": doc };
                    res.json(result);
                }else{
                    var result = { "error": 1, "info": doc };
                    res.json(result);
                }

            });
        }else{
            console.log("inside update one student : server ");
            db.student.findAndModify({
                // find the object by id
                query: { _id: mongojs.ObjectId(req.body.id) },
                // new values are in req.body, update it's name
                update: { $set: { 'user.firstname' : req.body.updatedUser.firstname,
                                  'user.lastname' : req.body.updatedUser.lastname,
                                  'user.username' : req.body.updatedUser.username,
                                  'user.email' : req.body.updatedUser.email,
                                  'user.phone' : req.body.updatedUser.phone} },
                // single one
                new: true
            }, function (err, doc, lastErrorObject) {
                // respond with the new document
                console.log("user updated ");
                console.log(doc);
                if(err == null){
                    var result = { "error": 0, "info": doc };
                    res.json(result);
                }else{
                    var result = { "error": 1, "info": doc };
                    res.json(result);
                }


            });
        }
       /* var uid = req.params.id;
        console.log(uid)
        if (!professorExist(user)) {
            console.log("valid new user");
            res.send(user);
            //db.professor.delete
        } else {
            // delete from students
            res.json({ "error": "user already exist." });
        }*/

    });


    /* get All users of type */
    app.get("/createUser", function (req, res) {
        var uid = req.params.id;
        console.log(uid)
        if (!professorExist(user)) {
            console.log("valid new user");
            res.send(user);
            //db.professor.delete
        } else {
            // delete from students
            res.json({ "error": "user already exist." });
        }

    });


    /* Authentication */
    app.post("/login/:uinfo", function (req, res) {
        console.log("In login server method ");
        console.log(req.params.uinfo);
        var info = JSON.parse(req.params.uinfo);
         var email = info.email;
         var type = info.type;

        if(type == "prof"){
            var p = db.professor.findOne({ 'user.email': email },function (error, docs) {
                console.log(docs);
                if (docs) {  // check if we get empty document
                    console.log("user does exist",docs);
                    result = { "error": 0, "info": docs };
                    res.json(result);
                } else{
                    console.log("user does not exist",docs);
                    result = { "error": 1 ,"info": "user not exist" };
                    res.json(result);
                }
            });
        }else{
            var s = db.student.findOne({ 'user.email': email },function (error, docs) {
                console.log(docs);
                if (docs) {  // check if we get empty document
                    console.log("user does exist",docs);
                    result = { "error": 0, "info": docs };
                    res.json(result);
                } else{
                    console.log("user does not exist",docs);
                    result = { "error": 1 ,"info": "user not exist" };
                    res.json(result);
                }

            });
        }

    });


    /* Courses server  starts here . * /
    /* get All courses from courses collection where professor id */
    app.post("/courses/:id/:type", function (req, res) {
        console.log("Inside get all courses : server ");
        var uid = req.params.id;
        var type = req.params.type;
        var result;
        console.log(type);
        if (type == "prof") {
            console.log("Looking for professor courses.");
            // get the courses for professor where professor id is uid.
            var curOne = db.courses.find(
                { 'prof_id' : uid  },function (error, docs) {

                    console.log("docs : " , docs);
                    if(!error){
                        if(!docs){
                            // if courses does not exists
                            result = { "error": 1, "info": "courses not exist" } ;
                            res.json(result);
                        }else{
                            // if courses exists select them all and return
                            console.log(" courses exists ");
                            result = { "error": 0 , "info" : docs } ;
                            res.json(result);

                        }
                    }

                });


        } else {
            // param(uid) is given
            console.log("Looking for student courses in courses collection");
            // var user_info = {"id": uid, "type": type};
            //"First get courseArray from student collection", say courseArray
            var sdocs = db.student.find({ '_id': mongojs.ObjectId(uid) },function(err,docs){

                if(!err){
                    if(typeof docs[0].courseArray !== 'undefined' && docs[0].courseArray.length != 0){
                        //courses exist get them all
                        console.log("Student is enrolled in courses ");
                        console.log(docs[0].courseArray);
                        result = { "error": 0 , "info" : docs[0].courseArray } ;
                        var tempArray = [];
                        for(i = 0; i < docs[0].courseArray.length ; i++){
                            tempArray.push(mongojs.ObjectId(docs[0].courseArray[i]));
                        }
                        console.log("printing temp array");
                        console.log(tempArray);
                        // Then match course id in course collection to courseArray
                        db.courses.find( { '_id': { $in: tempArray } },function(err,idocs){
                            console.log(err);
                            console.log("printing matched docs");
                            console.log(idocs);
                            if(idocs){
                                result = { "error": 0 , "info" : idocs } ;
                                res.json(result);
                            }else{
                                console.log("Error: matching courses from student array and course collection");
                                result = { "error": 1 , "info" : idocs } ;
                                res.json(result);
                            }
                        });
                        //res.json(result);
                    }else{
                        // courses does not exist
                        result = { "error": 1 , "info" : "courses not exist" } ;
                        res.json(result);
                    }
                }
            });

        }

    });



    // TODO not working
    // Create course if professor; Enroll student in encourse if student.
    app.post("/courses", function (req, res) {

        console.log("inside create course: server ");
        // var cinfo = {"id": uid, "type": type, "name": name, "desc": desc};
        var uid = req.body.id;
        var type = req.body.type;
        var result;
        if (type == "prof") {
            /* create course in courses table  */
            var course_name = req.body.name;
            var course_desc = req.body.desc;
            var exist = true;

            console.log("course name :"+ course_name);
            var num = db.courses.count();
            var cur = db.courses.find({ "name" : course_name}).count();
            console.log("courses count with given name : "+cur);
            if(typeof cur == 'undefined' || num === 0){   // condition is not valid
                exist = false;
            }
            console.log("courses exist : "+exist);

            var c = { "prof_id" : uid, "name" : course_name , "description" : course_desc,"studentArray" : [], "quizArray" : []};
           /* var c = { "prof_id" : uid, "name" : course_name , "description" : course_desc};*/
            db.courses.insert(c, function(error, i_docs){
                    console.log("inserted in course.");
                    console.log(i_docs);
                    if(error == null){
                        console.log("inserted in course collection.");
                        result = { "error": 0 , "info" : uid  } ;
                        res.json(result);

                    }else{
                        console.log("Error : insert in course collection.");
                        result = { "error": 1 , "info" : uid  } ;
                        res.json(result);
                    }

            });

           /* result = { "error": 1 , "info" : "course_exist"  } ;
            res.json(result);*/



        }else{
            console.log(" Enrolling student in course.");
            console.log(req.body.course_id);
            //  var info = {"id": uid,"type": type, "course_id": course_id} From req.body
            var addStudent = {'student_id': req.body.id, 'studentQuizArray' : [] };
            var flag = false; // indicate whether student get added to course collection.
            var result = {} ;
            db.courses.find({_id: mongojs.ObjectId(req.body.course_id)},function(err,docs){
                console.log(docs);
                console.log(err);
                if(typeof docs[0] === 'undefined' || docs[0] === null){
                    console.log(" course not exist");
                    var result = {"error ": 1,"info": "Course not exist "};
                    res.json(result);
                }else{
                    console.log(" course exist");
                    db.courses.update(
                        { "_id" : mongojs.ObjectId(req.body.course_id) },
                        { $addToSet : { "studentArray" : addStudent } },function(err,docs){
                            console.log("enrolled student  .");
                            console.log(docs);
                            console.log(err);
                            if( docs.ok == true && docs.n == 1 && docs.updatedExisting == true){
                                console.log("Student added to course collection");
                                db.student.update(
                                    {"_id" : mongojs.ObjectId(req.body.id)},
                                    { $addToSet : { "courseArray" : req.body.course_id }},function(err,udocs){
                                        console.log(udocs);
                                        console.log(err);
                                        if( udocs.ok == true && udocs.n == 1 && udocs.updatedExisting == true){
                                            console.log("Course added to student collection");
                                            var result = {"error ": 0,"info": udocs};
                                            res.json(result);
                                        }else{
                                            console.log("Error : Course added to student collection");
                                            var result = {"error ": 1,"info": udocs};
                                            res.json(result);
                                        }

                                    });
                            }else{
                                console.log("Error :  adding student to course collection");
                                var result = {"error ": 1,"info": docs};
                                res.json(result);
                            }
                        });
                }
            });

        }

    });



    // get all courses from courses collection based on user UID .
    /*app.get("/courses", function (req, res){

        console.log("Inside get all courses for any user : server.")
        var cid = req.body.id;

        var type = req.body.type;
        if(type == "prof"){
            var prof_id = req.body.prof_id;
            db.courses.find(
                { '_id' : mongojs.ObjectId(cid)},
                { 'prof_id' : prof_id},
                function(err, doc){
                    if(!doc){
                        res.json({"error" : 0 , "info" : doc});
                    }else{
                        res.json({"error" : 1 , "info" : "not exist"});
                    }
                });
        }else{
            console.log("Looking for student courses in courses collection");
            // var user_info = {"id": uid, "type": type};
            console.log(req.body);
            //"First get courseArray from student collection", say courseArray
            // Then match course id in course collection to courseArray

        }

    });*/

    app.get("/courses/:cid",function(req,res){
        console.log("inside get selected course.");
        var info = JSON.parse(req.params.cid);
        console.log(info.cid);
        db.courses.find({ '_id' : mongojs.ObjectId(info.cid)},function(err, docs){
            console.log(docs);
            if(typeof docs[0] !== 'undefined' || docs[0] !== null){
                res.json({"error" : 0 , "info" : docs});
            }else{
                res.json({"error" : 1 , "info" : "not exist"});
            }
        });
    });

    /* Delete course from courses collection  and remove from student courses array id. */
    app.delete("/courses/:ac", function (req, res){

        var acc = JSON.parse(req.params.ac);
        var type = acc.type;
        if(type == "prof"){
            /*  var acc = {"id": c._id,"name" : c.name, "description" : c.description, "type": type, "prof_id" : c.prof_id };*/
            // remove it from everywhere.
            // 1. remove from professor courses array
            var prof_id = acc.prof_id;
            db.professor.update(
                { '_id' : mongojs.ObjectId(prof_id)},
                { $pull : { 'courses' : acc.id }},
                function(error, doc){
                    console.log(" removed from professor courses array :",doc);
                    if(doc.ok == true && doc.n == 1 && doc.updatedExisting == true){
                        // TODO 2. remove from student courses array

                        //3. remove from courses collection
                        console.log("to remove from courses course id :"+ acc.id);
                        db.courses.remove({'_id' : mongojs.ObjectId(acc.id)},function(err, docs){
                            console.log("removed from courses :",docs);
                            if(docs.n  == 1 ){
                                res.json({"error" : 0 , "info" : acc});
                            }else{
                                res.json({"error" : 1 , "info" : acc});
                            }
                        });

                    }
                });


        }else{
            console.log("Unenroll student from the course.");
            // var acc = {"id": uid,"type": type, "course_id": course_id};
            console.log(acc);
            var cur = db.courses.update(
                { "_id" : mongojs.ObjectId(acc.course_id)},
                { $pull : { "studentArray": { "student_id" : acc.id} }},function(err,doc){
                    console.log(err);
                    console.log(doc);
                    if( doc.ok == true && doc.n == 1 && doc.updatedExisting == true){
                        console.log("Unenroll from course");
                        var result = {"error ": 0,"info":acc.id};

                        // remove from course array in student collection.
                        db.student.update(
                            { "_id" : mongojs.ObjectId(acc.id)},
                            { $pull : { "courseArray": acc.course_id }},
                             function(err,doc){
                                 if( doc.ok == true && doc.n == 1 && doc.updatedExisting == true){
                                     console.log("Removed from student course Array ");
                                     var result = {"error ": 0,"info":acc.id};
                                     res.json(result);
                                 }else{
                                     var result = {"error ": 1,"info": "cannot remove from student courseArray"};
                                     res.json(result);
                                 }
                             });
                    }else{
                        console.log("Error : Unenroll from course");
                        var result = {"error ": 1,"info": "unenroll error"};
                    }
                    res.json(result);
                });

        }
    });


    app.put("/courses/:ac", function (req, res){
        console.log("Inside update course: server ");
       /* console.log(req.params.ac);*/ /* {"id": c._id,"name" : c.name, "description" : c.description, "type": type };*/
        var acc = JSON.parse(req.params.ac);
        var id  = acc.id;
        var type = acc.type;


        if(type == 'prof'){
            var name = acc.name;
            var desc = acc.description;
            var incur =  db.courses.update(
                { "_id" : mongojs.ObjectId(id)},
                { $set : {  "name" : name , "description" : desc}},
                function(error, i_docs){

                    console.log(" updated in courses table. ",i_docs);
                    console.log(" updated in courses table error",error);

                    result = {"error" : 1 , "info" : i_docs};
                    if(i_docs.ok == true && i_docs.n == 1 && i_docs.updatedExisting == true){
                        console.log(" if updated. ",i_docs);
                        result = {"error" : 0 , "info" : i_docs};
                    }
                    res.json(result);

                });
        }else{/*{ id: '5482a8a7bc748acc1278e103',
            uid: '5482a01e45bf3124217ea53e',
            type: 'stud',
            quiz_id: 1,
            updatedQuiz:
            { id: 1,
                course_id: '5482a8a7bc748acc1278e103',
                is_posted: false,
                title: 'First quiz for english course',
                due_date: '2014-12-10T21:00:09.150Z',
                last_modified: '2014-12-07T18:55:14.582Z',
                score: 0,
                problemArray: [ [Object], [Object] ] },
            action: 'push' }*/

            // Student updataing the studentQuizArray
            console.log("updating the student Quiz Array");
            console.log(acc);

            if(acc.action == 'push'){
                console.log("push student quiz array");
                var incur =  db.courses.update(
                                {
                                    "_id": mongojs.ObjectId(id),
                                    "studentArray": {
                                        $elemMatch: {"student_id": acc.uid}
                                    }
                                },
                                { $addToSet : {  'studentArray.$.studentQuizArray' : acc.updatedQuiz }},
                                function(error, i_docs){

                                    console.log(" Add to studentQuizArray  ",i_docs);
                                    console.log(" Error studentQuizArray ",error);

                                    result = {"error" : 1 , "info" : i_docs};
                                    if(i_docs.ok == true && i_docs.n == 1 && i_docs.updatedExisting == true){
                                        console.log("  if updated. ",i_docs);
                                        result = {"error" : 0 , "info" : i_docs};
                                    }
                                    res.json(result);

                                });
            }/*else if(acc.action == 'update'){
                // search for the quiz and then update it.
                console.log("updating student quizarray");
                var incur =  db.courses.update(
                    {
                        "_id": mongojs.ObjectId(id),
                        "studentArray": {
                            $elemMatch: {"student_id": acc.uid}
                        }
                    },
                    { $pull : 'studentArray.$.studentQuizArray' },
                    function(error, i_docs){

                        console.log(" removed from  studentQuizArray  ",i_docs);
                        console.log(" Error removed from studentQuizArray ",error);

                        result = {"error" : 1 , "info" : i_docs};
                        if(i_docs.ok == true && i_docs.n == 1 && i_docs.updatedExisting == true){
                            console.log("  if updated. ",i_docs);
                            result = {"error" : 0 , "info" : i_docs};
                        }
                        res.json(result);

                    });
            }*/

        }

    });


    app.get("/availCourses",function(req,res){
        console.log("inside all avail courses.");
        db.courses.find(function(err, docs){
                console.log(docs);
                if(typeof docs[0] !== 'undefined' || docs[0] !== null){
                    res.json({"error" : 0 , "info" : docs});
                }else{
                    res.json({"error" : 1 , "info" : "not exist"});
                }
            });
    });

    /* Code for quiz */
    /* Create */
    app.post("/quiz", function (req, res){
        console.log("Inside  quiz server : create");
        console.log(req.body);
        var info = req.body;

        var q = { "id" : info.quiz_id , "quiz" : info.updatedQuiz};


        //  push the quiz

        var cur = db.courses.find(
            {"_id" : mongojs.ObjectId(info.course_id)},function(err,docs){

                if(typeof docs !== 'undefined' || docs === null || docs.length != 0){

                    console.log(docs);
                    console.log(docs[0].quizArray);
                    if(typeof docs[0].quizArray !== 'undefined' || docs[0].quizArray !== null){

                        console.log("push in quiz array .");
                        db.courses.update(
                            {"_id" : mongojs.ObjectId(info.course_id)},
                            { $addToSet : { "quizArray" : q }},function(err,docs){

                                console.log("pushed in quiz array .");
                                console.log(docs);
                                console.log(err);

                                if( docs.ok == true && docs.n == 1 && docs.updatedExisting == true){
                                    var result = {"error ": 0,"info": q};
                                    res.send(result);

                                }else{
                                    var result = {"error ": 1,"info": "update push quiz error."};
                                    res.send(result);
                                }

                            });
                    }
                }

            });
    });


    /* Delete */
    app.delete("/quiz/:q", function (req, res){
        console.log("Inside quiz server : delete");
        var acc = JSON.parse(req.params.q);
        console.log(acc);

        var cur = db.courses.update(
            { "_id" : mongojs.ObjectId(acc.course_id)},
            { $pull : { "quizArray": { "id" : acc.quiz_id} }},function(err,doc){
                console.log(err);
                console.log(doc);
                if( doc.ok == true && doc.n == 1 && doc.updatedExisting == true){
                    var result = {"error ": 0,"info":acc.quiz_id};

                }else{
                    var result = {"error ": 1,"info": "delete quiz error."};
                }
                res.json(result);
            });
    });


    /* Update */
    app.put("/quiz/:info", function (req, res){
        console.log("Inside update quiz: ");
        console.log(req.params.info);
        var info = JSON.parse(req.params.info);

        console.log(info);

        var incur =  db.courses.update(
            { "_id" : mongojs.ObjectId(info.course_id),
              "quizArray" : {
                  $elemMatch : { "id" : info.quiz_id }
              }
            },
            { $set : {  'quizArray.$.quiz' : info.updatedQuiz}},
            function(error, doc){

                console.log(" updated in courses table. ",doc);
                console.log(" updated in courses table error",error);
                if( doc.ok == true && doc.n == 1 && doc.updatedExisting == true){
                    var result = {"error ": 0,"info": info.quiz_id};

                }else{
                    var result = {"error ": 1,"info": "update quiz error."};
                }
                res.json(result);


            });
    });


    /* get all quizzes. */
    app.get("/quiz/:info", function (req, res){
        console.log("Inside quiz server : getAll");
        var info = JSON.parse(req.params.info);
        console.log(info);

        var cur = db.courses.find({"_id" : mongojs.ObjectId(info.course_id)},function(err,docs){
            console.log(docs);
            console.log(docs[0].quizArray);
            var result = {"error" : 1, "info" : "not_exist"};
            if(typeof docs[0].quizArray === 'undefined' || docs[0].quizArray === null){
                res.json(result);
            }else if(docs[0].quizArray.length == 0){
                res.json(result);
            }else{
                var result = {"error" : 0, "info" : docs[0].quizArray};
                res.json(result);
            }
        });


    });

    function insertIntoCoursesDb(uid,course_name,course_desc){

        var flag = false;
        var incur =  db.courses.insert(
            { "prof_id" : uid, "name" : course_name , "description" : course_desc},
            function(error, i_docs){

                console.log(" Added to courses table. ",i_docs);
                console.log(" Added to courses table. ",error);

                if(i_docs._id){
                    console.log(" Added to courses table. ",i_docs);
                    flag = true;
                }
            });

        return flag;
    }


}



/*
db.professor.update({'_id' : ObjectId("5456df25fc1010b01cd8c4e5") },{$set: { "
    urses" : [{"course" : [{"cname":"English"}] }]}});



    result =  {"error": 1, "reason": "no courses"};
        console.log("Num of documents returned "+ cur.count(function(err, doc) { console.log(doc);}));
        db.professor.update({'_id' : mongojs.ObjectId(uid)},{$set: { "courses" : [{"course" : [{"cname":"English"}] }]}})


        db.professor.update({'_id' : ObjectId('5456df25fc1010b01cd8c4e5'),
        { $set :
        { "courses" :
            [     {  "name" : "English" , "description" : "something"}    ]
        }
        }
        )

        // to add a new course in courses
        db.collection.update(
            { "_id": ObjectId("5456df25fc1010b01cd8c4e5") },
            {
                "$push": {
                    "courses": {
        { "course" : {  "name" : "Maths" }}

    }
}
}
)


db.collection.update({ "_id": ObjectId("5456df25fc1010b01cd8c4e5")},{"$push
    : { "courses": {  "course" : { "name" : "Maths" } } } });

db.professor.update({'_id' : ObjectId('5456df25fc1010b01cd8c4e5'), { $addToSet: { "courses.$.course": { "name" : "Maths"} }})
if(!err)
{
    result = { "error": 0, "info": docs };
}
res.json(result);

});

//console.log("Num of documents returned "+cur.hasNext());

} else {
    console.log("user does not exist");
    res.json({ "error":  1, "reason": "no courses" });
}


 var cur = db.professor.find(
 { '_id' : mongojs.ObjectId(uid) },  // query
 { 'courses ': { $exist : true } },  // where i.e fields in mongodb
 function(err, docs){

 });

*/