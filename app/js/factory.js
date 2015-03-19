'use strict';

angular.module('adressApp', [])
    .factory('adressen', ['$http', function($http) {
        return {
            list: function(callback) {
                $http.get('adressen.json').success(callback);
            },
            find: function(id, callback) {
                $http.get('adressen.json').success(function(data) {
                    var adresse = data.filter(function(entry) {
                        return entry.id === id;
                    })[0];
                    callback(adressen);
                });
            }
        };
    }]);
