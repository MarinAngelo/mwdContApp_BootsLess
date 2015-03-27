angular.module('adressApp')
.controller('ListController', ['$scope', 
    function($scope) { 

// $scope.currentDetail = null;
    // $scope.setDetail = function(contact) {
    //   $scope.currentDetail = contact;
    //   $location.path('views/adressNeu.html');
    // };
    // $scope.clearDetail = function() {
    //   $scope.currentDetail = null;
    // };

    	$scope.contacts = [];
//wenn die Site geladen wird, sollen alle adressen im Local storage angezeigt werden
    	    function reload() {
      WP.all.entries(function(contacts) {
        $scope.contacts = contacts;
      });
    }
    reload();

        $scope.newContact = WP.create.entry();
    $scope.editing = null;

    $scope.addContact = function() {
      WP.save($scope.newContact);
      reload();
      $scope.newContact = WP.create.entry();
    };

}]);