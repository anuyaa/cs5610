/**
 * Created by Ankita on 11/13/2014.
 */
module.exports = function (app, db, mongojs) {


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

                        result = { "error": 0, "new_user": doc };
                        res.json(result);
                    });
                } else {
                    console.log("user exist");
                    res.json({ "error":  1 });
                }

            });


        } else {
            // add student

            var sdocs = db.student.find({ 'email': new_user.user.email }).count(function (error, sdocs) {
                if (sdocs == 0) {
                    console.log("student does not exist");
                    // insert into db

                    result = { "error": 0, "new_user": sdocs }
                    res.json(result);
                } else
                    console.log("user exist");
                res.json({ "error": "user exist" });

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
    app.get("/createUser/:id", function (req, res) {
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


    /* Update a user with id */
    app.put("/createUser/:id", function (req, res) {
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


    /* get All courses for user id */
    app.get("/getCourses", function (req, res) {
        var uid = req.body.user.id;
        var result;
        if (type == "prof") {

            var pdocs = db.professor.find({ '_id': uid }).count(function (error, pdocs) {
                if (pdocs != 0) {
                    console.log("User exists .");
                    db.professor.find( { 'courses.course ': { $exist : true } }, function(err, docs){
                        result =  {"error": 1, "reason": "no courses"};
                        if(!err)
                        {
                            result = { "error": 0, "info": docs };
                        }
                        res.json(result);

                    });

                } else {
                    console.log("user does not exist");
                    res.json({ "error":  1, "reason": "no courses" });
                }

            });


        } else {
            // add student

            var sdocs = db.student.find({ 'email': new_user.user.email }).count(function (error, sdocs) {
                if (sdocs == 0) {
                    console.log("student does not exist");
                    // insert into db

                    result = { "error": 0, "new_user": sdocs }
                    res.json(result);
                } else
                    console.log("user exist");
                res.json({ "error": "user exist" });

            });

        }

    });
}
