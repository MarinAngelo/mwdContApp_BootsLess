'use strict';

angular.module('adressApp')
.controller('ListController', ['$scope', 'adressService', 
    function($scope, adressService) { 
    adressService.list(function(adressen) {
    	$scope.adressen = adressen;
    });

    $scope.sortArg = "name";

}]);
