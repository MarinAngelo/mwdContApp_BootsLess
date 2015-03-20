'use strict';

angular.module('adressApp')
.controller('ListController', ['$scope', '$http', 
    function($scope, $http) { /*[]dipendency injection wegen minifizierung*/
    	// daten anzeigen mit $http.get
    $http.get('adressen.json').success(function(data) {
        $scope.adressen = data;
    });
    $scope.sortArg = "name";

}]);
