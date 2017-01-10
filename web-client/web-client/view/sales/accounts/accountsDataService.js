(function () {

     'use strict';
      // Service for get GET API
     angular.module('account').factory('accountsDataServices', accountsDataServices);

     function accountsDataServices($q, $http, config, toastr, $sessionStorage) {
      
       
        var obj = {};

        var configHeader = {
          headers: {
              Authentication: JSON.stringify($sessionStorage.SessionToken)
          }
        }

        obj.getAccountsDetails = function(data){  
    	      var deferred = $q.defer();
            $http.get(config.apiAccount +"get/listview?input_param="+data,  configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });            
            return deferred.promise;
        }

         obj.getAccountFiled = function(data){  
            var deferred = $q.defer();
            $http.get(config.apiAccount +"fields",  configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });            
            return deferred.promise;
        }

        obj.saveAccountsDetails = function(data){  
            var deferred = $q.defer();
            $http.get(config.apiAccount +"/save",  configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });            
            return deferred.promise;
        }

        obj.userDetails = function(data){  
            var deferred = $q.defer();
            $http.get(config.apiFileds +"users",  configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });            
            return deferred.promise;
        }


        obj.getConvert = function(data){  
            var deferred = $q.defer();
            $http.get(config.apiAccount +"convert/get?input_param="+data,  configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });            
            return deferred.promise;
        }

        obj.convertAccount = function(data){ 

         var deferred = $q.defer();

         $http({
            url:  config.apiAccount + "convert",
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
               // toastr.error('something went wrong please try again', 'Error');
              }else{
                //toastr.success('convert done', 'Success');
              }
              
          }).error(function () {
              //toastr.error('something went wrong please try again', 'Error');
              deferred.reject();
         });

         return deferred.promise;

     }

        obj.shareAccount = function(data){ 

         var deferred = $q.defer();

         $http({
            url:  config.apiAccount + "share",
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
                //toastr.error('something went wrong please try again', 'Error');
              }else{
                //toastr.success('share done', 'Success');
              }
              
          }).error(function () {
              //toastr.error('something went wrong please try again', 'Error');
              deferred.reject();
         });

         return deferred.promise;

     }

    obj.assignAccount = function(data){ 

         var deferred = $q.defer();

         $http({
            url:  config.apiAccount + "assign",
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
               // toastr.error('something went wrong please try again', 'Error');
              }else{
                //toastr.success('share done', 'Success');
              }
              
          }).error(function () {
             // toastr.error('something went wrong please try again', 'Error');
              deferred.reject();
         });

         return deferred.promise;

     }

        obj.getWorkflows = function(data){  
            var deferred = $q.defer();
            $http.get(config.apiAccount +"workflows/get?input_param="+data,  configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });            
            return deferred.promise;
        }

        obj.applyWorkflows = function(data){  
            var deferred = $q.defer();
            $http.get(config.apiAccount +"workflows/get?input_param="+data,  configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });            
            return deferred.promise;
        }

        obj.detailAccountsDetails = function(data){  
            var deferred = $q.defer();
            $http.get(config.apiAccount +""+data+"/detailview",  configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });            
            return deferred.promise;
        }

        obj.atrailAccountsDetails = function(data){  
            var deferred = $q.defer();
            $http.get(config.apiAccount +""+data+"/atrail",  configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });            
            return deferred.promise;
        }

        obj.editAccountsDetails = function(data){      
            var deferred = $q.defer();
            $http.get(config.apiAccount +"/"+data,  configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });            
            return deferred.promise;
        }

         obj.CustomizefieldsAccounts = function(data){      
            var deferred = $q.defer();
            $http.get(config.apiAccount +"customizefields/setup/save"+data,  configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });            
            return deferred.promise;
        }

        obj.changeSetupFields = function(data){      
            var deferred = $q.defer();
            $http.get(config.apiFileds +""+data +"/fields",  configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });            
            return deferred.promise;
        }

        obj.getSetupFields = function(data){  
            var deferred = $q.defer();
            $http.get(config.apiAccount +"setup/get?input_param="+data,  configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });            
            return deferred.promise;
        } 

        obj.saveSetupFields = function(data){ 

         var deferred = $q.defer();

         $http({
            url:  config.apiAccount + "setup/save",
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
               // toastr.error('something went wrong please try again', 'Error');
              }else{
               // toastr.success('share done', 'Success');
              }
          }).error(function () {
              deferred.reject();
         });

         return deferred.promise;

     }

      obj.saveAccount = function(data){ 

         var deferred = $q.defer();

         $http({
            url:  config.apiAccount + "save",
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
               // toastr.error('something went wrong please try again', 'Error');
              }else{
               // toastr.success('share done', 'Success');
              }
          }).error(function () {
              deferred.reject();
         });

         return deferred.promise;
     }

         obj.deleteAccount = function(data){ 

         var deferred = $q.defer();

         $http({
            url:  config.apiAccount + "delete",
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
              //  toastr.error('something went wrong please try again', 'Error');
              }else{
               // toastr.success('share done', 'Success');
              }
              
          }).error(function () {
              //toastr.error('something went wrong please try again', 'Error');
              deferred.reject();
         });

         return deferred.promise;

     }

        obj.addNote = function(data){  
            var deferred = $q.defer();
            $http.get(config.apiAccount +"addNote?input_param="+data,  configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });            
            return deferred.promise;
        }

        return obj; 
     }    

 })();