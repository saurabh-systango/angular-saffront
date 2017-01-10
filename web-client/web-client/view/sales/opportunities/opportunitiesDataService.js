(function () {

  'use strict';
  // Service for get GET API
  angular.module('opportunities').factory('opportunitiesDataServices', opportunitiesDataServices);

  function opportunitiesDataServices($q, $http, config, toastr,  $sessionStorage) {

    var obj = {};

    var configHeader = {
      headers: {
        Authentication: JSON.stringify($sessionStorage.SessionToken)
      }
    }

    obj.getAccountsDetails = function () {

      var deferred = $q.defer();

      $http.get(config.apiOpportunities + "get/listview", configHeader).success(function (data) {
        deferred.resolve(data);
      })
        .error(function () {
          deferred.reject();
        });

      return deferred.promise;

    }

     obj.getAccountFiled = function(data){  
          var deferred = $q.defer();
          $http.get(config.apiOpportunities +"/fields",  configHeader).success(function(data) {
            deferred.resolve(data);
          })
          .error(function() {
            deferred.reject();
          });            
          return deferred.promise;
      }


    obj.getOppList = function(data){  
        var deferred = $q.defer();
        $http.get(config.apiOpportunities +"get?input_param="+data,  configHeader).success(function(data) {
          deferred.resolve(data);
        })
        .error(function() {
          deferred.reject();
        });            
        return deferred.promise;
    } 

    obj.saveOppList = function(data){  
        var deferred = $q.defer();
        $http.get(config.apiOpportunities +"save", data,  configHeader).success(function(data) {
          deferred.resolve(data);
        })
        .error(function() {
          deferred.reject();
        });            
        return deferred.promise;
    } 


      obj.getSetupFields = function(data){  
        var deferred = $q.defer();
        $http.get(config.apiOpportunities +"setup/get?input_param="+data,  configHeader).success(function(data) {
          deferred.resolve(data);
        })
        .error(function() {
          deferred.reject();
        });            
        return deferred.promise;
    } 

    obj.saveSetupFieldsAppot = function(data){ 

         var deferred = $q.defer();

         $http({
            url:  config.apiOpportunities + "setup/save",
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
                toastr.success('change is done', 'Success');
              }
          }).error(function () {
              deferred.reject();
         });

         return deferred.promise;

     }

     obj.detailAccountsDetails = function(data){  
            var deferred = $q.defer();
            $http.get(config.apiOpportunities +""+data+"/detailview",  configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });            
            return deferred.promise;
        }

      obj.saveCustomizeFields = function(data){ 

         var deferred = $q.defer();

         $http({
            url:  config.apiOpportunities + "customizefields/setup/save",
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
                toastr.success('change is done', 'Success');
              }
          }).error(function () {
              deferred.reject();
         });

         return deferred.promise;

     }

    obj.deleteOppData = function(data){  
        var deferred = $q.defer();
        $http.post(config.apiOpportunities +"delete", data,  configHeader).success(function(data) {
          deferred.resolve(data);
        })
        .error(function() {
          deferred.reject();
        });            
        return deferred.promise;
    } 

    obj.editOppsDetails = function(data){      
        var deferred = $q.defer();
        $http.get(config.apiOpportunities +""+data,  configHeader).success(function(data) {
          deferred.resolve(data);
        })
        .error(function() {
          deferred.reject();
        });            
        return deferred.promise;
    }

      obj.saveOppData = function(data) {

            var deferred = $q.defer();

            $http({
                url: config.apiOpportunities + "save",
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

    obj.saveCustomizeSields = function(data){  
        var deferred = $q.defer();
        $http.post(config.apiOpportunities +"customizefields/setup/save", configHeader, data).success(function(data) {
          deferred.resolve(data);
        })
        .error(function() {
          deferred.reject();
        });            
        return deferred.promise;
    } 


    obj.getWorkflows = function(data){  
        var deferred = $q.defer();
        $http.get(config.apiOpportunities +"workflows/get?input_param="+data,  configHeader).success(function(data) {
          deferred.resolve(data);
        })
        .error(function() {
          deferred.reject();
        });            
        return deferred.promise;
    } 

    obj.applyWorkflows = function(data){  
        var deferred = $q.defer();
        $http.get(config.apiOpportunities +"applyworkflow?input_param="+data,  configHeader).success(function(data) {
          deferred.resolve(data);
        })
        .error(function() {
          deferred.reject();
        });            
        return deferred.promise;
    } 
   
    obj.getConvert = function (data) {
      var deferred = $q.defer();
      $http.get(config.apiOpportunities + "convert/get?input_param=" + data, configHeader).success(function (data) {
        deferred.resolve(data);
      })
        .error(function () {
          deferred.reject();
        });
      return deferred.promise;
    }

    obj.convertAccount = function(data){ 

         var deferred = $q.defer();

         $http({
            url:  config.apiOpportunities + "convert",
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
                toastr.success('convert done', 'Success');
              }
              
          }).error(function () {
              toastr.error('something went wrong please try again', 'Error');
              deferred.reject();
         });

         return deferred.promise;

     }

    obj.deleteSalesData = function(data) {

            var deferred = $q.defer();

            $http({
                url: config.apiOpportunities + "delete",
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