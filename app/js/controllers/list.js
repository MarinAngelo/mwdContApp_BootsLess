'use strict';

angular.module('adressApp')
.controller('ListController', ['$scope', 'adressen', 
    function($scope, adressen) { 
    adressen.list(function(adressen) {
    	$scope.adressen = adressen;
    });

    $scope.sortArg = "name";

}]);
