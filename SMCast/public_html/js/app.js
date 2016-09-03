(function () {
    var app = angular.module('admin', ['ngAnimate', 'ngRoute']);


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
        }]);

})();
