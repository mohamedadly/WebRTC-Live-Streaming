(function () {
    var app = angular.module('casting', ['ngAnimate', 'ngRoute']);


    // configure our routes
    app.config(function ($routeProvider) {
        $routeProvider

                // route for the home page
                .when('/', {
                    templateUrl: '/pages/default.html',
                    controller: 'DefaultController'
                }).when('/pub', {
            templateUrl: '/pages/publisher.html',
            controller: 'PublisherController'
        }).when('/sub', {
            templateUrl: '/pages/subscriber.html',
            controller: 'SubscriberController'
        }).when('/chat', {
            templateUrl: '/pages/chat.html',
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
                var params = {"chatroommode":"0",
                "to": "0",
                "session" :"ddbaba372e67bf5137c11c1db21c320e"};
               jqcc.ccbroadcast.init(params);
            };
            
    }]);

    app.controller('SubscriberController', ['$http', function ($http) {
            var subscriber = this;
            
            subscriber.viewStream = function(streamID){
                var params = {"to": "0",
                "grp" :streamID};
              jqcc.ccbroadcast.accept(params);  
            };
    }]);

    app.controller('ChatController',  ['$http', function ($http) {
            var chat = this;
            
            chat.chatwith = function(user){
                jqcc.cometchat.chatWith(user);
            };
    }]);


})();
