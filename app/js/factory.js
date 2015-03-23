"use strict";

angular.module('adressApp', [])
    .factory('adresser', function() {

        var adressen = [{
            "name": "Markus"
        }, {
            "name": "Claudia"
        }];

        // hinzuf: function() {
        // 	if ($scope.adresse.name) {
        // 		$scope.adressen.push({name: $scope.adresse.name});
        // 		$scope.adresse.name = '';
        // 	}
        // }

        // };

        return {
            all: function() {
                return adressen;
            }
        };
    });
