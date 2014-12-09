/**
 * Created by Ankita on 12/4/2014.
 */
app.controller("studentController", ["$scope", "$http","$state", "$location", "RegistrationService",
    function ($scope, $http,$state, $location,RegistrationService) {


        $scope.uid  = RegistrationService.getIdProperty();
        console.log("In student controller ",$scope.uid);


       /* $scope.gotoSelected = function(state){
            console.log("In dashboard controller go to ");
            console.log(state);
            $state.go(state,{id : $scope.uid});
        };*/


    }]);