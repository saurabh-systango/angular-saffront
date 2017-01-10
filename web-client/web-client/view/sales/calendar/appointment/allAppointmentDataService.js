(function () {

    'use strict';
    // Service for get GET API
    angular.module('calendar').factory('allAppointmentDataServices', allAppointmentDataServices);

    function allAppointmentDataServices($q, $http, config, $sessionStorage) {

        var obj = {};

        var configHeader = {
            headers: {
                Authentication: JSON.stringify($sessionStorage.SessionToken)
            }
        }

        obj.getAccountsDetails = function(data) {
            var deferred = $q.defer();
            $http.get(config.apiAppointment + "get/listview?input_param=" + data, configHeader).success(function(data) {
                deferred.resolve(data);
            })
            .error(function() {
                deferred.reject();
            });
            return deferred.promise;
        }

        obj.newAppointmentDialog = function () {
            var deferred = $q.defer();

            $http.get(config.apiAppointment + "new", configHeader).success(function (data) {
                deferred.resolve(data);
            })
            .error(function () {
                deferred.reject();
            });

            return deferred.promise;
        }

       
        obj.editAppointmentDetails = function (data) {
            var deferred = $q.defer();
            $http.get(config.apiAppointment + "" + data, configHeader).success(function (data) {
                deferred.resolve(data);
            })
            .error(function () {
                deferred.reject();
            });
            return deferred.promise;
        }

        obj.getSetupFields = function (data) {
            var deferred = $q.defer();
            $http.get(config.apiAppointment + "setup/get?input_param=" + data, configHeader).success(function (data) {
                deferred.resolve(data);
            })
            .error(function () {
                deferred.reject();
            });
            return deferred.promise;
        }

        obj.changeSetupFields = function (data) {
            var deferred = $q.defer();
            $http.get(config.apiFileds + "" + data +"/fields", configHeader).success(function (data) {
                deferred.resolve(data);
            })
            .error(function () {
                deferred.reject();
            });
            return deferred.promise;
        }

         obj.saveSetupFields = function(data){ 

             var deferred = $q.defer();

             $http({
                url:  config.apiAppointment + "setup/save",
                method: "POST",
                headers: {
                     'Content-Type': 'application/x-www-form-urlencoded',
                     'dataType': 'jsonp',
                     'Authentication': JSON.stringify($sessionStorage.SessionToken)
                },
                transformRequest: function(obj) {
                   var str = [];
                   for(var p in obj)
                   str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                   return str.join("&");
                },
                data: {
                     input_param : data
                }
              }).success(function(data) {
                  deferred.resolve(data);
                  console.log(JSON.stringify(data));
                  if(data.status == -1){
                    
                  }else{
                    
                  }
              }).error(function () {
                  deferred.reject();
             });

             return deferred.promise;
         }

        obj.addNote = function (data) {

            var deferred = $q.defer();

            $http({
                url: config.apiAppointment + "addnote",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'dataType': 'jsonp',
                    'Authentication': JSON.stringify($sessionStorage.SessionToken)
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    input_param: data
                }
            }).success(function (data) {
                deferred.resolve(data);
                console.log(JSON.stringify(data));
            }).error(function () {
                deferred.reject();
            });

            return deferred.promise;

        }

        obj.deleteAppointment = function (data) {

            var deferred = $q.defer();

            $http({
                url: config.apiAppointment + "delete",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'dataType': 'jsonp',
                    'Authentication': JSON.stringify($sessionStorage.SessionToken)
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    input_param: data
                }
            }).success(function (data) {
                deferred.resolve(data);
                console.log(JSON.stringify(data));
            }).error(function () {
                deferred.reject();
            });

            return deferred.promise;

        }


        obj.completeTask = function (data) {

            var deferred = $q.defer();

            $http({
                url: config.apiAppointment + "complete",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'dataType': 'jsonp',
                    'Authentication': JSON.stringify($sessionStorage.SessionToken)
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    input_param: data
                }
            }).success(function (data) {
                deferred.resolve(data);
                console.log(JSON.stringify(data));
            }).error(function () {
                deferred.reject();
            });

            return deferred.promise;

        }


        obj.reschedule = function (data) {

            var deferred = $q.defer();

            $http({
                url: config.apiAppointment + "reschedule",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'dataType': 'jsonp',
                    'Authentication': JSON.stringify($sessionStorage.SessionToken)
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    input_param: data
                }
            }).success(function (data) {
                deferred.resolve(data);
                console.log(JSON.stringify(data));
            }).error(function () {
                deferred.reject();
            });

            return deferred.promise;

        }

        obj.addNewAppointment = function(data){ 

             var deferred = $q.defer();

             $http({
                url:  config.apiAppointment + "save",
                method: "POST",
                headers: {
                     'Content-Type': 'application/x-www-form-urlencoded',
                     'dataType': 'jsonp',
                     'Authentication': JSON.stringify($sessionStorage.SessionToken)
                },
                transformRequest: function(obj) {
                   var str = [];
                   for(var p in obj)
                   str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                   return str.join("&");
                },
                data: {
                     input_param : data
                }
              }).success(function(data) {
                  deferred.resolve(data);
                  console.log(JSON.stringify(data));
                  if(data.status == -1){
                    
                  }else{
                    
                  }
              }).error(function () {
                  deferred.reject();
             });

             return deferred.promise;
         }


        return obj;
    }

})();