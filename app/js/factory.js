'use strict';

angular.module('adressApp')
.factory('adressService', ['$http', function($http){
	return {
		list: function(callback) {
			$http.get('adressen.json').success(callback);
		},
		find: function(name, callback) {
			$http.get('adressen.json').success(function(data) {
				var adresse = data.filter(function(entry) {
					return entry.name === name;
				})[0];
				callback(adresse);
			});
		}
		
	};
}]);