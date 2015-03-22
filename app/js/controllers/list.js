'use strict';

angular.module('adressApp')
.controller('ListController', function($scope, adresser) {

   $scope.adressen = adresser.adressen;

});
