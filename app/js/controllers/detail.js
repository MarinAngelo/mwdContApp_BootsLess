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

                $scope.exportVcard = function() {
      var data = {adr: [], tel: []};
      data.name = {
        first: $scope.currentDetail.first_name,
        last: $scope.currentDetail.last_name,
      };
      WP.retrieve.addresses($scope.currentDetail, function(addresses) {
        addresses.forEach(function(address) {
          data.adr.push({
            type: address.label,
            street: address.street + ' ' + address.number,
            city: address.city,
            zip: address.zip,
            country: address.country
          });
        });
        WP.retrieve.phones($scope.currentDetail, function(phones) {
          phones.forEach(function(phone, i) {
            data.tel.push({
              type: phone.label,
              number: phone.number,
              pref: i === 0
            });
          });
          var imageURL = $scope.currentDetail.imageURL;
          if(imageURL) {
            var match = imageURL.match(/^data:image\/(\w+);base64,/);
            if(match) {
              data.photo = {
                photo: imageURL.substring(match[0].length),
                ext: match[1].toUpperCase(),
                type: 'base64'
              };
            } else {
              data.photo = {
                photo: imageURL,
                ext: '',
                type: 'uri'
              };
            }
          }
          var vcard = window.browserify.virginity(data);
          var a = document.createElement('a');
          a.download = $scope.currentDetail.name + '.vcf';
          a.href = 'data:text/vcard,' + encodeURIComponent(vcard);
          var click = new MouseEvent('click', {view: window, bubbles: true, cancelable: true});
          a.dispatchEvent(click);
        });
      });
    };

        }
    ]);
