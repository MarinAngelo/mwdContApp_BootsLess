'use strict';
//Beispiel gemäss example 39 von Curran Kelleher Screencasts
//
angular.module('adressApp')
.controller('AdressDetailCtrl', ['$scope', '$routeParams', '$http',
 function($scope, $routeParams, $http) {
    //Name wird aus den Routeparameter der URL ausgelesen und übergeben
    $scope.name = $routeParams.AdressName;
    //Daten werden nach dem entsprechenden Namen gefiltert und angezeigt
    $http.get('adressen.json').success(function(data) {
        $scope.adresse = data.filter(function(entry) {
            return entry.name === $scope.name;
        }) [0];
    });
}]);