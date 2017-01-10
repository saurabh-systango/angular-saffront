(function() {

    'use strict';

    angular.module('calendar', ['ui.router', 'sync-autocomplete', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.select', 'ui.bootstrap.datetimepicker']);

})();

(function() {

    'use strict';

    angular.module('calendar').controller('calendarTabViewCtrl', calendarTabViewCtrl);

    function calendarTabViewCtrl($scope) {

        $scope.calendarTabs = [
            {
                title: 'Calendar',
                url: 'view/sales/calendar/calendarSchedular.html'
            },
            {
                title: 'All Appointments',
                url: 'view/sales/calendar/appointment/allAppointment.html'
            },
            {
                title: 'Pending Tasks',
                url: 'view/sales/calendar/pendingTasks/pendingTask.html'
            },
            {
                title: 'All Tasks',
                url: 'view/sales/calendar/allTasks/allTasks.html'
            }
        ];

        $scope.calendarTabUrl = 'view/sales/calendar/pendingTasks/pendingTask.html';

        $scope.onClickTab = function (tab) {
            $scope.calendarTabUrl = tab.url;
        }
        $scope.isActiveTab = function (tabUrl) {
            return tabUrl == $scope.calendarTabUrl;
        }

        console.log($scope.calendarTabUrl);

       

        
    }

})();

(function() {

    'use strict';

    angular.module('calendar').controller('calendarSchedularCtrl', calendarSchedularCtrl);

    function calendarSchedularCtrl($scope, $uibModal, allAppointmentDataServices, accountsDataServices) {

        $scope.userList = function() {

            accountsDataServices.userDetails().then(function(data) {
                $scope.userList = data.data.users
            })
            .catch(function() {

            });
        }
        $scope.userList();

     $scope.events = [];
        $scope.refresh = function () {
            allAppointmentDataServices.getAccountsDetails().then(function (data) {
                $scope.accountData = data;
              
                angular.forEach(data.data.records, function (value, key) {

                    //var start_date = $filter('date')(value.start_date, "yyyy, mm, dd"); // for conversion to string

                    $scope.events.push({
                        id: value.id,
                        text: value.subject,
                        start_date: new Date(value.start_date),
                        end_date: new Date(value.end_date)
                    });
                   
                });

               
            })
            .catch(function () {
                $scope.error = 'data not fount';
            });
        }

        $scope.refresh();

        $scope.animationsEnabled = true;

        $scope.createNewAppointment = function () {
          //  alert('Hi');
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/calendar/createNewAllAppointment.html',
                controller: 'ModalInstanceCtrl',
                size: '800px',  
                resolve: {
                    modelType: function () {
                        var modelData = {
                            modelName: 'createNewAppointment'
                        }
                        return modelData;
                    
                    }
                },  
            });
        };  

       $scope.scheduler = { date: new Date() };
    }

})();


(function() {

    'use strict';

    angular.module('calendar').directive('dhxScheduler', function() {
        return {
          restrict: 'A',
            scope: false,
            transclude: true,
            template: '<div class="dhx_cal_navline" ng-transclude></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>',

            link: function ($scope, $element, $attrs, $controller) {
                //default state of the scheduler
                if (!$scope.scheduler)
                    $scope.scheduler = {};
                $scope.scheduler.mode = $scope.scheduler.mode || "month";
                $scope.scheduler.date = $scope.scheduler.date || new Date();

                //watch data collection, reload on changes
                $scope.$watch($attrs.data, function (collection) {
                    scheduler.clearAll();
                    scheduler.parse(collection, "json");
                }, true);

                //mode or date
                $scope.$watch(function () {
                    return $scope.scheduler.mode + $scope.scheduler.date.toString();
                }, function (nv, ov) {
                    var mode = scheduler.getState();
                    if (nv.date != mode.date || nv.mode != mode.mode)
                        scheduler.setCurrentView($scope.scheduler.date, $scope.scheduler.mode);
                }, true);

                //size of scheduler
                $scope.$watch(function () {
                    return $element[0].offsetWidth + "." + $element[0].offsetHeight;
                }, function () {
                    scheduler.setCurrentView();
                });

                //styling for dhtmlx scheduler
                $element.addClass("dhx_cal_container");

                //init scheduler
                scheduler.init($element[0], $scope.scheduler.date, $scope.scheduler.mode);
            }
        };
    });

})();

(function() {

    'use strict';

    angular.module('calendar').directive('dhxTemplate', function($filter) {

        scheduler.aFilter = $filter;

        return {
          
            restrict: 'AE',
            terminal: true,

            link: function ($scope, $element, $attrs, $controller) {
                $element[0].style.display = 'none';

                var template = $element[0].innerHTML;
                template = template.replace(/[\r\n]/g, "").replace(/"/g, "\\\"").replace(/\{\{event\.([^\}]+)\}\}/g, function (match, prop) {
                    if (prop.indexOf("|") != -1) {
                        var parts = prop.split("|");
                        return "\"+scheduler.aFilter('" + (parts[1]).trim() + "')(event." + (parts[0]).trim() + ")+\"";
                    }
                    return '"+event.' + prop + '+"';
                });
                var templateFunc = Function('sd', 'ed', 'event', 'return "' + template + '"');
                scheduler.templates[$attrs.dhxTemplate] = templateFunc;
            }
        };
    });

})();

(function() {

    'use strict';

    angular.module('calendar').filter('range', function() {

        return function (input, min, max) {
            min = parseInt(min); //Make string input int
            max = parseInt(max);
            for (var i = min; i <= max; i++)
                input.push(i);
            return input;
        };
    });

})();

(function () {

    'use strict';
    angular.module('calendar').controller('ModalInstanceCtrl', ModalInstanceCtrl);
    function ModalInstanceCtrl($scope,  $uibModal, $uibModalInstance, modelType) { 

        // $scope.RepeatReminder = function(size) {

        //     var modalInstance = $uibModal.open({
        //         animation: $scope.animationsEnabled,
        //         ariaLabelledBy: 'modal-title',
        //         ariaDescribedBy: 'modal-body',
        //         templateUrl: 'view/sales/appointment/allAppointmentReschedule.html',
        //         //controller: 'ModalInstanceCtrl',
        //         size: '400px Repeat',
        //         resolve: {
        //             modelType: function() {
        //                 return 'taskRepeatReminder';
        //             }
        //         }
        //     });
        // };  

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

        $scope.openCalendar1 = function (e, picker) {
            $scope[picker3].open = true;
        };

        $scope.openCalendar2 = function (e, picker) {
            $scope[picker4].open = true;
        };

        $scope.ok = function () {
                    alert('I m working from calender');
            $uibModalInstance.close('open');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();