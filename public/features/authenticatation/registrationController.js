app.controller("RegistrationController",
    ["$scope", "$rootScope","$http","$location", "RegistrationService","$state",
        function ($scope, $rootScope,$http,$location, RegistrationService,$state) {

            console.log("In registration controller ");
            var user_type;

            $scope.status = {
                isopen: false
            };

            $scope.toggled = function(open) {
                $log.log('Dropdown is now: ', open);
            };

            $scope.toggleDropdown = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.status.isopen = !$scope.status.isopen;
            };

            $scope.selectUser = function (type) {
                user_type = type;
                console.log(user_type);
               // $scope.selectedUserType
                // TODO: Show selected button on the dropdown
            };

            $scope.register = function () {
                var email = $scope.user.email;
                var username = $scope.user.name;
                var fname = $scope.user.fname;
                var lname = $scope.user.lname;
                var phone = $scope.user.phone;

               
                /* ADD : check for alphanumeric */
                if (email == undefined || username == "") {
                    $scope.user.email = "";
                    $scope.user.name = "";
                    $scope.user.fname = "";
                    $scope.user.lname = "";
                    // $scope.user.photo = "";
                    return;
                }

                if (angular.isUndefined(phone) || phone == null){
                    phone = "";
                }
                //var user_type = "prof";
                var newPro = {};
                if(user_type == "prof"){
                    newPro = { 'firstname': fname, 'lastname': lname, 'email': email, 'username': username,  "phone" : phone};
                }else{
                    newPro = { 'firstname': fname, 'lastname': lname, 'email': email, 'username': username, "phone" : phone,"courseArray" : [] };
                }

                /* create functionality */
                var addThisUser = { "type" : user_type, "user": newPro };
                console.log(addThisUser);
                RegistrationService.create(addThisUser, function (response) {
                    console.log("User added successfully");
                    console.log(response);
                });
            };

            $scope.login = function(){
                var mail = $scope.login.mail;
                console.log(user_type);
                var info = { "type" : user_type, "mail" : mail};
                RegistrationService.login(info,function(response){
                    console.log("after login of user.");
                    console.log(response);
                });
            }

            $scope.registerClick = function(){
                console.log("logging out");
                $state.go('register');
            }

            $scope.loginClick = function(){
                console.log("login out");
                $state.go('login');
            }


        }
    ]);