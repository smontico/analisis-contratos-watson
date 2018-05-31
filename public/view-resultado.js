/*global angular */
/*global alert */
var app = angular.module('myapp.view-resultado', ['ngRoute', 'ngResource'])
    .config(['$routeProvider', function ($routeProvider) {
        'use strict';
        $routeProvider.when('/view-resultado', {
            templateUrl: 'view-resultado.html',
            controller: 'ViewCtrlResultado'
        });
    }])

    .controller('ViewCtrlResultado', function ($scope, $location, UserService, $rootScope) {
        'use strict';
    
        $scope.discovery = UserService.getDiscovery(); //https://stackoverflow.com/questions/29769804/getting-and-setting-value-in-factory-in-angualrjs    
        $rootScope.$on("updates",function(){
            $scope.discovery = UserService.getDiscovery();
        });
    
        $scope.cantdocus = UserService.getCantDocus(); //https://stackoverflow.com/questions/29769804/getting-and-setting-value-in-factory-in-angualrjs
        $rootScope.$on("updates",function(){
            $scope.cantdocus = UserService.getCantDocus();
        });
    
        var initControler = function () {
            $scope.query = UserService.query;
            $scope.features = UserService.features;
            $scope.discovery = UserService.discovery;
            $scope.nlu = UserService.nlu;

            //$scope.discoveryIndex = 0;          
            $scope.offset = UserService.offset;
            $scope.offsetshow = UserService.offset + UserService.count;
            if ($scope.offsetshow > $scope.discovery.matching_results) {
                $scope.offsetshow = $scope.discovery.matching_results
            }
        };
        
        $scope.$watch(function () {
            //return UserService.query;
            return UserService;
        }, function (newValue, oldValue) {
            //console.log(newValue + ' ' + oldValue);
            initControler();
        });

        $scope.antRes = function(){
            UserService.offset = UserService.offset - 5;
            initControler();
            $scope.myFunctionAnalizar();            
        }
        $scope.nextRes = function antDiscDocu(){
            UserService.offset = UserService.offset + 5;
            initControler();
            $scope.myFunctionAnalizar();            
        }
        
        $scope.myFunctionAnalizar = function () {
            $location.path("/index");
            UserService.runQuery ($scope, $location);
        };
    
        $scope.firstDoc = function(){
            try{
                if ($scope.discovery.matching_results > 0 && $scope.offset > 0){
                    return "enabled";
                }else{
                    return "disabled";                
                }
            }catch (err){
                return "disabled";                
            }            
        }    

        $scope.lastDoc = function(){
            try{
                if ($scope.offsetshow < $scope.discovery.matching_results){
                    return "enabled";
                }else{
                    return "disabled";                
                }
            }catch (err){
                return "disabled";                
            }            
        }  
        
        
        initControler();
        // Seteo de checklist model -  ENTIDADES DE NLU ---

        
  $scope.user = {
        entities: [$scope.nlu.entities]
  };
    
  $scope.checkAll = function() {
    $scope.user.entities = angular.copy($scope.nlu.entities);
  };
    //$scope.checkAll();
  $scope.uncheckAll = function() {
    $scope.user.entities = [];
  };
  $scope.checkFirst = function() {
    $scope.user.entities = [];
    $scope.user.entities.push($scope.nlu.entities);
  };
  $scope.setToNull = function() {
    $scope.user.entities = null;
  };
    
    $scope.getDiscoveryQuery = function () {
        // Query example: 
        //                "enriched_text.entities.type::'Servicio',enriched_text.concepts.text::'Antel',enriched_text.entities.text::'servicios de telecomunicaciones';
        // Url   example:
        //                    
        var query_or = document.getElementById('consulta_or').checked;
        var operador = ",";
        if (query_or){
            // selecciono OR
            operador = '|';
        }else{
            // hace la busqueda como si fuera AND
            operador = ',';
        }
        var text = 'enriched_text.entities.type::"SERVICIO"';
        var i = 1
        for (i = 1; i < $scope.user.entities.length; i++) {
            text += operador + 'enriched_text.entities.text::"' + $scope.user.entities[i].text + '"';
        }
        return text;
    };

    $scope.queryBuffer = "";
    $scope.imChanged = function(){
        if (UserService.getLoader()) {
            //Set buffer:
            $scope.queryBuffer = $scope.getDiscoveryQuery();
            console.log("setBuffer");
        } else {
            $scope.query = $scope.getDiscoveryQuery();
            UserService.query = $scope.query;
            UserService.runQueryDiscovery ($scope, $location);
            //console.log(JSON.stringify($scope.discovery.results));
        }
    };
    });

// here we define our unique filter
app.filter('unique', function() {
   // we will return a function which will take in a collection
   // and a keyname
   return function(collection, keyname) {
      // we define our output and keys array;
      var output = [], 
          keys = [];
      // we utilize angular's foreach function
      // this takes in our original collection and an iterator function
      angular.forEach(collection, function(item) {
          // we check to see whether our object exists
          var key = item[keyname];
          // if it's not already part of our keys array
          if(keys.indexOf(key) === -1) {
              // add it to our keys array
              keys.push(key); 
              // push this item to our final output array
              output.push(item);
          }
      });
      // return our array which should be devoid of
      // any duplicates
      return output;
   };
});