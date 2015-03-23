'use strict';

angular.module('adressApp')
.controller('ListController', ['$scope', 'adressService', 
    function($scope, adressService) { 

   $scope.adressen = adressService.list(); 
    	

}]);
