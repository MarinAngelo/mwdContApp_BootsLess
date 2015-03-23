'use strict';

angular.module('adressApp', ['ngRoute', 'adresser'])
.config(['$routeProvider', 
      function($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'views/adressListe.html',
            controller: 'ListController'
        })
        .when('/adressNeu', {
            templateUrl: 'views/adressNeu.html',
            controller: 'FormController'
        })
        .when('/:AdressName', {
            templateUrl: 'views/adressDetail.html',
            controller: 'DetailController'
        })
        .otherwise({
            redirectTo: '/'
        });
    }]);

  