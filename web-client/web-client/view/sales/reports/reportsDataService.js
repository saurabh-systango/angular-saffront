(function () {

    'use strict';
    // Service for get GET API
    angular.module('reports').factory('reportsDataServices', reportsDataServices);

    function reportsDataServices($q, $http, config, $sessionStorage) {

        var obj = {};

        var configHeader = {
            headers: {
                Authentication: JSON.stringify($sessionStorage.SessionToken)
            }
        }

        obj.getReportDetails = function () {

            var deferred = $q.defer();

            $http.get(config.apiSalesReports, configHeader).success(function (data) {
                deferred.resolve(data);
            })
                .error(function () {
                    deferred.reject();
                });

            return deferred.promise;

        }





        obj.activityReport = function (data) {
            var deferred = $q.defer();
            $http.get(config.apiSalesReports + "/activity?input_param=" + data, configHeader).success(function (data) {
                deferred.resolve(data);
            })
                .error(function () {
                    deferred.reject();
                });
            return deferred.promise;
        }
        obj.conversionReport = function (data) {
            var deferred = $q.defer();
            $http.get(config.apiSalesReports + "/conversion?input_param=" + data, configHeader).success(function (data) {
                deferred.resolve(data);
            })
                .error(function () {
                    deferred.reject();
                });
            return deferred.promise;
        }
        obj.pipelineReport = function (data) {
            var deferred = $q.defer();
            $http.get(config.apiSalesReports + "/pipeline?input_param=" + data, configHeader).success(function (data) {
                deferred.resolve(data);
            })
                .error(function () {
                    deferred.reject();
                });
            return deferred.promise;
        }
        obj.callReport = function (data) {
            var deferred = $q.defer();
            $http.get(config.apiSalesReports + "/call?input_param=" + data, configHeader).success(function (data) {
                deferred.resolve(data);
            })
                .error(function () {
                    deferred.reject();
                });
            return deferred.promise;
        }
        obj.forcastReport = function (data) {
            var deferred = $q.defer();
            $http.get(config.apiSalesReports + "/forcast?input_param=" + data, configHeader).success(function (data) {
                deferred.resolve(data);
            })
                .error(function () {
                    deferred.reject();
                });
            return deferred.promise;
        }


        return obj;
    }

})();



