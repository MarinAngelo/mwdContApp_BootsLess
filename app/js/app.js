'use strict';

angular.module('adressApp', ['ngRoute']);
  app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .when('/profilDetails', {
        templateUrl: 'views/profilDetails.html'
      })
      .when('/profilNeu', {
        templateUrl: 'views/profilNeu.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

