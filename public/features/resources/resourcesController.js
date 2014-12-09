/**
 * Created by Ankita on 12/8/2014.
 */
app.controller("ResourceController", ["$scope", "$http","$state", "$location", "RegistrationService",
    function ($scope, $http,$state, $location,RegistrationService) {


        $scope.uid  = RegistrationService.getIdProperty();
        $scope.type  = RegistrationService.getTypeProperty();
        console.log("In resources controller ",$scope.uid);


        $scope.gotoSelected = function(state){
            console.log("In dashboard controller go to ");
            console.log(state);
            $state.go(state,{id : $scope.uid});
        };


        var keyword = $scope.search_input;
        var apiKey = "AIzaSyBNUGULhhyJU6mzXWPaiJUrsNbp-pprKAQ";
        var url = "https://www.googleapis.com/youtube/v3/search?key="+apiKey;
        url = url + "&part=snippet&mine=true&type=video&videoDefinition=high&videoCaption=closedCaption&max-results=50&q=";

        console.log("printing url ");
        console.log(url);

        $scope.search = function () {

            var search_for = $scope.search_input;
            url = url + search_for;
            console.log(url);
            getVideos(url);
        }

        function getVideos(url) {
            $http.get(url).success(function (response) {
                console.log(response);
                $scope.items = response.items;
                console.log($scope.items[0].snippet);
            });

        }


        $scope.searchBook = function () {
            url = "http://it-ebooks-api.info/v1/";
            var userInput = $scope.search.book;
            //  var bfilter = $scope.search.filter;
            //var bfilter = document.getElementByName("ftype").value;
            // var bfilter = $("input[type=radio]:checked").val();
            // var bfilter = $('input:radio[name=ftype]').val();
            var bfilter = 'title';
            console.log(userInput + " - " + bfilter);
            url = url + "search/" + userInput ;
            console.log(url);
            getBook(url);
        }


        $scope.change = function (id) {
            url = "http://it-ebooks-api.info/v1/";
            console.log("Book ID : " + id);
            url = url + "/book/" + id;
            console.log(url);
            $http.get(url).success(function (req, res) {
                $scope.book_detail = res;
            });
        }

        function getBook( url) {
            $http.get(url).success(function (response) {
                //console.log(response.Books[0]);
                $scope.items = response.Books;

            });

        }

        function getBookDetail( url) {
            $http.get(url).success(function (response) {
                console.log(response.Books[0]);
                $scope.items = response.Books;

            });
        }

    }]);
