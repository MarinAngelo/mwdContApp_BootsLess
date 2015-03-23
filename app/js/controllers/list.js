'use strict';

angular.module('adressApp', [])
.controller('ListController', ['$scope', 'adresser', function($scope, adresser) {

   // $scope.adressen = adresser.all();
   adresser.list(function(adressen) {
   	$scope.adressen = adressen;
   });

}]);
// adressen.list(function(adressen) {
//     	$scope.adressen = adressen;
//     });