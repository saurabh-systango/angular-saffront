(function () {

    'use strict';

    angular.module('marketingTemplate', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.selection']);

})();

	
(function () {

	var rowData = [];
    'use strict';

    angular.module('marketingTemplate').controller('marketingTemplatesCtrl', marketingTemplatesCtrl);

    function marketingTemplatesCtrl($scope,$uibModal, $timeout,uiGridConstants, marketingDataService, $rootScope, $state) {

        $scope.targetColor1 = '#761B08';
        $scope.targetColor2 = '#08760A';
        $scope.targetColor3 = '#087176';
        $scope.targetColor4 = '#082E76';

        $scope.sliderConfig = {
            min: 600,
            max: 900,
            step: 100
        }

		$scope.copyPage_Marketing = function (id) {
                $rootScope.rowChangedValue = id;
        };
        $scope.deleteMarketingTemplate = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/marketing/marketing-template/deleteMarketingTemplate.html',
                controller: 'deleteMarketingCtrl',
                windowClass: 'deletePopupCls',
                size: '350px delet',

                resolve: {

                    modelType: function() {
                        var modelData = {
                            modelName: 'deleteMarketingTemplate',
                            rowIds: $rootScope.deleteId,
                            formData: "",
                            single:$scope.singleSelect,
                            count: $scope.templateName
                        }
                        $scope.singleSelect = false;
                        return modelData;
                    }
                }
            });

        }


       $rootScope.refresh = function () {
        	marketingDataService.getMarketingDetails().then(function (data) {
            	 //menu items
            	$scope.menuData=[
            	               {label:'Category',name:'category'},
            	               {label:'Owner',name:'owner'},
            	               {label:'Status',name:'status'}
            	];
            	$scope.searchMenuData=[
            	               {label:'Name',name:'name'},
              	               {label:'Category',name:'category'},
              	              {label:'Subject',name:'subject'},
              	               {label:'Owner',name:'owner'},
              	               {label:'Status',name:'status'},
              	              {label:'All',name:'all'}
              	];
                $scope.columnSort = $scope.searchMenuData[0];
                $scope.salesData = data;
                $scope.gridOptions1.data = data.data.records;
                console.log( $scope.gridOptions1.data);
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
            marketingDataService.deleteMarketTemplate(arr).then(function(data){
        			$rootScope.refresh();
        	})
        	 .catch(function () {
                 $scope.error = 'data not fount';
             });
        }
        
        $scope.anotherRefresh = function (group)
        {
        			
        marketingDataService.getListViewByFieldName(group).then(function (data) {
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
        }else if(templateName==="create_marketing_template_preview_Banner_Promotion_Multiple_Column"){
        	$state.go('create_marketing_template_preview_Banner_Promotion_Multiple_Column');
        }
         
        }
        
        $scope.filterByFieldName = function (fieldName,condition)
        {
        	
        	var groupByCondition = {
        			menu : fieldName,
        			condition : condition != 'All' ? condition : ''
        	};
        	
        	console.log(groupByCondition);
        	marketingDataService.getListViewByCondition(groupByCondition).then(function (data){
        		$scope.gridOptions1.data = data.data.records;
        	}).catch(function (){
        		$scope.error = 'data not found';
        	});
        };

        $rootScope.refresh();

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

        $scope.gridOptions1.columnDefs = [
            { field: 'name', displayName: 'Name', cellTemplate: '<div class="ui-grid-cell-contents clickable" ng-click="grid.appScope.accountsDetails(row.entity.id)" >{{ row.entity.name}}</div>', },
            { field: 'category', displayName: 'Category' },
            { field: 'owner', displayName: 'Owner' },
            { field: 'created_on', displayName: 'Created on' },
            { field: 'updated_by', displayName: 'Updated By' },
            { field: 'updated_on', displayName: 'Updated On' },
            { field: 'status', displayName: 'Status' },
            { field: 'subject', displayName: 'Subject' }
        ],


            //   $scope.gridOptions1.columnDefs = [{
            //     field: 'name',
            //     name: 'Name',
            //     cellTemplate: '<div class="ui-grid-cell-contents clickable" ng-click="grid.appScope.accountsDetails(row.entity.id)" >{{ row.entity.name}}</div>',
            //     width: 100,
            //     enableFiltering: false
            // }, ];
            $scope.accountsDetails = function (id,sta) {
                $rootScope.currentTab = 'view/marketing/marketing-template/creatingtemplates.html';
                console.log("fdsfsd="+$rootScope.currentTab);
                $scope.status1 = sta;
             console.log("jjjjj"+ sta);
                 
            };


        $scope.selectedRows = [];
        $scope.gridOptions1.onRegisterApi = function (gridApi) {
            console.log('onRegisterApi');
            $scope.gridApi = gridApi;
            $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected == true) {
					 $rootScope.copy_Id = row.entity.id;
                    console.log("row"+row.isSelected);
                    $scope.isStatus = row.entity.t_status;
                    $scope.selectedRows.push(row.entity.id);
                    $rootScope.deleteId = row.entity.id;
                    $scope.templateName =row.entity.name;
                    //  $rootScope.deleteId.id = $scope.selectedRows;
                    console.log(JSON.stringify($rootScope.deleteId))
                    $scope.selectedRowsDelete = $scope.selectedRows.length;


                    
                    console.log('this row is selected', row);
                    //$scope.selectedRows.push(row);
                    rowData.push(row);
                    console.log($scope.selectedRows);
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
                $scope.singleSelect = false;
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
                $scope.isSelect = row.isSelected;
                if(isSelect){
                    $scope.isStatus = row.entity.t_status;
                } else{

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
            
             $scope.activeSalesTempl = function(){
               if(rowData && rowData[0] && rowData[0].entity && rowData[0].entity.id){
                
                marketingDataService.marketingTmplActive(rowData[0].entity.id).then(function (data){
                    //$scope.gridOptions1.data = data.data.records;
                    rowData[0].entity.status = 'Inactive';
                }).catch(function (){
                    $scope.error = 'data not found';
                });

            }
        }

        $scope.inactiveSalesTempl = function(){
            if(rowData && rowData[0] && rowData[0].entity && rowData[0].entity.id){
               
                if(rowData[0].entity.status=="Active"){
                  
                    marketingDataService.marketingTmplInActive(rowData[0].entity.id).then(function (data){
                        rowData[0].entity.status = 'Inactive';
                        $rootScope.refresh();
                    }).catch(function (){
                        $scope.error = 'Status not change';
                    });

                }
                if(rowData[0].entity.status=="Inactive"){

                    marketingDataService.marketingTmplActive(rowData[0].entity.id).then(function (data){
                        rowData[0].entity.status = 'Active';
                        $rootScope.refresh();
                    }).catch(function (){
                        $scope.error = 'Status not change';
                    });
                }

            }
        }
        $scope.searchInList = function(){
            var searchByCondition = {
                groupBy: $scope.groupSort.name,
                searchBy: $scope.columnSort.name,
                searchText: $scope.searchByInputField
            };
            marketingDataService.getListViewBySearchBox(searchByCondition).then(function (data){
                $scope.gridOptions1.data = data.data.records;
            }).catch(function (){
                $scope.error = 'data not found';
            });
        }

    }
   

})();

(function () {

    'use strict';

    angular.module('marketingTemplate').controller('ModalInstanceSalesCtrl', ModalInstanceSalesCtrl);

    function ModalInstanceSalesCtrl($scope, $uibModalInstance, modelType) {

        $scope.ok = function () {
            $uibModalInstance.close('open');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();

(function () {

    'use strict';

    angular.module('marketingTemplate').controller('sourceCodeModalCtrl', sourceCodeModalCtrl);

    function sourceCodeModalCtrl($scope, $uibModalInstance) {

        $scope.ok = function () {
            $uibModalInstance.close('open');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();

(function () {

    'use strict';

    angular.module('marketingTemplate').controller('backToAllTmplCtrl', backToAllTmplCtrl);

    function backToAllTmplCtrl($scope, $uibModalInstance, modelType) {
        $scope.useThisDesignObj = modelType;
        $scope.createMarketingTmplObj = modelType.createMarketingTmplObj;
        $scope.ok = function () {
            $scope.createMarketingTmplObj.isShowAllTemp = true;
            $scope.useThisDesignObj.t_catagory = '';
            $uibModalInstance.close('open');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();

(function () {

    'use strict';

    angular.module('marketingTemplate').controller('createMarketingTemplatesCtrl', createMarketingTemplatesCtrl);

    function createMarketingTemplatesCtrl($scope, $uibModal, marketingDataService, $sce, $state, $timeout) {
        $scope.testColor = '';
        $scope.createMarketingTmplObj = {
            isShowAllTemp: true,
            activeSideBarTab: 'colors_fonts',
            activeSorceCode: false
        }
        $scope.useThisDesignObj = {
            responseData: new Object,
            t_msg: '',
            t_catagory: ''
        }
        $scope.templateDesignsStyle = {
            headerBG: {
                isShow: false,
                value: ''
            }
        }
        $scope.tempObject = [{
            "title": "Personalize",
        }];
        $scope.selectCategory = [
            'Auto Response', 
            'Marketing Template', 
            'Newsletter', 
            'Greetings'
        ];
        $scope.layout_id = 0;
        $scope.selectedCategory = {
            categorys: angular.copy($scope.selectCategory)
        };
        $scope.refresh = function (layout_id) {
            $scope.layout_id = layout_id;
            marketingDataService.getAllTemplates($scope.selectCategory, $scope.layout_id).then(function (data) {
                $scope.newSalesData = data;
                angular.forEach(data.data.available_mail_merge_fields, function (value, key) {
                    angular.forEach(value, function (value, key) {
                        $scope.tempObject.push({
                            "title": value,
                        });
                    });
                });
            }).catch(function () {
                $scope.error = 'data not fount';
            });
        }
        $scope.refresh(0);
        $scope.filterCategory = function(){
            return function(template){
                var incrCate;
                for(incrCate = 0; incrCate < $scope.selectedCategory.categorys.length; incrCate++){
                    if(template.t_catagory == $scope.selectedCategory.categorys[incrCate]){
                        return true;
                    }
                }
            }
        }
        $scope.processLibraryTemplate = function () {
        	marketingDataService.saveSalesDetails(id);
        }
        $scope.closeCreateTemplate = function(templateName){
            var incrTab;
            for(incrTab = 0; incrTab < $scope.tabs.length; incrTab++){
                if(templateName == $scope.tabs[incrTab].title){
                    $scope.tabs.splice(incrTab, 1);
                    if($scope.tabs.length == 1){
                         $scope.homeShow = true;
                    }       
                }
            }
        }
        $scope.onClickUseThisDesignBtn = function(id, catagory){
            $scope.createMarketingTmplObj.isShowAllTemp = false;
            $scope.useThisDesignObj.responseData = new Object();
            marketingDataService.previewTemplate(id).then(function (data) {
                if(status == 0){
                    $scope.useThisDesignObj.responseData = data.data;
                    $scope.useThisDesignObj.t_catagory = catagory;
                    $scope.useThisDesignObj.t_msg = $sce.trustAsHtml(data.data.template_details[0].t_msg);

                    $timeout(function(){
                        var a = document.getElementsByClassName("HeaderheadingSection");
                        if(a.length){
                            $scope.templateDesignsStyle.headerBG.isShow = true;    
                            $scope.templateDesignsStyle.headerBG.value = a[0].querySelectorAll('table')[0].style.backgroundColor;
                        } else{
                            $scope.templateDesignsStyle.headerBG.isShow = false;
                        }
                    }, 100);
                }
            }).catch(function () {
                $scope.error = 'data not fount';
            });
        }
        $scope.backToAllTmpl = function(){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: '<div class="modal-header">'+
                    '<h5 class="modal-title">Confirmation Dialog</h5>'+
                '</div>'+
                '<div class="modal-body">'+
                    '<img src="images/confirmation.png">'+
                    '<p class="modelWarningTxt">If you go back, you will lose your unsaved changes. Do you wish to proceed?</p>'+
                    '<div class="row"><button ng-click="ok();" class="btn_bg1 btn_ok">OK</button>'+
                    '<button ng-click="cancel();" class="btn_bg1">Cancel</button></div>'+
                '</div>',
                controller: 'backToAllTmplCtrl',
                backdrop: 'static',
                windowClass: 'displaySourceCodePopupCls backToTmplPopupCls',
                size: 'sm',
                resolve: {
                     modelType: function () {
                        var modelData = {
                            createMarketingTmplObj: $scope.createMarketingTmplObj,
                            t_catagory: $scope.useThisDesignObj.t_catagory
                        }
                        return modelData;
                    }
                }

            });
        }
        $scope.showDesignView = function(){
            if($scope.createMarketingTmplObj.activeSorceCode == false){
                return;
            }
            $scope.createMarketingTmplObj.activeSorceCode = false
        }
        $scope.showSourceCodeFunction = function(){
            if($scope.createMarketingTmplObj.activeSorceCode == true){
                return;
            } else{
                $scope.createMarketingTmplObj.activeSorceCode = true;
            }
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: '<div class="modal-header">'+
                    '<h5 class="modal-title">Alert Dialog</h5>'+
                '</div>'+
                '<div class="modal-body">'+
                    '<img src="images/info.png"><p class="modelWarningTxt">Warning!</p>'+
                    '<p>This mode is for expert users and requires knowledge of HTML. '+
                    'If you are not familiar with HTML, '+
                    'click the Design tab to use our WYSIWYG designer.</p>'+
                    '<div class="row"><button ng-click="cancel();" class="btn_bg1">OK</button></div>'+
                '</div>',
                controller: 'sourceCodeModalCtrl',
                backdrop: 'static',
                windowClass: 'displaySourceCodePopupCls',
                size: 'sm'
            });
        }
        $scope.cancelModal = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.changeBG = function(){
            console.log('Test Change Color');
        }
        $scope.previewTemplate = function(id){
            //window.open('view/marketing/marketing-template/preview_template.html', '_blank');
            var url = $state.href('preview_template', {ids: id});
            window.open(url,'_blank');
        }
    }

})();
(function () {

    'use strict';

    angular.module('marketingTemplate').controller('previewTmplCtrl', previewTmplCtrl);

    function previewTmplCtrl($scope, $state, marketingDataService, $sce) {
        if($state && $state.params && $state.params.ids){
            marketingDataService.previewTemplate($state.params.ids).then(function (data) {
                if(status == 0){
                    $scope.previewTemplateData = data.data.template_details[0]
                    $scope.showTemplate = $sce.trustAsHtml(data.data.template_details[0].t_msg);
                    $scope.isTemplate = true;
                }
            }).catch(function () {
                $scope.isTemplate = false;
                $scope.error = 'data not fount';
            });
        }
    }

})();
(function () {

    'use strict';

    angular.module('marketingTemplate').controller('deleteMarketingCtrl', deleteMarketingCtrl);

    function deleteMarketingCtrl($scope, toastr, $uibModalInstance, modelType,$timeout,uiGridConstants, marketingDataService, $rootScope, $state) {
       $scope.templateName = modelType.count;
       $scope.singleSelect = modelType.single;
       console.log("sfdsfdsfsdfsdf"+ $scope.singleSelect);
        $scope.deleteRecord = function() {

            console.log('modelType.rowIds ', modelType.rowIds);
            var _data = {
                "id": [modelType.rowIds]
            }
            marketingDataService.deleteMarketTemplate(_data.id).then(function(data) {
                $scope.singleSelect =false;
                // console.log("sfdsfdsfsdfsdf"+ $scope.singleSelect);
                $uibModalInstance.close('open');
              $rootScope.refresh();  
            })
            .catch(function() {

            });
        }
 
     $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };  

    }

})();
 (function () {

    'use strict';

    angular.module('marketingTemplate').controller('copyMarketingTmplCtrl', copyMarketingTmplCtrl);

    function copyMarketingTmplCtrl($scope, marketingDataService, $rootScope) {

        $scope.targetColor = '#d2cabc';
        $scope.targetColor1 = '#761B08';
        $scope.targetColor2 = '#08760A';
        $scope.targetColor3 = '#087176';
        $scope.targetColor4 = '#082E76';
        /*$scope.marketing_video = function () {
                $scope.addTab({
                    name: 'Getting Started'
                });
        };*/

        $scope.sliderConfig = {
            min: 600,
            max: 900,
            step: 100
        }
        $scope.setPrice = function(price) {
            $scope.price = price;    
        }
        $scope.add_subject = function (subject) {
            var array = [];
            var subjectData = $scope.user_template.template_details[0].t_subject;
            console.log(subjectData);
            if (subjectData != null || subjectData != '') {
                array.push($scope.user_template.template_details[0].t_subject);
                array.push('${' + subject.value + '}');
                $scope.user_template.template_details[0].t_subject = array.join(" ");
            }
            else {
                array.push('${' + subject.value + '}');
                $scope.user_template.template_details[0].t_subject = array;
            }

        }
        marketingDataService.marketingtemplates($rootScope.copy_Id).then(function (data) {
                
                $scope.user_template = data.data;
                $scope.temp_newObject = [],
                angular.forEach(data.data.available_mail_merge_fields, function (value, key) {
                    angular.forEach(value, function (value, key) {
                        $scope.temp_newObject.push({
                            "title": value,
                            "value": key
                        });
                    });
                });
        }).catch(function () {
                $scope.error = 'data not fount';
        });

    }

})();
(function () {

 'use strict';

 angular.module('marketingTemplate').directive('uiColorpicker', function () {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: false,
        replace: true,
        template: "<span><input class='input-small' /></span>",
        link: function(scope, element, attrs, ngModel) {
            var input = element.find('input');
            var options = angular.extend({
                color: ngModel.$viewValue,
                change: function(color) {
                    scope.$apply(function() {
                      ngModel.$setViewValue(color.toHexString());
                    });
                }
            }, scope.$eval(attrs.options));
            
            ngModel.$render = function() {
              input.spectrum('set', ngModel.$viewValue || '');
            };
            
            input.spectrum(options);
        }
    };
 })
 .directive("slider", function() {
    return {
        restrict: 'A',
        scope: {
            config: "=config",
            price: "=model"
        },
        link: function(scope, elem, attrs) {
            var setModel = function(value) {
                scope.model = value;   
            }
            
            $(elem).slider({
                range: false,
                min: scope.config.min,
                max: scope.config.max,
                step: scope.config.step,
                slide: function(event, ui) { 
                    scope.$apply(function() {
                        scope.price = ui.value;
                    });
                }
            });
        }
    }
});

})();