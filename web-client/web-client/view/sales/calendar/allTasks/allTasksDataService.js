(function() {

    'use strict';
    // Service for get GET API
    angular.module('calendar').factory('allTasksDataServices', allTasksDataServices);

    function allTasksDataServices($q, $http, config, toastr, $sessionStorage) {

        var obj = {};

        var configHeader = {
            headers: {
                Authentication: JSON.stringify($sessionStorage.SessionToken)
            }
        }

        obj.getAccountsDetails = function(data) {
            var deferred = $q.defer();
            $http.get(config.apiAllTask + "get/listview?input_param=" + data, configHeader).success(function(data) {
                deferred.resolve(data);
            })
                .error(function() {
                    deferred.reject();
                });
            return deferred.promise;
        }

        obj.editTasks = function(data) {
            var deferred = $q.defer();
            $http.get(config.apiAllTask + "/" + data, configHeader).success(function(data) {
                deferred.resolve(data);
            })
                .error(function() {
                    deferred.reject();
                });
            return deferred.promise;
        }


       
        obj.saveTasks = function(data) {
            var deferred = $q.defer();
            $http.post(config.apiAllTask + "/save", data, configHeader).success(function(data) {
                deferred.resolve(data);
            })
                .error(function() {
                    deferred.reject();
                });
            return deferred.promise;
        }

       obj.getSetupFields = function (data) {
            var deferred = $q.defer();
            $http.get(config.apiAllTask + "setup/get?input_param=" + data, configHeader).success(function (data) {
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
                url:  config.apiAllTask + "setup/save",
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
                    toastr.error('something went wrong please try again', 'Error');
                  }else{
                    toastr.success('share done', 'Success');
                  }
              }).error(function () {
                  deferred.reject();
             });

             return deferred.promise;

         }


        obj.addNote = function(data) {

            var deferred = $q.defer();

            $http({
                url: config.apiAllTask + "addnote",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'dataType': 'jsonp',
                    'Authentication': JSON.stringify($sessionStorage.SessionToken)
                },
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    input_param: data
                }
            }).success(function(data) {
                deferred.resolve(data);
                console.log(JSON.stringify(data));
            }).error(function() {
                deferred.reject();
            });

            return deferred.promise;

        }



        obj.delete = function(data) {

            var deferred = $q.defer();

            $http({
                url: config.apiAllTask + "delete",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'dataType': 'jsonp',
                    'Authentication': JSON.stringify($sessionStorage.SessionToken)
                },
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    input_param: data
                }
            }).success(function(data) {
                deferred.resolve(data);
                console.log(JSON.stringify(data));
            }).error(function() {
                deferred.reject();
            });

            return deferred.promise;

        }


        obj.completeTask = function(data) {

            var deferred = $q.defer();

            $http({
                url: config.apiAllTask + "complete",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'dataType': 'jsonp',
                    'Authentication': JSON.stringify($sessionStorage.SessionToken)
                },
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    input_param: data
                }
            }).success(function(data) {
                deferred.resolve(data);
                console.log(JSON.stringify(data));
            }).error(function() {
                deferred.reject();
            });

            return deferred.promise;

        }


        obj.reschedule = function(data) {

            var deferred = $q.defer();

            $http({
                url: config.apiAllTask + "reschedule",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'dataType': 'jsonp',
                    'Authentication': JSON.stringify($sessionStorage.SessionToken)
                },
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    input_param: data
                }
            }).success(function(data) {
                deferred.resolve(data);
                console.log(JSON.stringify(data));
            }).error(function() {
                deferred.reject();
            });

            return deferred.promise;

        }

        return obj;
    }

})();