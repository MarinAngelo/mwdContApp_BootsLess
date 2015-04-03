'use strict'

angular.module('adressApp')
    .controller('DetailController', ['$scope', '$routeParams',
        function($scope, $routeParams) {
            // aus parent controller projekt thomas
            $scope.currentDetail = null;

            WP.get($routeParams.ContactKey, function(contact) {
                $scope.currentDetail = contact;
            });

            $scope.clearDetail = function() {
                $scope.currentDetail = null;
                // redirectTo: '/';
                $location.path('adressListe.html');
                $location.replace();
            };

            $scope.editing = false;


            $scope.toggleEditing = function() {
                if ($scope.editing) {
                    save();
                }
                $scope.editing = !$scope.editing;
            };

            function reload() {
                if ($scope.currentDetail) {
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
            };
            reload();

            $scope.removeContact = function(currentDetail) {
                WP.del(currentDetail);
                reload();
            };

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

            $scope.addPhone = function() {
                $scope.phones.push(WP.create.phone());
            };

            $scope.saveImageURL = function(url) {
                $scope.currentDetail.imageURL = url;
            };


        }
    ]);
