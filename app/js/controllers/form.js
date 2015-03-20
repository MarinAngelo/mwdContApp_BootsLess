'use strict';

angular.module('adressApp')
.controller('FormController', ['$scope', function($scope){
	$scope.adresse = {
		name: null
	};
	
	$scope.adressen = [];

	$scope.submit = function() {
		if ($scope.adresse.name) {
			$scope.adressen.push({name: $scope.adresse.name});
			$scope.adresse.name = '';
		}
	};
}]);
