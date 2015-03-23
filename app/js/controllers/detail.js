(function(angular, WP){
'use strict';

angular.module('adressApp', [])
.controller('DetailController', ['$scope', '$routeParams',
 function($scope, $routeParams) {
   $scope.editing = false;

    $scope.toggleEditing = function() {
      if($scope.editing) {
        save();
      }
      $scope.editing = !$scope.editing;
    };
    function reload() {
      if($scope.currentDetail) {
        WP.retrieve.addresses($scope.currentDetail, function(addresses) {
          $scope.addresses = addresses;
        });
        WP.retrieve.phones($scope.currentDetail, function(phones) {
          $scope.phones = phones;
        });
      } else {
        $scope.addresses = [];
        $scope.phones = [];
        $scope.editing = false;
      }
      $scope.newAddresses = [];
    }
    reload();

    function save() {
      $scope.addresses.forEach(WP.save.bind(WP));
      $scope.phones.forEach(WP.save.bind(WP));
      $scope.newAddresses.forEach(WP.add.address.bind(null, $scope.currentDetail));
      WP.save($scope.currentDetail);
    }
    $scope.$watch('currentDetail', reload);

    $scope.addAddress = function() {
      $scope.newAddresses.push(WP.create.address());
    };
}]);

}(window.angular, window.WP));