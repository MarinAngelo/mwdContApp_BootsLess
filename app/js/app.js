'use strict';

var adressApp = angular.module('adressApp', [
  'ngRoute',
  'adressAppControllers'
  ]); /*'ngResource' , 'firebase'*/

    adressApp.config(['$routeProvider', 
      function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'views/adressListe.html',
            controller: 'AdressListeCtrl'
        }).
        when('/adressNeu', {
            templateUrl: 'views/adressNeu.html',
            controller: 'AdressNeuCtrl'
        }).
        when('/:AdressName', {
            templateUrl: 'views/adressDetail.html',
            controller: 'AdressDetailCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    }]);