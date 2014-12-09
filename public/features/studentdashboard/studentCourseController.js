/**
 * Created by Ankita on 12/4/2014.
 */
app.controller("studentCourseController", ["$scope", "$http","$state", "$location", "RegistrationService","StudentCourseService","CourseService",
    function ($scope, $http,$state, $location,RegistrationService,StudentCourseService,CourseService) {


        var uid  = RegistrationService.getIdProperty();
        var type = RegistrationService.getTypeProperty();

        console.log("In student  course controller ",$scope.uid);

        $scope.allCourses = [];   // indicate all courses in which student is enrolled.
        $scope.studentCourseIdArray = [];
        $scope.currentCourse = {};

        $scope.availCourses = [];  // indicate all available courses irrespective of user
        $scope.courses = "not_available";  // indicate if there are available courses or not in enroll page
        $scope.selection = 'not_exist';   // indicate if student has any courses. hide div

        getAll(uid,type);

        function getAll(uid, type) {
            /*Get all courses for a user. */
            var user_info = {"id": uid, "type": type};
            StudentCourseService.selectAll(user_info, function (response, status, headers, config) {
                console.log(response.info);
                if (response.error == 1 || response.info.length == 0) {
                    //$scope.selection = 'not_exist';  // if no available course, set displayCourses selection:not_exist
                    console.log("No courses enrolled ");
                    getAvailCourses();
                    $scope.selection = 'not_exist';
                } else {
                    if($scope.allCourses.length == 0  && response.error == 1){
                        $scope.studentCourseIdArray = [];  // reset course Id array for student
                        $scope.showListCourse();
                    }else {
                        // assign current course
                        console.log("There are available courses.");
                        $scope.currentCourse = response.info[0];        // first course in the list:  current course
                        console.log("current courses :", $scope.currentCourse);

                        // assign all courses for students
                        $scope.allCourses = response.info;   // all courses in which student is enrolled, displayCourses.
                        console.log("all courses :", $scope.allCourses);

                        setStudentCourseIdArray();   // set array of course id's , in which student is enrolled.

                        $scope.selection = 'exist';        // show div based on selection, displayCourses

                        setCurrentCourseQuizzes();
                    }


                }
            });
        }


        /* Returns all available courses in the course collection, irrespective of user.*/
        function getAvailCourses(){
            CourseService.getAvailCourses(function(response, status, headers, config) {

                console.log("get all available courses. " + response.info.length);
                if (response.error == 1 || response.info.length == 0) {
                    console.log("no available courses ");
                    $scope.availCourses = [];    // show available courses, enrollCourse
                    $scope.courses = 'not_available';
                }else {

                    console.log(" available courses ");
                    console.log(response.info);
                    for(i = 0; i < response.info.length ; i++){
                        if($scope.studentCourseIdArray.indexOf(response.info[i]._id ) == -1){
                            // if course id is not present in studentCourseIdArray, then push
                            $scope.availCourses.push(response.info[i]);
                        }

                    }
                    console.log($scope.availCourses);
                    $scope.courses = 'available';
                    if($scope.availCourses.length == 0){
                        $scope.courses = 'not_available';
                    }
                }
            });
        }


        function setStudentCourseIdArray(){

            for(i = 0; i < $scope.allCourses.length; i++){
                $scope.studentCourseIdArray.push($scope.allCourses[i]._id);
            }
        }

        /* Set current course */
        $scope.setCurrentCourse = function(course_id){
            console.log("inside set current course "+course_id);
            CourseService.selectOne(course_id,function(response, status, headers, config) {
                console.log(response);
                console.log("got the selected course "+course_id);
                console.log(response.info[0]);
                if(response.error == 0){
                    $scope.currentCourse = response.info[0];
                    $scope.allQuizzesForCourse = [];
                    $scope.oldQuizzesForCourse = [];
                    $scope.studentQuizzesForCourse = [];
                    $scope.studentQuizIdArray = [];
                    $scope.my_quizzes = 'none';// my quiz tab
                    $scope.old_quiz = 'none';// old quiz tab
                    $scope.takeQuiz = 'none';// take quiz tab
                    $scope.currentQuiz = {};
                    originalQuiz = {};
                    setCurrentCourseQuizzes();
                }else{
                    $scope.show = "courseNotExist";
                    $scope.currentCourse = {};
                    console.log(" Cannot find the course.");
                }

            });
        }


        /* Enroll student in the given course.*/
        $scope.enroll = function(course_id){
            console.log(" enrolling student in course ",course_id);
            // Now we need to add the student in the courses table
            var info = {"id": uid,"type": type, "course_id": course_id};
            StudentCourseService.enrollCourse(info,function(response, status, headers, config) {
                console.log(response);
                if (response.error == 1 ) {
                    console.log("cannot enroll in course ");
                    //$scope.courses = "not-available";    // show available courses. enrollCourse
                    //$scope.selection = "not_exist";
                }else {
                    //$scope.availCourses = response.info;  // need to fetch all courses for given student.
                    //$scope.courses = "available";    // we set all available courses, enrollCourse.
                    //$scope.selection = "not_exist";
                }
                getAll(uid,type);
            });
        }

        /* Unenroll student from the given course.*/
        $scope.unenroll = function(course_id){
            console.log("unenrolling student from course ",course_id);
            var info = {"id": uid,"type": type, "course_id": course_id};
            StudentCourseService.unenrollCourse(info,function(response, status, headers, config) {
                console.log(response);
               // console.log("get all available courses. " + response.info.length);
                if (response.error == 1 ) {
                    console.log(" cannot unenroll from course ");
                    //$scope.courses = "not-available";    // show available courses.
                }else {
                    console.log("unenrolled from the course.");
                    console.log("Before length of student courses :",$scope.studentCourseIdArray.length);
                    $scope.studentCourseIdArray.splice(array.indexOf(course_id),1);
                    console.log("After length of student courses :",$scope.studentCourseIdArray.length);
                    //$scope.availCourses = response.info;  // need to fetch all courses for given student.
                    //$scope.courses = "available";    // show available courses.
                }

                $scope.currentCourse = {};
                $scope.allQuizzesForCourse = [];
                $scope.oldQuizzesForCourse = [];
                $scope.studentQuizzesForCourse = [];
                $scope.studentQuizIdArray = [];
                $scope.my_quizzes = false;// my quiz tab
                $scope.old_quiz = 'none';// old quiz tab
                $scope.takeQuiz = 'none';// take quiz tab
                $scope.currentQuiz = {};
                originalQuiz = {};

                getAll(uid,type);

            });

        }


        $scope.showListCourse = function(){
            getAvailCourses();
            switchBasedOnCourse();
            $scope.show = "listCourses";
        }


        $scope.show = "";
        $scope.allQuizzesForCourse = [];
        $scope.oldQuizzesForCourse = [];
        $scope.studentQuizzesForCourse = [];
        $scope.studentQuizIdArray = [];
        $scope.my_quizzes = 'none';// my quiz tab
        $scope.old_quiz = 'none';// old quiz tab
        $scope.takeQuiz = 'none';// take quiz tab
        $scope.currentQuiz = {};
        originalQuiz = {};

        // This function assumes that quiz has not been deleted by professor.
        function setCurrentCourseQuizzes(){  // for quiz dashboard right panel
            console.log("inside get current course quizzes .");
            console.log($scope.currentCourse);

            var c = $scope.currentCourse;
            var flag = false;

            var studentObjectInCourse = {};
            if(angular.isDefined(c.studentArray)){
                for(i = 0; i < c.studentArray.length ; i++){
                    if(c.studentArray[i].student_id == uid){
                        angular.copy(c.studentArray[i],studentObjectInCourse);
                    }
                }
            }
            console.log("student object in course :",studentObjectInCourse);
            var studentQuizArray = [];
            if(angular.isDefined(studentObjectInCourse)){
                //studentQuizArray = studentObjectInCourse.studentQuizArray;
                angular.copy(studentObjectInCourse.studentQuizArray,studentQuizArray);
                angular.copy(studentObjectInCourse.studentQuizArray,$scope.studentQuizzesForCourse);
            }

            console.log("student quiz array :",$scope.studentQuizzesForCourse);
            var stuQuizIdArray = []; // stores id of quiz took by student
            if(studentObjectInCourse.studentQuizArray.length == 0){
                $scope.my_quizzes = 'none';
            }else{
                // store student quiz id in an array, then we do not show them in available quiz
                for(k = 0; k < studentObjectInCourse.studentQuizArray.length ; k++){
                    stuQuizIdArray.push(studentObjectInCourse.studentQuizArray[k].id);
                }
                angular.copy(stuQuizIdArray,$scope.studentQuizIdArray);
                //$scope.my_quizzes = true;
                flag = true;
            }


            if(angular.isDefined(c.quizArray)){
                var allQuizzes = [];
                allQuizzes = $scope.currentCourse.quizArray;
                console.log("All quizzes in this course "+ allQuizzes.length);
                console.log(allQuizzes);
                $scope.allQuizzesForCourse = [];  // all available quizzes not old and not already taken
                $scope.oldQuizzesForCourse = [];
                // Adding all quizes posted in the courses
                for(aq = 0; aq < allQuizzes.length ; aq++){
                    console.log(allQuizzes[aq].quiz.is_posted);
                   // console.log("is date :"+angular.isDate(new Date(allQuizzes[aq].quiz.due_date)));
                   //  console.log(new Date(allQuizzes[aq].quiz.due_date) >= new Date());
                    if(allQuizzes[aq].quiz.is_posted == true && ($scope.studentQuizIdArray.indexOf(allQuizzes[aq].quiz.id) == -1) &&
                        new Date(allQuizzes[aq].quiz.due_date) >= new Date() ){
                        $scope.allQuizzesForCourse.push(allQuizzes[aq]);  // available to take
                    }else if(new Date(allQuizzes[aq].quiz.due_date) < new Date()){
                        $scope.oldQuizzesForCourse.push(allQuizzes[aq]);  // old quizzes, those could have took by student's
                    }
                }
                console.log("All quizzes available for student to take :  $scope.allQuizzesForCourse");
                console.log($scope.allQuizzesForCourse);
                console.log("All quizzes available for student to take :  $scope.oldQuizzesForCourse");
                console.log($scope.oldQuizzesForCourse);
                console.log("All quizzes available for student to take :  $scope.studentQuizzesForCourse");
                console.log($scope.studentQuizzesForCourse);

                $scope.currentQuiz = {};        // unset the current quiz
                $scope.originalQuiz = {};

                switchBasedOnQuiz();             // switch quiz dashbaord

            }
            // old quizzes, which are old but cannot take compare if(today's date > date_due) && is_posted == true
            // available quizzes, are posted n student can take  if(today's date < date_due) && is_posted == true
            // quizzes submitted by student , from studentQuizArray
        }

        function switchBasedOnQuiz(){   // for quiz dashboard right panel
            var c = $scope.currentCourse;
            if(angular.isUndefined(c.quizArray)){
                console.log("Quizzes has not been created for this course yet.");
                $scope.show = "emptyDashboard";
            }else{
                $scope.show = "quizDashboard";
            }
        }


        function switchBasedOnTypeOfQuiz(){   // for quiz dashboard right panel
            var c = $scope.currentCourse;
            if(angular.isUndefined(c.quizArray)){
                console.log("Quizzes has not been created for this course yet.");
                $scope.show = "emptyDashboard";
            }else{
                $scope.show = "quizDashboard";
            }
        }


        function switchBasedOnCourse(){ // for enrollCourse page
            var c = $scope.availCourses;
            if(angular.isUndefined(c) || c == []){
                console.log("Courses not available.");
                $scope.courses = "not-available";
            }else{
                $scope.courses = "available";
            }
        }


        $scope.showOldQuiz = function(quiz_id){
            console.log("inside show old quiz");
            $scope.resetQuiz();
            console.log(quiz_id);
            $scope.old_quiz = quiz_id;

        }

        $scope.showMyQuiz = function(quiz_id){
            console.log("inside show my quiz ");
            $scope.resetQuiz();
            console.log("inside show old quiz");
            console.log(quiz_id);
            $scope.my_quizzes  = quiz_id;

        }

        $scope.resetQuiz = function(){
            // go to tab old Quizzes
            console.log("inside reset quiz ");
            $scope.currentQuiz = {};
            originalQuiz = {};
            $scope.old_quiz = 'none';
            $scope.takeQuiz = 'none';
            $scope.my_quizzes = 'none';
        }


        $scope.takeNewQuiz = function(e){
            console.log("inside take new quiz before editing");
            originalQuiz = {};
            angular.copy(e, originalQuiz);// copy ,  hash to originalQuiz and e will b different
            angular.copy(e, $scope.currentQuiz);
            //$scope.currentQuiz = e;  // assigning ,  hash to both current quiz and e
            $scope.takeQuiz = e.id;  // show div
        }

        $scope.setOption = function(prob_id,opt_id){
            console.log(" inside set option ");
            //console.log($parent.setOption);
            console.log(prob_id,opt_id);
            for(i=0;i < $scope.currentQuiz.quiz.problemArray.length; i++){
                if($scope.currentQuiz.quiz.problemArray[i].id == prob_id){
                    for( j = 0; j < $scope.currentQuiz.quiz.problemArray[i].optionArray.length; j ++){
                        if($scope.currentQuiz.quiz.problemArray[i].optionArray[j].opt_id == opt_id){
                            $scope.currentQuiz.quiz.problemArray[i].optionArray[j].is_correct = true;
                        }else{
                            $scope.currentQuiz.quiz.problemArray[i].optionArray[j].is_correct = false;

                        }
                    }
                }
            }
        }

        $scope.submitQuiz = function(){

            console.log("inside submit quiz after editing ")
            console.log(originalQuiz);
            console.log($scope.currentQuiz);
            //$scope.currentQuiz = {}; // unset the current quiz
            var quiz = {};
            quiz.id = $scope.currentQuiz.id;
            quiz.course_id = $scope.currentQuiz.quiz.course_id;
            quiz.is_posted = true;  // posted by student
            quiz.title = $scope.currentQuiz.quiz.title;
            quiz.due_date =  $scope.currentQuiz.quiz.due_date;
            quiz.last_modified = new Date();
            quiz.score = 0;
            quiz.problemArray = [];
            for(i = 0 ; i < $scope.currentQuiz.quiz.problemArray.length; i++) {
                console.log("Inside for loop, changing problem array ");
                var prob = {};
                prob.id = $scope.currentQuiz.quiz.problemArray[i].id;
                //console.log("prob id :"+prob.id);
                prob.type = $scope.currentQuiz.quiz.problemArray[i].type;
                //console.log("prob type :"+prob.type);
                prob.title = $scope.currentQuiz.quiz.problemArray[i].title;
                //console.log("prob title :"+prob.title);
                //console.log($scope.currentQuiz.problemArray[i].optionArray);
                prob.correctOptionIndex = $scope.currentQuiz.quiz.problemArray[i].correctOptionIndex;
                prob.optionArray = [];
                prob.score = 0;
                for (j = 0; j < $scope.currentQuiz.quiz.problemArray[i].optionArray.length; j++) {

                    var opt_id = $scope.currentQuiz.quiz.problemArray[i].optionArray[j].opt_id;
                    var opt_text = $scope.currentQuiz.quiz.problemArray[i].optionArray[j].opt_text;
                    var is_correct = $scope.currentQuiz.quiz.problemArray[i].optionArray[j].is_correct;

                    if(is_correct == true){
                        prob.studentAnswerIndex = j;
                    }

                    if (angular.equals(originalQuiz.quiz.problemArray[i].correctOptionIndex, j) &&
                        angular.equals(originalQuiz.quiz.problemArray[i].optionArray[j].is_correct, true)) {
                        prob.score = 5;
                        quiz.score = quiz.score + 5;
                    }
                    var option = {"opt_id": opt_id, "opt_text": opt_text, "is_correct": is_correct};
                    prob.optionArray.push(option);

                }
                quiz.problemArray.push(prob);

            }
                console.log("printing the quiz to insert or update.");
                console.log(quiz);

            /*{ id: '5482a8a7bc748acc1278e103',
             uid: '5482a01e45bf3124217ea53e',
             type: 'stud',
             quiz_id: 1,
             updatedQuiz:
             { id: 1,
             course_id: '5482a8a7bc748acc1278e103',
             is_posted: false,
             title: 'First quiz for english course',
             due_date: '2014-12-10T21:00:09.150Z',
             last_modified: '2014-12-07T18:55:14.582Z',
             score: 0,
             problemArray: [ [Object], [Object] ] },
             action: 'push' }*/
                var info = {};
                info.id = quiz.course_id;
                info.uid = uid;
                info.type = type;
                info.updatedQuiz = quiz;
                if($scope.studentQuizIdArray.indexOf(quiz.id) == -1){
                    console.log("push the quiz in studentQuizArray");
                    info.action = "push";
                    console.log(info);
                    StudentCourseService.update(info,function(response, status, headers, config){
                        console.log(response);
                    });
                    $scope.studentQuizzesForCourse.push(quiz);
                    $scope.studentQuizIdArray.push(quiz.id) ;
                    if($scope.allQuizzesForCourse.length > 0){
                        for(m = 0; m < $scope.allQuizzesForCourse.length; m++){
                            if($scope.allQuizzesForCourse[m].id == quiz.id){
                                $scope.allQuizzesForCourse.splice(m,1);
                            }
                        }
                    }else{
                        // show messages
                    }

                }else{
                    console.log("You have already took this quiz. ");
                    // student array does not contain this quiz, first time student taking this quiz, update in student Array
                }
                $scope.resetQuiz();
                //setCurrentCourseQuizzes();
        }

    }]);
