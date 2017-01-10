(function () {

     'use strict';
      // Service for get GET API
     angular.module('webform').factory('webformsDataService', webformsDataService);

     function webformsDataService($q, $http,$httpParamSerializer, config,  $sessionStorage) {
      
        var obj = {};

        var configHeader = {
          headers: {
                  Authentication: JSON.stringify($sessionStorage.SessionToken),
                  'Content-Type' : 'application/x-www-form-urlencoded',
                  'dataType' : 'jsonp'
              }
        }

        /*For deleteing webform template - to delete row of table*/
        obj.deleteWebForms = function(row){
         var dataField = $httpParamSerializer(
              {
               input_param:{
                'id' :row
               }
              } 
             );
         var deferred = $q.defer();
         $http.post(config.apiWebForms +"delete",dataField,configHeader).success(function(row){
             deferred.resolve(row);          
         })
         .error(function(){
          deferred.reject();
         });
         return deferred.promise;
         
        }

           // Edit opt-in form 
        obj.getOptInForm = function(data){
        	var deferred = $q.defer();
        	$http.get(config.apiWebForms +"/"+data, configHeader).success(function(data){
        		deferred.resolve(data);
        	})
        	.error(function(){
        		deferred.reject();
        	});
        	 return deferred.promise;
        }
        
        
        obj.getWebformDetails = function(){
          
var dataField = $httpParamSerializer(
              {
                input_param:{
                 "group_by_field_name": "",
               "group_by_condition": "",
               "search_field_name": "",
               "search_text": "",
               "sort_field_name": "",
               "sort_type": "",
               "start_index": 1,
               "page_size":20
                }
              }
              );

          var deferred = $q.defer();
        console.log(config.apiWebForms +"get/listview?"+dataField);
          $http.get(config.apiWebForms +"get/listview?"+dataField, configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });          
            return deferred.promise;
        }

      
        /*webform template list view api call with parameter start*/
       
        //group_by_field_name when we change the category,owner or status
        obj.getListViewByFieldName = function(fieldName){
        var dataField = $httpParamSerializer(
              {
                input_param:{
                  "group_by_field_name": fieldName.name
                }
              }
              );
            var deferred = $q.defer();
            $http.get(config.apiWebForms +"get/listview?"+dataField,configHeader).success(function(data) {
                deferred.resolve(data);
              })
              .error(function() {
                deferred.reject();
              });          
              return deferred.promise;
          }
        
        //group by condition such as when we click on the category then Newsteller (group_by_condition)
        obj.getListViewByCondition = function(groupByCondition)
        {
          var dataField = $httpParamSerializer(
            {
              input_param:{
                'group_by_field_name' : groupByCondition.menu,
                'group_by_condition' : groupByCondition.condition 
              }
            } 
          );
          
          console.log("dataFields ="+dataField);
          
            var deferred = $q.defer();
            $http.get(config.apiWebForms +"get/listview?"+dataField,configHeader).success(function(data) {
                deferred.resolve(data);
              })
              .error(function() {
                deferred.reject();
              });          
              return deferred.promise;
        }
        
        
    /*    parameter call end here*/
        
        obj.createSalesDetails = function(){
            
          var deferred = $q.defer();

            $http.get(config.salesAccount +"new", configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });
            
            return deferred.promise;

        }

        obj.saveSalesDetails = function(data){
            
           console.log(data);

          var deferred = $q.defer();

            $http.post(config.salesAccount +"save", data, configHeader).success(function(data) {
              deferred.resolve(data);
            })
            .error(function() {
              deferred.reject();
            });
            
            return deferred.promise;

        }
        
/*For deleteing webform template - to delete row of table*/
        
        obj.deleteMarketTemplate= function(row){
          console.log(row);
          var dataField = $httpParamSerializer(
                {
                  input_param:{
                    'id' :row
                  }
                } 
              );
          var deferred = $q.defer();
          $http.post(config.apiWebForms +"delete",dataField,configHeader).success(function(row){
             deferred.resolve(row);           
          })
          .error(function(){
            deferred.reject();
          });
          return deferred.promise;
          
        }

        // For Search Field
        obj.getListViewBySearchBox = function(fieldName){
          var dataField = $httpParamSerializer({
              input_param:{
                "group_by_field_name": fieldName.groupBy,
                "search_field_name": fieldName.searchBy,
                "search_text": fieldName.searchText
              }
            });
            var deferred = $q.defer();
            $http.get(config.apiWebForms +"get/listview?"+dataField,configHeader).success(function(data) {
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