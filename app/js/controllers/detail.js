'use strict';
//Beispiel gemäss example 39 von Curran Kelleher Screencasts
//
angular.module('adressApp')
.controller('DetailController', ['$scope', '$routeParams',
 function($scope, $routeParams) {
    //Name wird aus den Routeparameter der URL ausgelesen und übergeben
    $scope.name = $routeParams.AdressName;
   
}]);