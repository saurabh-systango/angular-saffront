(function() {
   'use strict';

   angular.module('soffrontApp')
       .constant('config', {
           api: "https://testapi.snapshotcrm.com/v3/token/",
           apiAccount: "https://testapi.snapshotcrm.com/v3/accounts/" ,
           apiSales: "https://testapi.snapshotcrm.com/v3/salestemplates/",
           apiAppointment: "https://testapi.snapshotcrm.com/v3/appointments/",
           apiPendingTask: "https://testapi.snapshotcrm.com/v3/tasks/",
           apiAllTask: "https://testapi.snapshotcrm.com/v3/tasks/",
           apiOpportunities:"https://testapi.snapshotcrm.com/v3/opportunities/",
           apiSalesReports:"https://testapi.snapshotcrm.com/v3/reports/sales"  ,
           apiFileds:"https://testapi.snapshotcrm.com/v3/"  ,
           apiMarketinTemplate:"https://testapi.snapshotcrm.com/v3/marketingtemplates/",
           apiContact:"https://testapi.snapshotcrm.com/v3/contacts/",
           apiWebForms:"https://testapi.snapshotcrm.com/v3/webforms/",
           apiGetGroup:"https://testapi.snapshotcrm.com/v3/groups/get"
       });

})();