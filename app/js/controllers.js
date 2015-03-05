'use strict';

var adressAppControllers = angular.module('adressAppControllers', []);

adressAppControllers.controller('AdressListeCtrl', ['$scope', '$http', 
    function($scope, $http) { /*[]dipendency injection wegen minifizierung*/
    $http.get('adressen.json').success(function(data) {
        $scope.adressen = data;
    });
    $scope.sortArg = 'Absteigend';
}]);

adressAppControllers.controller('AdressDetailCtrl', function($scope, $routeParams, $http) {
    $scope.name = $routeParams.AdressName;

    $http.get('adressen.json').success(function(data) {

        $scope.adresse = data.filter(function(entry) {
            return entry.name === $scope.name;
        })[0];
    });
});