var app = angular.module('myApp', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'home.html'
        })
        .when('/subjects', {
            templateUrl: 'subjects.html',
            controller: 'subjectsCtrl'
        })
        .when('/quiz/:id/:name', {
            templateUrl: 'quiz-app.html',
            controller: 'quizsCtrl'
        })
});

app.controller('subjectsCtrl', function ($scope, $http) {
    $scope.list_subject = [];
    $http.get('db/Subjects.js').then(function (res) {
        $scope.list_subject = res.data;
    });
});
app.controller('quizsCtrl', function ($scope, $http, $routeParams, quizFactory) {
    $http.get('db/Quizs/' + $routeParams.id + '.js').then(function (res) {
        // $scope.list_subject = res.data;
        quizFactory.questions = res.data;
    });
});


app.directive('quizfpoly', function (quizFactory, $routeParams) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'template_quiz.html',
        link: function (scope, elem, attrs) {
            scope.start = function () {
                quizFactory.getQuestions().then(function () {
                    scope.subjectsName = $routeParams.name;
                    scope.id = 1;
                    scope.quizOver = false;// chua hoan thanh
                    scope.inProgess = true;
                    scope.getQuestion();
                });

            };
            scope.reset = function () {
                scope.inProgess = false;
                scope.score = 0;
            };
            scope.getQuestion = function () {
                var quiz = quizFactory.getQuestion(scope.id);
                if (quiz) {
                    scope.question = quiz.Text;
                    scope.options = quiz.Answers;
                    scope.answer = quiz.AnswerId;
                    scope.answerMode = true;

                } else {
                    scope.quizOver = true;
                }

            }
            scope.checkAnswer = function () {
                // alert('answer');
                if (!$('input[name = answer]:checked').length) return;
                var ans = $('input[name = answer]:checked').val();
                if (ans == scope.answer) {
                    //alert('dung')
                    scope.score++;
                    scope.correctAns = true;
                } else {
                    // alert('sai')
                    scope.correctAns = false;
                }
                scope.answerMode = false;
            };
            scope.nextQuestion = function () {
                scope.id++;
                scope.getQuestion();
            }
            scope.reset();
        }
    }
});
app.factory('quizFactory', function ($http, $routeParams) {
    // $http.get('db/Quizs/ADAV.js').then(function (res) {
    //     questions = res.data;
    //     alert(questions.length);
    // });

    return {
        getQuestions: function () {
            return $http.get('db/Quizs/' + $routeParams.id + '.js').then(function (res) {
                questions = res.data;
            });
        },
        getQuestion: function (id) {
            var ramdomItem = questions[Math.floor(Math.random() * questions.length)];
            var count = questions.length;
            if (count > 10) {
                count = 11;
            }

            if (id < count) {
                return ramdomItem;
            } else {
                return false;
            }

        }
    }
});

