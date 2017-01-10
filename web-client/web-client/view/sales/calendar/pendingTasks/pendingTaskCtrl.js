//controller for calendar -> pending task start

(function() {

    'use strict';

    angular.module('calendar').controller('pendingTaskCtrl', pendingTaskCtrl);

    function pendingTaskCtrl($scope, $rootScope, $uibModal, pendingTaskDataServices, accountsDataServices) {

        $scope.upcoming = [];
        $scope.overdue = [];
        $scope.today = [];

        $scope.pendData = {
            user_names : 'All'
        }
        $scope.userList = function() {

            accountsDataServices.userDetails().then(function(data) {
                $scope.userList = data.data.users
            })
            .catch(function() {

            });
        }
        $scope.userList();

        $scope.pendData.user_names = 'All';

        $rootScope.refresh = function () {

           var _data = {
                "query_name":"All Tasks",
                "query_type":"",     
                "search":                
                 [  
                      { "t_status": "Pending" },
                      { "t_owner": $scope.pendData.user_names },
                    
                 ],
                 "sort_field_name": "t_status",      
                 "sort_type": "desc"
            }

           console.log(JSON.stringify(_data));

            pendingTaskDataServices.getAccountsDetails(JSON.stringify(_data)).then(function (data) {
               
                $scope.accountData = data;
                $scope.groupBy = data.group_by

                $scope.addNoteFloatFlag = false;
                $scope.floatButtonShowFlag = false;        

                angular.forEach(data.data.records, function (value, key) {

                    var currentDate = new Date();
                    var formattedCurrentDate = moment(new Date()).format('YYYY-MM-DD hh:mm');

                    if (value.t_dueby > formattedCurrentDate) {
                        $scope.upcoming.push({
                            "id": value.id,
                            "company": value.company,
                            "t_name": value.t_name,
                            "t_status": value.t_status,
                            "t_dueby": value.t_dueby,
                        });
                    }
                    else if (value.t_dueby < formattedCurrentDate) {
                        $scope.overdue.push({
                             "id": value.id,
                            "company": value.company,
                            "t_name": value.t_name,
                            "t_status": value.t_status,
                            "t_dueby": value.t_dueby,
                        });
                    }
                    else {
                        $scope.today.push({
                             "id": value.id,
                            "company": value.company,
                            "t_name": value.t_name,
                            "t_status": value.t_status,
                            "t_dueby": value.t_dueby,
                        })
                    }

                });
            })
            .catch(function () {
                $scope.error = 'data not fount';
            });
        }

        $rootScope.refresh();

         $scope.floatButtonShowFlag = false;
        $scope.addNoteFloatFlag = false;
        $scope.selectedRows = [];

        $scope.selectEntity = function (id) {

            $scope.selectedRows.push(id);
             $scope.compltettitle = id;
            $rootScope.deleteId = {};
            $rootScope.deleteId.id = $scope.selectedRows;

            $scope.addNoteFloatFlag = true;
            $scope.floatButtonShowFlag = true;           

        }

         // $scope.SaveComplete = function(){
         //    var _data = {
         //        "id": $scope.rowChangedValue,
         //        "note_text": "completed appointment"
         //    };
         //    pendingTaskDataServices.saveComplete(JSON.stringify(_data)).then(function (data) {
                   
         //    })
         //    .catch(function () {
         //        $scope.error = 'data not fount';
         //    });

         // }
        
        $scope.floatButtonShowFlag = false;
        $scope.addNoteFloatFlag = false;

        $scope.addNote = function (size) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/pendingTasks/pendingTaskAddNote.html',
                controller: 'ModalInstancePendingTaskCtrl',
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
		$rootScope.taskRepeatReminder = function(size) {

				var modalInstance = $uibModal.open({
					animation: $scope.animationsEnabled,
					ariaLabelledBy: 'modal-title',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'view/sales/calendar/pendingTasks/pendingTaskRepeatReminder.html',
					controller: 'ModalInstanceNewAccountsCtrl',
					size: '400px Repeat',
					resolve: {
						modelType: function() {
							return 'taskRepeatReminder';
						}
					}
				});
			}
	
        $scope.complete = function (size) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/pendingTasks/pendingTaskComplete.html',
                controller: 'ModalInstancePendingTaskCtrl',
                size: '400px addNote complete',
                resolve: {                  
                    modelType: function() {
                        var modelData = {
                            modelName: 'complete',
                            rowIds: $rootScope.deleteId,
                            formData: $scope.compltettitle,
                            count: $scope.selectedRowsDelete
                        }
                        return modelData;
                    }
                }
            });
        }

        $scope.forward = function (size) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/pendingTasks/pendingTaskReschedule.html',
                controller: 'ModalInstancePendingTaskCtrl',
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

      
        $scope.createNewTask = function (size) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/pendingTasks/pendingTaskNewTask.html',
                controller: 'ModalInstancePendingTaskCtrl',
                size: '800px addTask',
                resolve: {
                    modelType: function () {
                        return 'TaskNewTask';
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
		$scope.deletes = function (size) {

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/pendingTasks/pendingTaskDelete.html',
                controller: 'ModalInstancePendingTaskCtrl',
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
    }

})();


(function() {

    'use strict';

    angular.module('calendar').controller('ModalInstancePendingTaskCtrl', ModalInstancePendingTaskCtrl);

    function ModalInstancePendingTaskCtrl($scope, $http, $rootScope, uiGridConstants, $filter, $uibModalInstance, modelType, pendingTaskDataServices, allTasksDataServices) {

        $scope.repeatType = ["Daily", "Weekly", "Monthly", "Yearly"];

        $scope.repeatOn = ["M", "T", "W", "T", "F", "S", "S"];

        $scope.repeat = { repeatType: $scope.repeatType[0], repeatEvery: 1, repeatOn: $scope.repeatOn[0] };

         $scope.picker3 = {
            t_dueby: new Date()
        };

        $scope.openCalendar = function(e, picker) {
              $scope[picker].open = true;
        };

        $scope.gridOptions1 = {
            enableSorting: true,
            columnDefs: [
              { field: 'name' },
              { field: 'gender' },
              { field: 'company', enableSorting: false }
            ],
            onRegisterApi: function( gridApi ) {
              $scope.grid1Api = gridApi;
            }
        };

        $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/100.json')
        .success(function(data) {
          $scope.gridOptions1.data = data;
        });

        $scope.rescheduleTypeOptions = [{
            value : 'Next day',
            id: 'nextDay'
        }]

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

        $scope.openCalendar = function (e, picker) {
            $scope[picker].open = true;
        };

        $scope.addNoteApi = function () {
            var _data = {
                "id": modelType.rowIds
            }
            allTasksDataServices.addNote(JSON.stringify(_data)).then(function (data) {
                 $rootScope.refresh();
            })
            .catch(function () {
            });
        }

        $scope.completeApi = function () {
            var _data = {};
            _data = modelType.rowIds;
            _data.note_text = $scope.note_text

            allTasksDataServices.completeTask(JSON.stringify(_data)).then(function (data) {
                $uibModalInstance.close('open');
                 $rootScope.refresh();
            })
            .catch(function () {
            });
        }

        $scope.picker3 = {
            date: new Date()
        };

        $scope.rescheduleType = 'Next day';

        $scope.rescheduleApi = function () {          
             var _data = {};
            _data = modelType.rowIds;
            _data.type = $scope.rescheduleType;
            _data.no_of_days = $scope.day;
            _data.date = $scope.datest;

            allTasksDataServices.reschedule(JSON.stringify(_data)).then(function (data) {
               $uibModalInstance.close('open');
                $rootScope.refresh();
            })
            .catch(function () {
               
            });
        }

        $scope.addNewTask = function () {        

            //  var dateStr = $scope.t_dueby;
            // $scope.dt = $filter('date')(new Date(dateStr.split('-').join('/')), "M/d/yyyy HH/mm");

             var _data = {
                "id": 0,
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
    
        $scope.deleteApi = function () {  
            console.log('delete Pop-up')
            allTasksDataServices.delete(JSON.stringify(modelType.rowIds)).then(function (data) {
                $uibModalInstance.close('open');
                 console.log('delete Pop-up call')
                $rootScope.refresh();
            })
            .catch(function () {
                
            });
        }



        $scope.ok = function() {
            $uibModalInstance.close('open');
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();