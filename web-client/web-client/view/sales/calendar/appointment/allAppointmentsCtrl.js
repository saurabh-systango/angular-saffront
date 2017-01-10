(function () {

    'use strict';

    angular.module('allAppointments', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.selection', 'ui.select']);

})();

(function () {

    'use strict';

    angular.module('allAppointments').controller('allAppointmentCtrl', allAppointmentCtrl);


    function allAppointmentCtrl($scope, $rootScope, toastr, $filter, $uibModal, uiGridExporterService, uiGridExporterConstants, allAppointmentDataServices, uiGridConstants) {

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
            exporterCsvFilename: 'All Appointments_Resultset.csv',
            paginationPageSizes: [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200],
            paginationPageSize: 10,
            useExternalPagination: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0
        };

        $scope.queries = [];

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

        $scope.group_by_field_name = "t_status"
        
        $scope.groupSelected = function(group) {
            $scope.groupSort = group;
            $scope.group_by_field_name = group.name;
            console.log(group.name)
            $rootScope.refresh();
        }

         $scope.idSelectedAppointment = 'All Appointments';

        $scope.setSelectedAccount = function(val) {
            $scope.idSelectedAppointment = val;
            $scope.query_name = val;
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
            $scope.search_field_name = colname.name
        }

        $scope.clearCondition = function(){
            $scope.group_by_condition = '';
            console.log('Clear')
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

            console.log(JSON.stringify(_data));
            allAppointmentDataServices.getAccountsDetails(JSON.stringify(_data)).then(function (data) {
              
                $scope.queryObj = {
                    query_name : data.data.query_name,
                    query_type : data.data.query_type,
                    page_size : data.data.page_size,
                    sort_field_name : data.data.sort_field_name,
                    sort_type : data.data.sort_type
                }
                
                $scope.gridOptions1.totalItems = data.data.records.length;
                var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;

                $scope.accountData = data;
                $scope.groupBy = data.group_by;
                $scope.queries = data.data.queries;
                 $scope.singleSelect = false;
                $scope.multipleSelect = false;
                $scope.selectedRows = []

                angular.forEach(data.data.fields, function (value, key) {

                    if (!value.is_hidden) {
                        $scope.gridOptions1.columnDefs.push({
                            name: value.name,
                            displayName: value.label,
                            enableCellEdit: true,
                            cellTemplate: '<div ng-if="' + value.is_detail_link + ' == true" class="ui-grid-cell-contents clickable" ng-click="grid.appScope.accountsDetails(row.entity.id)" title="{{ row.entity.' + value.name + '}}">{{ row.entity.' + value.name + '}}</div> <div ng-if="' + value.is_detail_link + ' == false" class="ui-grid-cell-contents" title="{{ row.entity.' + value.name + '}}">{{ row.entity.' + value.name + '}}</div>',
                        });
                    }

                });
                $scope.gridOptions1.data = data.data.records.slice(firstRow, firstRow + paginationOptions.pageSize);
                
            })
            .catch(function () {
                $scope.error = 'data not fount';
            });
        }

        $rootScope.refresh();


        $scope.gridOptions1.columnDefs = [];
        $scope.selectedRows = [];
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
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                paginationOptions.pageNumber = newPage;
                paginationOptions.pageSize = pageSize;
                $rootScope.refresh();
            });

            $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row) {

                // console.log(row.entity.id);
                if (row.isSelected == true) {
                    $rootScope.rowChangedValue = row.entity.id;
                    console.log(row.entity)
                    //$scope.isStatus = row.entity.t_status;
                    $scope.selectedRows.push(row.entity.id);
                    $scope.compltettitle = row.entity.subject;
                    $rootScope.deleteId = {};
                    $rootScope.deleteId.id = $scope.selectedRows;
                    console.log(JSON.stringify($rootScope.deleteId))
                    $scope.selectedRowsDelete = $scope.selectedRows.length;
                    console.log( $scope.selectedRowsDelete )
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
            $scope.gridApi.selection.on.rowSelectionChangedBatch($scope, function (row) {
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

        $scope.addFilter = function() {
            $scope.addTab({
                name: 'Add Filter'
            });
        }

        $scope.animationsEnabled = true;

        //Get Convet API Call

        $rootScope.setup = {};
        $scope.getSetupField = function () {

            var _data = {
                "query_name": "All Appointments",
                "query_type": "query"
            }

            allAppointmentDataServices.getSetupFields(JSON.stringify(_data)).then(function (data) {
                $rootScope.selected_fields = data.data.selected_fields;
                $rootScope.available_fields = data.data.available_fields;
                $rootScope.child_object_list = data.data.child_object_list

                console.log($rootScope.child_object_list)
            })
                .catch(function () {
                   
                });
        }

        $scope.setupAppointmentTemplate = function (size) {
            $scope.getSetupField();
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/appointment/listSetup.html',
                controller: 'ModalInstanceAllAppontmentCtrl',
                size:  '700px setup',
                resolve: {
                    modelType: function () {
                        var modelData = {
                            modelName: 'setupAppointment',
                            rowIds: $scope.rowChangedValue,
                            tempObj: $scope.queryObj
                        }
                        return modelData;
                    }
                }
            });
        }
     
        $scope.createNewAppointment = function () {

            $rootScope.apntMsg = 'Add Appointment';

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/createNewAllAppointment.html',
                controller: 'ModalInstanceAllAppontmentCtrl',
                size: '800px addTask',
                resolve: {
                    modelType: function () {
                        var modelData = {
                            modelName: 'Add Appointment',
                            rowIds: $scope.rowChangedValue,
                            formData: "",
                            count: $scope.selectedRowsDelete,
                        }

                        return modelData;
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
        $scope.allAppointmentAddNote = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/appointment/allAppointmentAddNote.html',
                controller: 'ModalInstanceAllAppontmentCtrl',
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
                templateUrl: 'view/sales/calendar/pendingTasks/pendingTaskComplete.html',
                controller: 'ModalInstanceAllAppontmentCtrl',
                size: '400px addNote complete',
                resolve: {
                    modelType: function () {
                        var modelData = {
                            modelName: 'compelete',
                            rowIds: $rootScope.deleteId,
                            formData: $scope.compltettitle,
                            count : $scope.selectedRowsDelete

                        }

                        return modelData;
                    }
                }
            });
        }

		$scope.taskRepeatReminder = function(size) {

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

        $scope.allAppointmentReschudule = function () {
            console.log('allAppointmentReschudule');
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/appointment/allAppointmentReschedule.html',
                controller: 'ModalInstanceAllAppontmentCtrl',
                size: '370px Reschedule',
                resolve: {
                    modelType: function() {
                        var modelData = {
                            modelName: 'reschedule',
                            rowIds: $rootScope.deleteId,
                            formData: "",
                            count: $scope.selectedRowsDelete
                        }
                        return modelData;
                    }
                }
            });
        }

        $scope.allAppointmentExcel = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/appointment/allAppointmentExcel.html',
                controller: 'ModalInstanceAllAppontmentCtrl',
                size: '400px excel',
                resolve: {
                    modelType: function () {
                        var modelData = {
                            modelName: 'allAppointmentExcel',
                            rowIds: $scope.rowChangedValue,
                            formData: "",
                        }
                        return modelData;
                    }
                }
            });
        }

        $scope.allAppointmentPrint = function () {
            window.print()
           
        }


        $scope.allAppointmentDelete = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/appointment/allAppointmentDelete.html',
                controller: 'ModalInstanceAllAppontmentCtrl',
                size: '350px delet',
                resolve: {
                    modelType: function() {
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
		$rootScope.allAppointmentDelete = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/appointment/allAppointmentDelete.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function () {
                        return 'allAppointmentDelete';
                    }
                }
            });
        }	
		$rootScope.emailAlert = function (size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/appointment/emailAlert.html',
                controller: 'ModalInstanceOpportunitiesCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function () {
                        return 'emailAlert';
                    }
                }
            });
        }	

        $scope.allAppointmentEdit = function () {          

            allAppointmentDataServices.editAppointmentDetails($scope.rowChangedValue).then(function (data) {
                $rootScope.appointmentView = data.data.records;
                console.log('Edit Appointment : ', JSON.stringify(data.data.records));
            })
            .catch(function () {                
            });

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/createNewAllAppointment.html',
                controller: 'ModalInstanceAllAppontmentCtrl',
                size: '800px addTask',
                resolve: {
                    modelType: function () {
                        var modelData = {
                            modelName: 'Edit Appointment',
                            rowIds: $scope.rowChangedValue,
                            formData: $rootScope.editData,
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
    angular.module('allAppointments').controller('ModalInstanceAllAppontmentCtrl', ModalInstanceAllAppontmentCtrl);
    function ModalInstanceAllAppontmentCtrl($scope, $rootScope, $filter, accountsDataServices,  $uibModalInstance, allAppointmentDataServices, modelType, toastr) {

        $scope.selectedData = null;
       

        $scope.userList = function() {

            accountsDataServices.userDetails().then(function(data) {
                $scope.userList = data.data.users
            })
            .catch(function() {

            });
        }

        $scope.userList();

        $scope.onSelect = function(selection) {
            console.log(selection);
            $scope.selectedData = selection;
        };

        console.log("Edit Data : ", modelType.formData)

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

         $scope.rescheduleChange = function () {

            if ($scope.rescheduleType == 'byDays') {
                $scope.rescheduleDayMode = true;
                $scope.rescheduleSpecificDateMode = false;
            }
            else if ($scope.rescheduleType == 'date') {
                $scope.rescheduleSpecificDateMode = true;
                $scope.rescheduleDayMode = false;
            }
            else {
                $scope.rescheduleSpecificDateMode = false;
                $scope.rescheduleDayMode = false;
            }
        }

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
            
		
        // $scope.picker3 = {
        //     date: new Date()
        // };
        // $scope.openCalendar = function (e, picker) {
        //     $scope[picker].open = true;
        // };
		
        $scope.modelType = modelType;
        // add Note API
        $scope.addNoteApi = function () {
            var _data = {
                "id": [$scope.modelType.rowIds]
            }
            allAppointmentDataServices.addNote(JSON.stringify(_data)).then(function (data) {
                if (data.status == -1) {
                   $uibModalInstance.close('open');
                } else {
                    
                     $uibModalInstance.close('open');
                }
            })
            .catch(function () {
               
            });
        }

        console.log('formData', modelType.rowIds)
        // complete API funtion call
        $scope.completeApi = function () {
            var tempObj = {}
            tempObj = modelType.rowIds
            tempObj.note_text = $scope.note_text 
            console.log(JSON.stringify(tempObj))

            // console.log($scope.rowChangedValue);
            allAppointmentDataServices.completeTask(JSON.stringify(tempObj)).then(function (data) {
                if (data.status == -1) {
                   $uibModalInstance.close('open');
                } else {
                    $uibModalInstance.close('open');
                }
            })
            .catch(function () {
                toastr.error('something went wrong please try again', 'Error');
            });
        }

        $scope.rescheduleType = 'Next day';

        $scope.rescheduleApi = function () {          
             var _data = {};
            _data = modelType.rowIds;
            _data.type = $scope.rescheduleType;
            _data.no_of_days = $scope.day;
            _data.date = $scope.datest;

            allAppointmentDataServices.reschedule(JSON.stringify(_data)).then(function (data) {
               $uibModalInstance.close('open');
                $rootScope.refresh();
            })
            .catch(function () {
               
            });
        }  

        $scope.attendeesList = function(){
            allAppointmentDataServices.newAppointmentDialog().then(function (data) {
                $scope.note_types = data.data.note_types;
                $scope.attendees = data.data;
                // $scope.user = {
                //     note_type: $scope.note_types[0],
                //     note: ''
                // }
            })
            .catch(function () {
                $scope.error = 'data not fount';
            });
        }   
        $scope.attendeesList();

          // Delete API funtion call
          $scope.newAppointmentSave = function () { 

            console.log('$scope.subject', $scope.appointmentView.subject)
            var _data = {
                "id": modelType.rowIds,
                "subject": $scope.appointmentView.subject,
                "start_date": $scope.picker4.date,
                "end_date":   $scope.picker3.date,
                "t_status":   $scope.appointmentView.t_status,
                "assign_to":  $scope.appointmentView.assign_to,
                "company":    $scope.appointmentView.company,
                "location": "",
                "full_name":  $scope.appointmentView.full_name,
                "text":       $scope.appointmentView.text,
                "ol_sync":    $scope.appointmentView.ol_sync,
                "google_sync": $scope.appointmentView.google_sync,
                "parent_recordid": 0,
                "attendees": [
                    {
                        "id": $scope.selectedData.id,
                        "guest_name": $scope.selectedData.name,
                        "guest_email": $scope.selectedData.email,
                        "t_status": $scope.selectedData.t_status,
                        "owner":  $scope.selectedData.owner
                    }
                ],
                "note_type" : $scope.appointmentView.note_type,
                "note" : $scope.appointmentView.note,
                "is_repeat" : false,
                "recurring_fields": {},
                "reminder":[
                    {
                        "t_reminder_type": "Email",
                        "t_time_type": "minutes",
                        "t_time_value": "10"
                    },
                    {
                        "t_reminder_type": "Pop-up",
                        "t_time_type": "minutes",
                        "t_time_value": "10"
                    }
                ]

            }

            console.log(JSON.stringify(_data));
            
            allAppointmentDataServices.addNewAppointment(JSON.stringify(_data)).then(function (data) {
                if (data.status == -1) {
                  $uibModalInstance.close('open');
                   $rootScope.refresh();
                } else {
                    $rootScope.refresh();
                    $uibModalInstance.close('open');
                    $rootScope.refresh();
                }

            })
            .catch(function () {
                
            });
        }


        $scope.newAppointmentDialog = [];
        if (modelType.modelName == 'Add Appointment') {           
            $scope.picker3 = {
                date: new Date()
            };

            $scope.addReminder = function () {
                $scope.user.reminder.push({ t_reminder_type: $scope.reminderType[0], t_time_type: $scope.reminderIn[0], t_time_value: 10 });
            }

            $scope.deleteReminder = function (val) {
                $scope.user.reminder.splice(val, 1);
            }

            $scope.saveNewAppointment = function (isValid) {
                if (isValid) {
                    alert('our form is amazing');
                    console.log($scope.user);
                }
                else {
                    alert('invalid');
                }
            }

            $scope.allAppointmentOpenRepeatPopUp = function (isChecked) {
                if (isChecked) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'view/sales/calendar/allAppointmentRepeatReminder.html',
                        controller: 'ModalInstanceAllAppontmentCtrl',
                        size: 'md',
                        resolve: {
                            modelType: function () {
                                var modelData = {
                                    modelName: 'allAppointmentOpenRepeatPopUp',
                                    rowIds: $scope.rowChangedValue,
                                    formData: "",
                                }
                                return modelData;
                            }
                        }
                    });
                }
            }
        }
        else if (modelType.modelName == 'addNote') {
            // $scope.addNoteApi(modelType);

            $scope.note_types = [];
            allAppointmentDataServices.newAppointmentDialog().then(function (data) {
                $scope.note_types = data.data.note_types;
                $scope.user = {
                    note_type: $scope.note_types[0],
                    note: ''
                }
            })
            .catch(function () {
                $scope.error = 'data not fount';
            });
        }
        else if (modelType.modelName == 'setupAppointment') {     
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


        else if (modelType.modelName == 'allAppointmentOpenRepeatPopUp') {

            $scope.repeatType = ["Daily", "Weekly", "Monthly", "Yearly"];

            $scope.repeatOn = ["M", "T", "W", "T", "F", "S", "S"];

            $scope.repeat = { repeatType: $scope.repeatType[0], repeatEvery: 1, repeatOn: $scope.repeatOn[0] };

            $scope.picker3 = {
                date: new Date()
            };

            $scope.openCalendar = function (e, picker) {
                $scope[picker].open = true;
            };

            $scope.weekMode = false;
            $scope.monthMode = false;

            $scope.changeRepeatType = function (val) {
                if (val == 'Weekly') {
                    $scope.weekMode = true;
                    $scope.monthMode = false;
                }
                else if (val == 'Monthly') {
                    $scope.monthMode = true;
                    $scope.weekMode = false;
                }
                else {
                    $scope.monthMode = false;
                    $scope.weekMode = false;
                }
            }
        }

        else if (modelType.modelName == 'delete') {

        }
        else if (modelType.modelName == 'reschedule') {
          
        }

        else if (modelType.modelName == 'allAppointmentExcel') {

        }
        else if (modelType.modelName == 'Edit Appointment') {


            $scope.addReminder = function () {
                $scope.user.reminder.push({ t_reminder_type: $scope.reminderType[0], t_time_type: $scope.reminderIn[0], t_time_value: 10 });
            }

            $scope.deleteReminder = function (val) {
                $scope.user.reminder.splice(val, 1);
            }

            $scope.saveNewAppointment = function (isValid) {
                alert($scope.user.subject);
                // check to make sure the form is completely valid
                if (isValid) {
                    alert('our form is amazing');
                    console.log($scope.user);
                }
                else {
                    alert('invalid');
                }
            }

            $scope.allAppointmentOpenRepeatPopUp = function (isChecked) {

                if (isChecked) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'view/sales/calendar/allAppointmentRepeatReminder.html',
                        controller: 'ModalInstanceAllAppontmentCtrl',
                        size: 'md',
                        resolve: {
                            modelType: function () {
                                return 'allAppointmentOpenRepeatPopUp';
                            }
                        }
                    });
                }
            }
        }
        else if (modelType.modelName == 'complete') {
            $scope.completeApi(modelType);
        }

        $scope.saveSetupField = function () {
                var _data = {
                    "query_name":modelType.tempObj.query_name,
                    "query_type":modelType.tempObj.query_type,
                    "page_size":modelType.tempObj.page_size,
                    "sort_field_name":modelType.tempObj.sort_field_name,
                    "sort_type":modelType.tempObj.sort_type,
                    "field_width_info": $scope.selected_fields,
                    "child_objects":[
                        {
                            "object":$scope.relatedTable1,
                            "field_width_info": $scope.reltb1selected,
                        }
                    ]
                }
                
                console.log(JSON.stringify(_data));


                allAppointmentDataServices.saveSetupFields(JSON.stringify(_data)).then(function (data) {
                  // console.log(data)
                  $uibModalInstance.close('open');
                  //toastr.success('Setting Save', 'Success');
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


        $scope.deleteRecord = function () {          
            console.log(modelType.rowIds);
            allAppointmentDataServices.deleteAppointment(JSON.stringify(modelType.rowIds)).then(function (data) {
                $uibModalInstance.close('open');
                $rootScope.refresh();
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
    }

})();