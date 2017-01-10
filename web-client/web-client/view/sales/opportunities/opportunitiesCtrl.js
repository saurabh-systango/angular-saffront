(function () {

    'use strict';

    angular.module('opportunities', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.selection']);

})();


(function () {

    'use strict';

    angular.module('opportunities').controller('opportunitiesCtrl', opportunitiesCtrl);

    function opportunitiesCtrl($scope, $rootScope, toastr, $filter, $uibModal, uiGridExporterService, uiGridExporterConstants, opportunitiesDataServices, uiGridConstants) {
        $rootScope.opDetailsTabs = [
            {
                title: 'Notes',
                url: 'view/sales/accounts/contact.html'
            },
            {
                title: 'Appointment',
                url: 'view/sales/sales-template/sales.html'
            },
            {
                title: 'Account',
                url: 'view/sales/accounts/account.html'
            },
            {
                title: 'Cases',
                url: 'view/sales/sales-template/sales2.html'
            },
            {
                title: 'Attachment',
                url: 'view/sales/sales-template/sales3.html'
            },
            {
                title: 'Group',
                url: 'view/sales/sales-template/sales4.html'
            }
        ];

        $rootScope.oppDetailCurrentTab = 'view/sales/accounts/contact.html';

        $scope.onClickTab = function (tab) {
            $rootScope.oppDetailCurrentTab = tab.url;

        }

        $scope.isActiveTab = function (tabUrl) {
            return tabUrl == $rootScope.oppDetailCurrentTab;
        }

         $scope.CloseMe = function(){
              $scope.visible2 = false;
        }

        $scope.actionDetail = function(action) {

            if (action == 'refresh') {
                $scope.accountsDetails();
            } else if (action == 'edit') {
                $scope.addTab({
                    name: 'edit',
                    title : 'edit'
                });
            } else if (action == 'delete') {
                $scope.delete();
            } else if (action == 'copy') {
                $scope.addTab({
                    name: 'Copy Records'
                });
            } else if (action == 'groups') {
                $scope.addGroupAccountsTemplate()
            } else if (action == 'map') {
                $scope.viewGoogleMapAccountsTemplate()
            } else if (action == 'assign') {
                $scope.assignAccountsTemplate()
            } else if (action == 'share') {
                $scope.shareWithAccountsTemplate()
            } else if (action == 'workflow') {
                $scope.workflow()
            } else if (action == 'print') {
                window.print();
            }

        }

        $scope.gridOptions1 = {
            rowHeight: 30,
            multiSelect: true,
            enableFooterTotalSelected: true,
            exporterCsvFilename: 'Opportunities_Resultset.csv',
            showGridFooter: true,
            enableSorting: true,
            enableColumnMenus: false,
            paginationPageSizes: [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200],
            cpaginationPageSize: 25,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0
        };		
        $scope.selectedRows = [];
        $scope.gridOptions1.columnDefs = [];
        $scope.gridOptions1.onRegisterApi = function (gridApi) {
            console.log('onRegisterApi');
            $scope.gridApi = gridApi;
            $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row) {

                if (row.isSelected == true) {
                    $scope.rowChangedValue = row.entity.id;
                    $scope.selectedRows.push(row.entity.id);
                    $rootScope.deleteId = {};
                    $rootScope.deleteId.id = $scope.selectedRows;
                } else {
                    var index = $scope.selectedRows.indexOf(row);
                    console.log(index)
                    $scope.selectedRows.splice(index, 1);
                    $scope.singleSelect = false;
                    console.log('this row is unselected', row);
                    //  console.log($scope.selectedRows);
                }
                console.log($scope.selectedRows);
                if ($scope.selectedRows.length == 1) {
                    console.log('single row is selected');
                    $scope.singleSelect = true;
                    $scope.multipleSelect = false;
                } else if ($scope.selectedRows.length >= 2) {

                    console.log('$scope.selectedRows.length >= 2');
                    $scope.singleSelect = true;
                    $scope.multipleSelect = true;
                }

            })
            var selectAllFlag = false;
            $scope.gridApi.selection.on.rowSelectionChangedBatch($scope, function (row) {

                console.log('Multi row selected');
                if (selectAllFlag == false) {
                    $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                        $scope.multipleSelect = true;
                        $scope.singleSelect = true;
                        //  $scope.rowChangedValue = row.entity.id;
                       // $scope.selectedRows.push({ 'id': row.entity.id });
                    });
                    $rootScope.selectedRowsDelete = $scope.selectedRows.length;
                    console.log($rootScope.selectedRowsDelete);
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
        $scope.fieldList = function() {
            opportunitiesDataServices.getAccountFiled().then(function(data) {
                $scope.fieldList = data.data.fields;
            })
            .catch(function() {
            });
        }

        $scope.fieldList();

        $scope.accountsDetails = function(id) {
            opportunitiesDataServices.detailAccountsDetails(id).then(function(data) {
                $rootScope.detailsData = data;
                    if(data.status == 0){
                        $scope.addTab({
                            name: 'company',
                            title: data.data.title
                        });
                }
            })
            .catch(function() {
                 
            });
            
        };

        $scope.groupSort = { label: 'Status' };
        
        $rootScope.groupLabel = 't_status'
        $scope.groupSelected = function (group) {
            $scope.groupSort = group;
            $scope.groupLabel = group.name;
            $rootScope.refresh();
        }

        $scope.isGroupByFiled = 'Status';

        $scope.groupByFiled = function (val) {
            $scope.isGroupByFiled = val;
        }

       


       // $scope.filterSort = { label :'All Opportunities'};
       //  //$rootScope.filterLabel = 't_status'
       //  $scope.filterSelected = function(filter) {
       //      $scope.filterSort = filter;
       //      //console.log(filter)
       //      $scope.filterName = filter.name; 
       //      $rootScope.refresh();
       //  }

       //  $scope.idSelectedAppointment = ' All Opportunities';

       //  $scope.setSelectedAccount = function (val) {
       //      $scope.idSelectedAppointment = val;
       //  }

       //   $scope.colnameSelected = function (colname) {
       //      $scope.columnSort = colname;
       //  }

       //  $scope.filterSort = {
       //      label: 'All'
       //  };

        $scope.filterSelected = function(filter) {
            $scope.filterSort = filter;
        }

        $scope.group_by_field_name = 't_status'
        $scope.groupSelected = function(group) {
            $scope.groupSort = group;
            $scope.group_by_field_name = group.name;
            console.log(group)
            $rootScope.refresh();
        }

        $scope.idSelectedAppointment = 'All Opportunities';
        $scope.query_name = 'All';
        $scope.setSelectedAccount = function(val) {
            $scope.idSelectedAppointment = val;
            $scope.query_name = val;
            $rootScope.refresh();
        }

   
        $scope.colnameSelected = function (colname) {
            $scope.columnSort = colname;
            $scope.search_field_name = colname.name;
            $rootScope.refresh();
        }

        $scope.isGroupByFiled = 'Status';

        $scope.groupByFiled = function(val) {
            $scope.isGroupByFiled = val;
            $rootScope.refresh();
        }


        $scope.group_by_condition = "";
        $scope.filterBy = function(type){
            if(type == 'All'){
                $scope.group_by_condition = "";
                $rootScope.refresh();                  
            }else{
                $scope.group_by_condition = type;
                $rootScope.refresh();                  
            }
        } 


        $rootScope.refresh = function () {

             var _data = {
                "query_name":  $scope.query_name,
                "group_by_field_name": $scope.group_by_field_name,
                "group_by_condition" : $scope.group_by_condition,
                "search_field_name"  : $scope.search_field_name, 
                "search_text": $scope.searchText,
                "sort_type": "asc",
                "page_size" : 100
            };

            console.log(_data);
            opportunitiesDataServices.getAccountsDetails(JSON.stringify(_data)).then(function (data) {

                 $scope.selectedRows = [];
                 $scope.multipleSelect = false;
                 $scope.singleSelect = false;
                 $scope.searchText = '';

                 console.log('Data : ', JSON.stringify(data));
                $scope.accountData = data;
                angular.forEach(data.data.fields, function (value, key) {
                    if (!value.is_hidden) {
                        $scope.gridOptions1.columnDefs.push({
                            name: value.name,
                            displayName: value.label,
                            enableCellEdit: value.is_inline_edit,
                            cellTemplate: '<div ng-if="' + value.is_detail_link + ' == true" class="ui-grid-cell-contents clickable" ng-click="grid.appScope.accountsDetails(row.entity.id)" title="{{ row.entity.' + value.name + '}}">{{ row.entity.' + value.name + '}}</div> <div ng-if="' + value.is_detail_link + ' == false" class="ui-grid-cell-contents" title="{{ row.entity.' + value.name + '}}">{{ row.entity.' + value.name + '}}</div>',
                        });

                    }

                });

                $scope.gridOptions1.data = data.data.records;

                })
                .catch(function () {
                     
                });
        }

        $rootScope.refresh();

         $scope.getTableHeight = function () {
            var rowHeight = 30; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.gridOptions1.data.length * rowHeight + headerHeight) + "px"
            };
        };

         $rootScope.exportAllCSV = function() {
            var grid = $scope.gridApi.grid;
            var rowTypes = uiGridExporterConstants.ALL;
            var colTypes = uiGridExporterConstants.ALL;
            uiGridExporterService.csvExport(grid, rowTypes, colTypes);             
        };

        $rootScope.exportSelectedCSV = function() {
            var grid = $scope.gridApi.grid;
            var rowTypes = uiGridExporterConstants.SELECTED;
            var colTypes = uiGridExporterConstants.SELECTED;
            uiGridExporterService.csvExport(grid, rowTypes, colTypes);             
        };

        $scope.colnameSelected = function (colname) {
            $scope.columnSort = colname;
        }

        $scope.addFilter = function(){
            $scope.addTab({
                    name: 'Add Filter'
            });   
        }

         //Save Customize Filed API CALL
        $scope.saveCustomizeAPI = function () {

            var _data = {
                 "is_show_field_label": false,
                 "field_names":[
                    "company",
                    "workflow_name",
                    "t_status",
                    "Sales_rep"
                  ]
            }


            opportunitiesDataServices.saveCustomizeSields(JSON.stringify(_data)).then(function (data) {
               console.log(data);
            })
            .catch(function () {
                 
            });

        }
    $scope.accountsEdit = function (id) {
            opportunitiesDataServices.editOppsDetails($scope.rowChangedValue).then(function (data) {
                $rootScope.editData = data.data.records;

                if (data.status == 0) {
                    $scope.addTab({
                        name: 'edit',
                        title : data.data.records.title
                    });
                }
            })
            .catch(function () {
                 
            });
        };

        $rootScope.saveOpportinitiesData = function () {

            console.log('saveOpportinities data');
           
            var _data = {
               
            }


            opportunitiesDataServices.saveOppData(JSON.stringify(_data)).then(function (data) {
               console.log(data)
            })
            .catch(function () {
                 
            });
        };

         $scope.accountsEdit = function (id) {
            console.log($scope.rowChangedValue);
            opportunitiesDataServices.editOppsDetails($scope.rowChangedValue).then(function (data) {
                $rootScope.editData = data.data.records;
                console.log(data.data.records)
                if (data.status == 0) {
                    $scope.addTab({
                        name: 'edit',
                        title : data.data.records.name
                    });
                }
            })
            .catch(function () {
                 
            });
        };

        $rootScope.saveOpportinitiesData = function () {
            console.log('saveOpportinities data');           
            var _data = {}

            opportunitiesDataServices.saveOppData(JSON.stringify(_data)).then(function (data) {
               console.log(data)
            })
            .catch(function () {
                 
            });
        };

    
        //Get Convet API Call
        $scope.getSetupField = function () {

            var _data = {
                "query_name": "All Opportunities",      
                "query_type": "query",
            }

            opportunitiesDataServices.getSetupFields(JSON.stringify(_data)).then(function (data) {
                $rootScope.selected_fields = data.data.selected_fields;
                $rootScope.available_fields = data.data.available_fields;
                $rootScope.child_object_list = data.data.child_object_list
            })
            .catch(function () {
                 
            });
        }

         //Get Convet API Call
        $scope.geList = function () {

            var _data = {       
                "search":              
                 [
                    { "search_field_name": "" },
                    { "search_field_name": "" }
                ],
                "search_text": "" ,
                "start_index": 6,           
                "page_size": 10,           
                "parent_object": "",           
                "parenr_record_id":  45875,    
                "fields":  []
            }

            opportunitiesDataServices.getOppList(JSON.stringify(_data)).then(function (data) {
                console.log(JSON.stringify(data))
            })
            .catch(function () {
                 
            });
        }

        //Save API
        $scope.addOppotunitiData = function(data){
            opportunitiesDataServices.saveOppList(data).then(function (data) {
                console.log(JSON.stringify(data))
            })
            .catch(function () {
                 
            });
        }

        //Save Setup

        //Get Convet API Call
        $scope.saveSetupField = function () {

         var _data = {
            "query_name": "All Opportunities",      
            "query_type": "",
            "page_size": 10,
            "sort_field_name": "t_name",
            "sort_type": "asc",
            "field_width_info": [
                {
                    "field_name": "company",
                    "width": 150
                },
                {
                    "field_name": "t_name",
                    "width": 150
                },
                {
                    "field_name": "t_status",
                    "width": 150
                }
            ],
                "child_objects":[
                        {
                            "object":"Company",
                            "field_width_info": [
                                {
                                    "field_name": "company",
                                    "width": 150
                                },
                                {
                                    "field_name": "t_status",
                                    "width": 150
                                }
                            ]
                        }
                    ]

            }


            opportunitiesDataServices.saveSetupFields(JSON.stringify(_data)).then(function (data) {
                console.log(JSON.stringify(data))
            })
            .catch(function () {
                 
            });
        };
        
        

        //$scope.saveSetupField();

        $scope.animationsEnabled = true;

        $scope.createNewOppotunitiesTemplate = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/addOppotunities.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size:'550px add',
                resolve: {
                    modelType: function () {
                        return 'createNewOppotunitiesTemplate';
                    }
                }
            });
        }
		

        $scope.setupAccountsTemplate = function (size) {

            $scope.getSetupField();

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/setupAccountsTemplate.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '700px setup',
                resolve: {
                    modelType: function () {
                        return 'setupAccountsTemplate';
                    }
                }
            });
        }

        $rootScope.customizeOpportunities = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/customizeOpportunities.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '550px customizes',
                resolve: {
                    modelType: function () {
                        return 'customizeOpportunities';
                    }
                }
            });
        }
		$rootScope.addField = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/addField.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '720px addFild',
                resolve: {
                    modelType: function () {
                        return 'addField';
                    }
                }
            });
        }
		$rootScope.regulerList = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/regulerList.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '500px regularList',
                resolve: {
                    modelType: function () {
                        return 'regulerList';
                    }
                }
            });
        }
			$rootScope.emailAlert = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/emailAlert.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function () {
                        return 'emailAlert';
                    }
                }
            });
        }	
		$rootScope.regularDown = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/regularDown.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function () {
                        return 'regularDown';
                    }
                }
            });
        }
		$rootScope.regularUP = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/regularUP.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function () {
                        return 'regularUP';
                    }
                }
            });
        }
		$rootScope.regularRemove = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/regularRemove.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function () {
                        return 'regularRemove';
                    }
                }
            });
        }
		$rootScope.regularSave = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/regularSave.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function () {
                        return 'regularSave';
                    }
                }
            });
        }
		$rootScope.regularAdd = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/regularAdd.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function () {
                        return 'regularAdd';
                    }
                }
            });
        }
			$rootScope.addSearch = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/addSearch.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size:'800px addSearch',
                resolve: {
                    modelType: function () {
                        return 'addSearch';
                    }
                }
            });
        }
		$rootScope.compnynote = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/compnynote.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '400px addNote',
                resolve: {
                    modelType: function () {
                        return 'compnynote';
                    }
                }
            });
        }
		$rootScope.taskDelete	 = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/taskDelete.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '350px delet',
                resolve: {
                    modelType: function () {
                        return 'taskDelete';
                    }
                }
            });
        }

		
			$rootScope.Fieldelete = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/Fieldelete.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size:'350px delet',
                resolve: {
                    modelType: function () {
                        return 'Fieldelete';
                    }
                }
            });
        }
		$rootScope.editField = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/editField.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '720px editField',
                resolve: {
                    modelType: function () {
                        return 'editField';
                    }
                }
            });
        }

        $scope.addNote = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/addNote.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '800px add-note',
                resolve: {
                    modelType: function () {
                        return 'addNote';
                    }
                }
            });
        }
        $scope.convert = function (size) {
            $scope.convertData();
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/convert.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '620px convert',               
                  resolve: {
                    modelType: function() {
                        var modelData = {
                            modelName: 'convert',
                            rowIds: $rootScope.deleteId,
                            formData: "",
                        }
                        return modelData;
                    }
                }
            });
        }
		$rootScope.convertSave = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/convertSave.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '350px delet',
                resolve: {
                    modelType: function() {
                        return 'convertSave';
                    }
                }
            });
        }
	
	 
        $scope.addTask = function (size) {
            ///$scope.convertData();
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/addTask.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '800px addTask',
                resolve: {
                    modelType: function () {
                        return 'addTask';
                    }
                }
            });
        } 
		$rootScope.taskRepeatReminder = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/taskRepeatReminder.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '400px Repeat',
                resolve: {
                    modelType: function() {
                        return 'taskRepeatReminder';
                    }
                }
            });
        }
		$scope.createNewAllAppointment = function (size) {
            ///$scope.convertData();
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/createNewAllAppointment.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: size,
                resolve: {
                    modelType: function () {
                        return 'createNewAllAppointment';
                    }
                }
            });
        }

        $scope.convertData = function () {

            var _data = {
                "id": $scope.rowChangedValue
            };

            opportunitiesDataServices.getConvert(JSON.stringify(_data)).then(function (data) {
                console.log('GET CONVERT DATA RESPOSNse', data);
                $rootScope.converData = data;
                $rootScope.disable = data.data.current_stage
            })
            .catch(function () {
                 
            });
        }

        $scope.cntdata = {};

         $scope.saveConvertData = function () {

            var _data = {
                "id": $scope.rowChangedValue
            };

            opportunitiesDataServices.saveConvert(JSON.stringify($scope.cntdata)).then(function (data) {
                console.log(data);
            })
            .catch(function () {
                 
            });
        }


         //Get Workflow API Call
        $scope.workflowAPI = function () {

            var _data = {
                "workflow_id": "",
                "stage_id": ""
            };

            opportunitiesDataServices.getWorkflows(JSON.stringify(_data)).then(function (data) {
                $rootScope.workflowData = data;
            })
            .catch(function () {
                 
            });
        }

         //Get Workflow API Call
        $scope.applyWorkflow = function () {

            var _data = {
                "workflow_id": "",
                "stage_id": ""
            };

            opportunitiesDataServices.applyWorkflows(JSON.stringify(_data)).then(function (data) {
                $rootScope.workflowData = data;
            })
            .catch(function () {
                 
            });
        }


        $scope.addToGroup = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/addToGroup.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: size,
                resolve: {
                    modelType: function () {
                        return 'addToGroup';
                    }
                }
            });
        }
        $scope.workflow = function (size) {

             $scope.workflowAPI();

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/workflow.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '600px Workflow',
                resolve: {
                    modelType: function () {
                        return 'workflow';
                    }
                }
            });
        }
        $scope.edit = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/edit.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '400px editBatch',
                resolve: {
                    modelType: function () {
                        return 'edit';
                    }
                }
            });
        }
        $scope.delete = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/delete.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '350px delet',
               resolve: {

                    modelType: function () {
                        var modelData = {
                            modelName: 'delete',
                            rowIds: $rootScope.deleteId,
                            formData: "",
                            count: $scope.selectedRowsDelete
                        }
                        return modelData;
                    }

                    //  modelType: function () {
                    //     var modelData = {
                    //         modelName: 'delete',
                    //         rowIds: $scope.rowChangedValue,
                    //         formData: "",
                    //         count: $rootScope.selectedRowsDelete
                    //     }
                    //     return modelData;
                    // }
                }
            });
        }

        $scope.emportToExcel = function (size) {
           
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/opportunities/exportToExcel.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '400px excel',
                resolve: {
                    modelType: function () {
                        return 'exportToExcel';
                    }
                }
            });
        }
        $scope.print = function (size) {
            window.print();
        }

        $scope.visible = false;
        $scope.toggle = function() {
            $scope.visible = !$scope.visible;
        };

        $scope.visible2 = false;
        $scope.toggle2 = function() {
            $scope.visible2 = !$scope.visible2;
        };

        $scope.saveCustomizeFields = function () {

            console.log('selected_fields ', $scope.selected_fields);

            var _data = {
                 "is_show_field_label": false,
                 "field_names":[
                    "company",
                    "workflow_name",
                    "t_status",
                    "Sales_rep"
                  ]
            }

            opportunitiesDataServices.saveCustomizeFields(JSON.stringify(_data)).then(function (data) {
             console.log(data)
            })
            .catch(function () {
                 
            });
        }
		$scope.class = "none";
       $scope.clickTwit = function() {
           if ($scope.class === "none")
               $scope.class = "block";
           else
               $scope.class = "none";
       };

          $scope.updateTodo = function(value) {
            console.log('Saving title ' + value);
            //alert('Saving title ' + value);
          };
          
          $scope.cancelEdit = function(value) {
            console.log('Canceled editing', value);
            //alert('Canceled editing of ' + value);
          };
          
          $scope.todos = [
            {id:123, title: 'Lord of the things'},
            {id:321, title: 'Hoovering heights'},
            {id:231, title: 'Watership brown'}
          ];


        $rootScope.alertPopup = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/sales-template/alert.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: 'md',
                resolve: {
                    modelType: function () {
                        return 'test';
                    }
                }

            });
        }
    }
})();

(function () {

    'use strict';

    angular.module('opportunities').controller('ModalInstanceOpportunitiesCtrl', ModalInstanceOpportunitiesCtrl);

    function ModalInstanceOpportunitiesCtrl($scope, $rootScope, $uibModalInstance, opportunitiesDataServices, modelType, toastr, $filter, allAppointmentDataServices) {

       
        $scope.class = "none";
        $scope.clickTwit = function() {
            if ($scope.class === "none")
                $scope.class = "block";
            else
                $scope.class = "none";
        };



        $scope.status_type= ["Presentation", "Proposal", "Negotiation", "Close"];

        $scope.salesrep = [""];

        // min date picker
        $scope.picker4 = {
            date: new Date(),
            datepickerOptions: {
                maxDate: null
            }
        };


        $scope.openCalendar = function(e, picker) {
            $scope[picker].open = true;
        };

        $scope.note_type= ["Appointment", "Dialed", "Email", "LVM", "Note", "Spoke", "Task", "Transferred"];

        if (modelType == 'addTask') {
			
			 $scope.picker3 = {
                date: new Date()
            };

            $scope.openCalendar1 = function (e, picker) {
                $scope[picker].open = true;
            };

            $scope.picker4 = {
                date: new Date()
            };

            $scope.openCalendar2 = function (e, picker) {
                $scope[picker].open = true;
            };

            $scope.newAppointmentDialogCreate = function () {
                allAppointmentDataServices.newAppointmentDialog().then(function (data) {
                    $scope.newAppointmentDialog = data.data;
                    $scope.reminderType = ["Email", "Pop-up"];
                    $scope.reminderIn = ["minutes", "hours", "days", "weeks"];

                    $scope.user = {
                        subject: '',
                        start_date: $scope.picker3.date,
                        end_date: moment($scope.picker4.date).format('YYYY-MM-DD hh:mm'),
                        id: 0,
                        t_status: 'Scheduled',
                        assign_to: 'Ravi Teja Villa',
                        company: '',
                        location: '',
                        full_name: '',
                        text: '',
                        ol_sync: 'No',
                        google_sync: 'No',
                        parent_recordid: 0,
                        attendees: [],
                        note_type: $scope.newAppointmentDialog.note_types[0],
                        note: "",
                        is_repeat: $scope.newAppointmentDialog.is_repeat,
                        recurring_fields: {},
                        reminder: [
                            {
                                t_reminder_type: $scope.reminderType[0],
                                t_time_type: $scope.reminderIn[0],
                                t_time_value: 10
                            },
                            {
                                t_reminder_type: $scope.reminderType[0],
                                t_time_type: $scope.reminderIn[0],
                                t_time_value: 10
                            }
                        ]

                    }

                    angular.forEach($scope.newAppointmentDialog.attendees, function (value, key) {
                        $scope.user.attendees.push({
                            id: value.id,
                            guest_name: value.guest_name,
                            guest_email: value.guest_email,
                            t_status: value.t_status,
                            owner: value.owner
                        });

                    });

                })
                    .catch(function () {
                        $scope.error = 'data not fount';
                    });
            }

            $scope.newAppointmentDialogCreate();

            $scope.addReminder = function () {
                $scope.user.reminder.push({ t_reminder_type: $scope.reminderType[0], t_time_type: $scope.reminderIn[0], t_time_value: 10 });
            }

            $scope.deleteReminder = function (val) {
                $scope.user.reminder.splice(val, 1);
            }
			
		

        }else if(modelType == 'setupAccountsTemplate'){

            $scope.changedTable1=function(table1){              

                var  objName = $filter('lowercase')(table1);
                //alert(objName);
                allAppointmentDataServices.changeSetupFields(objName).then(function (data) {
                    //console.log(data);
                    $scope.fieldsName = data.data.fields;
                })
                .catch(function () {
                       
                });

            } 
            $scope.changedTable2=function(table2){
                var  objName2 = $filter('lowercase')(table2);
                allAppointmentDataServices.changeSetupFields(objName2).then(function (data) {
                    //console.log(data);
                    $scope.fieldsName1 = data.data.fields;
                })
                .catch(function () {
                      
                });
            }  
        }

        else if (modelType == 'addNoteAccountsTemplate') {

        }
        else if (modelType == 'convertAccountsTemplate') {

        }
        else if (modelType == 'addGroupAccountsTemplate') {
            
            $scope.addToGroupHereFlag = true;

            $scope.addToGroupHere = function () {
                $scope.addToGroupHereFlag = false;
            }

            $scope.addToGroupHereFlagCancel = function () {
                $scope.addToGroupHereFlag = true;
            }
        }
        else if (modelType == 'workflowAccountsTemplate') {

        }
        else if (modelType == 'shareWithAccountsTemplate') {

        }
        else if (modelType == 'assignAccountsTemplate') {

        }
        else if (modelType == 'deleteAccountAccountsTemplate') {

        }
        else if (modelType == 'viewGoogleMapAccountsTemplate') {

        }
        else if (modelType == 'generateExcelAccountsTemplate') {

        }

        $scope.exportToCSV = function(){
            
             if($scope.selected == 'all'){
                $rootScope.exportAllCSV();
                $uibModalInstance.dismiss('cancel');
             }else{
                $rootScope.exportSelectedCSV();
                $uibModalInstance.dismiss('cancel');
             }
        }

        $scope.Expand = function(){
            $scope.addTab({
                name: 'Create Opportunities'
            });
            $uibModalInstance.dismiss('cancel');
        }

       $scope.saveSetupField = function () {

            console.log('selected_fields ', $scope.selected_fields);

            var _data = {
                "query_name": "All",        
                "query_type": "",
                "page_size": 10,
                "sort_field_name": $scope.relatedTable1,
                "sort_type": $scope.sortby,
                "field_width_info": $scope.selected_fields,
                "child_objects":[
                    {
                        "object":$scope.relatedTable1,
                        "field_width_info": $scope.reltb1selected,
                    }
                ]
            }

            opportunitiesDataServices.saveSetupFieldsAppot(JSON.stringify(_data)).then(function (data) {
              $uibModalInstance.close('open');
            })
            .catch(function () {
                 
            });
        }

        $scope.deleteRecord = function () {
            
            opportunitiesDataServices.deleteSalesData(JSON.stringify(modelType.rowIds)).then(function (data) {
                console.log(data);
            })
            .catch(function () {
                 
            });

        }

        $scope.accounts = {}

        $scope.addOppotunities = function () {
         
            // var _data = {
              
            // }


            if( $scope.accounts.name == undefined){
                 $rootScope.alertPopup();
            }else{

                opportunitiesDataServices.saveSetupFieldsAppot(JSON.stringify(_data)).then(function (data) {
                  $uibModalInstance.close('open');
                })
                .catch(function () {
                     
                });

            }
        }
          $scope.convertAccount = function () {
            $scope.cntdata.current_status = $scope.disable;
            $scope.pendingTask = [];
            angular.forEach($rootScope.converData.data.pending_tasks, function(album){
              if (album.selected) $scope.pendingTask.push({'id': album.id, 'value' : album.name});
            });

            //console.log(JSON.stringify($scope.cntdata))

            // var _data = {
                 
            //      "current_status": "Lead",
            //      "changed_status": $scope.statusList,
            //      "is_create_next_task": $scope.w_cb,                 
            //      "note_text": $scope.comment,
            //      "child_object": $scope.t_state,
            //      "child_status": "Lead"
            // }

            console.log($scope.cntdata.disable)

            var tempObj = {};
            tempObj = modelType.rowIds;
            tempObj = $scope.cntdata;
            tempObj.pending_task =  $scope.pendingTask;
            
            opportunitiesDataServices.convertAccount(JSON.stringify(tempObj)).then(function (data) {
              $uibModalInstance.close('open');                
            })
            .catch(function () {
                 
            });
        }

        
        console.log('modelType', modelType);
        $scope.modelType = modelType;
        $scope.ok = function () {
            console.log(modelType);
            $uibModalInstance.close('open');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();




