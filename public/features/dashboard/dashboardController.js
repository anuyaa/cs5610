app.controller("DashBoardController", ["$scope", "$http","$state", "$location", "RegistrationService",
    function ($scope, $http,$state, $location,RegistrationService) {


        $scope.uid  = RegistrationService.getIdProperty();
        $scope.type  = RegistrationService.getTypeProperty();
        console.log("In dashboard controller ",$scope.uid);


        $scope.gotoSelected = function(state){
            console.log("In dashboard controller go to ");
            console.log(state);
            $state.go(state,{id : $scope.uid});
        };

        getUserInfo();
        $scope.currentUser = {};
        $scope.profile = "show";
        function getUserInfo(){
            var selThisUser = { "type": $scope.type, "id": $scope.uid };
            RegistrationService.selectOne(selThisUser,function(response, status, headers, config){
                console.log(response);
                if(response.error == 0){
                    $scope.currentUser = response.info[0].user;
                    $scope.profile = "show";
                }
            });
        }

        $scope.editProfile = function(){
            $scope.profile = 'edit';
        }

        $scope.user = {};
        $scope.saveProfile = function(){
            console.log("inside save profile ");
            console.log($scope.user);
            var fn = $scope.user.fname;
            var ln = $scope.user.lname;
            var un = $scope.user.uname;
            var email = $scope.user.email;
            var phone = $scope.user.phone;
            if(angular.isUndefined($scope.user.firstname) || $scope.user.firstname == ""){
               fn = $scope.currentUser.firstname;
            }
            if(angular.isUndefined($scope.user.lastname) || $scope.user.lastname == ""){
                ln = $scope.currentUser.lastname;
            }
            if(angular.isUndefined($scope.user.username) || $scope.user.username == ""){
                un = $scope.currentUser.username;
            }

            if(angular.isUndefined($scope.user.email) || $scope.user.email == ""){
                email = $scope.currentUser.email;
            }

            var updatedUser = {"firstname" : fn, "lastname" : ln ,"username" : un, "email" : email, "phone" : phone};
            var info = { "type": $scope.type, "id": $scope.uid, "updatedUser" : updatedUser};
            console.log(info);
            RegistrationService.update(info,function(response, status, headers, config){
                console.log("after update profile in controller")
                console.log(response);
                if(response.error == 0){
                    $scope.currentUser = response.info.user;
                    $scope.profile = "show";
                }
            });
            //getUserInfo();
           // $scope.profile = "show";
        }

        $scope.logout = function(){
            console.log("logging out");
            $state.go('login');
        }


    }]);