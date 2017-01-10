(function () {

    'use strict';

    // Controller for get GET API
    angular.module('soffrontApp').controller('homeCtrl', homeCtrl);

    function homeCtrl($scope, $rootScope, $http, $timeout, $q, $state, config, toastr, $localStorage, $sessionStorage, homeDataServices) {

        if( $sessionStorage.SessionToken == undefined){
             $state.go('sessionexpired');
         }else{


          $scope.emailID = $sessionStorage.loginEmail;
          $scope.userName = $sessionStorage.loginUsername ;

            console.log('$scope.userName : ',  $scope.userName)

        $scope.getModule = function () {
            homeDataServices.getModuleList().then(function (data) {

                $scope.moduleList = data.data.modules;
                $scope.moduleItem = [];
                $scope.moduleItem2 = [];
                $scope.moduleItem3 = [];
                $scope.moduleItem4 = [];

                 angular.forEach(data.data.modules, function (value, key) {
                     if(value.module == 'Marketing'){
                         angular.forEach(value.module_items, function (value, key) {
                              $scope.moduleItem.push({
                                name: value.name,
                                id:value.id
                            });
                        });
                     }else if(value.module == 'Sales'){
                         angular.forEach(value.module_items, function (value, key) {
                              $scope.moduleItem2.push({
                                name: value.name,
                                id:value.id
                            });
                        });
                     } else if(value.module == 'Service'){
                         angular.forEach(value.module_items, function (value, key) {
                              $scope.moduleItem3.push({
                                name: value.name,
                                id:value.id
                            });
                        });
                     }else if(value.module == 'Settings'){
                         angular.forEach(value.module_items, function (value, key) {
                              $scope.moduleItem4.push({
                                name: value.name,
                                id:value.id
                            });
                        });
                     }
                     
                });
            })
            .catch(function () {
                toastr.error('something went wrong please try again', 'Error');
            });
        }
        $scope.getModule();

    $scope.openNewFeature = function() {
       $scope.$modalInstance.close();
    };
        $scope.getFilterList = function(){

            homeDataServices.getFilterList().then(function (data) {
                $scope.FilterList = data.data.filters;
            })
            .catch(function () {
                toastr.error('something went wrong please try again', 'Error');
            });
        }
        $scope.getFilterList();

        $scope.colnameSelected = function(colname) {
            $scope.columnSort = colname;
        }

        $scope.openCalendar = function(){
            $scope.addTab({
                name: 'Calendar/Tasks'
            });
        }
        $scope.visible = false;
        $scope.toggle = function() {
            $scope.visible = !$scope.visible;
        };
        $scope.myvalue = true;
   
        $scope.showAlert = function(){
            $scope.myvalue = false;  
        }

        $scope.searchFilter = function () {

            var _data = {
                "module": "All",
                "module_id": "",
                "type": "",
                "item_id": "",
                "item_name": ""
            }

            homeDataServices.saveFilter(JSON.stringify(_data)).then(function (data) {
                console.log(data)

                $scope.tabs.push(
                    {
                        title: 'Results for Accounts='+''+ $scope.searchType,
                        url: 'view/filterTemplate.html'
                    }
                );

                $rootScope.currentTab = 'view/filterTemplate.html';

            })
            .catch(function () {
                toastr.error('something went wrong please try again', 'Error');
            });
        }
		
		$scope.advanceSearch = function(){
			$scope.tabs.push(
				{
					title: 'Adavance Search',
					url: 'view/advancedSearch.html'
				}
			);
		}

        $scope.activeTabIndex = 0
        
        $scope.homeShow = true;
        $scope.showMe = function(tab){
            // alert(tab.title);
            if(tab.title == 'Home'){
                $scope.homeShow = true;
            }else{
                $scope.homeShow = false;
            }
        }        
        $scope.tabs = [
            {
                title: 'Home',
                url: ''
            }
        ];
        $rootScope.addTab = function(tab) {  
            console.log('addTab : ', tab)
            if(tab.name == 'Sales Templates'){
                $scope.homeShow = false;
                var tabName = tab.name;
                var url = 'view/sales/sales-template/sales.html';
            }else if(tab.name == 'Calendar/Tasks'){
                $scope.homeShow = false;
                var tabName = tab.name;
                var url = 'view/sales/calendar/calendarModuleView.html';
            }else if(tab.name == 'Accounts'){
                $scope.homeShow = false;
                var tabName = tab.name;
                var url = 'view/sales/accounts/account.html';
            }else if(tab.name == 'Opportunities'){
                $scope.homeShow = false;
                var tabName = tab.name;
                var url = 'view/sales/opportunities/opportunities.html';
            }else if(tab.name == 'Reports'){
                $scope.homeShow = false;
                var tabName = 'Sales Reports';
                var url = 'view/sales/reports/reportMenu.html';
            }else if(tab.name == 'Create Sales Template'){
                $scope.homeShow = false;
                var tabName = tab.name;
                var url = 'view/sales/sales-template/addSalesTemplate.html';
            }else if(tab.name == 'Edit Sales Templates'){
                $scope.homeShow = false;
                var tabName = tab.name;
                var url = 'view/sales/sales-template/editSalesTamplate.html';
            }else if(tab.name == 'Copy Sales Templates'){
                $scope.homeShow = false;
                var tabName = tab.name;
                var url = 'view/sales/sales-template/copySalesTemplate.html';
            }else if(tab.name == 'Account Details'){
                $scope.homeShow = false;
                var tabName = tab.title;
                var url = 'view/sales/accounts/detailsAccounts.html';
            }else if(tab.name == 'Edit Accounts'){
                $scope.homeShow = false;
                var tabName = tab.title;
                var url = 'view/sales/accounts/editAccounts.html'
            }else if(tab.name == 'Accounts Merge'){
                $scope.homeShow = false;
                var tabName = tab.name;
                var url = 'view/sales/accounts/margeMail.html'
            }else if(tab.name == 'Create Accounts'){
                $scope.homeShow = false;
                var tabName = tab.name;
                var url = 'view/sales/accounts/editAccounts.html'
            }else if(tab.name == 'company'){
                 $scope.homeShow = false;
                 var tabName = tab.title;
                var url = 'view/sales/opportunities/companyDetails.html'
            }else if(tab.name == "edit"){
                $scope.homeShow = false;
                var tabName = tab.title;
                var url ='view/sales/opportunities/signleEdit.html';
            }else if(tab.name == 'Create Opportunities'){
                $scope.homeShow = false;
                var url ='view/sales/opportunities/signleEdit.html';
            }else if(tab.name == 'Add Filter'){
                $scope.homeShow = false;
                var tabName = tab.name;
                var url ='view/sales/opportunities/addFilter.html';
            }else if(tab.name ==  'Copy Records'){
                $scope.homeShow = false;
                var tabName = tab.name;
                var url ='view/sales/accounts/editAccounts.html';
            }else if(tab.name == 'Marketing Templates'){
                var tabName = tab.name;
                $scope.homeShow = false;
                var url ='view/marketing/marketing-template/marketing.html';
            }else if(tab.name == 'Create Marketing Templates'){
                var tabName = tab.name;
                $scope.homeShow = false;
                var url ='view/marketing/marketing-template/create_marketing_template.html';
            }else if(tab.name == 'Contacts'){
                var tabName = tab.name;
                $scope.homeShow = false;
                var url ='view/marketing/contact/account.html';
            }else if(tab.name == 'Web Forms'){
                var tabName = tab.name;
                $scope.homeShow = false;
                var url ='view/marketing/webforms/webform.html';
            }else if(tab.name == 'Contact Details'){
                $scope.homeShow = false;
                var tabName = tab.title;
                var url = 'view/marketing/contact/detailsAccounts.html';
            } else if(tab.name == 'Create Web Forms'){
                var tabName = tab.name;
                $scope.homeShow = false;
                var url ='view/marketing/webforms/createWebForms.html';
            } else if(tab.name == 'Geeting Started'){
                var tabName = tab.name;
                $scope.homeShow = false;
                var url ='view/marketing/webforms/webFormGettingStarted.html';
            } else if(tab.name == 'Edit webform'){
                var tabName = tab.title;
                $scope.homeShow = false;
                var url ='view/marketing/webforms/create_web_forms_edit-opt.html';
            } else if(tab.name == 'Preview'){
                var tabName = tab.name;
                $scope.homeShow = false;
                var url ='view/marketing/webforms/webform_preview.html';
            } else if(tab.name == 'copy marketing Templates'){
                var tabName = tab.name;
                $scope.homeShow = false;
                var url ='view/marketing/marketing-template/copy_marketing _template.html';
            }else if(tab.name == 'Getting Started'){
                var tabName = tab.name;
                $scope.homeShow = false;
                var url ='view/marketing/marketing-template/getting_started_marketing_click_video.html';
            }else if(tab.name == 'Copy webform'){
                 var tabName = tab.title;
                 $scope.homeShow = false;
                 var url ='view/marketing/webforms/createWebForms.html';
            } 


            var newTab = {
                title: tabName,
                url: url,
                id: tab.id
            };

            console.log('Tab ID:',tab.id );

            // if($scope.tabs.id == tab.id){
            //     alert('Same id')
            // }else{
            //     alert('no same ')
            // }
            if ($scope.tabs.length < 15) {
                $scope.tabs.push(newTab); 
            }else{
                alert('You have reached the maximum number of tabs that you can add.');
            }
            $timeout(function(){
              $scope.activeTabIndex = ($scope.tabs.length - 1);
            });
            console.log($scope.activeTabIndex);

        };
        
        console.log('Tabs List : ', JSON.stringify($scope.tabs));

        $scope.removeTab = function (index) {
            $scope.tabs.splice(index, 1);
            if($scope.tabs.length == 1){
                 $scope.homeShow = true;
            }
        };

        $rootScope.logout = function () {
            $localStorage.$reset()
            $sessionStorage.$reset();
            $state.go('jtrackLogin');          
        }
    }

    }

})();
(function () {
    'use strict';
    // Service for get GET API
    angular.module('soffrontApp').factory('homeDataServices', homeDataServices);
    function homeDataServices($q, $http, config, toastr, $sessionStorage) {
        var obj = {};
        var configHeader = {
            headers: {
                Authentication: JSON.stringify($sessionStorage.SessionToken)
            }
        }
        obj.getModuleList = function () {

            var deferred = $q.defer();

            $http.get(config.apiFileds + "home/get", configHeader).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject();
            });

            return deferred.promise;
        }
        obj.getFilterList = function () {
            var deferred = $q.defer();
            $http.get(config.apiFileds + "home/filters", configHeader).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject();
            });
            return deferred.promise;
        }

        obj.saveFilter = function(data){ 
             var deferred = $q.defer();
             $http({
                url:  config.apiFileds + "home/filters/save",
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