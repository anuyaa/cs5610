/**
 * Created by Ankita on 12/4/2014.
 */
// This service is used for student
app.factory("StudentCourseService", function ($http,$location,$state) {

    var user_id;
    //To enroll a student in a course.
    var enrollCourse = function (cinfo, callback) {
        console.log("inside student course service",cinfo);
        $http.post("/courses", cinfo).success(function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available

            console.log("After course added in  inside course ");
            console.log(status);
            console.log(data);

            if(data.error == 0){
                console.log("enrolled 2",data.info);
                $state.go("dashboard.stuCourses",{id : data.info});
            }else{
                console.log("cannot enroll in course. ");
                callback(data, status, headers, config);
            }



        }). error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(status);
        });
    }


    var selectOne = function (user, callback) {
       /*  select functionality
        var selThisUser = { "type" : user_type, "id": id };
        $http.get("/createUser", selThisUser).success(function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(status);
            console.log(data);
        }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(status);
            });*/
    }


    /* get All courses for given student functionality. It should work with get instead of get. */
    var selectAll = function (user_info ,callback) {
        console.log("Inside get all courses : Student Course Service ");
        console.log(user_info);
        $http.post("/courses/"+user_info.id+"/"+user_info.type,user_info).success(callback).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status
                console.log(data);
                console.log(status);

            });

    }


    var update = function (ac, callback) {

        /*{"id": c._id,"name" : c.name, "description" : c.description, "type": type };*/
        $http.put("/courses/"+JSON.stringify(ac)).success(function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(status);
            console.log(data);

          /*  if(data.error == 0){
                $state.go("dashboard.courses",{id : ac.prof_id});
            }else{
                callback(data);
            }*/
        }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(status);
            });
    }


    var unenrollCourse = function (info, callback) {

       /*  delete functionality*/
        console.log(info); // var info = {"id": uid,"type": type, "course_id": course_id};
        $http.delete("/courses/" + JSON.stringify(info)).success( function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(status);
            console.log("error :"+data.error);
            console.log("data :",data);
            console.log(info.id);
            //callback(data);
            if(data.error == 0){
                $state.go("dashboard.stuCourses",{id : info.id});
            }else{
                callback(data);
            }
            // forward the user to its registration page

        }).error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(status);
        });
    }


    return {

        "enrollCourse": enrollCourse,
        "unenrollCourse": unenrollCourse,
        "selectAll": selectAll,
        "update": update,
        "uid" : user_id
    };
});