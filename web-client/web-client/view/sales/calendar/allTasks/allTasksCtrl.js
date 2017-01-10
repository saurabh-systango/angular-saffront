(function () {

    'use strict';

    angular.module('allTasks', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.selection', 'ui.select']);

})();

(function () {

    'use strict';

    angular.module('allTasks').controller('allTasksCtrl', allTasksCtrl);

    function allTasksCtrl($scope, $rootScope, toastr, $filter, $uibModal, uiGridExporterService, uiGridExporterConstants, allTasksDataServices, uiGridConstants) {

        var paginationOptions = {
            pageNumber: 1,
            pageSize:10,
           // sort: null
        };

        $scope.gridOptions1 = {
            rowHeight: 30,
            multiSelect: true,
            enableFooterTotalSelected: true,
            showGridFooter: true,
            enableSorting: true,
            enableColumnMenus: false,
             paginationPageSizes: [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200],
            paginationPageSize: 10,
            useExternalPagination: true,
            exporterCsvFilename: 'All Tasks_Resultset.csv',
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0
        };

        $scope.gridOptions1.columnDefs = [];
         $scope.gridOptions1.onRegisterApi = function (gridApi) {

            $scope.gridApi = gridApi;

            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
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

                console.log(row.isSelected);

                $scope.isSelect = row.isSelected;

                if ($scope.isSelect == true) {
                    $rootScope.rowChangedValue = row.entity.id;
                    
                    $scope.selectedRows.push(row.entity.id);
                    $rootScope.deleteId = {};
                    $rootScope.deleteId.id = $scope.selectedRows;
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

            var selectAllFlag = false;

            $scope.gridApi.selection.on.rowSelectionChangedBatch($scope, function (row) {

                $scope.isSelect = row.isSelected;

                if ($scope.isSelect == true) {
                    $rootScope.rowChangedValue = row.entity.id;
                    $scope.isStatus = row.entity.t_status;
                    //$scope.selectedRows.push(row);

                    $scope.selectedRows.push(row.entity.id);
                    $rootScope.deleteId = {};
                    $rootScope.deleteId.id = $scope.selectedRows;
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
        };

        $scope.getTableHeight = function () {
            var rowHeight = 30; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.gridOptions1.data.length * rowHeight + headerHeight) + "px"
            };
        };

        $scope.filterSelected = function(filter) {
            $scope.filterSort = filter;
            $scope.filterName = filter.name;
            $rootScope.refresh();
        }


        $scope.groupSort = {
            label: 'Status'
        };

        $scope.group_by_field_name = "t_status"
        
        $scope.groupSelected = function(group) {
            $scope.groupSort = group;
            $scope.group_by_field_name = group.name;
            console.log(group.name)
            $rootScope.refresh();
        }

         $scope.queryName = 'All Tasks';

        $scope.setSelectedAccount = function(val) {
            $scope.idSelectedAppointment = val;
            $scope.queryName = val;
        }

        $scope.isGroupByFiled = 'Status';

        $scope.groupByFiled = function(val) {
            $scope.isGroupByFiled = val;
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

        $scope.search_field_name = "";
        $scope.colnameSelected = function (colname) {
            $scope.columnSort = colname;
            $scope.search_field_name = colname.name,
            $rootScope.refresh();
        }

        $scope.clearCondition = function(){
            $scope.group_by_condition = '';
            console.log('Clear')
        }


        $rootScope.refresh = function () {

            var _data = {    
                 "query_name":  $scope.queryName,            
                "group_by_field_name": $scope.group_by_field_name,
                "group_by_condition" : $scope.group_by_condition,
                "search_field_name"  : $scope.search_field_name, 
                "search_text": $scope.searchText,
                "sort_type": "asc",
                "page_size" : 100
              //  "page_size" : paginationOptions.pageSize,
                // "start_index": 6 
            };

            console.log(_data);
            allTasksDataServices.getAccountsDetails(JSON.stringify(_data)).then(function (data) {

                $scope.accountData = data;

                $scope.gridOptions1.totalItems = data.data.records.length;
                var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
                   
                $scope.accountData = data;
                
                $scope.singleSelect = false;
                $scope.multipleSelect = false;
                $scope.selectedRows = []

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

                $scope.gridOptions1.data = data.data.records.slice(firstRow, firstRow + paginationOptions.pageSize);
            
                })
                .catch(function () {
                    toastr.error('something went wrong please try again', 'Error');
                });
        }

        $rootScope.refresh();

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

        $scope.animationsEnabled = true;

       $scope.getSetupField = function () {

            var _data = {
                "query_name": "All Task",
                "query_type": "query"
            }

            allTasksDataServices.getSetupFields(JSON.stringify(_data)).then(function (data) {
                $rootScope.selected_fields = data.data.selected_fields;
                $rootScope.available_fields = data.data.available_fields;
                $rootScope.child_object_list = data.data.child_object_list

                console.log($rootScope.child_object_list)
            })
            .catch(function () {
                toastr.error('something went wrong please try again', 'Error');
            });
        }


        $scope.setupAppointmentTemplate = function () {
            $scope.getSetupField();
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/allTasks/setup.html',
                controller: 'ModalInstanceAllTaskCtrl',
                size:  '700px setup',
                resolve: {
                    modelType: function () {
                            var modelData = {
                                modelName: 'setup'
                            }
                        return modelData;
                    
                    }
                },

            });
        }

        $scope.addNote = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/allTasks/allTaskAddNote.html',
                controller: 'ModalInstanceAllTaskCtrl',
                size: '800px add-note',
                resolve: {
                    modelType: function () {
                        var modelData = {
                            modelName: 'addNote',
                            rowIds: $scope.rowChangedValue,
                            formData: "",
                        }
                        return modelData;
                    }
                }
            });
        }



        $scope.complete = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/allTasks/allTaskComplete.html',
                controller: 'ModalInstanceAllTaskCtrl',
                size: '400px addNote complete',
                resolve: {
                    modelType: function () {
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


        $scope.reschedule = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/allTasks/reschedule.html',
                controller: 'ModalInstanceAllTaskCtrl',
                size: '370px Reschedule',
                resolve: {
                    modelType: function () {
                        var modelData = {
                            modelName: 'reschedule',
                            rowIds: $scope.rowChangedValue,
                            formData: "",
                        }
                        return modelData;
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
        $scope.delete = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/pendingTasks/pendingTaskDelete.html',
                controller: 'ModalInstanceAllTaskCtrl',
                size: '350px delet',
                resolve: {
                    modelType: function () {
                        var modelData = {
                            modelName: 'delete',
                            rowIds: $rootScope.deleteId ,
                            formData: "",
                        }
                        return modelData;
                    }
                }
            });
        }

        $scope.allTasksExcel = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/allTasks/allTasksExcel.html',
                controller: 'ModalInstanceAllTaskCtrl',
                size: '400px excel',
                resolve: {
                    modelType: function () {
                        return 'allTasksExcel';

                    }
                }
            });
        }

        $scope.allTasksPrint = function () {
            window.print();
        }
        // edit API function
        $scope.editApi = function () {
            allTasksDataServices.editTasks($scope.rowChangedValue).then(function (data) {
                console.log('editTasks API');
                $rootScope.editData = data.data.records;
                $rootScope.data = data.data;
            })
                .catch(function () {
                    toastr.error('something went wrong please try again', 'Error');
                });
        };
	
        $scope.allTasksEdit = function () {
            $scope.editApi();
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/allTasks/allTasksEdit.html',
                controller: 'ModalInstanceAllTaskCtrl',
                size: '800px addTask',
                resolve: {
                    modelType: function () {
                        var modelData = {
                            modelName: 'edit',
                            rowIds: $scope.rowChangedValue,
                            formData: "",
                        }
                        return modelData;
                    }
                }
            });
        }
		
		$rootScope.emailAlert = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/allTasks/emailAlert.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function () {
                        return 'emailAlert';
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
			 $rootScope.delete = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/pendingTasks/pendingTaskDelete.html',
                controller: 'ModalInstanceAllTaskCtrl',
                size: '350px delet',
                resolve: {
                    modelType: function () {
                        var modelData = {
                            modelName: 'delete',
                            rowIds: $scope.rowChangedValue,
                            formData: "",
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
    angular.module('allTasks').controller('ModalInstanceAllTaskCtrl', ModalInstanceAllTaskCtrl);

    function ModalInstanceAllTaskCtrl($scope, $rootScope, $uibModalInstance, $filter, modelType, allTasksDataServices, toastr) {
        //$scope.modelType = modelType;
        console.log(modelType);

        $scope.reminderType = ["Email", "Pop-up"];
        $scope.reminderIn = ["minutes", "hours", "days", "weeks"];
        $scope.user = {
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

        $scope.addReminder = function () {
            $scope.user.reminder.push({ t_reminder_type: $scope.reminderType[0], t_time_type: $scope.reminderIn[0], t_time_value: 10 });
        }
        $scope.deleteReminder = function (val) {
            $scope.user.reminder.splice(val, 1);
        }

        $scope.openCalendar = function (e, picker) {
            $scope[picker].open = true;
        };

        // add Note API
        $scope.addNoteApi = function () {
            var _data = {
                "id": [$scope.modelType.rowIds],
            }
            allTasksDataServices.addNote(JSON.stringify(_data)).then(function (data) {
                if (data.status == -1) {
                     $uibModalInstance.close('open');
                } else {
                     $uibModalInstance.close('open');
                }

            })
            .catch(function () {
               
            });
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

        // complete API funtion call
        $scope.completeApi = function (data) {
            // alert('completeApi');
            var _data = {
                "id": [$scope.modelType.rowIds],			// task record ids
                "note_text": ""
            }
            // console.log($scope.rowChangedValue);
            allTasksDataServices.completeTask(JSON.stringify(_data)).then(function (data) {
                console.log('completeApi', JSON.stringify(data))
                if (data.status == -1) {
                    $uibModalInstance.close('open');
                } else {
                    $uibModalInstance.close('open');
                }

            })
            .catch(function () {
               
            });
        }

        // reschedule API function
        $scope.rescheduleApi = function () {
            var _data = {
                "id": [$scope.modelType.rowIds],	// task recordids
                "type": "",		// nextday,nextweek,nextmonth,bydays,date
                "no_of_days": 0,	//Optional
                "date": ""		//Optional
            }
            allTasksDataServices.reschedule(JSON.stringify(_data)).then(function (data) {
                if (data.status == -1) {
                  $uibModalInstance.close('open');
                } else {
                    $uibModalInstance.close('open');
                }

            })
            .catch(function () {
                
            });
        }
        // Delete API funtion call
        $scope.deleteApi = function () {            

            allTasksDataServices.delete(JSON.stringify(modelType.rowIds)).then(function (data) {
                if (data.status == -1) {
                    $uibModalInstance.close('open');
                } else {
                    $uibModalInstance.close('open');
                    $rootScope.refresh();
                }
            })
            .catch(function () {
              
            });
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

            allTasksDataServices.saveSetupFields(JSON.stringify(_data)).then(function (data) {
              // console.log(data)
              $uibModalInstance.close('open');
              //toastr.success('Setting Save', 'Success');
            })
            .catch(function () {
                toastr.error('something went wrong please try again', 'Error');
            });
        }


        if(modelType.modelName == 'setup'){
            $scope.changedTable1=function(table1){              

            var  objName = $filter('lowercase')(table1);
                //alert(objName);
                allTasksDataServices.changeSetupFields(objName).then(function (data) {
                    //console.log(data);
                    $scope.fieldsName = data.data.fields;
                })
                .catch(function () {
                      toastr.error('something went wrong please try again', 'Error');
                });

            } 
            $scope.changedTable2=function(table2){
                var  objName2 = $filter('lowercase')(table2);
                allTasksDataServices.changeSetupFields(objName2).then(function (data) {
                    //console.log(data);
                    $scope.fieldsName1 = data.data.fields;
                })
                .catch(function () {
                     toastr.error('something went wrong please try again', 'Error');
                });
            }  
        }

        $scope.addNewTask = function () {        

             var _data = {
                "id": modelType.rowIds,
                "t_name": $scope.t_name,
                "t_dueby": $scope.t_dueby,
                "t_status": $scope.t_status,
                "company": $scope.company,
                "fullname": $scope.fullname,
                "t_description": $scope.t_description,
                "t_owner": $scope.t_owner,
                "note_type": $scope.note_type,
                "note": $scope.note,
                "parent_record_id": 0,
                "recurring_fields": {}
            }

            console.log(_data);
            pendingTaskDataServices.addNewTasks(JSON.stringify(_data)).then(function (data) {
               $uibModalInstance.close('open');
                $rootScope.refresh();
            })
            .catch(function () {
               
            });
        }

        $scope.ok = function () {
            $uibModalInstance.close('open');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();