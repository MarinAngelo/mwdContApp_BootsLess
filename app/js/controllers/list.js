'use strict';

angular.module('adressApp' ['adressApp.services'])
.controller('ListController', ['$scope', 'adresser', function($scope, adresser) {

   $scope.adressen = adresser.all();

}]);
