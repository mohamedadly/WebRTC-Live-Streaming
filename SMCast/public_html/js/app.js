(function () {
    var app = angular.module('casting', ['ngRoute']);


    //Kurento WS
    var ws = new WebSocket('wss://' + 'kms.searchandmap.com:8443' + '/cast');
    var webRtcPeer;
    window.onbeforeunload = function () {
        ws.close();
    };
    ws.onmessage = function (message) {
        var parsedMessage = JSON.parse(message.data);
        console.info('Received message: ' + message.data);

        switch (parsedMessage.id) {
            case 'presenterResponse':
                presenterResponse(parsedMessage);
                break;
            case 'viewerResponse':
                viewerResponse(parsedMessage);
                break;
            case 'stopCommunication':
                dispose();
                break;
            case 'iceCandidate':
                webRtcPeer.addIceCandidate(parsedMessage.candidate)
                break;
            default:
                console.error('Unrecognized message', parsedMessage);
        }
    };
    function presenterResponse(message) {
        if (message.response != 'accepted') {
            var errorMsg = message.message ? message.message : 'Unknow error';
            console.warn('Call not accepted for the following reason: ' + errorMsg);
            dispose();
        } else {
            webRtcPeer.processAnswer(message.sdpAnswer);
        }
    }
    function viewerResponse(message) {
        if (message.response != 'accepted') {
            var errorMsg = message.message ? message.message : 'Unknow error';
            console.warn('Call not accepted for the following reason: ' + errorMsg);
            dispose();
        } else {
            webRtcPeer.processAnswer(message.sdpAnswer);
        }
    }
    function onOfferPresenter(error, offerSdp) {
        if (error)
            return onError(error);

        var message = {
            id: 'presenter',
            sdpOffer: offerSdp
        };
        sendMessage(message);
    }
    function onIceCandidate(candidate) {
        console.log('Local candidate' + JSON.stringify(candidate));

        var message = {
            id: 'onIceCandidate',
            candidate: candidate
        };
        sendMessage(message);
    }

    function stop() {
        if (webRtcPeer) {
            var message = {
                id: 'stop'
            };
            sendMessage(message);
            dispose();
        }
    }

    function dispose() {
        if (webRtcPeer) {
            webRtcPeer.dispose();
            webRtcPeer = null;
        }
    }

    function sendMessage(message) {
        var jsonMessage = JSON.stringify(message);
        console.log('Senging message: ' + jsonMessage);
        ws.send(jsonMessage);
    }

    // configure our routes
    app.config(function ($routeProvider) {
        $routeProvider

                // route for the home page
                .when('/', {
                    templateUrl: 'pages/default.html',
                    controller: 'DefaultController'
                }).when('/pub', {
            templateUrl: 'pages/publisher.html',
            controller: 'PublisherController'
        }).when('/sub', {
            templateUrl: 'pages/subscriber.html',
            controller: 'SubscriberController'
        }).otherwise({
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
            var video = document.getElementById('localvideo');

            publisher.startLiveStream = function () {
                if (!webRtcPeer) {
                    var options = {
                        localVideo: video,
                        onicecandidate: onIceCandidate
                    }

                    webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function (error) {
                        if (error)
                            return onError(error);

                        this.generateOffer(onOfferPresenter);
                    });
                }
            };

        }]);

    app.controller('SubscriberController', ['$http', function ($http) {
            var subscriber = this;

            subscriber.viewStream = function (streamID) {
                
            };
        }]);
    
})();
