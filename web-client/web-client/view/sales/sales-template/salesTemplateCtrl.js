(function () {

    'use strict';

    angular.module('salesTemplate', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.selection']);

})();


(function () {

    'use strict';
    angular.module('salesTemplate').controller('salesTemplatesCtrl', salesTemplatesCtrl);
    // sales Template Controller
    function salesTemplatesCtrl($scope, $uibModal, $filter, $window, toastr, uiGridConstants, salesDataServices, $rootScope) {

        var paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
        };

        $scope.gridOptions1 = {
            rowHeight: 30,
            enablePaginationControls: true,
            multiSelect: true,
            enableSelectAll: true,
            enableFiltering: true,
            enableFooterTotalSelected: true,
            showGridFooter: true,
            enableSorting: true,
            enableColumnMenus: false,
            paginationPageSizes: [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200],
            paginationPageSize: 10,
            useExternalPagination: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0
        };
        $scope.search_field_name = "t_name";
        $scope.colnameSelected = function (colname) {
            $scope.columnSort = colname;
            $scope.search_field_name = colname.name
        }

        $scope.group_by_field_name = "t_catagory";
        $scope.groupSelected = function (group) {
            $scope.groupSort = group;
            $scope.group_by_field_name = group.name;
            $scope.group_by_condition = '';
            $rootScope.refresh();
        }
        $scope.isGroupByFiled = 'Category';

        $scope.groupByFiled = function (val) {
            $scope.isGroupByFiled = val;
        }


        $scope.group_by_condition = "";
        $scope.filterBy = function (type) {
            if (type == 'All') {
                $scope.group_by_condition = "";
                $rootScope.refresh();
            } else {
                $scope.group_by_condition = type;
                console.log(type);
                $rootScope.refresh();
            }
        }

        $scope.copySaleTemplate = function () {
            $scope.add.name = 'copy_of_' + $scope.add.name
            $scope.addShoweMoreAction = false;
        };


        $rootScope.refresh = function () {

            var _data = {
                "group_by_field_name": $scope.group_by_field_name,
                "group_by_condition": $scope.group_by_condition,
                "search_field_name": $scope.search_field_name,
                "search_text": $scope.searchText,
                "sort_type": "asc",
                "page_size": 100
            };
            salesDataServices.getSalesDetails(JSON.stringify(_data)).then(function (data) {
                $scope.gridOptions1.totalItems = data.data.records.length;
                var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
                $scope.salesData = data;
                $scope.status = data.data.records;
                $scope.isSelect = false;
                $scope.singleSelect = false;
                $scope.multipleSelect = false;
                $scope.selectedRows = []

                angular.forEach(data.data.fields, function (value, key) {

                    //Default group by field name
                    // if(value.name == $scope.group_by_field_name){
                    //     $scope.groupSort = {
                    //         label: value.label
                    //     }
                    // }
                    // //Default search field name
                    // if($scope.search_field_name == value.name){                       
                    //     $scope.columnSort= {
                    //         label: value.label
                    //     }
                    // }                    

                    if (value.label == 'id') {

                    } else {

                        $scope.gridOptions1.columnDefs.push({
                            name: value.name,
                            displayName: value.label,
                            enableCellEdit: value.is_inline_edit,
                            cellTemplate: '<div  ng-if="' + value.is_detail_link + ' == true" class="ui-grid-cell-contents clickable" ng-click="grid.appScope.accountsDetails(row.entity.id)"  title="{{ row.entity.' + value.name + '}}">{{ row.entity.' + value.name + '}}</div> <div ng-if="' + value.is_detail_link + ' == false" class="ui-grid-cell-contents" title="{{ row.entity.' + value.name + '}}">{{ row.entity.' + value.name + '}}</div>',
                        });
                    }

                });

                $scope.gridOptions1.data = data.data.records.slice(firstRow, firstRow + paginationOptions.pageSize);

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

        $scope.selectedRows = [];
        $scope.gridOptions1.onRegisterApi = function (gridApi) {

            $scope.gridApi = gridApi;

            $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                if (sortColumns.length == 0) {
                    paginationOptions.sort = null;
                } else {
                    paginationOptions.sort = sortColumns[0].sort.direction;
                }
                $rootScope.refresh();
            });
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                paginationOptions.pageNumber = newPage;
                paginationOptions.pageSize = pageSize;
                $rootScope.refresh();
            });

            $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row) {

                $scope.isSelect = row.isSelected;

                if ($scope.isSelect == true) {
                    $rootScope.rowChangedValue = row.entity.id;
                    $scope.isStatus = row.entity.t_status;
                    //$scope.selectedRows.push(row);

                    $scope.selectedRows.push(row.entity.id);
                    $rootScope.deleteId = {};
                    $rootScope.deleteId.id = $scope.selectedRows;
                    console.log('$rootScope.delete Record ID', $rootScope.deleteId.id);
                    $scope.selectedRowsDelete = $scope.selectedRows.length;
                } else {
                    var index = $scope.selectedRows.indexOf(row);
                    $scope.selectedRows.splice(index, 1);
                    $scope.singleSelect = false;
                }

                if ($scope.selectedRows.length == 1) {
                    $scope.singleSelect = true;
                    $scope.multipleSelect = false;
                } else if ($scope.selectedRows.length >= 2) {
                    $scope.singleSelect = false;
                    $scope.multipleSelect = true;
                }

            });

            $scope.selectAllFlag = false;

            $scope.gridApi.selection.on.rowSelectionChangedBatch($scope, function (row) {

                if ($scope.selectAllFlag == false) {

                    $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                        $scope.multipleSelect = true;
                        $scope.singleSelect = false;
                        $scope.selectedRows.push(row);
                        $rootScope.deleteId = $scope.selectedRows;
                        $scope.selectedRowsDelete = $scope.selectedRows.length;
                    });

                    $scope.selectAllFlag = true;

                } else {
                    $scope.gridApi.selection.clearSelectedRows();
                    $scope.selectAllFlag = false;
                    $scope.multipleSelect = false;
                    $scope.singleSelect = false;
                    $scope.selectedRows = [];
                }
                if ($scope.selectedRows.length == 1) {
                    $scope.singleSelect = true;
                    $scope.multipleSelect = false;
                } else if ($scope.selectedRows.length >= 2) {
                    $scope.singleSelect = false;
                    $scope.multipleSelect = true;
                }

            });
        };

        //open new tab
        $scope.accountsDetails = function (id) {
            $rootScope.rowChangedValue = id;
            console.log('rowChangedvalue:', $rootScope.rowChangedValue);
            $scope.editSales();
            $scope.addTab({
                name: 'Edit Sales Templates'
            });
        };

        $scope.editTemaplate = function () {
            $scope.singleSelect = false;
            $scope.multipleSelect = false;
            $scope.editSales();
            $scope.addTab({
                name: 'Edit Sales Templates'
            });
        };

        $scope.copySaleTemplate = function () {
            $scope.hideButton = false;
            $scope.addTab({
                name: 'Copy Sales Templates'
            });
        };

        //Get Field 
        $scope.getAllFiels = function () {
            salesDataServices.salesAllFiels().then(function (data) {
                $scope.salesFieldData = data;
            })
                .catch(function () {
                    // toastr.error('something went wrong please try again', 'Error');
                });
        }
        //Inactive template
        $scope.inactiveSalesTempl = function () {
            var _data = {
                "id": [$rootScope.rowChangedValue]
            }

            salesDataServices.inactiveSalesTemplate(JSON.stringify(_data)).then(function (data) {
                $scope.saveSalesTemplate = data;
                $scope.refresh();
            })
                .catch(function () {
                    // toastr.error('something went wrong please try again', 'Error');
                });
        }

        //Active Template
        $scope.activeSalesTempl = function () {
            var _data = {
                "id": [$rootScope.rowChangedValue]
            }

            salesDataServices.activeSalesTemplate(JSON.stringify(_data)).then(function (data) {
                $scope.saveSalesTemplate = data;
                $scope.refresh();
            })
                .catch(function () {
                    //toastr.error('something went wrong please try again', 'Error');
                });
        }

        $scope.editSales = function () {
            var _data = $rootScope.rowChangedValue;
            salesDataServices.editSalesTemplate(JSON.stringify(_data)).then(function (data) {
                $rootScope.editData = data.data;
            })
                .catch(function () {
                    //toastr.error('something went wrong please try again', 'Error');
                });
        }

        $scope.add = {
            availableOptions: [
                { name: 'Active' },
                { name: 'Inactive' }
            ],
            status: { name: 'Active' }
        };

        $scope.status_type = ["Active", "Inactive"];


        $scope.animationsEnabled = true;

        $scope.deleteSalesTemplate = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/sales-template/deleteSalesTemplate.html',
                controller: 'ModalInstanceSalesCtrl',
                size: '350px delet',
                resolve: {
                    modelType: function () {
                        var modelData = {
                            modelName: 'delete',
                            rowIds: $rootScope.deleteId.id,
                            formData: "",
                            count: $scope.selectedRowsDelete
                        }
                        return modelData;
                    }
                }
            });
        }


        $scope.addMailMarge = function (item) {
            var array = [];
            var subjectData = document.getElementById("myText").value;
            console.log(subjectData);
            if (subjectData != null || subjectData != '') {
                array.push(document.getElementById("myText").value);
                array.push('${' + item.value + '}');
                $scope.add.subject = array.join(" ");
            }
            else {
                array.push('${' + item.value + '}');
                $scope.add.subject = array;
            }

        }
    }

})();

(function () {

    'use strict';

    angular.module('salesTemplate').controller('ModalInstanceSalesCtrl', ModalInstanceSalesCtrl);

    function ModalInstanceSalesCtrl($scope, $rootScope, toastr, $uibModalInstance, modelType, salesDataServices) {

        $scope.class = "none";
        $scope.clickTwit = function () {
            $scope.classGp = "none";
            $scope.classFb = "none";

            if ($scope.class === "none")
                $scope.class = "block";
            else
                $scope.class = "none";
        };

        $scope.modelType = modelType;

        $scope.deleteRecord = function () {
            console.log('Delete Records:', modelType.rowIds);
            if (modelType.rowIds == undefined) {
                $scope.delId = [];
                $scope.delId.push($rootScope.rowChangedValue);
                console.log($scope.delId);
                console.log('scope delID', $scope.delId);
                var _data = {
                    "id": $scope.delId
                }

            }
            else {
                var _data = {
                    "id": modelType.rowIds.id
                }

            }
            salesDataServices.deleteSalesData(JSON.stringify(_data)).then(function (data) {

                if (data.status == -1) {
                    $scope.cancel();
                    // $uibModalInstance.close('open');
                } else {
                    console.log('data.status');
                    $rootScope.refresh();
                    // if (modelType.formData == 'copyTemp') {
                    //     $scope.addTab({
                    //         name: 'Sales Templates'
                    //     });
                    // } else {

                    // }
                    $scope.cancel();
                    // $rootScope.removeTab($index);

                    // $uibModalInstance.close('open');
                }

            })
                .catch(function () {
                    // toastr.error('something went wrong please try again', 'Error');
                });

        }


        $scope.ok = function () {
            $uibModalInstance.close('open');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.checkSpam = function (ticked) {
            console.log(ticked);
            if ($scope.checked == 'true') {
                console.log('checked True');
                $scope.spamCheck = true;
                $scope.sendTo = $rootScope.emailAddress;

            } else {
                console.log('checked false');
            }
        }
    }

})();

// create sales template CTrl...

(function () {
    'use strict';
    angular.module('salesTemplate').controller('createSalesTemplatesCtrl', createSalesTemplatesCtrl);
    function createSalesTemplatesCtrl($scope, $rootScope, $uibModal, $window, toastr, $http, $state, salesDataServices) {

        $scope.content = 'Type Here.';
        $scope.copySaleTemplate = function () {
            $scope.add.name = 'copy_of_' + $scope.add.name
            $scope.showeMoreAction = false;
        };

        $scope.add = {
            availableOptions: [
                { name: 'Active' },
                { name: 'Inactive' }
            ],
            status: { name: 'Active' } //This sets the default value of the select in the ui
        };

        $scope.tempObject = [],

            $scope.refresh = function () {
                salesDataServices.createSalesDetails().then(function (data) {
                    $scope.newSalesData = data;

                    angular.forEach(data.data.available_mail_merge_fields, function (value, key) {
                        angular.forEach(value, function (value, key) {
                            $scope.tempObject.push({
                                "title": value,
                                "value": key
                            });
                        });
                    });
                })
                    .catch(function () {
                        $scope.error = 'data not fount';
                    });


            }

        $scope.refresh();

        $scope.addMailMarge = function (item) {
            var array = [];
            var subjectData = document.getElementById("subject").value;
            console.log(subjectData);
            if (subjectData != null || subjectData != '') {
                array.push(document.getElementById("subject").value);
                array.push('${' + item.value + '}');
                $scope.add.subject = array.join(" ");
            }
            else {
                array.push('${' + item.value + '}');
                $scope.add.subject = array;
            }

        }

        $scope.showeMoreAction = false;

        $scope.saveSalesTempl12 = function () {

            if ($scope.add.name == undefined) {
                $scope.alertPopup();
            } else {
                var _data = {
                    "name": $scope.add.name,
                    "subject": $scope.add.subject,
                    "email_message": $scope.add.email_message,
                    "status": $scope.add.status.name
                }

                salesDataServices.saveSalesTemplate(JSON.stringify(_data)).then(function (data) {
                    $scope.saveSalesTemplate = data;
                    $scope.showeMoreAction = true;
                    $rootScope.deleteId = data.data;
                })
                    .catch(function () {
                        //  toastr.error('something went wrong please try again', 'Error');
                    });
            }

        }

        $scope.openWindow = function () {
            console.log('openWindow');
            var url = $state.href('preview', { recordId: $rootScope.deleteId.id });
            $window.open(url, '_blank');
        }

        $scope.test = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/sales-template/testMail.html',
                controller: 'ModalInstanceSalesCtrl',
                size: '350px delet',
                resolve: {
                    modelType: function () {
                        return 'test';
                    }
                }

            });
        }


        $scope.alertPopup = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/sales-template/alert.html',
                controller: 'ModalInstanceSalesCtrl',
                size: '350px delet',
                resolve: {
                    modelType: function () {
                        var modelData = {
                            modelName: 'delete',
                            rowIds: $rootScope.deleteId,
                            formData: "copyTemp",
                            count: $scope.selectedRowsDelete
                        }
                        return modelData;
                    }
                }
            });
        }
    }

})();

//Edit Sale Template
(function () {
    'use strict';
    angular.module('salesTemplate').controller('editSalesTemplatesCtrl', editSalesTemplatesCtrl);

    function editSalesTemplatesCtrl($scope, $rootScope, toastr, $window, $uibModal, $state, salesDataServices) {

        angular.forEach($rootScope.deleteId, function (value, key) {
            angular.forEach(value, function (value, key) {
                $scope.editId = value
            });
        });


        $scope.copySaleTemplate = function () {
            $scope.editData.name = 'copy_of_' + $scope.editData.name
            $scope.editShoweMoreAction = false;
        };

        $scope.tempObject = [],

            $scope.refresh = function () {
                salesDataServices.createSalesDetails().then(function (data) {
                    $scope.newSalesData = data;
                    angular.forEach(data.data.available_mail_merge_fields, function (value, key) {
                        angular.forEach(value, function (value, key) {
                            $scope.tempObject.push({
                                "title": value,
                                "value": key
                            });
                        });
                    });
                })
                    .catch(function () {
                        $scope.error = 'data not fount';
                    });
            }

        $scope.refresh();

        $scope.detailsSales = function () {
            var _data = $rootScope.rowChangedValue;
            salesDataServices.editSalesTemplate(JSON.stringify(_data)).then(function (data) {
                $scope.editData = data.data.template_details;
                //$scope.editData.name = 'copy_of_'+data.data.template_details.name;
            })
                .catch(function () {
                    //  toastr.error('something went wrong please try again', 'Error');
                });
        }

        $scope.detailsSales();

        $scope.deleteSalesTemplate = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/sales-template/deleteSalesTemplate.html',
                controller: 'ModalInstanceSalesCtrl',
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
                }
            });
        }


        $scope.editShoweMoreAction = true;
        $scope.saveSalesTempl12 = function () {
            var _data = {
                "id": $scope.editId,
                "name": $scope.editData.name,
                "subject": $scope.editData.subject,
                "email_message": $scope.editData.email_message,
                "status": $scope.editData.status
            }

            console.log(JSON.stringify(_data))

            salesDataServices.saveSalesTemplate(JSON.stringify(_data)).then(function (data) {
                $scope.saveSalesTemplate = data;
                $scope.editShoweMoreAction = true;
            })
                .catch(function () {
                    //toastr.error('something went wrong please try again', 'Error');
                });
        }

        $scope.openWindow = function () {
            console.log('openWindow');
            console.log($rootScope.deleteId);
            angular.forEach($rootScope.deleteId, function (value, key) {
                angular.forEach(value, function (value, key) {
                    var url = $state.href('preview', { recordId: value });
                    $window.open(url, '_blank');
                });
            });
        }

        $scope.addMailMarge = function (item) {
            var array = [];
            var subjectData = document.getElementById("myText").value;
            console.log(subjectData);
            if (subjectData != null || subjectData != '') {
                array.push(document.getElementById("myText").value);
                array.push('${' + item.value + '}');
                $scope.editData.subject = array.join(" ");
            }
            else {
                array.push('${' + item.value + '}');
                $scope.editData.subject = array;
            }

        }

        $scope.test = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/sales-template/testMail.html',
                controller: 'ModalInstanceSalesCtrl',
                size: '500px testmail',
                resolve: {
                    modelType: function () {
                        return 'test';
                    }
                }

            });
        }


        $scope.alertPopup = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/sales-template/alert.html',
                controller: 'ModalInstanceSalesCtrl',
                size: '350px delet',
                resolve: {
                    modelType: function () {
                        var modelData = {
                            modelName: 'delete',
                            rowIds: $rootScope.deleteId,
                            formData: "copyTemp",
                            count: $scope.selectedRowsDelete
                        }
                        return modelData;
                    }
                }
            });
        }
    }

})();

// copy Ctrl
(function () {
    'use strict';
    angular.module('salesTemplate').controller('copySalesTemplatesCtrl', copySalesTemplatesCtrl);
    function copySalesTemplatesCtrl($scope, $rootScope, toastr, $state, $window, $uibModal, salesDataServices) {

        $scope.copySaleTemplate = function () {
            $scope.copyData.name = 'copy_of_' + $scope.copyData.name
            $scope.copyShoweMoreAction = false;
        };


        $scope.tempObject = [],

            $scope.refresh = function () {
                salesDataServices.createSalesDetails().then(function (data) {
                    $scope.newSalesData = data;
                    angular.forEach(data.data.available_mail_merge_fields, function (value, key) {
                        angular.forEach(value, function (value, key) {
                            $scope.tempObject.push({
                                "title": value,
                                "value": key
                            });
                        });
                    });
                })
                    .catch(function () {
                        $scope.error = 'data not fount';
                    });
            }

        $scope.refresh();

        //$scope.copyShoweMoreAction = true;
        $scope.detailsSales = function () {
            var _data = $rootScope.rowChangedValue;
            salesDataServices.editSalesTemplate(JSON.stringify(_data)).then(function (data) {
                $scope.copyData = data.data.template_details;
                $scope.copyData.name = 'copy_of_' + data.data.template_details.name;
            })
                .catch(function () {
                    // toastr.error('something went wrong please try again', 'Error');
                });
        }

        $scope.detailsSales();

        $scope.copyShoweMoreAction = false;

        $scope.saveSalesTempl12 = function () {
            var _data = {
                "name": $scope.copyData.name,
                "subject": $scope.copyData.subject,
                "email_message": $scope.copyData.email_message,
                "status": $scope.copyData.status
            }

            salesDataServices.saveSalesTemplate(JSON.stringify(_data)).then(function (data) {
                $scope.saveSalesTemplate = data;
                $scope.copyShoweMoreAction = true;
            })
                .catch(function () {
                    // toastr.error('something went wrong please try again', 'Error');
                });
        }

        $scope.openWindow = function () {
            angular.forEach($rootScope.deleteId, function (value, key) {
                angular.forEach(value, function (value, key) {
                    var url = $state.href('preview', { recordId: value });
                    $window.open(url, '_blank');
                });
            });
        }

        $scope.addMailMarge = function (item) {
            var array = [];
            var subjectData = document.getElementById("myText").value;
            console.log(subjectData);
            if (subjectData != null || subjectData != '') {
                array.push(document.getElementById("myText").value);
                array.push('${' + item.value + '}');
                $scope.copyData.subject = array.join(" ");
            }
            else {
                array.push('${' + item.value + '}');
                $scope.copyData.subject = array;
            }

        }
        $scope.alertPopup = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/sales-template/alert.html',
                controller: 'ModalInstanceSalesCtrl',
                size: '350px delet',
                resolve: {
                    modelType: function () {
                        return 'test';
                    }
                }

            });
        }
        $scope.test = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/sales-template/testMail.html',
                controller: 'ModalInstanceSalesCtrl',
                size: '500px testmail',
                resolve: {
                    modelType: function () {
                        return 'test';
                    }
                }

            });
        }

        $scope.deleteSalesTemplate = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/sales-template/deleteSalesTemplate.html',
                controller: 'ModalInstanceSalesCtrl',
                size: '350px delet',
                resolve: {
                    modelType: function () {
                        var modelData = {
                            modelName: 'delete',
                            rowIds: $rootScope.deleteId,
                            formData: "copyTemp",
                            count: $scope.selectedRowsDelete
                        }
                        return modelData;
                    }
                }
            });
        }

    }

})();

(function () {

    'use strict';
    angular.module('salesTemplate').controller('previousCtrl', previousCtrl);

    function previousCtrl($scope, $stateParams, salesDataServices, toastr) {
        $scope.editSales = function () {
            var _data = $stateParams.recordId;
            console.log($stateParams.recordId)
            salesDataServices.editSalesTemplate($stateParams.recordId).then(function (data) {
                $scope.editData = data.data.template_details;
                console.log($scope.editData);
                document.getElementById("msgBody").innerHTML = $scope.editData.email_message;

            })
                .catch(function () {
                    //toastr.error('something went wrong please try again', 'Error');
                });
        }
        $scope.editSales();






    }

})();
