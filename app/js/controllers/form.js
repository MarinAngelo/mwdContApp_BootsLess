(function(angular, WP){ //API wrapper
'use strict';

angular.module('adressApp', [])
.controller('FormController', ['$scope', function($scope){
    $scope.newContact = WP.create.entry();

    $scope.addContact = function() {
      WP.save($scope.newContact);
      reload();
      $scope.newContact = WP.create.entry();
    };

}]);

}(window.angular, window.WP));