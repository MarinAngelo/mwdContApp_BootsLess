(function(angular, WP){ //API wrapper


angular.module('adressApp')
.controller('FormController', ['$scope',
 function($scope){
 	
 	$scope.currentDetail = null;
    $scope.setDetail = function(contact) {
      $scope.currentDetail = contact;
    };
    $scope.clearDetail = function() {
      $scope.currentDetail = null;
    };

    $scope.newContact = WP.create.entry();

    $scope.addContact = function() {
      WP.save($scope.newContact);
      reload();
      $scope.newContact = WP.create.entry();
    };

}]);

}(window.angular, window.WP));