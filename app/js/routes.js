'use strict';

angular.module('adressApp')
.config(['$routeProvider', 
      function($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'views/adressListe.html',
            controller: 'ListController',
            
        })
        .when('/adressNeu', {
            templateUrl: 'views/adressNeu.html',
            controller: 'FormController'
        })
         //wenn in der URL als Parameter ein Name erscheint dann....-> was auch immer hinter dem #/ erscheint
         // wird der Variablen "AdressName" zugeordnet? .. und den $routeParams übergeben somit die Variable
         // dann im Controller weiter verwendet werden kann.
        .when('/:ContactKey', {
            templateUrl: 'views/adressDetail.html',
            controller: 'DetailController'
        })
        .otherwise({
            redirectTo: '/'
        });
    }]);