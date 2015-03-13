'use strict';

angular.module('adressApp', ['ngRoute'])
.config(['$routeProvider', 
      function($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'views/adressListe.html',
            controller: 'AdressListeCtrl'
        })
        .when('/adressNeu', {
            templateUrl: 'views/adressNeu.html',
            controller: 'AdressNeuCtrl'
        })
         //wenn in der URL als Parameter ein Name erscheint dann....-> was auch immer hinter dem Slasch erscheint
         // wird der Variablen "AdressName" zugeordnet? .. und den $routeParams übergeben somit die Variable
         // dann im Controller weiter verwendet werden kann.
        .when('/:AdressName', {
            templateUrl: 'views/adressDetail.html',
            controller: 'AdressDetailCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    }]);

  