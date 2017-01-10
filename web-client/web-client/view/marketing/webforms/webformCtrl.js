(function () {

    'use strict';

    angular.module('webform', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.selection']);

})();

    
(function () {

    var rowData = [];
    'use strict';

    angular.module('webform').controller('webformCtrl', webformCtrl);

    function webformCtrl($scope,$uibModal, $timeout,uiGridConstants, webformsDataService, $rootScope, $state) {
          
            /*$rootScope.openTab = function(tab) { 
                //alert("crtlMar");
              if(tab == 'Create Webform Templates'){
              var url = 'view/webforms/create_webforms_template.html';
            }

            var newTab = {
                title: tab,
                url: url
            };

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

        $scope.removeTab = function (index) {
            $scope.tabs.splice(index, 1);
            if($scope.tabs.length == 1){
                 $scope.homeShow = true;
            }
        }*/



 $scope.copyWebForm = function() {
                console.log(rowData);
                $scope.addTab({
                    name: 'Copy webform',
                    title : 'Copy '+rowData[0].entity.name
                });
        };

         $scope.closeInnerTemplate = function(templateName){
            var incrTab;
            templateName = 'Copy '+rowData[0].entity.name;
            for(incrTab = 0; incrTab < $scope.tabs.length; incrTab++){
                if(templateName == $scope.tabs[incrTab].title){
                    $scope.tabs.splice(incrTab, 1);
                    if($scope.tabs.length == 1){
                         $scope.homeShow = true;
                    }       
                }
            }
        }


        /*delete webform template code - to delete row of table*/
        $scope.deleteWebForms = function(){
         var arr=[];
         for(var i=0;i<rowData.length;i++)
          {
           arr.push(+rowData[i].entity.recordId);
          }
          rowData.splice(0);
          webformsDataService.deleteWebForms(arr).then(function(data){
              $scope.selectedRows = [];
              $scope.singleSelect = false;
           $scope.refresh();
         })
          .catch(function () {
                 $scope.error = 'data not fount';
             });
        }



        $scope.refresh = function () {
            webformsDataService.getWebformDetails().then(function (data) {
                 //menu items
                $scope.menuData=[
                               {label:'Table Name',name:'tableName'},
                               {label:'Status',name:'status'},
                               {label:'All',name:'all'}
                ];
                $scope.searchMenuData=[
                               {label:'Name',name:'name'},
                               {label:'Source',name:'source'},
                               {label:'Status',name:'status'},
                              {label:'All',name:'all'}
                ];
                console.log("fdf");
                console.log(data);
                $scope.columnSort = $scope.searchMenuData[0];
                $scope.salesData = data;
                $scope.gridOptions1.data = data.data.records;
            })
                .catch(function () {
                    $scope.error = 'data not fount';
                });
        }
        
      
        
        /*delete market template code - to delete row of table*/
        $scope.deleteMarketTemplate = function(){
            var arr=[];
            
            console.log("before for loop"+rowData.length);
            
            for(var i=0;i<rowData.length;i++)
                {
                    console.log(" i"+i+"  "+rowData[i].entity.id)
                    arr.push(rowData[i].entity.id);
                }
             rowData.splice(0);
            console.log("after for loop"+rowData.length);
            webformsDataService.deleteWebforms(arr).then(function(data){
                    $scope.refresh();
            })
             .catch(function () {
                 $scope.error = 'data not fount';
             });
        }

            
            $scope.openMarketingPage = function ()
                   {
                          $scope.addTab('Create Marketing Templates');
                }



        
 $scope.anotherRefresh = function (group)
        {
                    
     webformsDataService.getListViewByFieldName(group).then(function (data) {
                         $scope.salesData = data;
                         $scope.gridOptions1.data = data.data.records;
              })
                  .catch(function () {
                      $scope.error = 'data not fount';
                  });
        };
        
     // view template according to vikash sir.
        $scope.clickEvent= function(templateName){
        if(templateName==="creatingtemplates"){
            $state.go('creatingtemplates');
        }else if(templateName==="create_webforms_template_preview_Banner_Promotion_Multiple_Column"){
            $state.go('create_webforms_template_preview_Banner_Promotion_Multiple_Column');
        }
         
        }
        
        $scope.filterByFieldName = function (fieldName,condition)
        {
            
            var groupByCondition = {
                    menu : fieldName,
                    condition : condition
            };
            
            console.log(groupByCondition);
            webformsDataService.getListViewByCondition(groupByCondition).then(function (data){
                $scope.gridOptions1.data = data.data.records;
            }).catch(function (){
                $scope.error = 'data not found';
            });
        };

        $scope.refresh();

        $scope.getTableHeight = function () {
            var rowHeight = 30; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.gridData.data.length * rowHeight + headerHeight) + "px"
            };
        };

        $scope.gridOptions1 = {
            rowHeight: 30,
            multiSelect: true,
            enableFiltering: true,
            enableFooterTotalSelected: true,
            showGridFooter: true,
            enableSorting: true,
            enableColumnMenus: false,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0
        };

       /* $scope.gridOptions1.columnDefs = [
                                          { field: 'assignTo',
                                            displayName: 'Assign To', 
                                            cellTemplate: '<div class="ui-grid-cell-contents clickable" ng-click="grid.appScope.accountsDetails(row.entity.id)" >{{ row.entity.assignTo}}</div>', },
                                          { field: 'name', displayName: 'Name' },
                                          { field: 'tableName', displayName: 'Table Name' },
                                          { field: 'group', displayName: 'Group' },
                                          { field: 'source', displayName: 'Source' },
                                          { field: 'status', displayName: 'Status' }
        ],*/

        $scope.gridOptions1.columnDefs = [
                                          { field: 'assignTo',
                                            displayName: 'Assign To'},
                                          { field: 'name', displayName: 'Name',
                                                cellTemplate: '<div class="ui-grid-cell-contents clickable" ng-click="grid.appScope.editWebform(row.entity)" >{{ row.entity.name}}</div>',},
                                          { field: 'tableName', displayName: 'Table Name' },
                                          { field: 'group', displayName: 'Group' },
                                          { field: 'source', displayName: 'Source' },
                                          { field: 'status', displayName: 'Status' }
        ],
            //   $scope.gridOptions1.columnDefs = [{
            //     field: 'name',
            //     name: 'Name',
            //     cellTemplate: '<div class="ui-grid-cell-contents clickable" ng-click="grid.appScope.accountsDetails(row.entity.id)" >{{ row.entity.name}}</div>',
            //     width: 100,
            //     enableFiltering: false
            // }, ];
            $scope.accountsDetails = function (id) {
                // alert(id);
                // view/sales/sales-template
                $rootScope.currentTab = 'view/webforms/creatingtemplates.html';
                console.log("fdsfsd="+$rootScope.currentTab);
            };

            /*$scope.editWebform = function (id) {
                $scope.addTab({
                    name: 'Edit webform'
                });
               
            };
*/
        
         // Edit opt-in form 
               $scope.editWebform = function(entity) {
                webformsDataService.getOptInForm(entity.recordId).then(function(data) {
                	console.log("dfdsf");
                	console.log(data);
                   // $rootScope.editData = data.data.records;
                    //$scope.data = $rootScope.editData;
                	$scope.data = data;
                	$scope.myName = "neeraj";
                    console.log("Edit data ", data);
                    if (data.status == 0) {
                        $scope.addTab({
                            name: 'Edit webform',
                            title : 'Edit '+entity.assignTo
                        });
                    }
                })
                .catch(function() {

                });
            };
           
        $scope.selectedRows = [];
        $scope.gridOptions1.onRegisterApi = function (gridApi) {
            console.log('onRegisterApi');
            $scope.gridApi = gridApi;
            $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected == true) {
                    console.log('this row is selected', row);
                    $scope.selectedRows.push(row);
                    rowData.push(row);
                    //  console.log($scope.selectedRows);
                } else {
                    var index = $scope.selectedRows.indexOf(row);
                    $scope.selectedRows.splice(index, 1);
                    console.log("before slice"+rowData);
                    rowData.splice(index,1);
                    console.log("splice rowData else"+rowData);
                    $scope.singleSelect = false;
                    console.log('this row is unselected', row);
                    //  console.log($scope.selectedRows);
                }
                console.log($scope.selectedRows);
                if ($scope.selectedRows.length == 1) {
                    console.log('single row is selected');
                    $scope.singleSelect = true;
                    $scope.multipleSelect = false;
                } else
                    if ($scope.selectedRows.length >= 2) {
                        $scope.singleSelect = false;
                        $scope.multipleSelect = true;

                    }

            })
            var selectAllFlag = false;
            $scope.gridApi.selection.on.rowSelectionChangedBatch($scope, function (row) {
                if (selectAllFlag == false) {
                    $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                        $scope.multipleSelect = true;
                        $scope.singleSelect = false;
                        $scope.selectedRows.push(row);
                    });
                    selectAllFlag = true;
                    console.log('selectAllFlag:', selectAllFlag);
                } else {
                    $scope.gridApi.selection.clearSelectedRows();
                    selectAllFlag = false;
                    $scope.multipleSelect = false;
                    $scope.singleSelect = false;
                    $scope.selectedRows = [];
                }
                console.log($scope.selectedRows);

            });
        };

        $scope.getTableHeight = function () {
            var rowHeight = 30; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.gridOptions1.data.length * rowHeight + headerHeight) + "px"
            };
        };

        // $scope.gridOptions1.columnDefs = [
        //   {field: 'first_name', name: 'First Name', cellTemplate:  '<div class="ui-grid-cell-contents clickable" ng-click="grid.appScope.accountsDetails(row.entity.id)" >{{ row.entity.first_name}}</div>', width: 100 , enableFiltering: false},
        // ];

        // $scope.accountsDetails = function(id){
        //     alert(id);
        // };

        $scope.colnameSelected = function (colname) {
            $scope.columnSort = colname;
        }
            
        $scope.groupSelected = function (group) {
            $scope.groupSort = group;
            $scope.anotherRefresh(group);
        }
        
        $scope.animationsEnabled = true;


        $scope.deleteSalesTemplate = function () {
            console.log('salesTemplate---->editSalesTemplate-->saveSalesTemplate');
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/sales-template/deleteSalesTemplate.html',
                // controller: 'deletePopupCtrl',
                // controllerAs: '$ctrl',
                size: 'sm',
                //                resolve: {
                //                    deleteTemplateID: function () {
                //                        return $ctrl.items;
                //                    }
                //                }

            });
        }
        $scope.searchInList = function(){
            var searchByCondition = {
                groupBy: $scope.groupSort.name,
                searchBy: $scope.columnSort.name,
                searchText: $scope.searchByInputField
            };
            webformsDataService.getListViewBySearchBox(searchByCondition).then(function (data){
                $scope.gridOptions1.data = data.data.records;
            }).catch(function (){
                $scope.error = 'data not found';
            });
        }

    }
   

})();

(function () {

    'use strict';

    angular.module('webform').controller('ModalInstanceSalesCtrl', ModalInstanceSalesCtrl);

    function ModalInstanceSalesCtrl($scope, $uibModalInstance, modelType) {

        $scope.ok = function () {
            $uibModalInstance.close('open');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();


/*(function () {

    'use strict';

    angular.module('webform').controller('createSalesTemplatesCtrl', createSalesTemplatesCtrl);

    function createSalesTemplatesCtrl($scope, $uibModal, webformsDataService) {

        $scope.tempObject = [{
            "title": "Personalize",
        }],

            $scope.refresh = function () {
                salesDataServices.createSalesDetails().then(function (data) {
                    $scope.newSalesData = data;
                    angular.forEach(data.data.available_mail_merge_fields, function (value, key) {
                        angular.forEach(value, function (value, key) {
                            $scope.tempObject.push({
                                "title": value,
                            });
                        });
                    });
                })
                    .catch(function () {
                        $scope.error = 'data not fount';
                    });
            }
        $scope.refresh();

        $scope.saveSalesTemplate = function (id) {
            webformsDataService.saveSalesDetails(id);
        }
    }

})();*/


/*(function () {

    'use strict';

    angular.module('webform').controller('editSalesTemplatesCtrl', editSalesTemplatesCtrl);

    function editSalesTemplatesCtrl($scope, $uibModal, webformsDataService) {

        $scope.tempObject = [{
            "title": "Personalize",
        }],
            $scope.copySaleTemplate = function () {
                console.log('copySaleTemplate');
                $scope.hideButton = false;
                console.log($scope.hideButton);


            };
        $scope.mailMarges = ['Addres1', 'Address2', 'Address3'];

        //        Add mailmarage start
        $scope.addMailMarge = function () {
            console.log('editSalesTemplateCtrl addMailMarge');
            var arrray = [];
            arrray.push(document.getElementById("myText").value);
            console.log(arrray);
            arrray.push($scope.selectedData);
            //            arrray.join();
            document.getElementById("myText").value = arrray.join(',');
        }
        $scope.refresh = function () {
            webformsDataService.createSalesDetails().then(function (data) {
                $scope.newSalesData = data;
                angular.forEach(data.data.available_mail_merge_fields, function (value, key) {
                    angular.forEach(value, function (value, key) {
                        $scope.tempObject.push({
                            "title": value,
                        });
                    });
                });
            })
                .catch(function () {
                    $scope.error = 'data not fount';
                });
        }
        $scope.test = function () {
            console.log('salesTemplate---->editSalesTemplate-->test');
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/sales-template/testMail.html',
                controller: 'testMailCtrl',
                size: 'md',
                //                resolve: {
                //                    deleteTemplateID: function () {
                //                        return $ctrl.items;
                //                    }
                //                }

            });
        }


        $scope.refresh();

        $scope.saveSalesTemplate = function (id) {
            salesDataServices.saveSalesDetails(id);
        }
    }

})();*/
/*(function () {

    'use strict';

    angular.module('webform').controller('copySalesTemplatesCtrl', copySalesTemplatesCtrl);

    function copySalesTemplatesCtrl($scope, $uibModal, webformsDataService) {

        $scope.tempObject = [{
            "title": "Personalize",
        }],

            $scope.refresh = function () {
            webformsDataService.createSalesDetails().then(function (data) {
                    $scope.newSalesData = data;
                    angular.forEach(data.data.available_mail_merge_fields, function (value, key) {
                        angular.forEach(value, function (value, key) {
                            $scope.tempObject.push({
                                "title": value,
                            });
                        });
                    });
                })
                    .catch(function () {
                        $scope.error = 'data not fount';
                    });
            }
        $scope.refresh();

        $scope.saveSalesTemplate = function (id) {
            webformsDataService.saveSalesDetails(id);
        }
    }

})();*/
/*(function () {

    'use strict';

    angular.module('webform').controller('testMailCtrl', testMailCtrl);

    function testMailCtrl($scope, $uibModal) {
        $scope.checkSpam = function (ticked) {
            console.log(ticked);
            if ($scope.checked == 'true') {
                console.log('checked True');
                $scope.spamCheck = true;
                $scope.sendTo = 'ravi@inflexonpoint.com';
            } else {
                console.log('checked false');
            }
        }
        $scope.sendMail = function () {
            console.log('salesTemplate---->editSalesTemplate-->sendMail()');
            if ($scope.sendTo == '' || $scope.sendTo == null) {
                alert('please enter email address');
            } else {

                var input_param = {
                    "template_name": "Template-001",
                    "to_email": $scope.sendTo,
                    "is_check_spam": $scope.spamCheck
                }
                var authToken = "'" + token.value + "'";
                console.log(authToken);
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "https://testapi.snapshotcrm.com/v3/salestemplates/testemail",
                    "method": "POST",
                    "headers": {
                        "authentication": { "token": authToken },
                        "content-type": "application/json",
                    }
                }

                $.ajax(settings).done(function (response) {
                    console.log(response);
                });
            }
        }

    }

})();*/