'use strict';

angular.module('adressApp')
.factory('adressen', ['$http', function($http){
	return {
		list: function(callback) {
			$http.get('adressen.json').success(callback);
		}
		
	};
}]);