'use strict';

angular.module('adressApp')
    .directive('imageLoader', function() {
        return {
            restrict: 'E',
            template: '<input type="file" name="photo" accept="image/*" capture="camera">',
            replace: true,
            scope: {
                onImage: '&'
            },
            link: function($scope, element, attrs) {
                element.on('change', function(event) {
                    var el = event.target;
                    var file = el.files[0];
                    if (!file) {
                        return;
                    }
                    var reader = new FileReader();
                    reader.onload = function() {
                        $scope.$apply(function() {
                            $scope.onImage({
                                url: reader.result
                            });
                        });
                    };
                    // Directly read into a data URL.
                    reader.readAsDataURL(file);
                });
            }

                $scope.saveImageURL = function(url) {
                $scope.currentDetail.imageURL = url;
            };
        };
    });
