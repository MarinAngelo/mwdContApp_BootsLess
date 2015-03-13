'use strict';

angular.module('adressApp')
.controller('AdressListeCtrl', ['$scope', '$http', 
    function($scope, $http, adressen) { 
    adressen.list(function(adressen) {
    	$scope.adressen = adressen;
    });

    $scope.sortArg = "name";

}]);
