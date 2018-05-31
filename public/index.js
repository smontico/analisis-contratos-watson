/*global angular */
// Declare app level module which depends on views, and components
var myapp = angular.module('myapp', [
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'checklist-model',
    'myapp.view-ingresofree',
    'myapp.view-resultado',
    'myapp.view-documento'
]).
    config(['$locationProvider', '$routeProvider', '$sceDelegateProvider', '$httpProvider', '$interpolateProvider', function ($locationProvider, $routeProvider, $sceDelegateProvider, $httpProvider, $interpolateProvider) {
        'use strict';
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/'});
        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain. **.
            'https://gateway.watsonplatform.net/**'
        ]);
    }]);

myapp.factory('UserService', ['$http', '$rootScope', function ($http, $rootScope) {

    var dataFactory = {};
    
    dataFactory.features = {};
    
    dataFactory.discoveryLocal = {};
    dataFactory.nlu = {}
    
    dataFactory.query = "";    
    dataFactory.runLocal = false;

    //Show loading...
    dataFactory.myloader = false;
    dataFactory.getLoader = function () {
        return dataFactory.myloader;
    };
    
    dataFactory.setLoader = function (firstname) {
        dataFactory.myloader = firstname;
        $rootScope.$broadcast("updates");
    };
    // end show loading...
    
    //Show cantidad de documentos...
    dataFactory.cantdocus = false;
    dataFactory.getCantDocus = function () {
        return dataFactory.cantdocus;
    };
    
    dataFactory.setCantDocus = function (firstname) {
        dataFactory.cantdocus = firstname;
        $rootScope.$broadcast("updates");
    };
    // end show loading...
    
    //Set discovery array
    dataFactory.discovery = {};
    dataFactory.getDiscovery = function () {
        return dataFactory.discovery;
    };
    
    dataFactory.setDiscovery = function (thearray) {
        dataFactory.discovery = thearray;
        $rootScope.$broadcast("updates");
        //$scope.$digest();
    };
    //End set discovery array
    
    dataFactory.runQuery = function (scope, location){
            if (!dataFactory.runLocal) {
                dataFactory.setLoader(true);    
                dataFactory.setCantDocus(false);
                $http({
                    method: 'POST',
                    url: '/nlu',
                    data: { querynlu: dataFactory.query }
                }).then(function successCallback(response) {
                    
                    //Get uniques
                    var newdata = [];
                    var lenNLU = response.data.entities.length;
                    var i = 0;
                    for (i = 0; i < lenNLU; i++) {
                        var j = 0;
                        var valoryaexiste = false;
                        var lennewdata = newdata.length;
                        for (j = 0; j < lennewdata; j++) {                        
                            if(newdata[j].text == response.data.entities[i].text) {
                                //Valor ya existe
                                valoryaexiste = true;
                            }
                        }
                        if (!valoryaexiste){
                            newdata.push(response.data.entities[i]);
                        }
                    }            
                    dataFactory.nlu.entities = newdata;
                    //End set NLU
                    dataFactory.setLoader(false);
                    location.path("/view-resultado");
                }, function errorCallback(response) {
                    alert("Error query nlu:" + response.data);
                });
            }else{
                    location.path("/view-resultado");
            }
    }
    
    dataFactory.offset = 0;
    dataFactory.count = 5;
    dataFactory.runQueryDiscovery = function (scope, location){
            var theUrl = '/discovery-nl-offset?query=' + dataFactory.query + "&count=" + dataFactory.count + "&offset=" + dataFactory.offset
            if (!dataFactory.runLocal) {
                dataFactory.setLoader(true);
                var thearray = {};
                dataFactory.setDiscovery(thearray);
                $http({
                    method: 'GET',
                    url: theUrl
                }).then(function successCallback(response) {
                    dataFactory.setDiscovery(response.data);
                    console.log(response.data.aggregations[0].aggregations[0].results);
                    //Set values to NLU array:
                    var lenNLU = dataFactory.nlu.entities.length;
                    var i = 0;
                    for (i = 0; i < lenNLU; i++) {
                        var j = 0;
                        var seteoValor = false;
                        //var lenDIS = response.data.aggregations[0].results.length;
                        var lenDIS = response.data.aggregations[0].aggregations[0].results.length;
                        
                        for (j = 0; j < lenDIS; j++) {                        
                            if(response.data.aggregations[0].aggregations[0].results[j].key == dataFactory.nlu.entities[i].text) {
                                //Agrego el valor
                                dataFactory.nlu.entities[i].count = response.data.aggregations[0].aggregations[0].results[j].matching_results
;
                                seteoValor = true;
                                //j = dataFactory.nlu.entities.length;
                            }
                        }
                        if (!seteoValor){
                            dataFactory.nlu.entities[i].count = 0;        
                        }
                    }                       
                    //End set NLU                    
                    dataFactory.setLoader(false);
                    dataFactory.setCantDocus(true);
                    location.path("/view-resultado");
                }, function errorCallback(response) {
                    alert("Error queryDiscovery:" + response.data);
                });
            }else{
                dataFactory.setDiscovery(dataFactory.discoveryLocal);
            }
    }
    
        dataFactory.runQueryDoc = function (scope, location, docIndex){
            if (!dataFactory.runLocal) {
                if (docIndex < 0) {
                    dataFactory.offset = dataFactory.offset - dataFactory.count;
                    docIndex = dataFactory.count - 1;
                } else {
                    dataFactory.offset = dataFactory.offset + dataFactory.count;
                    docIndex = 0;
                }
                var theUrl = '/discovery-nl-offset?post=' + dataFactory.query + "&count=" + dataFactory.count + "&offset=" + dataFactory.offset
                dataFactory.setLoader(true);
                $http({
                    method: 'GET',
                    url: theUrl
                }).then(function successCallback(response) {
                    dataFactory.setDiscovery(response.data);
                    dataFactory.setLoader(false);
                    var docId = dataFactory.discovery.results[docIndex].id
                    location.path("/view-documento/" + docId);
                }, function errorCallback(response) {
                    alert("Error:" + response.data);
                });
            }else{
                    location.path("/view-resultado");
            }

    }
    return dataFactory; 
    
}]);