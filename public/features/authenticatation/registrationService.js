app.factory("RegistrationService", function ($http,$location,$state) {


    var user_id ;
    var user_type;
    var create = function (addThisUser, callback) {
        console.log("In service",addThisUser);
        $http.post("/createUser", addThisUser).success(function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(status);
            console.log(data);
            // forward the user to its new dashboard page
            setIdProperty(data.info._id);
            setTypeProperty(data.info.type);
            if(data.info.type == "prof"){
                $state.go("dashboard.profile",{id : data.info._id});
            }else{
                $state.go("dashboard.stuProfile",{id : data.info._id});
            }

            //$location.path("/dashboard/"+data.new_user._id);   // forwarding the user to his own dashboard page
        }).
         error(function (data, status, headers, config) {
             // called asynchronously if an error occurs
             // or server returns response with an error status.
             console.log(status);
         });
    }

    var selectOne = function (user, callback) {
        /* select functionality */
        var selThisUser = { "type": user.type, "id": user.id };
        $http.get("/createUser/"+JSON.stringify(selThisUser)).success(callback).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(status);
        });
    }



    var selectAll = function (callback) {
        /* get All functionality */
        var getAllUser = { "type": user_type };
        $http.get("/createUser", getAllUser).success(function (data, status, headers, config) {
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


    var update = function (info, callback) {
        /* update functionality */
        console.log("in registration update service ");
        console.log(info);
        $http.put("/createUser", info).success(callback).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(status);
        });
    }


    var del = function (delUser, callback) {

        /* delete functionality */
        var delThisUser = { "type": user_type, "id": id };
        $http.delete("/createUser", delThisUser).success(function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(status);
            console.log(data);
            // forward the user to its registration page 
        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(status);
        });
    }


    var login = function(info,callback){

        console.log("inside login service");
        console.log(info);

        var uinfo = {"email":info.mail, "type":info.type};
      $http.post("/login/"+JSON.stringify(uinfo)).success(function (data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          console.log(status);
          console.log(data);

          if(data.error == '0'){
              console.log("After successfull login: service");
              console.log(data.info);
              user_id = data.info._id;
              setIdProperty(user_id);
              setTypeProperty(data.info.type);
              if(data.info.type == "prof"){
                  $state.go("dashboard.profile",{id : user_id});
              }else{
                  $state.go("dashboard.stuProfile",{id : user_id});
              }

          }else{
              $state.go("login");
          }
          // forward the user to its registration page
      }).error(function (data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log(status);
              $state.go("login");
      });

    }

    var setIdProperty = function(value) {
        user_id = value;
    }

    var getIdProperty = function () {
        return user_id;
    }

    var setTypeProperty = function(value) {
        user_type = value;
    }

    var getTypeProperty = function () {
        return user_type;
    }
    return {

        "create": create,
        "selectOne": selectOne,
        "selectAll": selectAll,
        "update": update,
        "del": del,
        "login" : login,
        "setIdProperty" : setIdProperty,
        "getIdProperty" : getIdProperty,
        "setTypeProperty" : setTypeProperty,
        "getTypeProperty" : getTypeProperty


    };
});