/*global angular */
angular.module('myapp.view-documento', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        'use strict';
        $routeProvider.when('/view-documento/:id', {
            templateUrl: 'view-documento.html',
            controller: 'ViewCtrlDocumento'
        });
    }])

    .controller('ViewCtrlDocumento', function ($scope, $routeParams, $location, UserService) {
        'use strict';
        //alert($routeParams.id);
        $scope.query = UserService.query;
        $scope.features = UserService.features;
        $scope.discovery = UserService.discovery;
        $scope.docIndex = 0;
        function getById(arr, id) {
            for (var d = 0, len = arr.length; d < len; d += 1) {
                if (arr[d].id === id) {
                    $scope.docIndex = d;
                    return arr[d];
                }
            }
        }

        $scope.documento = getById($scope.discovery.results, $routeParams.id);
        $scope.firstDoc = function(){
            if ($scope.docIndex == 0){
                return "disabled";
            }else{
                return "enabled";                
            }
        }    

        $scope.lastDoc = function(){
            if ($scope.docIndex == ($scope.discovery.matching_results - 1)){
                return "disabled";
            }else{
                return "enabled";                
            }
        }    

    
        function setPaginacion (){
            console.log("$scope.docIndex = " + $scope.docIndex);
            
            try {
                var newId = $scope.discovery.results[$scope.docIndex].id;
            }
            catch(err) {
                
                
                
                
            }
            $location.path("/view-documento/"+newId);
            
        }
    
        $scope.antDiscDocu = function(){
            $scope.docIndex = $scope.docIndex - 1;
            setPaginacion();
        }
        $scope.nextDiscDocu = function antDiscDocu(){
            $scope.docIndex = $scope.docIndex + 1;
            setPaginacion();
        }
        
        
    });