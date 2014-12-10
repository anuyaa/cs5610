/**
 * Created by Ankita on 11/13/2014.
 *
 * TODO.  when adding new option to any existing problem and select it, it unchecks the options from other problems.
 */
app.controller("CourseController", ["$scope", "$http","$state", "$location", "CourseService","RegistrationService","QuizService",
    function ($scope, $http,$state, $location,CourseService,RegistrationService,QuizService) {


        var uid = RegistrationService.getIdProperty();
        var type = RegistrationService.getTypeProperty();
        console.log("In courses controller " + uid);
        $scope.uid = uid;

        $scope.addSelection = 'no';
        $scope.newCourse = {};           // This field will be present in parent scope.
        $scope.currentCourse = {};
        $scope.allCourses = [];

        getAll(uid, type);

        $scope.createCourse = function () {
            console.log($scope);
            var name = $scope.newCourse.name;  // Here child scope will overwrite  newCourse object
            var desc = $scope.newCourse.desc;
            console.log(name + "--" + desc);
            var cinfo = {"id": uid, "type": type, "name": name, "desc": desc};
            createACourse(cinfo);
        }


        $scope.setAddCourse = function () {
            console.log(" I add course. ");
            $scope.addSelection = 'yes';  // this will show the create course page.
        }

        /*
         $scope.gotoSelected = function(state){
         console.log("In courses controller "+uid);
         $state.go(state);
         };*/

        //$scope.oneAtATime = true;

        function getAll(uid, type) {
            /*Get all courses for a user. */
            var user_info = {"id": uid, "type": type};
            CourseService.selectAll(user_info, function (response, status, headers, config) {

                console.log("get all " + response.info.length);
                if (response.error == 1 || response.info.length == 0) {
                    $scope.selection = 'not_exist';
                } else {


                    $scope.currentCourse = response.info[0];        // first course in the list:  current course
                    $scope.allCourses = response.info;              // all courses
                    console.log("all courses :", $scope.allCourses);
                    $scope.addSelection = 'no';
                    $scope.template = 'course';
                    $scope.selection = 'exist';
                    $scope.quiz = 'display';

                }
            });
        }


        function createACourse(cinfo) {
            CourseService.create(cinfo, function (response, status, headers, config) {
                console.log(response);
                if(response.error == 0){
                    console.log("courses exists 2",data.info);
                    $scope.quizArray = [];
                    getAll(uid, type);
                }else{
                    getAll(uid, type);
                }
                $scope.addSelection = 'no';
                $scope.template = 'course';
            });
        }


        $scope.getCourseInfo = function (c) {
            console.log("inside getCourse info ");
            console.log(c);

            /* get all quizzes for this course. if it return false no quiz , else display all quizzes .*/
            $scope.currentCourse = c;
            $scope.addSelection = 'no';  //  to add a course or not.
            $scope.template = 'course';  // to show or edit course.

            $scope.currentQuiz = {};
            $scope.currentQuiz.problemArray = [];

            getAllQuizzes(c);

        }


        // if removing using professor account , it should get deleted from professor and courses collection.
        // else it will be deleted from students collection too.
        // only prof can delete course.
        $scope.deleteCourse = function (c) {
            console.log(" inside delete info.");
            console.log(c);
            var ac = {"id": c._id,"name" : c.name, "description" : c.description, "type": type, "prof_id" : c.prof_id };
            CourseService.remove(ac, function (response, status, headers, config) {
                console.log(response);
                $scope.quizArray = [];
                if(response.error == 0){
                    console.log("courses deleted",response);
                    $scope.quizArray = [];
                    getAll(uid, type);
                }else{
                    getAll(uid, type);
                }
                $scope.addSelection = 'no';
                $scope.template = 'course';

            });
        }


        $scope.editCourse = function (c) {
            console.log(" inside edit info. ");
            console.log(c);
            var ac = {"c": c, "type": type};
            $scope.addSelection = 'no';
            $scope.template = 'edit';
        };


        $scope.updateCourse = function (c) {
            console.log(" inside update info. ");
            console.log(c);
            var ac = {"id": c._id,"name" : c.name, "description" : c.description, "type": type, "prof_id" : c.prof_id };
            CourseService.update(ac, function (response, status, headers, config) {
                console.log(response);
                if(response.error == 0){
                    console.log("courses deleted",response);
                    getAll(uid, type);

                }else{
                    getAll(uid, type);
                }
                $scope.addSelection = 'no';
                $scope.template = 'course';

            });
        };


        $scope.ddSelectOptions = [
            {
                text: 'Multiple Choice',
                value: 'mcq'
            }, {
                text: 'Multiple Answer',
                value: 'maq'
            }, {
                // Example of an option with the 'href' property
                text: 'Fill in the blank',
                value: 'fb'
            }
        ];



        $scope.allQuizzes = [];  // [ {course id, [quiz1, quiz2, quiz3} ]  for all courses
        $scope.courseQuizzes = [];   // for current course.
        $scope.currentQuiz = {};   // quiz  ,  {course_id ,  problemArray , quiz title, isEditable, dateDue, dateModified}
        //$scope.problemArray = [];
        //$scope.currentProblem = {};
        //$scope.currentProblem.optionArray = [];

        $scope.ddSelectSelected = {};

        var current_quiz_id ;   // current quiz id

        $scope.quiz = "show";
        $scope.createQuiz = function (c) {
            console.log(" inside create quiz. ");
           // var ac = {"c": c, "type": type};
            $scope.quiz = "create";                     // to show or hide createQuiz div,used in ng-switch
            //$scope.ddSelectSelected.value = 'mcq';    // Do not initialize drop down menu with mcq option.
            //console.log($scope.ddSelectSelected.value);
            $scope.problemDiv = false;                  // do not show create question template initially
            $scope.createOptionDiv = false;             // do not show create option template initially

            $scope.currentQuiz.course_id = $scope.currentCourse._id ;   /* current quiz is { course_id : '5646546' } */
            $scope.currentQuiz = {};
            $scope.duedt.dt = new Date();

            // These are used to add a new problem
            $scope.newProblem = {};
            $scope.newProblem.optionArr = [];
            $scope.newProblem.newOption = {};
            // TODO remeber to unset this
            $scope.currentQuiz.problemArray = [];                       /* set current quiz problem array is empty.
                                                                           this array is used for problem's for new quiz(do not have id) */


            $scope.ddSelectSelected = {};                               /* current problem type option selected is not specified. */

        };


        //=====================================================================================//

        // NEW Problem functions start here.
        $scope.divAddProblem = false;
        $scope.newProblem = {};
        $scope.newProblem.optionArr = [];
        $scope.newProblemOptionDiv = false;  // hide the create option template
        $scope.newProblem.newOption = {};

        $scope.createProblem = function () {
            console.log("create problem of type:" + $scope.ddSelectSelected.value);
            $scope.divAddProblem = true;                  /*  show create question template */
            /* on the basis of drop down value selected assign current problem : prob_type  */
           /* if ($scope.ddSelectSelected.value == 'mcq') {
                $scope.newProblem.prob_type = "radio";
            } else if ($scope.ddSelectSelected.value == 'maq') {
                $scope.newProblem.prob_type = "check";
            } else if ($scope.currentProblem.prob_type = "fb") {
                $scope.newProblem.prob_type = "text";
            }*/

            $scope.newProblem.prob_type = "radio";
            $scope.optionErr = 'newProbErr';
        }

        $scope.addOptionsToProblem = function(){
            console.log("inside add option for a new problem.");
            $scope.optionErr = false;               //hide option error.
            $scope.newProblemOptionDiv = true;      // show the create option template

        }

        $scope.setRadioValue = function(value){
            console.log("inside set radio value.");
            console.log(value);
            $scope.newProblem.correctOption = value;

            console.log($scope.newProblem.optionArr);
            if(value == true){
                for (i = 0; i < $scope.newProblem.optionArr.length; i++) {
                    // make other options to false.
                    $scope.newProblem.optionArr[i].is_correct = false;
                }
            }
        }

        $scope.addThisOptionToProblem = function(){
            console.log("inside add this option for a new problem.");
            console.log($scope.newProblem);
            var o_text = $scope.newProblem.newOption.optText ;
            var o_arr = $scope.newProblem.optionArr;
            var flag = false;


            if(typeof o_text !== 'undefined' || o_text != null){

                console.log("printing o_arr ");
                console.log(o_arr);
                console.log("printing new option text ");
                console.log(o_text);
                for (i = 0; i < o_arr.length; i++) {
                    // check if option already exist.
                    console.log(o_arr[i]);
                    if (o_arr[i].opt_text == o_text) {
                        flag = true;  // option already exist.
                        break;
                    }
                }


                if( flag == false && o_text.length != 0){
                    var opt_id = $scope.newProblem.optionArr.length + 1;
                    var isCorrect = true;
                    console.log("New option is checked "+$scope.newProblem.correctOption);
                    if($scope.newProblem.correctOption != true){
                        isCorrect = false;
                    }
                    var op = {"opt_id" :  opt_id, opt_text : o_text,   "is_correct" : isCorrect };
                    $scope.newProblem.optionArr.push(op);    // push in the options array for new prob
                    $scope.newProblem.newOption = {};        // clear the new option
                    $scope.newProblem.correctOption = false;  // clear the correct option.
                    $scope.newProblemOptionDiv = false;      // hide the create option div
                }else{
                    $scope.newProblem.newOption.optText = "Option already exist.";
                }


            }
        }

        $scope.removeThisOptionfromProblem = function(opt_id){
            console.log("inside remove this option for a new problem.");
            var oindex;
            for(o = 0; o < $scope.newProblem.optionArr.length; o++){
                if(opt_id == $scope.newProblem.optionArr[o].opt_id){
                    oindex = o;
                    break;
                }
            }
            console.log(oindex);
            $scope.newProblem.optionArr.splice(oindex,1);  // remove option from current problem's option array
            if($scope.newProblem.optionArr.length == 0){
                $scope.optionErr = 'newProbErr';
            }
        }


      //  $scope.tempProblemArray = [];  // this array is used only if it's a completely new quiz
        $scope.optionErr = null;
        $scope.titleStyleErr = {};
        $scope.showSaveNPost = 'no';  // show save an due date  options
        $scope.addNewProblem = function(){
            console.log("inside adding new problem to quiz.");
            // make some checks
            // $scope.newProblem should not be empty;
            // $scope.newProblem.title != null || $scope.newProblem.optionArr != {};
            // Atleast one option should be checked.
            var prob = $scope.newProblem;
            if(prob !== 'undefined' && prob!==null && prob != {}){

                if(typeof prob.title  !== 'undefined' && prob.title !== null ){

                    if( prob.title.length != 0){
                        if(prob.optionArr != 0){
                            var oneOptionSet = false;
                            // check atleast one of the option is set, if not set the first one.
                            for(o = 0; o < prob.optionArr.length; o++){
                                if(true == prob.optionArr[o].is_correct){
                                    oneOptionSet = true;
                                    break;
                                }
                            }

                            if(oneOptionSet == false){
                                prob.optionArr[0].is_correct = true;
                            }

                            var probToAdd = {};
                            probToAdd.type = prob.prob_type;
                            probToAdd.title = angular.lowercase(prob.title);
                            probToAdd.optionArray =  prob.optionArr;
                            console.log(prob);


                            if(!angular.isUndefined($scope.currentQuiz) && angular.isDefined($scope.currentQuiz.id)){
                                // If quiz exist , just add this problem to problemArray of quiz.
                                console.log("current quiz is defined");
                                probToAdd.id = $scope.currentQuiz.problemArray.length + 1;
                                $scope.currentQuiz.problemArray.push(probToAdd);
                                console.log($scope.currentQuiz.problemArray);

                                $scope.divAddProblem = false;                  /*  hide create question template */
                                $scope.newProblem = {};
                                $scope.newProblem.optionArr = [];
                                $scope.newProblem.newOption = {};
                            }else{
                                // if not exist, add it to temprory problem array.
                                console.log("current quiz not defined, it's a new quiz");
                                probToAdd.id = $scope.currentQuiz.problemArray.length + 1;  // set the id of the problem based on problem array
                                $scope.currentQuiz.problemArray.push(probToAdd);  // add the problem to new current quiz

                                console.log($scope.currentQuiz.problemArray.length);

                                $scope.divAddProblem = false;                  /*  hide create question template */
                                $scope.newProblem = {};
                                $scope.newProblem.optionArr = [];
                                $scope.newProblem.newOption = {};
                                console.log("showing save n post buttin");
                                $scope.showSaveNPost = 'yes';  // show save an due date  options
                                console.log($scope.showSaveNPost);
                            }

                        }else{
                            // error please add some options.
                            console.log("Error : options not added.");
                            $scope.optionErr = 'newProbErr';
                        }
                    }else{
                        console.log("Error : title is empty.");
                        $scope.titleStyleErr = {"color":"red"};
                        $scope.newProblem.title = "Add Question First.";
                    }

                }else{
                    // error please add the question.
                    console.log("Error : title is undefined.");
                    $scope.titleStyleErr = {"color":"red"};
                    $scope.newProblem.title = "Add Question First.";
                }
            }else{
                // error plz add a problem.
            }

        }

        $scope.removeProblem = function(prob_id){
            console.log("inside delete problem.");
            console.log(prob_id);
            var pindex ;
            for(p = 0;p < $scope.currentQuiz.problemArray.length ; p++){
                if(prob_id == $scope.currentQuiz.problemArray[p].id){
                    pindex = p;
                    break;
                }
            }

            console.log(pindex);
            $scope.currentQuiz.problemArray.splice(pindex,1);  // remove option from current problem's option array

        }

        // NEW Problems functions end here.
        //=====================================================================================//
        // TO add option to a problem
        $scope.createOptionDiv = false;
        $scope.newOption = {};     /* initialize the create option object as empty */
        $scope.addOptions = function (prob_id) {
            console.log(" inside add option for problem. ");
            console.log( $scope.currentQuiz );
            console.log(prob_id);
            $scope.createOptionDiv = prob_id;      // show the create option template
            $scope.newOption = {};
            $scope.optionErr = null;

        }

        /* TODO on select of new option it unselects the other problems option. */
        /* adding a newly created option for the current problem */
        $scope.addThisOption = function (prob_id) {
            console.log(" inside add this option for current problem." );
            console.log("adding option to problem "+prob_id );
            console.log( "the new option :" );
            console.log($scope.newOption);
            console.log($scope.newOption.isCorrect);  // verify against true

            var flag = false;

            var pindex ;
            for(p = 0;p < $scope.currentQuiz.problemArray.length ; p++){
                if(prob_id == $scope.currentQuiz.problemArray[p].id){
                    pindex = p;
                    break;
                }
            }
            var o_arr = $scope.currentQuiz.problemArray[pindex].optionArray;      /* get the problem where probid is prob id  array for current prob */
            var o_text = $scope.newOption.optText;

            if (typeof o_text !== 'undefined' || o_text != null) {

                for (o in o_arr) {
                    // check if option already exist.
                    if (o.opt_text == o_text) {
                        flag = true;  // option already exist.
                        $scope.newOption.optText = "Option already exists.";
                        break;
                    }
                }
                // if the option does not exist and it's not defined
                if (o_text.length != 0 && flag == false) {

                    console.log("new option : " + $scope.newOption);

                    if($scope.newOption.isCorrect != true) {
                        $scope.newOption.isCorrect = false;
                    }else{

                       // $scope.newOption.isCorrect = true;
                        for (o = 0; o < $scope.currentQuiz.problemArray[pindex].optionArray.length; o++) {
                            // check if option already exist.
                            if ($scope.currentQuiz.problemArray[pindex].optionArray[o].is_correct == true) {
                                $scope.currentQuiz.problemArray[pindex].optionArray[o].is_correct = false;
                                console.log("making other options to false.");
                            }
                        }
                    }

                    $scope.newOption.opt_id = o_arr.length + 1;                     // set the id of new option

                    var op = {opt_id :  $scope.newOption.opt_id, opt_text: $scope.newOption.optText,is_correct : $scope.newOption.isCorrect };
                    $scope.currentQuiz.problemArray[pindex].optionArray.push(op);                                   // add the option to option array

                    $scope.createOptionDiv = null;                                // hide the create option div

                    console.log($scope.currentQuiz.problemArray[pindex]);
                    console.log($scope.currentQuiz);

                }


            }


        }


        $scope.removeOption = function (prob_id, opt_id) {
            console.log("inside remove option .");
            console.log(prob_id+" --- "+opt_id);
            var pindex ;
            var oindex ;
            for(p = 0;p < $scope.currentQuiz.problemArray.length ; p++){
                if(prob_id == $scope.currentQuiz.problemArray[p].id){
                    pindex = p;
                    break;
                }
            }
            for(o = 0; o < $scope.currentQuiz.problemArray[pindex].optionArray.length; o++){
                if(opt_id == $scope.currentQuiz.problemArray[pindex].optionArray[o].opt_id){
                    oindex = o;
                }
            }
            console.log(pindex,oindex);
            $scope.currentQuiz.problemArray[pindex].optionArray.splice(oindex,1);  // remove option from current problem's option array

            console.log("problem still contains options ");
            console.log($scope.currentQuiz.problemArray[pindex].optionArray);
            if($scope.currentQuiz.problemArray[pindex].optionArray.length != 0){
                var oneOptionSet = false;
                // check atleast one of the option is set, if not set the first one.
                for(o = 0; o < $scope.currentQuiz.problemArray[pindex].optionArray.length; o++){
                    if(true == $scope.currentQuiz.problemArray[pindex].optionArray[o].is_correct){
                        oneOptionSet = true;
                        break;
                    }
                }
                console.log(oneOptionSet);
                if(oneOptionSet == false){
                    $scope.currentQuiz.problemArray[pindex].optionArray[0].is_correct = true;  // does not display but changed the model
                }
                console.log($scope.currentQuiz.problemArray[pindex].optionArray);

            }else{
                console.log("Error : options not added.");
                $scope.optionErr = $scope.currentQuiz.problemArray[pindex].id;   //TODO need for each problem in problem array
            }



        }


        $scope.setOption = function(prob_id,oid){   // need the quiz_id too
                console.log("inside set option");
                console.log(prob_id,oid);
                var nm = "group_"+prob_id;
                console.log($scope.nm);
                console.log($scope.group_1);

        }


       // adding prob to alreadt existing quiz
        $scope.addProblem = function () {

            var prob = $scope.currentProblem;
            if (typeof prob !== 'undefined' || prob === null) {

                console.log("  problem title : " + prob.prob_title);
                console.log("  problem option array :" );
                console.log(prob.optionArray);
                console.log(prob);


                var all_unselected = true;
                var o_arr = prob.optionArray;   // check if all the options are unselected , then show error msgdo not proceed
                for(var i = 0; i < o_arr.length;i++){
                    console.log(o_arr[i].optSelected);
                    if(o_arr[i].optSelected != false){
                        all_unselected = false;
                        break;
                    }
                }

                if(all_unselected){
                    // do not proceed show error msg somewhere
                }

                // optionArray: Array[2], prob_type: "radio", prob_title: "title 1",prob_id: 1,
                var push_prob = { 'prob' : prob};        // to access this problem in array, we will need prob.prob_id
                $scope.problemArray.push(push_prob);     // push current prob, with atleast one correct option.
                $scope.problemDiv = false;                  /*  hide create question template */
                console.log($scope.currentCourse);

            }


        }


        /* problemArray , quiz title, isEditable, dateDue, dateModified */

        $scope.quizArray = [];
        $scope.saveQuiz = function () {
            console.log("inside save quiz .");
            //console.log($scope.allQuizzes);
           // console.log($scope.courseQuizzes);

            console.log($scope.currentQuiz);
            console.log("print date");
          //  console.log($scope.dueDate);

            console.log($scope.duedt.dt);

           // console.log("printing problem array of current quiz ");
           // console.log($scope.currentQuiz.problemArray.length);
          /* check if quiz has title, date due,
             dateModified current date. */
            var course_id = $scope.currentCourse._id;
            var quiz = {};
            quiz.id = $scope.currentQuiz.id;
            quiz.course_id = course_id;
            quiz.is_posted = false;
            quiz.title = $scope.currentQuiz.title;  // verify if title is set
            quiz.due_date =  $scope.duedt.dt; // should be scope.dt
            quiz.last_modified = new Date();
            quiz.problemArray = [];
            for(i = 0 ; i < $scope.currentQuiz.problemArray.length; i++){
                console.log("Inside for loop , creating problem array ");
                var prob = {};
                prob.id = $scope.currentQuiz.problemArray[i].id;
                //console.log("prob id :"+prob.id);
                prob.type = $scope.currentQuiz.problemArray[i].type;
                //console.log("prob type :"+prob.type);
                prob.title = $scope.currentQuiz.problemArray[i].title;
                //console.log("prob title :"+prob.title);
                //console.log($scope.currentQuiz.problemArray[i].optionArray);
                prob.optionArray = [];
                for(j=0; j < $scope.currentQuiz.problemArray[i].optionArray.length; j++){

                    var opt_id = $scope.currentQuiz.problemArray[i].optionArray[j].opt_id;
                    var opt_text = $scope.currentQuiz.problemArray[i].optionArray[j].opt_text;
                    var is_correct = $scope.currentQuiz.problemArray[i].optionArray[j].is_correct;
                    if(is_correct == true){
                        prob.correctOptionIndex = j;
                    }
                    var option = { "opt_id" : opt_id, "opt_text" : opt_text, "is_correct" : is_correct};
                    prob.optionArray.push(option);

                }

                quiz.problemArray.push(prob);
            }

            console.log("printing the quiz to insert or update.");
            console.log(quiz);
            //console.log(quiz.id);

            //quiz.id = 2 ; // suppose we selected quiz id 2
            if(angular.isUndefined(quiz.id)){
                // its a new quiz,
                console.log("Its a new quiz.so create");
                quiz.id = $scope.quizArray.length + 1;  // assign quiz id to the quiz.
                var info = {};
                info.course_id = course_id;
                info.quiz_id = quiz.id;
                info.updatedQuiz = quiz;
                QuizService.create(info, function (response, status, headers, config) {
                    console.log("Returned to controller . ");

                });
            }else {
                // quiz already exist.
                console.log("existing quiz.so update");
                var info = {};
                info.course_id = course_id;
                info.quiz_id = quiz.id;
                info.updatedQuiz = quiz;
                QuizService.update(info, function (response, status, headers, config) {
                    console.log("Returned to controller after update. ");
                });
            }

            $scope.currentQuiz = {};
            $scope.showSaveNPost = 'no';  // show save an due date  options
            getAllQuizzes($scope.currentCourse); // update the quiz array

        }


        $scope.deleteQuiz = function (quiz_id) {
            console.log("inside delete quiz .");
            console.log("deleting quiz num :"+quiz_id);
            var course_id = $scope.currentCourse._id;
            //var quiz_id = 2;
            var qinfo = {};
            qinfo.course_id = course_id;
            qinfo.quiz_id = quiz_id;
            QuizService.remove(qinfo, function (response, status, headers, config) {
                console.log("Returned to controller after delete. ");
                console.log(response);
                console.log(status);

                getAllQuizzes($scope.currentCourse); // update the quiz array
            });

        }


        $scope.updateQuiz = function () {
            console.log("inside update quiz .");

            var quiz = {};
            quiz.course_id = $scope.currentCourse._id;
            quiz.id = 2;
            quiz.title = " First Ever quiz title !! ".toString();;
            quiz.is_posted = false;
            quiz.due_date =  new Date("2014-12-12 00:00:00");
            quiz.last_modified = new Date();
            quiz.problemArray = [];
            var prob = {};
            prob.id = 1;
            prob.type = "radio";
            prob.title = "Red , blue, yellow ".toString();
            prob.optionArray =  [];
            var option_1 = { "opt_id" : 1, "opt_text" : "red".toString() , "is_correct" : true};
            var option_2 = { "opt_id" : 2, "opt_text" : "blue".toString() , "is_correct" : false};
            var option_3 = { "opt_id" : 3, "opt_text" : "yellow".toString() , "is_correct" : false};
            prob.optionArray.push(option_1);
            prob.optionArray.push(option_2);
            prob.optionArray.push(option_3);
            quiz.problemArray.push(prob);

            console.log(quiz);

            if(quiz.is_posted != true){ /* quiz not posted */
                var course_id = $scope.currentCourse._id;
                var quiz_id = 2;
                var info = {};
                info.course_id = course_id;
                info.quiz_id = quiz_id;
                info.updatedQuiz = quiz;
                QuizService.update(info, function (response, status, headers, config) {
                    console.log("Returned to controller after delete. ");
                });
            }else{
                console.log("quiz already posted. could not make changes. ");
            }


        }


        $scope.saveNPostQuiz = function () {
            console.log("inside save n post quiz .");

            //console.log($scope.allQuizzes);
            // console.log($scope.courseQuizzes);

            console.log($scope.currentQuiz);
            console.log("print date");
            //  console.log($scope.dueDate);

            console.log($scope.duedt.dt);

            // console.log("printing problem array of current quiz ");
            // console.log($scope.currentQuiz.problemArray.length);
            /* check if quiz has title, date due,
             dateModified current date. */
            var course_id = $scope.currentCourse._id;
            var quiz = {};
            quiz.id = $scope.currentQuiz.id;
            quiz.course_id = course_id;
            quiz.is_posted = true;
            quiz.title = $scope.currentQuiz.title;  // verify if title is set
            quiz.due_date =  $scope.duedt.dt; // should be scope.dt
            quiz.last_modified = new Date();
            quiz.problemArray = [];
            for(i = 0 ; i < $scope.currentQuiz.problemArray.length; i++){
                console.log("Inside for loop , creating problem array ");
                var prob = {};
                prob.id = $scope.currentQuiz.problemArray[i].id;
                //console.log("prob id :"+prob.id);
                prob.type = $scope.currentQuiz.problemArray[i].type;
                //console.log("prob type :"+prob.type);
                prob.title = $scope.currentQuiz.problemArray[i].title;
                //console.log("prob title :"+prob.title);
                //console.log($scope.currentQuiz.problemArray[i].optionArray);
                prob.optionArray = [];
                prob.correctOptionIndex = 0;
                for(j=0; j < $scope.currentQuiz.problemArray[i].optionArray.length; j++){

                    var opt_id = $scope.currentQuiz.problemArray[i].optionArray[j].opt_id;
                    var opt_text = $scope.currentQuiz.problemArray[i].optionArray[j].opt_text;
                    var is_correct = $scope.currentQuiz.problemArray[i].optionArray[j].is_correct;
                    if(is_correct == true){
                        prob.correctOptionIndex = j;
                    }
                    var option = { "opt_id" : opt_id, "opt_text" : opt_text, "is_correct" : is_correct};
                    prob.optionArray.push(option);

                }

                quiz.problemArray.push(prob);
            }

            console.log("printing the quiz to insert or update.");
            console.log(quiz);
            //console.log(quiz.id);

            //quiz.id = 2 ; // suppose we selected quiz id 2
            if(angular.isUndefined(quiz.id)){
                // its a new quiz,
                console.log("Its a new quiz.so create , in save n post .");
                quiz.id = $scope.quizArray.length + 1;  // assign quiz id to the quiz.
                var info = {};
                info.course_id = course_id;
                info.quiz_id = quiz.id;
                info.updatedQuiz = quiz;
                QuizService.create(info, function (response, status, headers, config) {
                    console.log("Returned to controller . ");

                });
            }else {
                // quiz already exist.
                console.log("existing quiz.so update, in save n post");
                var info = {};
                info.course_id = course_id;
                info.quiz_id = quiz.id;
                info.updatedQuiz = quiz;
                QuizService.update(info, function (response, status, headers, config) {
                    console.log("Returned to controller after update. ");
                });
            }

            $scope.currentQuiz = {};
            $scope.showSaveNPost = 'no';  // show save an due date  options
            getAllQuizzes($scope.currentCourse); // update the quiz array

        }


        $scope.isQuizSaved = "no";
        $scope.selectQuiz = function (e) {
            console.log("inside select quiz.");
            console.log(e);
            $scope.currentQuiz = e.quiz;
            var quiz = e.quiz;
            $scope.quiz = "displayAQuiz";
            if(quiz.is_posted == true){
                // quiz should have only delete option.
                $scope.isQuizSaved = "yes";
            }else{
                // quiz not posted yet, so it should have save and saveNPost option
                $scope.isQuizSaved = "no";
                $scope.duedt.dt = quiz.due_date;  // set due date on the calender
            }
        }

        function getAllQuizzes(c){
            console.log("inside get All quizzes. ");
            var info = {};
            info.course_id = c._id;
            QuizService.selectAll(info, function (response, status, headers, config) {
                console.log(" Returned to controller after select All. ");
                console.log(response);
               // return response;
                $scope.quizArray = [];
                $scope.currentQuiz = {};  // unset current quiz variable.
                if(response.error == 0 && response.info.length != 0){
                    $scope.quizArray = response.info;
                    $scope.quiz = "display";
                }else if(response.error = 1 && response.info == "not_exist"){
                    // show the course page with ng-switch quiz = create
                    $scope.quizArray = [];
                    $scope.createQuiz();
                   // $scope.quiz = "create";
                }
            });
        }


        /* date picker code controller. */
        $scope.dueDate = new Date();
        $scope.duedt = {};
        $scope.duedt.dt;
        $scope.today = function() {
            $scope.duedt.dt = new Date();
        };
        $scope.today();

        /*$scope.clear = function () {
            $scope.dt = null;
        };*/

        // Disable weekend selection
       /* $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };*/

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.mydp = {};
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            if (typeof($scope.mydp.opened) === 'undefined'){
                $scope.mydp = {};
            }
            $scope.mydp.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

     }]);


