(function(angular, WP){ //API wrapper
	
angular.module('adressApp')
.controller('ListController', ['$scope', 
    function($scope) { 

$scope.currentDetail = null;
    $scope.setDetail = function(contact) {
      $scope.currentDetail = contact;
    };
    $scope.clearDetail = function() {
      $scope.currentDetail = null;
    };

    	$scope.adressen = [];
//wenn die Site geladen wird, sollen alle adressen im Local storage angezeigt werden
    	    function reload() {
      WP.all.entries(function(adressen) {
        $scope.adressen = adressen;
      });
    }
    reload();

}]);

}(window.angular, window.WP));
