 (function () {

     'use strict';

      // Controller for get GET API
     angular.module('soffrontApp').config(function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/login');
      
      $stateProvider          
          // HOME STATES AND NESTED VIEWS ========================================
          .state('home', {
              url: '/home',
              templateUrl: 'view/home/home.html',
              controller  : 'homeCtrl',
          })          
          .state('login', {
              url: '/login',
              templateUrl: 'view/login/login.html',
              controller  : 'loginCtrl',
          })
          .state('forgotpassword', {
              url: '/forgotpassword',
              templateUrl: 'view/login/forgotpassword.html',
              controller  : 'loginCtrl',
          })
          .state('jtrackLogin', {
              url: '/jtrackLogin',
              templateUrl: 'view/login/jtrackLogin.html',
              controller  : 'loginCtrl',
          })
          .state('sessionexpired', {
              url: '/sessionexpired',
              templateUrl: 'view/login/sessionexpired.html',
              controller  : 'loginCtrl',
          })
          .state('preview', {
              url: '/preview/:recordId',
              templateUrl: 'view/emailTemplate.html',
              controller  : 'previousCtrl',
              //params: {param1: 'hi'}
          })
          //  All Sales------ >>  sales Template related states will be here
          .state('accounts', {
              url: '/accounts',
              templateUrl: 'view/sales/accounts/accounts.html',
              controller  : 'accountsCtrl',
          })
         .state('viewSaleTemplate', {
             url: '/viewSalesTemplate',
             templateUrl: 'view/sales/sales-template/viewSalesTemplate.html',
             controller: 'viewSalesTemplateCtrl'
         })
        .state('editSalesTemplate', {
            url: '/sales/sales-template/editSalesTemplate',
            templateUrl: 'view/sales/sales-template/editSalesTemplate.html',
            controller: 'editSalesTemplateCtrl'
        })

              //All Calendar --- >> calendar related states will be here

        .state('pendingTask', {
            url: '/sales/calendar/pendingTask',
            templateUrl: 'view/sales/calendar/pendingTask.html',
            controller: 'calendarCtrl'
        })

        .state('preview_template', {
            url: '/preview_template:ids',
            templateUrl: 'view/marketing/marketing-template/preview_template.html',
            controller: 'previewTmplCtrl'
        });

          
      });   

 })();



