(function () {

     'use strict';
     
      angular.module('soffrontApp', [ 
        'ui.router', 
        'ui.select', 
        'toastr', 
        'ngAnimate', 
        'ngLodash', 
        'ngSanitize',  
        'ui.bootstrap', 
        'account', 
        'ngStorage', 
        'angular-loading-bar', 
        'ui.grid.resizeColumns', 
        'ui.grid.moveColumns', 
        'salesTemplate',
        'calendar',
        'opportunities', 
        'allTasks',
        'reports', 
        'allAppointments',
        'ui.grid.exporter',
        'ngPrint',
        'ui.bootstrap.datetimepicker',
        'ngDragDrop',
        'marketingTemplate',
        'checklist-model',
        'contact',
        'webform',
        'colorpicker.module'
      ]);

 })();

 (function () {

    'use strict';
     
    angular.module('soffrontApp').run(function($rootScope, $state) {
        $rootScope.$on('$stateChangeError', console.log.bind(console));
        $rootScope.$state = $state;
    })

 })();

(function () {

    'use strict';
     
    angular.module('soffrontApp').config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
	    cfpLoadingBarProvider.includeBar = false;
    }])

 })();

(function () {

 'use strict';

 angular.module('soffrontApp').directive('ckEditor', function () {
   return {
     require: '?ngModel',
     link: function (scope, elm, attr, ngModel) {
       var ck = CKEDITOR.replace(elm[0]);
       if (!ngModel) return;
       ck.on('instanceReady', function () {
         ck.setData(ngModel.$viewValue);
       });
       ck.on('pluginsLoaded', function () {
         var editor = this,
           config = editor.config;
         editor.ui.addRichCombo('my-combo', {
           label: 'Personalize',
           title: 'Personalize',
           toolbar: 'colors,100',

           panel: {
             css: [CKEDITOR.skin.getPath('editor')].concat(config.contentsCss),
             multiSelect: false,
             attributes: { 'aria-label': 'My Dropdown Title' }
           },

           init: function () {
             this.startGroup('Personalize');
             this.add('${j_contacts.address1}', 'Address1');
             this.add('${j_contacts.address2}', 'Address2');
             this.add('${j_contacts.bday}', 'Birthday');
             this.add('${j_contacts.category}', 'Category');
             this.add('${j_contacts.city}', 'City');
             this.add('${j_contacts.comments}', 'Comments');
             this.add('${j_contacts.company}', 'Company');
             this.add('${j_contacts.country}', 'Country');
             this.add('${j_contacts.t_creater}', 'Created by');
             this.add('${j_contacts.created_on}', 'Created on');
             this.add('${j_contacts.email}', 'Created by');
             this.add('${j_contacts.t_creater}', 'Email');
             this.add('${j_contacts.email_status}', 'Email status');
             this.add('${j_contacts.fax}', 'Fax');
             this.add('${j_contacts.first_name}', 'First name');
             this.add('${j_contacts.hphone}', 'Home phone');
             this.add('${j_contacts.last_name}', 'Last name');
             this.add('${j_contacts.lead_score}', 'Lead Score');
             this.add('${j_contacts.mobile}', 'Mobile');
             this.add('${j_contacts.email2}', 'Other email');
             this.add('${j_contacts.permission_status}', 'Permission');
             this.add('${j_contacts.phone}', 'Phone');
             this.add('${j_contacts.sales_rep}', 'Sales rep');
             this.add('${j_contacts.salutation}', 'Salutation');
             this.add('${j_contacts.sc_source}', 'Secondary Source');
             this.add('${j_contacts.source}', 'Source');
             this.add('${j_contacts.state}', 'State');
             this.add('${j_contacts.tags}', 'Tag');
             this.add('${j_contacts.job_title}', 'Title');
             this.add('${j_contacts.type}', 'Title');
             this.add('${j_contacts.updated_by}', 'Updated by');
             this.add('${j_contacts.updated_on}', 'Updated on');
             this.add('${j_contacts.visible_to}', 'Visible to');
             this.add('${j_contacts.website}', 'Website');
             this.add('${j_contacts.zip_code}', 'Zip code');            
      
           },

           onClick: function (value) {
             editor.focus();
             editor.fire('saveSnapshot');

             editor.insertHtml(value);

             editor.fire('saveSnapshot');
           }
         });
       });
       function updateModel() {
         scope.$apply(function () {
           ngModel.$setViewValue(ck.getData());
         });
       }
       ck.on('change', updateModel);
       ck.on('key', updateModel);
       ck.on('dataReady', updateModel);

       ngModel.$render = function (value) {
         ck.setData(ngModel.$viewValue);
       };
     }
   };
 });

})();

(function () {

    'use strict';
     
      angular.module('soffrontApp').config(function(toastrConfig) {
        angular.extend(toastrConfig, {
          allowHtml: false,
          closeButton: false,
          closeHtml: '<button>&times;</button>',
          extendedTimeOut: 500,
          iconClasses: {
            error: 'toast-error',
            info: 'toast-info',
            success: 'toast-success',
            warning: 'toast-warning'
          },  
          messageClass: 'toast-message',
          onHidden: null,
          onShown: null,
          onTap: null,
          progressBar: false,
          tapToDismiss: true,
          templates: {
            toast: 'view/toast.html',
           // progressbar: 'directives/progressbar/progressbar.html'
          },
          timeOut: 5000,
          titleClass: 'toast-title',
          toastClass: 'toast'
        });
      })
})();

(function () {

 'use strict';

 angular.module('soffrontApp').directive('onEsc', function () {
    return function(scope, elm, attr) {
      elm.bind('keydown', function(e) {
        if (e.keyCode === 27) {
          scope.$apply(attr.onEsc);
        }
      });
    };
 });

})();

(function () {

 'use strict';

 angular.module('soffrontApp').directive('onEnter', function () {
     return function(scope, elm, attr) {
      elm.bind('keypress', function(e) {
        if (e.keyCode === 13) {
          scope.$apply(attr.onEnter);
        }
      });
    };
 });

})();

(function () {

 'use strict';

 angular.module('soffrontApp').directive('inlineEdit', function ($timeout) {
     return {
        scope: {
          model: '=inlineEdit',
          handleSave: '&onSave',
          handleCancel: '&onCancel'
        },
        link: function(scope, elm, attr) {
          var previousValue;
          
          scope.edit = function() {
            scope.editMode = true;
            previousValue = scope.model;
            
            $timeout(function() {
              elm.find('input')[0].focus();
            }, 0, false);
          };
          scope.save = function() {
            scope.editMode = false;
            scope.handleSave({value: scope.model});
          };
          scope.cancel = function() {
            scope.editMode = false;
            scope.model = previousValue;
            scope.handleCancel({value: scope.model});
          };
        },
        templateUrl: 'view/inline-edit.html'
      };
 });

})();

 (function () {

 'use strict';

 angular.module('soffrontApp').directive('ngEnter', function ($timeout, $parse) {
      return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
 });

})();
