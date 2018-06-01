/*global angular */
/*global alert */
angular.module('myapp.view-ingresofree', ['ngRoute', 'ngResource'])
    .config(['$routeProvider', function ($routeProvider) {
        'use strict';
        $routeProvider.when('/view-ingresofree', {
            templateUrl: 'view-ingresofree.html',
            controller: 'ViewCtrlIngresoFree'
        });
    }])
    .controller('ViewCtrlIngresoFree', function ($scope, $location, UserService, $rootScope) {
        'use strict';

        $scope.myloader = UserService.getLoader();
    
        $rootScope.$on("updates",function(){
            $scope.myloader = UserService.getLoader();
        });
    
        $scope.myFunctionAnalizar = function () {
            //Seteo paginado
            UserService.offset = 0;
            UserService.query = $scope.free;
            $location.path("/index");
            UserService.runQuery ($scope, $location);
        };
    
        $scope.myFunct = function(keyEvent) {
            if (keyEvent.which === 13)
            $scope.myFunctionAnalizar();
        };
    
        var initControler = function () {
            $scope.query = UserService.query;
            $scope.features = UserService.features;
            $scope.discovery = UserService.discovery;
            $scope.discoveryIndex = 0;
        };    
    
    });

