'use strict';

var adressApp = angular.module('adressApp', [
  'ngRoute',
  'adressAppControllers'
  // 'adressAppFilters'
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
        //wenn in der URL als Parameter ein Name erscheint dann....
        when('/:AdressName', {
            templateUrl: 'views/adressDetail.html',
            controller: 'AdressDetailCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    }]);