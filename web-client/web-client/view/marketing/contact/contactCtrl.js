(function() {

    'use strict';

    angular.module('contact', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.selection', 'ui.select']);

})();


(function() {

    'use strict';

    angular.module('contact').controller('contactCtrl', contactCtrl);

    function contactCtrl($scope, $rootScope, toastr, lodash, $uibModal, uiGridExporterService, uiGridExporterConstants, contactDataServices, uiGridConstants) {

        $rootScope.accountDetailsTabs = [{
            title: 'Notes',
            url: 'view/sales/accounts/contact.html'
        }, {
            title: 'Appointment',
            url: 'view/sales/sales-template/sales.html'
        }, {
            title: 'Contact',
            url: 'view/sales/sales-template/sales1.html'
        }, {
            title: 'Cases',
            url: 'view/sales/sales-template/sales2.html'
        }, {
            title: 'Attachment',
            url: 'view/sales/sales-template/sales3.html'
        }, {
            title: 'Group',
            url: 'view/sales/sales-template/sales4.html'
        }];

        $scope.visible = false;
        $scope.toggle = function() {
            $scope.visible = !$scope.visible;
        };

        $rootScope.accountDetailCurrentTab = 'view/sales/accounts/contact.html';

        $scope.onClickTab = function(tab) {
            $rootScope.accountDetailCurrentTab = tab.url;
        }

        $scope.isActiveTab = function(tabUrl) {
            return tabUrl == $rootScope.accountDetailCurrentTab;
        }
        
        $scope.CloseMe = function() {
            $scope.class = "none";
            $scope.classGp = "none";
            $scope.classFb = "none";
            $scope.custclass = "none"
            $scope.visible2 = false;
        }

          $scope.custclass = "none";
          $scope.clickCust = function() {
            if ($scope.custclass === "none")
                $scope.custclass = "block";
            else
                $scope.custclass = "none";
        };
        $scope.visible2 = false;
        $scope.toggle2 = function() {
            $scope.visible2 = !$scope.visible2;
        };
        $scope.class = "none";
        $scope.clickTwit = function() {
            $scope.classGp = "none";
            $scope.classFb = "none";

            if ($scope.class === "none")
                $scope.class = "block";
            else
                $scope.class = "none";
        };

        $scope.classFb = "none";
        $scope.clickFb = function() {
            if ($scope.classFb === "none")
                $scope.classFb = "block";
            else
                $scope.classFb = "none";
        };

        $scope.classGp = "none";
        $scope.clickGp = function() {
            $scope.class = "none";
            $scope.classFb = "none"
            if ($scope.classGp === "none")
                $scope.classGp = "block";
            else
                $scope.classGp = "none";
        };

        var paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
        };

        $scope.fieldList = function() {
            contactDataServices.getAccountFiled().then(function(data) {
                $scope.fieldList = data.data.fields;
            })
            .catch(function() {
            });
        }

        $scope.fieldList();

        $scope.gridOptions1 = {
            rowHeight: 30,
            multiSelect: true,
            enableCellEdit: true,
            editableCellTemplate: true,
            enableFooterTotalSelected: true,
            exporterCsvFilename: 'Accounts_Resultset.csv',
            showGridFooter: true,
            enableSorting: true,
            enableFiltering: true,
            enableColumnMenus: false,
            paginationPageSizes: [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200],
            paginationPageSize: 10,
            useExternalPagination: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0
        };

        $scope.gridOptions1.columnDefs = [];

        $scope.selectedRows = [];
        $scope.gridOptions1.onRegisterApi = function(gridApi) {
            $scope.gridApi = gridApi;

            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length == 0) {
                    paginationOptions.sort = null;
                } else {
                    paginationOptions.sort = sortColumns[0].sort.direction;
                }
                $rootScope.refresh();
            });
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                paginationOptions.pageNumber = newPage;
                paginationOptions.pageSize = pageSize;
                $rootScope.refresh();
            });


            $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (row.isSelected == true) {
                    $rootScope.rowChangedValue = row.entity.id;
                    $scope.isStatus = row.entity.t_status;
                    $scope.selectedRows.push(row.entity.id);
                    $rootScope.deleteId = {};
                    $rootScope.deleteId.id = $scope.selectedRows;
                    console.log(JSON.stringify($rootScope.deleteId))
                    $scope.selectedRowsDelete = $scope.selectedRows.length;
                } else {
                    var index = $scope.selectedRows.indexOf(row);
                    console.log(index)
                    $scope.selectedRows.splice(index, 1);
                    $scope.singleSelect = false;
                }
                if ($scope.selectedRows.length == 1) {
                    $scope.singleSelect = true;
                    $scope.multipleSelect = false;
                } else if ($scope.selectedRows.length >= 2) {
                    $scope.singleSelect = true;
                    $scope.multipleSelect = true;
                }

            })
            var selectAllFlag = false;
            $scope.gridApi.selection.on.rowSelectionChangedBatch($scope, function(row) {
                if (selectAllFlag == false) {
                    $scope.gridApi.selection.getSelectedRows().forEach(function(row) {
                        $scope.multipleSelect = true;
                        $scope.singleSelect = true;
                    });
                    $rootScope.selectedRowsDelete = $scope.selectedRows.length;
                    selectAllFlag = true;
                } else {
                    $scope.gridApi.selection.clearSelectedRows();
                    selectAllFlag = false;
                    $scope.multipleSelect = false;
                    $scope.singleSelect = false;
                    $scope.selectedRows = [];
                }
            });
        };

        $scope.gridOptions1.columnDefs = [{

            field: 'lead_score',
            name: 'lead Score',
            cellTemplate: '<div class="ui-grid-cell-contents clickable"><img src="images/star0.png" {{ row.entity.lead_score}}</div>',
            width: 100,
            enableFiltering: true,

        }];

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


        $scope.actionDetail = function(action) {

            if (action == 'refresh') {
                $scope.accountsDetails();
            } else if (action == 'edit') {
                $scope.addTab({
                    name: 'Edit Accounts'
                });
            } else if (action == 'delete') {
                $scope.deleteAccountAccountsTemplate();
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
                $scope.workflowAccountsTemplate()
            } else if (action == 'print') {
                window.print();
            }

        }

         $scope.accountsDetails = function(id) {
            contactDataServices.detailAccountsDetails(id).then(function(data) {
                $rootScope.detailsData = data;
                $scope.fields = data.data.record;
                $scope.custSelected = data.data.fields;
                if (data.status == 0) {
                    $scope.addTab({
                        name: 'Contact Details',
                        title : data.data.title
                    })
                }
            })
            .catch(function() {

            });

           // $rootScope.currentTab = 'view/sales/accounts/detailsAccounts.html';
        };

        $scope.accountsDetails = function(id) {
            contactDataServices.detailAccountsDetails(id).then(function(data) {
                $rootScope.detailsData = data;
                $scope.fields = data.data.record;
                $scope.custSelected = data.data.fields;
                if (data.status == 0) {
                    $scope.addTab({
                        name: 'Account Details',
                        title : data.data.title
                    })
                }
            })
            .catch(function() {

            });

           // $rootScope.currentTab = 'view/sales/accounts/detailsAccounts.html';
        };
        $scope.addFilter = function() {
            $scope.addTab({
                name: 'Add Filter'
            });
        }

        $scope.accountsEdit = function(id) {
            contactDataServices.editAccountsDetails($scope.rowChangedValue).then(function(data) {
                $rootScope.editData = data.data.records;
                $scope.data = $rootScope.editData;
                console.log("Edit data ", data);
                if (data.status == 0) {
                    $scope.addTab({
                        name: 'Edit Accounts'
                    });
                }
            })
            .catch(function() {

            });
        };

        // function to submit the form after all validation has occurred 
        $scope.accounts = {};

        $scope.submitForm = function(isValid) {
            console.log('submitForm');
            if (isValid) {
                contactDataServices.saveAccountsDetails($scope.accounts).then(function(data) {
                    console.log(data);
                })
                .catch(function() {

                });
            }

        };

        $scope.filterSort = {
            label: 'All'
        };

        $scope.filterSelected = function(filter) {
            $scope.filterSort = filter;
            $scope.filterName = filter.name;
            $rootScope.refresh();
        }

        $scope.groupSort = {
            label: 'Status'
        };
        $rootScope.groupLabel = 't_status'
        $scope.groupSelected = function(group) {
            $scope.groupSort = group;
            $scope.groupLabel = group.name;
            console.log(group)
            $rootScope.refresh();
        }

        //Get Convet API Call
        $scope.convert = function() {

                var _data = {
                    "id": $scope.rowChangedValue
                };

                contactDataServices.getConvert(JSON.stringify(_data)).then(function(data) {
                    $rootScope.converData = data;
                    $rootScope.disable = data.data.current_stage
                })
                .catch(function() {

                });
            }
            //Get Workflow API Call

        $scope.workflow = function() {

            var _data = {
                "workflow_id": "",
                "stage_id": ""
            };

            contactDataServices.getConvert(JSON.stringify(_data)).then(function(data) {
                $rootScope.workflowData = data;
            })
            .catch(function() {

            });
        }

        //Get editAccountsDetails API Call
        $scope.editAccountsDetails = function(data) {
            var _data = $scope.rowChangedValue;

            contactDataServices.editAccountsDetails(_data).then(function(data) {
                $rootScope.detailsData = data;
            })
            .catch(function() {

            });
        }

        $rootScope.applyWorkflows = function() {

            var _data = {
                "id": [],
                "workflow_id": '',
                "stage": '',
                "task_id": []
            }

            contactDataServices.getConvert(JSON.stringify(_data)).then(function(data) {
                $rootScope.workflowData = data;
            })
            .catch(function() {

            });

        }

        $rootScope.refresh = function() {

            var _data = {
                "query_name": $scope.filterName,
                "group_by_field_name": $scope.groupLabel,
                "page_size": 100,
                "sort_type": 'asc'
            };

            contactDataServices.getAccountsDetails(JSON.stringify(_data)).then(function(data) {

                    $scope.gridOptions1.totalItems = data.data.records.length;
                    var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;

                    $scope.singleSelect = false;
                    $scope.multipleSelect = false;
                    $scope.selectedRows = []

                    $scope.accountData = data;
                    angular.forEach(data.data.fields, function(value, key) {

                        if (!value.is_hidden) {
                            $scope.gridOptions1.columnDefs.push({
                                name: value.name,
                                displayName: value.label,
                                enableCellEdit: value.is_inline_edit,
                                cellTemplate: '<div ng-if="' + value.is_detail_link + ' == true" class="ui-grid-cell-contents clickable" ng-click="grid.appScope.accountsDetails(row.entity.id)" >{{ row.entity.' + value.name + '}}</div> <div ng-if="' + value.is_detail_link + ' == false" class="ui-grid-cell-contents">{{ row.entity.' + value.name + '}}</div>',
                            });
                        }
                    });

                    $scope.gridOptions1.data = data.data.records.slice(firstRow, firstRow + paginationOptions.pageSize);

                    $scope.filterBy = function(type) {
                        console.log(type)
                        if (type == "All") {
                            $scope.datas = data.data.group_by
                            $scope.gridOptions1.data = data.data.records
                        } else {
                            $scope.gridOptions1.data = _.filter(data.data.records, function(q) {
                                if ($scope.groupLabel == 't_status') {
                                    return q.t_status == type;
                                } else if ($scope.groupLabel == 'country') {
                                    return q.country == type;
                                } else if ($scope.groupLabel == 'ol_sync') {
                                    return q.ol_sync == type;
                                } else if ($scope.groupLabel == 'priority') {
                                    return q.priority == type;
                                } else if ($scope.groupLabel == 'sales_rep') {
                                    return q.sales_rep == type;
                                } else if ($scope.groupLabel == 'source') {
                                    return q.source == type;
                                } else if ($scope.groupLabel == 'state') {
                                    return q.state == type;
                                } else if ($scope.groupLabel == 't_type') {
                                    return q.t_type == type;
                                }
                            });
                        }
                    }

                })
                .catch(function() {

                });
        }

        $rootScope.refresh();

        $scope.getTableHeight = function() {
            var rowHeight = 30; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.gridOptions1.data.length * rowHeight + headerHeight) + "px"
            };
        };


        $scope.colnameSelected = function(colname) {
            $scope.columnSort = colname;
        }
            //Get Convet API Call
        $scope.getSetupField = function() {

            var _data = {
                "query_name": "All Accounts",
                "query_type": "",
                "parent_object": "",
            }

            contactDataServices.getSetupFields(JSON.stringify(_data)).then(function(data) {
                $rootScope.selected_fields = data.data.selected_fields;
                $rootScope.available_fields = data.data.available_fields;
                $rootScope.child_object_list = data.data.child_object_list
            })
            .catch(function() {

            });
        }

        $scope.idSelectedAppointment = null;

        $scope.setSelectedAccount = function(val) {
            $scope.idSelectedAppointment = val;
        }

        $scope.isGroupByFiled = null;

        $scope.groupByFiled = function(val) {
            $scope.isGroupByFiled = val;
        }

        $scope.animationsEnabled = true;

        $scope.createNewAccountsTemplate = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/addAccounts.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '550px add',
                resolve: {
                    modelType: function() {
                        var modelData = {
                            modelName: 'complete',
                            rowIds: $scope.rowChangedValue,
                            formData: "",
                        }
                        return modelData;
                    }
                }
            });
        }

        $rootScope.customizeAccounts = function(size) {

                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'view/sales/accounts/customizeAccounts.html',
                    controller: 'ModalInstanceNewAccountsCtrl',
                    size: '550px customizes',
                    resolve: {
                        modelType: function() {
                            return 'customizeAccounts';
                        }
                    }
                });
            }
        
        $rootScope.addField = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/addField.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '720px addFild',
                resolve: {
                    modelType: function() {
                        return 'addField';
                    }
                }
            });
        }
        $rootScope.regulerList = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/regulerList.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '500px regularList',
                resolve: {
                    modelType: function() {
                        return 'regulerList';
                    }
                }
            });
        }
        $rootScope.emailAlert = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/emailAlert.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function() {
                        return 'emailAlert';
                    }
                }
            });
        }
        $rootScope.regularDown = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/regularDown.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function() {
                        return 'regularDown';
                    }
                }
            });
        }
        $rootScope.regularUP = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/regularUP.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function() {
                        return 'regularUP';
                    }
                }
            });
        }
        $rootScope.regularRemove = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/regularRemove.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function() {
                        return 'regularRemove';
                    }
                }
            });
        }
        $rootScope.regularSave = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/regularSave.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function() {
                        return 'regularSave';
                    }
                }
            });
        }
        $rootScope.regularAdd = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/regularAdd.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function() {
                        return 'regularAdd';
                    }
                }
            });
        }
        $rootScope.addSearch = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/addSearch.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '800px addSearch',
                resolve: {
                    modelType: function() {
                        return 'addSearch';
                    }
                }
            });
        }
        $rootScope.compnynote = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/compnynote.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '400px addNote',
                resolve: {
                    modelType: function() {
                        return 'compnynote';
                    }
                }
            });
        }
        $rootScope.taskDelete = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/taskDelete.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '350px delet',
                resolve: {
                    modelType: function() {
                        return 'taskDelete';
                    }
                }
            });
        }

        $rootScope.addField = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/addField.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '720px addFild',
                resolve: {
                    modelType: function() {
                        return 'addField';
                    }
                }
            });
        }
        $rootScope.Fieldelete = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/Fieldelete.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '350px delet',
                resolve: {
                    modelType: function() {
                        return 'Fieldelete';
                    }
                }
            });
        }
        $rootScope.editField = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/editField.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '720px addFild',
                resolve: {
                    modelType: function() {
                        return 'editField';
                    }
                }
            });
        }

        $scope.setupAccountsTemplate = function(size) {
            $scope.getSetupField();
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/setupAccounts.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '700px setup',
                resolve: {
                    modelType: function() {
                        return 'setupAccountsTemplate';
                    }
                }
            });
        }

        $scope.addNoteAccountsTemplate = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/addNoteAccounts.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '800px add-note',
                resolve: {
                    modelType: function() {
                        return 'addNoteAccountsTemplate';
                    }
                }
            });
        }

        $scope.convertAccountsTemplate = function(size) {
            $scope.convert();
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/convertAccounts.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '620px convert',
                resolve: {
                    modelType: function() {
                        return 'convertAccountsTemplate';
                    }
                }

            });
        }

        $scope.addGroupAccountsTemplate = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/addGroupAccounts.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '450px add-group',
                resolve: {
                    modelType: function() {
                        return 'addGroupAccountsTemplate';
                    }
                }
            });
        }

        $scope.workflowAccountsTemplate = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/workflow.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '600px workflow',
                resolve: {
                    modelType: function() {
                        return 'workflowAccountsTemplate';
                    }
                }
            });
        }

        $scope.shareWithAccountsTemplate = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/shareWith.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '400px share-with',
                resolve: {
                    modelType: function() {
                        var modelData = {
                            modelName: 'shareWithAccountsTemplate',
                            rowIds: $rootScope.deleteId,
                            formData: "",
                        }
                        return modelData;
                    }
                }
            });
        }

        $scope.batchEditAccountsTemplate = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/batchEditAccounts.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '400px editBatch',
                resolve: {
                    modelType: function() {
                        return 'batchEditAccountsTemplate';
                    }
                }
            });
        }


        $scope.assignAccountsTemplate = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/assignAccounts.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '425px assign',
                resolve: {
                    modelType: function() {
                        var modelData = {
                            modelName: 'assignAccountsTemplate',
                            rowIds: $rootScope.deleteId,
                            formData: "",
                        }
                        return modelData;
                    }
                }
            });
        }

        $scope.deleteAccountAccountsTemplate = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/deleteAccounts.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '350px delet',
                resolve: {

                    modelType: function() {
                        var modelData = {
                            modelName: 'deleteAccountTemplate',
                            rowIds: $rootScope.deleteId,
                            formData: "",
                            count: $scope.selectedRowsDelete
                        }
                        return modelData;
                    }
                }
            });
        }

        $scope.viewGoogleMapAccountsTemplate = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/googleMap.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '720px googleMap',
                resolve: {
                    modelType: function() {
                        return 'viewGoogleMapAccountsTemplate';
                    }
                }
            });
        }

        $scope.generateExcelAccountsTemplate = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/generateExcel.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '400px excel',
                resolve: {
                    modelType: function() {
                        return 'generateExcelAccountsTemplate';
                    }
                }
            });
        }

        $scope.addAppointment = function(size) {
           var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/addAppointment.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '800px addTask',
                resolve: {
                    modelType: function() {
                        return 'addAppointment';
                    }
                }
            });
        }

        $scope.addTask = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/accounts/addTask.html',
                controller: 'ModalInstanceNewAccountsCtrl',
                size: '800px addTask',
                resolve: {
                    modelType: function() {
                        return 'addTask';
                    }
                }
            });
        }
        $rootScope.availableColors = ['Check 123', 'aaa_123', 'aaa', 'abcd'];
        $rootScope.colors = ['test', 'test_web'];

        $rootScope.addToGroupHereFlag = true;

        $rootScope.addToGroupHere = function() {
            $rootScope.addToGroupHereFlag = false;
        }
        $rootScope.addToGroupHereFlagCancel = function() {
            $rootScope.addToGroupHereFlag = true;
        }

        $scope.note_type = [{
                name: "Prospect",
                value: "Prospect"
            },
            {
                name: "Customer",
                value: "Customer"
            }
        ];

    }

})();

(function() {

    'use strict';

    angular.module('contact').controller('ModalInstanceNewAccountsCtrl', ModalInstanceNewAccountsCtrl);

    function ModalInstanceNewAccountsCtrl($scope, $rootScope, $uibModalInstance, modelType, toastr, $filter, contactDataServices, allAppointmentDataServices) {

        $scope.class = "none";
        $scope.clickTwit = function() {
            if ($scope.class === "none")
                $scope.class = "block";
            else
                $scope.class = "none";
        };

        $scope.deleteRecords = modelType.count;

        $scope.note_type = ["Appointment", "Dialed", "Email", "LVM", "Note", "Spoke", "Task", "Transferred"];
        $scope.status_type = ["Prospect", "Customer"];

        $scope.fieldList = function() {

            contactDataServices.getAccountFiled().then(function(data) {
                $scope.fieldList = data.data.fields;
            })
            .catch(function() {

            });
        }

        $scope.fieldList();

        $scope.fieldName = 'Sales rep'
        $scope.changeFiledValue = function() {
            $scope.filedData = $scope.fieldName;
        }
        $scope.userList = function() {

            contactDataServices.userDetails().then(function(data) {
                $scope.userList = data.data.users
            })
            .catch(function() {

            });
        }


        if (modelType == 'setupAccountsTemplate') {

            $scope.changedTable1 = function(table1) {

                var objName = $filter('lowercase')(table1);
                contactDataServices.changeSetupFields(objName).then(function(data) {
                    $scope.fieldsName = data.data.fields;
                })
                .catch(function() {

                });

            }
            $scope.changedTable2 = function(table2) {
                var objName2 = $filter('lowercase')(table2);
                contactDataServices.changeSetupFields(objName2).then(function(data) {
                    $scope.fieldsName1 = data.data.fields;
                })
                .catch(function() {

                });
            }
        } else if (modelType.modelName == 'shareWithAccountsTemplate') {
            $scope.userList();
        } else if (modelType.modelName == 'assignAccountsTemplate') {
            $scope.userList();
        }


        $scope.saveSetupField = function() {

            console.log('selected_fields ', $scope.selected_fields);

            console.log(JSON.stringify($scope.reltb1selected))

            var _data = {
                "query_name": "All",
                "query_type": "",
                "page_size": 10,
                "sort_field_name": $scope.relatedTable1,
                "sort_type": $scope.sortby,
                "field_width_info": $scope.selected_fields,
                "child_objects": [{
                    "object": $scope.relatedTable1,
                    "field_width_info": $scope.reltb1selected,
                }]
            }


            console.log(JSON.stringify(_data));

            contactDataServices.saveSetupFields(JSON.stringify(_data)).then(function(data) {
                $uibModalInstance.close('open');
            })
            .catch(function() {

            });
        }

        $scope.shareAccount = function() {

            $scope.user_id = [];
            angular.forEach($scope.userList, function(user) {
                if (user.selected) $scope.user_id.push(user.id);
            });
            var _data = {};
            _data = modelType.rowIds;
            _data.user_id = $scope.user_id

            contactDataServices.shareAccount(JSON.stringify(_data)).then(function(data) {
                $uibModalInstance.close('open');
            })
            .catch(function() {

            });
        }

        $scope.assignAccount = function() {

            var note = {
                "note_text": $scope.flyNote,
                "is_send_email": $scope.sendEmail
            }
            var _data = {};

            _data = modelType.rowIds;
            _data.user_id = [$scope.username.id];

            console.log(JSON.stringify(_data))

            var temp = {
                "id": [1479778, 1479777, 1479776],
                "user_id": [4859, 4833],
                "note_text": "",
                "is_send_email": true
            }

            contactDataServices.assignAccount(JSON.stringify(_data)).then(function(data) {
                $uibModalInstance.close('open');
            })
            .catch(function() {

            });
        }

        $scope.deleteAccount = function() {

            console.log('modelType.rowIds ', modelType.rowIds);
            var _data = {
                "id": [
                    modelType.rowIds
                ]
            }
            contactDataServices.deleteAccount(JSON.stringify(_data)).then(function(data) {
                $uibModalInstance.close('open');
            })
            .catch(function() {

            });
        }

        $scope.addNewAccount = function() {
            console.log('modelType.rowIds ', modelType.rowIds);
            var _data = {
                "id": 0,
                "parent_object": "",
                "parenr_record_id": 0,
                "is_convert": false,
                "is_notify_sales_rep": true,
                "fields": [{
                        "id": 12047,
                        "name": "company",
                        "value": "Account-015"
                    },
                    {
                        "id": 21683,
                        "name": "first_name",
                        "value": "Account-015 - Test -001"
                    },
                    {
                        "id": 0,
                        "name": "updated_on",
                        "value": "2016-11-14 02:24:15"
                    },
                    {
                        "id": 4587,
                        "name": "sales_rep",
                        "value": "Pradyut Sarkar"
                    },
                    {
                        "id": 45774,
                        "name": "visible_to",
                        "value": "Just me"
                    },
                    {
                        "id": 45774,
                        "name": "t_status",
                        "value": "Lead"
                    }
                ],
                "lookup_info": {
                    "lookup_object_name": "Accounts",
                    "record_id": 3292865
                }
            }


            contactDataServices.saveAccount(JSON.stringify(_data)).then(function(data) {
                $uibModalInstance.close('open');
            })
            .catch(function() {

            });
        }


        $scope.convertAccount = function() {

            console.log('modelType.rowIds ', modelType.rowIds);
            var _data = {
                "id": [modelType.rowIds],
                "current_status": "Lead",
                "changed_status": $scope.statusList,
                "is_create_next_task": $scope.w_cb,
                "pending_task": [{
                        "id": 1452,
                        "value": "Send a proposal"
                    },
                    {
                        "id": 8792,
                        "value": "Get the order"
                    }
                ],
                "note_text": $scope.rnote,
                "child_object": $scope.t_state,
                "child_status": "Lead"
            }


            contactDataServices.convertAccount(JSON.stringify(_data)).then(function(data) {
                $uibModalInstance.close('open');
            })
            .catch(function() {

            });
        }

        $scope.exportToCSV = function() {

            if ($scope.selected == 'all') {
                $rootScope.exportAllCSV();
                $uibModalInstance.dismiss('cancel');
            } else {
                $rootScope.exportSelectedCSV();
                $uibModalInstance.dismiss('cancel');
            }
        }
        $scope.Expand = function() {
            $scope.addTab({
                name: 'Create Accounts'
            });
            $uibModalInstance.dismiss('cancel');
        }

        $scope.ok = function() {
            $uibModalInstance.close('open');
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();

(function() {

    'use strict';

    angular.module('contact').controller('ModalInstanceNewAccountsCtrl', ModalInstanceNewAccountsCtrl);

    function ModalInstanceNewaccountsCtrl($scope, $rootScope, $uibModalInstance, contactDataServices, modelType, toastr, $filter, allAppointmentDataServices) {

        $scope.class = "none";
        $scope.clickTwit = function() {
            if ($scope.class === "none")
                $scope.class = "block";
            else
                $scope.class = "none";
        };

        $scope.status_type = ["Presentation", "Proposal", "Negotiation", "Close"];

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

        $scope.note_type = ["Appointment", "Dialed", "Email", "LVM", "Note", "Spoke", "Task", "Transferred"];

        if (modelType == 'addTask') {

            $scope.picker3 = {
                date: new Date()
            };

            $scope.openCalendar1 = function(e, picker) {
                $scope[picker].open = true;
            };

            $scope.picker4 = {
                date: new Date()
            };

            $scope.openCalendar2 = function(e, picker) {
                $scope[picker].open = true;
            };

            $scope.newAppointmentDialogCreate = function() {
                allAppointmentDataServices.newAppointmentDialog().then(function(data) {
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
                            reminder: [{
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

                        angular.forEach($scope.newAppointmentDialog.attendees, function(value, key) {
                            $scope.user.attendees.push({
                                id: value.id,
                                guest_name: value.guest_name,
                                guest_email: value.guest_email,
                                t_status: value.t_status,
                                owner: value.owner
                            });

                        });

                    })
                    .catch(function() {
                        $scope.error = 'data not fount';
                    });
            }

            $scope.newAppointmentDialogCreate();

            $scope.addReminder = function() {
                $scope.user.reminder.push({
                    t_reminder_type: $scope.reminderType[0],
                    t_time_type: $scope.reminderIn[0],
                    t_time_value: 10
                });
            }

            $scope.deleteReminder = function(val) {
                $scope.user.reminder.splice(val, 1);
            }

        } else if (modelType == 'setupAccountsTemplate') {

            $scope.changedTable1 = function(table1) {

                var objName = $filter('lowercase')(table1);
                allAppointmentDataServices.changeSetupFields(objName).then(function(data) {
                    $scope.fieldsName = data.data.fields;
                })
                .catch(function() {

                });

            }
            $scope.changedTable2 = function(table2) {
                var objName2 = $filter('lowercase')(table2);
                allAppointmentDataServices.changeSetupFields(objName2).then(function(data) {
                    $scope.fieldsName1 = data.data.fields;
                })
                .catch(function() {

                });
            }
        } else if (modelType == 'addNoteAccountsTemplate') {

        } else if (modelType == 'convertAccountsTemplate') {

        } else if (modelType == 'addGroupAccountsTemplate') {

            $scope.addToGroupHereFlag = true;

            $scope.addToGroupHere = function() {
                $scope.addToGroupHereFlag = false;
            }

            $scope.addToGroupHereFlagCancel = function() {
                $scope.addToGroupHereFlag = true;
            }
        } else if (modelType == 'workflowAccountsTemplate') {

        } else if (modelType == 'shareWithAccountsTemplate') {

        } else if (modelType == 'assignAccountsTemplate') {

        } else if (modelType == 'deleteAccountAccountsTemplate') {

        } else if (modelType == 'viewGoogleMapAccountsTemplate') {

        } else if (modelType == 'generateExcelAccountsTemplate') {

        }

        $scope.exportToCSV = function() {

            if ($scope.selected == 'all') {
                $rootScope.exportAllCSV();
                $uibModalInstance.dismiss('cancel');
            } else {
                $rootScope.exportSelectedCSV();
                $uibModalInstance.dismiss('cancel');
            }
        }

        $scope.saveSetupField = function() {

            console.log('selected_fields ', $scope.selected_fields);

            var _data = {
                "query_name": "All",
                "query_type": "",
                "page_size": 10,
                "sort_field_name": $scope.relatedTable1,
                "sort_type": $scope.sortby,
                "field_width_info": $scope.selected_fields,
                "child_objects": [{
                    "object": $scope.relatedTable1,
                    "field_width_info": $scope.reltb1selected,
                }]
            }

            console.log(JSON.stringify(_data))

            contactDataServices.saveSetupFieldsAppot(JSON.stringify(_data)).then(function(data) {
                $uibModalInstance.close('open');
            })
            .catch(function() {

            });
        }

        $scope.deleteRecord = function() {
            console.log(JSON.stringify(modelType.rowIds))
            contactDataServices.deleteSalesData(JSON.stringify(modelType.rowIds)).then(function(data) {
                console.log(data);
            })
            .catch(function() {

            });

        }

        $scope.accounts = {}

        $scope.Accounts = function() {

            if ($scope.accounts.name == undefined) {
                $rootScope.alertPopup();
            } else {

                contactDataServices.saveSetupFieldsAppot(JSON.stringify(_data)).then(function(data) {
                    $uibModalInstance.close('open');
                })
                .catch(function() {

                });

            }
        }

        $scope.convertAccount = function() {

            console.log('modelType.rowIds ', modelType.rowIds);
            var _data = {
                "id": [modelType.rowIds],
                "current_status": "Lead",
                "changed_status": $scope.statusList,
                "is_create_next_task": $scope.w_cb,
                "pending_task": [{
                        "id": 1452,
                        "value": "Send a proposal"
                    },
                    {
                        "id": 8792,
                        "value": "Get the order"
                    }
                ],
                "note_text": $scope.rnote,
                "child_object": $scope.t_state,
                "child_status": "Lead"
            }


            contactDataServices.convertAccount(JSON.stringify(_data)).then(function(data) {
                $uibModalInstance.close('open');
            })
            .catch(function() {

            });
        }


        console.log('modelType', modelType);
        $scope.modelType = modelType;
        $scope.ok = function() {
            console.log(modelType);
            $uibModalInstance.close('open');
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();