var myapp = angular.module('ngTableTutorial', ['ngTable', 'ngAnimate', 'ui.bootstrap', 'angularUtils.directives.dirPagination', 'ui.sortable', 'ngSanitize', 'ui.select']);
myapp.controller('ngtableCtrl', function ($scope, NgTableParams, $filter, $uibModal) {
    //$scope.sortType = 'name'; // set the default sort type
    $scope.sortType = '';
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchFish = '';
    $scope.deleteAllMode = false;
    $scope.currentPage = 1;
    $scope.currentPage1 = 1;
    //code for dynamic table with dynamic column start



    $scope.dynamicTableCols = ["Subject", "Assign to", "Company","Start date","End date","Status"];
    $scope.dynamicTableRowData = [];
    var data1 = ["row1", "row2", "row3", "row4", "row5", "row6","row7","row8","row9","row10","row11","row12","row13","row14","row15","row16","row17","row18","row19","row20","row21","row22","row23","row24","row25","row26","row27","row28","row29","row30"];
    var temp = {};
    var colname = '';
    var k = 0;
    while (k < data1.length) {
        for (i = 0; i < $scope.dynamicTableCols.length; i++) {
            colname = $scope.dynamicTableCols[i];
            temp[colname] = data1[k];
            k++;
        }
        $scope.dynamicTableRowData.push(temp);
       
        temp = {};
    }

    console.log($scope.dynamicTableRowData);

    //code for dynamic table with dynamic column end

    $scope.sort = function (keyname) {
        console.log('inside sort function' + keyname + $scope.reverse);
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    //function for select all checkbox

    $scope.selectAllcheck = function (value) {
        console.log('inside selectAllcheck function');
        for (i = 0; i < $scope.dynamicTableRowData.length; i++) {
            $scope.dynamicTableRowData[i].isChecked = value;
        }
    }

    //function for single checkbox select

    $scope.selectEntity = function () {
        console.log('inside selectEntity function');
        var count = 0;

        for (var j = 0; j < $scope.dynamicTableRowData.length; j++) {
            if ($scope.dynamicTableRowData[j].isChecked) {
                $scope.dynamicTableRowData[j].editmode = true;
            } else {
                $scope.dynamicTableRowData[j].editmode = false;
            }
        }

        for (var i = 0; i < $scope.dynamicTableRowData.length; i++) {

            if (!$scope.dynamicTableRowData[i].isChecked) {
                $scope.selectAll = false;
                return;
            }
        }

        $scope.selectAll = true;
        console.log($scope.dynamicTableRowData);
    }

    $scope.open = function () {
        alert('111');
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                username: function () {
                    return 'kkk';
                    //$scope.username;
                }
            }
        });

        modalInstance.result.then(function (userName) {
            $scope.username = userName;
            $scope.model.contacts.push({
                id: $scope.model.contacts.length + 1,
                name: userName.name,
                age: userName.age,
                location: userName.location,
                editmode: false
            });
            console.log($scope.model.contacts);
            $scope.getData();
        }, function () {
            alert('Modal dismissed at: ' + new Date());
        });
    };

    $scope.deleteSelectedCheckContact = function () {
        console.log('inside deleteSelectedCheckContact function');
        console.log($scope.dynamicTableRowData);

        if ($scope.selectAll) {
            var j = $scope.dynamicTableRowData.length;
            while ($scope.dynamicTableRowData.length > 0) {
                j--;
                if ($scope.dynamicTableRowData[j].isChecked) {
                    if ($scope.dynamicTableRowData[j].isChecked) {
                        $scope.dynamicTableRowData.splice(j, 1);
                    }
                }
            }
            $scope.selectAll = false;
        }
        else {
            var count = 0;
            for (k = $scope.dynamicTableRowData.length - 1; k >= 0; k--) {
                if (angular.isDefined($scope.dynamicTableRowData[k].isChecked)) {
                    if ($scope.dynamicTableRowData[k].isChecked) {
                        if ($scope.dynamicTableRowData[k].isChecked) {
                            count++;
                        }
                    }
                }
            }
            for (j = 0; j < count; j++) {
                for (s = 0; s < $scope.dynamicTableRowData.length; s++) {
                    if ($scope.dynamicTableRowData[s].isChecked) {
                        if ($scope.dynamicTableRowData[s].isChecked) {
                            $scope.dynamicTableRowData.splice(s, 1);
                        }
                    }
                }
            }
            //$scope.model.selectAll = false;
        }

        console.log($scope.dynamicTableRowData);
        // $scope.model.selectAll = false;
        // $scope.getData();
    }

    $scope.addNotePopUp = function () {
        alert('inside addNotePopUp function');
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'addNote.html',
            controller: 'addNoteModalInstanceCtrl',
            size: 'lg',
            resolve: {
                username: function () {
                    return 'kkk';
                    //$scope.username;
                }
            }
        });

        modalInstance.result.then(function (addNote) {
            console.log(addNote);
        }, function () {
            alert('Modal dismissed at: ' + new Date());
        });
    }

    $scope.editSingleAppointmentPopUp = function () {
        alert('inside editSingleAppointmentPopUp function');
        var count = 0;
        var singleEditFlag = true;
        $scope.selectedSingleAppointment = {};
        for (var i = 0; i < $scope.dynamicTableRowData.length; i++) {
            if ($scope.dynamicTableRowData[i].isChecked) {
                count++;
                $scope.selectedSingleAppointment = $scope.dynamicTableRowData[i];
                console.log($scope.selectedSingleAppointment);
            }
            if (count > 1) {
                singleEditFlag = false;
                break;
            }
        }

        //single entity edit mode

        if (singleEditFlag) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'editSingleAppointmentPopUp.html',
                controller: 'editSingleAppointmentModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.selectedSingleAppointment;
                        //$scope.username;
                    }
                }
            });

            modalInstance.result.then(function (editAppointment) {
                console.log(editAppointment);
            }, function () {
                alert('Modal dismissed at: ' + new Date());
            });
        }

            //bulk entity edit mode  

        else {
            alert('For bulk entity edit mode');

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'editBulkEntityPopUp.html',
                controller: 'editBulkAppointmentModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    username: function () {
                        return 'kkk';
                        //$scope.username;
                    }
                }
            });

            modalInstance.result.then(function (editBulkAppointment) {
                console.log(editBulkAppointment);
            }, function () {
                alert('Modal dismissed at: ' + new Date());
            });
        }
    }

    //function arguments:rowIndex,columnIndex
    $scope.editSingle1 = function (rowidx, columnidx) {
        console.log('inside editSingle1 function' + rowidx + columnidx);
        var colCount = $scope.dynamicTableCols.length;

        var array = [];

        for (k = 0; k < colCount; k++) {
            array.push(false);
        }

        for (i = 0; i < $scope.dynamicTableRowData.length; i++) {
            $scope.dynamicTableRowData[i].singleedit = array;
            for (j = 0; j < colCount; j++) {
                $scope.dynamicTableRowData[i].singleedit[j] = false;
            }
        }
        $scope.dynamicTableRowData[rowidx].singleedit[columnidx] = true;
        console.log($scope.dynamicTableRowData);

    }

    //function for delting particular column from table
    $scope.deleteParticularColumn = function () {
        console.log('inside deleteParticularColumn function');
        $scope.dynamicTableCols.splice(1, 1);
        console.log($scope.dynamicTableCols);
    }

    $scope.setup = function () {
        console.log('inside setup function');

        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'setUpPopUp.html',
            controller: 'setUpModalInstanceCtrl',
            size: 'lg',
            resolve: {
                dynamicTableCols: function () {
                    return $scope.dynamicTableCols;
                    //$scope.username;
                }
            }
        });

        modalInstance.result.then(function (setup) {
            console.log(setup);
            $scope.sortby = setup[0].setupSortby.type;
            $scope.sortKey = setup[0].setupSortby.type;
            $scope.reverse = setup[0].setupSortby.checkDescending;
            console.log($scope.reverse);
            console.log($scope.sortKey);

        }, function () {
            alert('Modal dismissed at: ' + new Date());
        });
    }

});

myapp.controller('ModalInstanceCtrl', function ($uibModalInstance, $scope, username, $uibModal) {
    alert(username);
    $scope.status = ["Cancelled", "Completed", "Scheduled"];
    $scope.assignto = ["Ravi Teja Villa"];
    $scope.remindertype = ["Email", "Pop-up"];
    $scope.remindertimein = ["minutes", "hours", "days", "weeks"];
    $scope.user = {
        subject: "",
        startdate: "",
        enddate: "",
        status: "",
        assignto: "",
        reminder: [{ type: '', duration: '', timein: '' }, { type: '', duration: '', timein: '' }],
        //reminder: "",
        company: "",
        fullname: "",
        text: "",
        repeat: "",
        outlooksync: "",
        googlesync: "",
        inviteguests: "",
        attendees: "Ravi Teja Villa (Owner)",
        addnotetype: "",
        addnotedesc: "",
        name: 'A',
        age: '10',
        location: 'location'
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.user);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel', '');
    };

    $scope.checkRepeat = function () {
        alert('clicked');
        alert($scope.user.repeat);
        //checkbox is clicked open modal
        if ($scope.user.repeat) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'myModalReminder.html',
                controller: 'remonderModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    // username: function () {
                    //  return 'kkk';
                    //$scope.username;
                    // }
                }
            });

            modalInstance.result.then(function (userName) {
                //$scope.username = userName;
                //$scope.model.contacts.push({
                //    id: $scope.model.contacts.length + 1,
                //    name: userName.name,
                //    age: userName.age,
                //    location: userName.location,
                //    editmode: false
                //});
                console.log(userName);
                //  $scope.getData();
            }, function () {
                alert('Modal dismissed at: ' + new Date());
            });
        }
        else {

        }
    }

    $scope.deleteReminder = function (val) {
        alert('inside delete reminder function' + val);
        $scope.user.reminder.splice(val, 1);
    }

    $scope.addReminder = function () {
        $scope.user.reminder.push({ type: '', duration: '', timein: '' });
    }
});

myapp.controller('remonderModalInstanceCtrl', function ($uibModalInstance, $scope) {
    $scope.repeattype = ["Daily", "Weekly", "Monthly", "Yearly"];
    $scope.reminderRepeat = { startdate: "", enddate: "", repeattype: "", repeatevery: "" };

    $scope.ok = function () {
        //$uibModalInstance.close($scope.user);
        $uibModalInstance.close($scope.reminderRepeat);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel', '');
    };

});

myapp.controller('addNoteModalInstanceCtrl', function ($uibModalInstance, $scope) {
    $scope.noteType = ["Appointment", "Dialed", "Email", "LVM", "Note", "Spoke", "Task", "Transferred"];

    $scope.addNote = { noteType: '', text: '' };

    $scope.ok = function () {
        // $uibModalInstance.close($scope.user);
        $uibModalInstance.close($scope.addNote);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel', '');
    };

});


myapp.controller('editSingleAppointmentModalInstanceCtrl', function ($uibModalInstance, $scope, $uibModal, item) {
    $scope.status = ["Cancelled", "Completed", "Scheduled"];
    $scope.addNoteType = ["Appointment", "Dialed", "Email", "LVM", "Note", "Spoke", "Task", "Transferred"];
    $scope.assignto = ["Ravi Teja Villa"];
    $scope.remindertype = ["Email", "Pop-up"];
    $scope.remindertimein = ["minutes", "hours", "days", "weeks"];
    console.log('inside editSingleAppointmentModalInstanceCtrl controller');
    console.log(item);

    $scope.editAppointment = {
        subject: item.subject,
        startdate: item.startdate,
        enddate: item.enddate,
        status: item.status,
        assignto: item.assignto,
        reminder: [{ type: '', duration: '', timein: '' }, { type: '', duration: '', timein: '' }],
        company: item.company,
        fullname: '',
        text: '',
        repeat: false,
        outlooksync: '',
        googlesync: '',
        inviteguests: '',
        attendees: 'Ravi Teja Villa (Owner)',
        addNote: { type: '', note: '' }
    };

    $scope.deleteReminder = function (val) {
        alert('inside delete reminder function' + val);
        $scope.editAppointment.reminder.splice(val, 1);
    }

    $scope.addReminder = function () {
        $scope.editAppointment.reminder.push({ type: '', duration: '', timein: '' });
    }

    $scope.ok = function () {
        // $uibModalInstance.close($scope.user);
        $uibModalInstance.close($scope.editAppointment);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel', '');
    };

    $scope.openRepeatPopUp = function (val) {
        alert('inside editSingleAppointmentPopUp function');
        if (val) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'editSingleAppointmentRepeatPopUp.html',
                controller: 'editAppointmentRepeatModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    username: function () {
                        return 'kkk';
                        //$scope.username;
                    }
                }
            });

            modalInstance.result.then(function (editAppointmentRepeat) {
                console.log(editAppointmentRepeat);
            }, function () {
                alert('Modal dismissed at: ' + new Date());
            });
        }

    }

});


myapp.controller('editAppointmentRepeatModalInstanceCtrl', function ($uibModalInstance, $scope) {

    $scope.repeatType = ["Daily", "Weekly", "Monthly", "Yearly"];

    $scope.editSingleAppointmentRepeat = {
        startdate: '',
        enddate: '',
        repeattype: '',
        repeatevery: ''
    };

    $scope.ok = function () {
        // $uibModalInstance.close($scope.user);
        $uibModalInstance.close($scope.editSingleAppointmentRepeat);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel', '');
    };

});

myapp.controller('editBulkAppointmentModalInstanceCtrl', function ($uibModalInstance, $scope) {
    $scope.editBulkAppointment = { modifiedField: '', withValue: '' };

    $scope.editBulkAppointmentModifiedField = ["Assign to", "Visible to", "Company", "Start date"];
    $scope.editBulkAppointmentWithValue = ["Everyone", "Just me"];

    $scope.ok = function () {
        // $uibModalInstance.close($scope.user);
        $uibModalInstance.close($scope.editBulkAppointment);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel', '');
    };

});


myapp.controller('setUpModalInstanceCtrl', function ($uibModalInstance, $scope, dynamicTableCols) {

    $scope.people = [
    { name: 'Adam', email: 'adam@email.com', age: 12, country: 'United States' },
    { name: 'Amalie', email: 'amalie@email.com', age: 12, country: 'Argentina' },
    { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina' },
    { name: 'Adrian', email: 'adrian@email.com', age: 21, country: 'Ecuador' },
    { name: 'Wladimir', email: 'wladimir@email.com', age: 30, country: 'Ecuador' },
    { name: 'Samantha', email: 'samantha@email.com', age: 30, country: 'United States' },
    { name: 'Nicole', email: 'nicole@email.com', age: 43, country: 'Colombia' },
    { name: 'Natasha', email: 'natasha@email.com', age: 54, country: 'Ecuador' },
    { name: 'Michael', email: 'michael@email.com', age: 15, country: 'Colombia' },
    { name: 'Nicolás', email: 'nicolas@email.com', age: 43, country: 'Colombia' }
    ];

    $scope.relatedTable1 = ["<None>", "Accounts", "Contacts", "Notes"];

    $scope.relatedTable2 = ["<None>", "Accounts", "Contacts", "Notes"];

    $scope.setupRelatedTable1 = $scope.relatedTable1[0];
    $scope.setupRelatedTable2 = $scope.relatedTable2[0];

    
    
    $scope.fields = dynamicTableCols;

    $scope.sortby = { type: '', checkDescending: false }
    $scope.setUp = [];

    $scope.ok = function () {
        // $uibModalInstance.close($scope.user);
        $scope.setUp.push({
            setupFields: $scope.fields,
            setupSortby: $scope.sortby,
        });

        $uibModalInstance.close($scope.setUp);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel', '');
    };

    $scope.deleteFields = function (idx) {
        alert('inside deleteFields function' + idx);
        $scope.fields.splice(idx, 1);
    }

});


//range filter for creating 1 to 30 for example numbers in selectbox
myapp.filter('range', function () {
    return function (input, min, max) {
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        for (var i = min; i <= max; i++)
            input.push(i);
        return input;
    };
});
