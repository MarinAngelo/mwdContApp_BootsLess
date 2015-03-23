'use strict';

angular.module('adressApp')
.controller('DetailController', ['$scope', '$routeParams', 'adressService',
 function($scope, $routeParams, adressService) {

adressService.find($routeParams.AdressName, function(adresse) {
	$scope.adresse = adresse;
});

}]);