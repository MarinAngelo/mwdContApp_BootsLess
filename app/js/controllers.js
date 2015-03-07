'use strict';

var adressAppControllers = angular.module('adressAppControllers', []);

adressAppControllers.controller('AdressListeCtrl', ['$scope', '$http', 
    function($scope, $http) { /*[]dipendency injection wegen minifizierung*/
    $http.get('adressen.json').success(function(data) {
        $scope.adressen = data;
    });
    $scope.sortArg = "name";
    /*if($scope.sortArg = 'favorit') {

    }*/
}]);

adressAppControllers.controller('AdressDetailCtrl', ['$scope', '$routeParams', '$http',
 function($scope, $routeParams, $http) {
    //Name wird aus den Routeparameter der URL ausgelesen und übergeben
    $scope.name = $routeParams.AdressName;
    //Daten werden nach dem entsprechenden Namen gefiltert und angezeigt
    $http.get('adressen.json').success(function(data) {
        $scope.adresse = data.filter(function(entry) {
            return entry.name === $scope.name;
        })[0];
    });
}]);