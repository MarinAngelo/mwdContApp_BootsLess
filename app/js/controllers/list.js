(function(angular, WP){ //API wrapper
	'use strict';

angular.module('adressApp', [])
.controller('ListController', ['$scope', 
    function($scope) { 

    	$scope.adressen = [];
//wenn die Site geladen wird, sollen alle adressen im Local storage angezeigt werden
    	    function reload() {
      WP.all.entries(function(adressen) {
        $scope.adressen = adressen;
      });
    }
    
    reload();

    // $scope.sortArg = 'name';

}]);

}(window.angular, window.WP));
