(function () {

    'use strict';
    // Service for get GET API
    angular.module('calendar').factory('pendingTaskDataServices', pendingTaskDataServices);

    function pendingTaskDataServices($q, $http, config, $sessionStorage) {

        var obj = {};

        var configHeader = {
            headers: {
                Authentication: JSON.stringify($sessionStorage.SessionToken)
            }
        }

        obj.getAccountsDetails = function (data) {

            var deferred = $q.defer();

            $http.get(config.apiPendingTask +"get/listview?input_param="+data,  configHeader).success(function(data) {
              deferred.resolve(data);
            }).error(function () {
                deferred.reject();
            });

            return deferred.promise;

        }

        obj.saveComplete = function (data) {

            var deferred = $q.defer();

            $http.get(config.apiPendingTask +"complete?input_param="+data,  configHeader).success(function(data) {
              deferred.resolve(data);
            }).error(function () {
                deferred.reject();
            });

            return deferred.promise;

        }


        obj.addNewTasks = function (data) {

            var deferred = $q.defer();

            $http({
                url: config.apiPendingTask + "save",
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

        return obj;
    }

})();