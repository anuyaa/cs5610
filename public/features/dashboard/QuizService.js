/**
 * Created by Ankita on 11/22/2014.
 */
app.factory("QuizService", function ($http,$location,$state) {


    var course_id ;
    var quiz_id ;

    var create = function (qinfo, callback) {
        console.log(" inside quiz service : create",qinfo);
        $http.post("/quiz", qinfo).success(function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available

            console.log("After quiz service : create ");
            console.log(status);
            console.log(data);

            /*if(data.info.length != 0){
                console.log("courses exists 2",cinfo);
                $state.go("dashboard.courses",{id : cinfo.id});
            }else{
                console.log("courses not exists 2");
                callback(data, status, headers, config);
            }*/



        }). error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(status);
        });
    }


    var selectOne = function (user, callback) {
        /* select functionality */
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
            });
    }


    /* get All quizzes for professor functionality */
    var selectAll = function (info ,callback) {

        console.log("inside quiz service : getAll",info);
        $http.get("/quiz/"+JSON.stringify(info)).success(function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(status);
            console.log(data);
            callback(data, status, headers, config);
        }).error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(data);
                console.log(status);
                callback(data, status, headers, config);

        });
    }


    var update = function (info, callback) {
        console.log("inside update quiz : service ");
        console.log(info);
        $http.put("/quiz/"+JSON.stringify(info)).success(function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(status);
            console.log(data);
            callback(data, status, headers, config);
            /*if(data.error == 0){
             $state.go("dashboard.courses",{id : ac.c.prof_id});
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


    var remove = function (qinfo, callback) {

        /* delete functionality */
        console.log(qinfo);
        $http.delete("/quiz/"+ JSON.stringify(qinfo)).success( function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            //console.log(status);
           // console.log(data);
            callback(data, status, headers, config);
           // console.log("error :"+data.error);
            //callback(data);
          /*  if(data.error == 0){
                $state.go("dashboard.courses",{id : ac.c.prof_id});
            }else{
                callback(data);
            }*/
            // forward the user to its registration page

        }).error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            callback(data, status, headers, config);
            //console.log(status);
        });
    }


    return {

        "create": create,
        "selectOne": selectOne,
        "selectAll": selectAll,
        "update": update,
        "remove": remove

    };
});
