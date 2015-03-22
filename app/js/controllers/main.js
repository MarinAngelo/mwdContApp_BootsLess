'use strict';

angular.module('adressApp')
.controller('MainController', ['$scope', function($scope){
	$scope.adresse = {
		name: null
	};
	
	$scope.adressen = [
		{"name": "Markus"},
		{"name": "Claudia"}
	];

	$scope.submit = function() {
		if ($scope.adresse.name) {
			$scope.adressen.push({name: $scope.adresse.name});
			$scope.adresse.name = '';
		}
	};
	
}]);