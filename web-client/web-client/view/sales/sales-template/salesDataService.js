(function() {

    'use strict';
    // Service for get GET API
    angular.module('salesTemplate').factory('salesDataServices', salesDataServices);

    function salesDataServices($q, $http, config, toastr, $sessionStorage) {

        var obj = {};

        var configHeader = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'dataType': 'jsonp',
                Authentication: JSON.stringify($sessionStorage.SessionToken)
            }
        }
        //console.log(JSON.stringify(configHeader));

        obj.salesAllFiels = function(data) {
            var deferred = $q.defer();
            $http.get(config.apiSales + "fields", configHeader).success(function(data) {
                deferred.resolve(data);
            })
            .error(function() {
                deferred.reject();
            });
            return deferred.promise;
        }


        obj.saveSalesTemplate = function(data) {

            var deferred = $q.defer();

            $http({
                url: config.apiSales + "save",
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
                if(data.status == -1){
                    console.log(data.error.message)
                   // toastr.error(data.error.message, 'Error');
                  }else{
                   // toastr.success('template saved', 'Success');
                  }
            }).error(function() {
                deferred.reject();
            });

            return deferred.promise;

        }

        obj.inactiveSalesTemplate = function(data) {

            var deferred = $q.defer();

            $http({
                url: config.apiSales + "inactive",
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
                if(data.status == -1){
                  //  toastr.error('something went wrong please try again', 'Error');
                  }else{
                   // toastr.success('status changed', 'Success');
                  }
            }).error(function() {
                deferred.reject();
            });

            return deferred.promise;

        }

        obj.activeSalesTemplate = function(data) {

            var deferred = $q.defer();

            $http({
                url: config.apiSales + "active",
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
                if(data.status == -1){
                    //toastr.error('something went wrong please try again', 'Error');
                  }else{
                    //toastr.success('status changed', 'Success');
                  }
            }).error(function() {
                deferred.reject();
            });

            return deferred.promise;

        }

        obj.getSalesDetails = function(data) {
            var deferred = $q.defer();
            $http.get(config.apiSales + "get/listview?input_param=" + data, configHeader).success(function(data) {
                deferred.resolve(data);
            })
                .error(function() {
                    deferred.reject();
                });
            return deferred.promise;
        }

        obj.editSalesTemplate = function(data) {
            var deferred = $q.defer();
            $http.get(config.apiSales + "" + data, configHeader).success(function(data) {
                deferred.resolve(data);
            })
                .error(function() {
                    deferred.reject();
                });
            return deferred.promise;
        }

        obj.createSalesDetails = function() {

            var deferred = $q.defer();

            $http.get(config.apiSales + "new", configHeader).success(function(data) {
                deferred.resolve(data);
            })
                .error(function() {
                    deferred.reject();
                });

            return deferred.promise;

        }

        obj.deleteSalesData = function(data) {

            var deferred = $q.defer();

            $http({
                url: config.apiSales + "delete",
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
                if(data.status == -1){
                   // toastr.error('something went wrong please try again', 'Error');
                  }else{
                   // toastr.success('record delete', 'Success');
                  }
            }).error(function() {
                deferred.reject();
            });

            return deferred.promise;

        }

        return obj;
    }

})();