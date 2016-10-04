(function () {
    var app = angular.module('casting', ['ngAnimate', 'ngRoute']);


    // configure our routes
    app.config(function ($routeProvider) {
        $routeProvider

                // route for the home page
                .when('/', {
                    templateUrl: '/cast/pages/default.html',
                    controller: 'DefaultController'
                }).when('/pub', {
            templateUrl: '/cast/pages/publisher.html',
            controller: 'PublisherController'
        }).when('/sub', {
            templateUrl: '/cast/pages/subscriber.html',
            controller: 'SubscriberController'
        }).when('/chat', {
            templateUrl: '/cast/pages/chat.html',
            controller: 'ChatController'
        }).
                otherwise({
                    redirectTo: '/'
                });
    });


    //Filters
    app.filter("trustUrl", ['$sce', function ($sce) {
            return function (recordingUrl) {
                return $sce.trustAsResourceUrl(recordingUrl);
            };
        }]);


    //Controllers
    app.controller('DefaultController', function () {
    });

    app.controller('PublisherController', ['$http', function ($http) {
            
            var publisher = this;
            
            publisher.startLiveStream = function (){
               jqcc.ccbroadcast.init('0');
            };
            
    }]);

    app.controller('SubscriberController', ['$http', function ($http) {
            var subscriber = this;
            subscriber.streams = [];
            
            subscriber.init = function () {
                $http({
                    method: 'GET',
                    url: '/php/getbroadcasts.php'
                }).then(function successCallback(response) {
                    subscriber.streams = response.data;
                }, function errorCallback(response) {
                    alert('error fetching broadcasts');
                });
            };
            
            subscriber.viewStream = function(streamID){
              jqcc.ccbroadcast.accept('0',streamID);  
            };
    }]);

    app.controller('ChatController',  ['$http', function ($http) {
            var chat = this;
            var userID = '0';
            
            chat.chatwith = function(user){
                alert(user);
                jqcc.cometchat.chatWith(user);
            };
    }]);


})();
