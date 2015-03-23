'use strict';

angular.module('adressApp')
    .factory('adressService', ['$http', function($http) {

        var adressen = [{
            "name": "Marinus"
        }, {
            "name": "Robert"
        }, {
            "name": "Sandra"
        }];

        return {
            list: function() {
                return adressen;
            },
            find: function() {

            },
            add: function() {
            	
            }

        };

    }]);
