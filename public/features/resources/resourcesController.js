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
        var vurl = "https://www.googleapis.com/youtube/v3/search?key="+apiKey;
        vurl = vurl + "&part=snippet&mine=true&type=video&videoDefinition=high&videoCaption=closedCaption&max-results=50&q=";

        console.log("printing url ");
        console.log(vurl);

        $scope.search = function () {

            var search_for = $scope.search_input;
            vurl = vurl + search_for;
            console.log(vurl);
            getVideos(vurl);
        }

        function getVideos(vurl) {
            $http.get(vurl).success(function (response) {
                console.log(response);
                $scope.vitems = response.items;
                console.log($scope.vitems[0].snippet);
            });

        }


        $scope.searchBook = function () {
            var burl = "http://it-ebooks-api.info/v1/";
            var userInput = $scope.search.book;
            //  var bfilter = $scope.search.filter;
            //var bfilter = document.getElementByName("ftype").value;
            // var bfilter = $("input[type=radio]:checked").val();
            // var bfilter = $('input:radio[name=ftype]').val();
            var bfilter = 'title';
            console.log(userInput + " - " + bfilter);
            burl = burl + "search/" + userInput ;
            console.log(burl);
            getBook(burl);
        }


        $scope.change = function (id) {
            var burl = "http://it-ebooks-api.info/v1/";
            console.log("Book ID : " + id);
            burl = burl + "/book/" + id;
            console.log(burl);
            $http.get(url).success(function (req, res) {
                $scope.book_detail = res;
            });
        }

        function getBook( burl) {
            $http.get(burl).success(function (response) {
                //console.log(response.Books[0]);
                $scope.bitems = response.Books;

            });

        }

        function getBookDetail( burl) {
            $http.get(burl).success(function (response) {
                console.log(response.Books[0]);
                $scope.bitems = response.Books;

            });
        }

    }]);
