var app = angular.module('DashboardApp', ['ui.router', 'ngDropdowns','ui.bootstrap']);

app.config(['$urlRouterProvider','$stateProvider',
    function ($urlRouterProvider,$stateProvider) {

        //$locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise("/");


        $stateProvider.
            state('login', {
                url:'/',
                templateUrl: 'features/authenticatation/login.html',
                controller: 'RegistrationController'
            }).
            state('register', {
                url:'/register',
                templateUrl: 'features/authenticatation/registrationform.html',
                controller: 'RegistrationController'
            }).
            state('dashboard', {
                url:"/dashboard/:id",
                templateUrl: 'features/dashboard.html',
                controller: 'DashBoardController',
                abstract : true
            }).
            state('dashboard.profile', {
                url:"",
                templateUrl: 'features/dashboard/dashboard.profile.html',
                controller: 'DashBoardController'
            }).
            state('dashboard.resource', {
                url:"/resources",
                parent : 'dashboard',
                templateUrl: 'features/resources/resource.html',
                controller: 'ResourceController'
            }).
            state('dashboard.courses', {
                url:"/courses",
                templateUrl: 'features/dashboard/displayCourses.html',
                controller: 'CourseController'
            }).
            state('dashboard.stuProfile', {
                url:"/profile",
                templateUrl: 'features/dashboard/dashboard.profile.html',
                controller: 'studentController'
            }).
            state('dashboard.stuResource', {
                url:"/sresources",
                parent : 'dashboard',
                templateUrl: 'features/resources/resource.html',
                controller: 'ResourceController'
            }).
            state('dashboard.stuCourses', {
                url:"/scourses",
                templateUrl: 'features/studentdashboard/displayCourses.html',
                controller: 'studentCourseController'
            });



    }]);