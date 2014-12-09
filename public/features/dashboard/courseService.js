/**
 * Created by Ankita on 11/13/2014.
 */
// This service is used for professor
app.factory("CourseService", function ($http,$location,$state) {


    var user_id ;
    var create = function (cinfo, callback) {
        console.log("course service",cinfo);
        $http.post("/courses", cinfo).success(function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available

            console.log("After course create inside service ");
            console.log(status);
            console.log(data);
            callback(data, status, headers, config);
           /* if(data.error == 0){
                console.log("courses exists 2",data.info);
                $state.go("dashboard.courses",{id : data.info});
            }else{
                console.log("cannot create course. ");
                callback(data, status, headers, config);
            }*/



        }). error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(status);
        });
    }


    var selectOne = function (course_id, callback) {
        /* select functionality */
        console.log("inside course selectone: service ");
        console.log(course_id);
        var info = { 'cid' : course_id};
        $http.get("/courses/"+JSON.stringify(info)).success(function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(status);
            console.log(data);
            callback(data, status, headers, config);
        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(status);
        });
    }


    /* get All courses for professor functionality */
    var selectAll = function (user_info ,callback) {

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
        console.log(ac);
        $http.put("/courses/"+JSON.stringify(ac)).success(function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(status);
            console.log(data);
            callback(data, status, headers, config);

        }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(status);
            });
    }


    var remove = function (ac, callback) {

        /* delete functionality */
        console.log(ac);
        $http.delete("/courses/" + JSON.stringify(ac)).success( function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(status);
            console.log("error :"+data.error);
            console.log("data :",data);
            console.log(ac.prof_id);
            //callback(data);
            callback(data, status, headers, config);

            // forward the user to its registration page

        }).error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(status);
        });
    }

    // get all courses irrespective of user.
    var getAvailCourses = function (callback) {
        console.log("Looking for all available courses : Course service ");
        $http.get("/availCourses").success(callback).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status
                console.log(data);
                console.log(status);

            });
    }

    return {

        "create": create,
        "selectOne": selectOne,
        "selectAll": selectAll,
        "update": update,
        "remove": remove,
        "getAvailCourses": getAvailCourses,
        "uid" : user_id
    };
});