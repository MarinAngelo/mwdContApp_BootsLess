'use strict';

angular.module('adressApp', [])
.factory('adresser', function(){

	var speicher = {
		adressen: [
		{"name": "Markus"},
		{"name": "Claudia"}
	],

	hinzuf: function() {
		if ($scope.adresse.name) {
			$scope.adressen.push({name: $scope.adresse.name});
			$scope.adresse.name = '';
		}
	}

	};

	return speicher;
});