'use strict';

angular.module('angularSimplePagination', []).directive('simplePagination', SimplePagination);

function SimplePagination() {
    return {
        restrict: 'E',
        scope: {
            currentPage: '=',
            offset: '=',
            pageLimit: '=',
            pageLimits: '=',
            total: '=',
            onUpdate: '&'
        },
        bindToController: true,
        controller: SimplePaginationController,
        controllerAs: 'pagination',
//    template: '\n      <div class="simple-pagination">\n        <p class="simple-pagination__items">Showing {{pagination.pageLimit}} out of {{pagination.total}}</p>\n        <p>\n          <button ng-click="pagination.previousPage()" ng-disabled="pagination.currentPage <= 0" class="simple-pagination__button simple-pagination__button--prev">\n            &#10094;\n          </button>\n          <span class="simple-pagination__pages">{{pagination.currentPage + 1}} of {{pagination.getTotalPages()}}</span>\n          <button ng-click="pagination.nextPage()" ng-disabled="pagination.currentPage === (pagination.getTotalPages() - 1)" class="simple-pagination__button simple-pagination__button--next">\n            &#10095;\n          </button>\n        </p>\n        <p class="simple-pagination__page-limit">\n          <span class="simple-pagination__page-limit__option" ng-repeat="limit in pagination.pageLimits" ng-if="limit < pagination.total">\n            <a href="" ng-click="pagination.setItemsPerPages(limit)" ng-class="{\'active\': pagination.isCurrentPageLimit(limit)}">{{limit}}</a>\n          </span>\n          <span>\n            <a href="" ng-click="pagination.setItemsPerPages(pagination.total)" ng-class="{\'active\': pagination.isCurrentPageLimit(pagination.total)}">All</a>\n          </span>\n        </p>\n      </div>\n    '
        template: '<div class="row"><div class="col-md-1" title="Previous page" callback="GoBack" style="background: #058ae5;margin-right: 4px;" ng-click="pagination.previousPage()"><img src="images/previousPage1.png"   align="absmiddle"></div><div class="col-md-1"  class="gmail-img-button" title="Next page"  ng-click="nextPage(begin,end)"  callback="GoNext" style="background: #058ae5;margin-right: 4px;"><img src="images/nextPage.png" ng-click="pagination.nextPage()" align="absmiddle"></div><div class="col-md-1" style="background: #058ae5;margin-right: 4px;"><div class="dropdown"><img src="images/dropDown.png" align="absmiddle" data-toggle="dropdown" style="background: #058ae5;margin-right: 4px;"/><ul class="dropdown-menu"><li ng-repeat="record in pagination.records"><a ng-click="pagination.recordsPerPage(record)">{{record}}</a></li></ul></div></div></div>'
    };
}

function SimplePaginationController() {


    var self = this;
    self.records = [5, 10, 15, 20, 30, 50];

    self.recordsPerPage = function (no) {
        console.log('inside viewSalesTemplateCtrl:recordsPerPage', no);
        self.noOfRecordsPerPage = no;


    };



    self.currentPage = self.currentPage || 0;
    self.pageLimit = self.pageLimit || self.pageLimits[0];

    self.setItemsPerPages = function (max) {
        self.pageLimit = max >= self.total ? self.total : max;
        self.currentPage = 0;
        self.offset = 0;
        invokeCallback();
    };

    self.nextPage = function () {
        self.currentPage += 1;
        self.offset = self.currentPage * self.pageLimit;
        invokeCallback();
    };

    self.previousPage = function () {
        self.currentPage -= 1;
        self.offset = self.currentPage * self.pageLimit;
        invokeCallback();
    };

    self.getTotalPages = function () {
        return Math.ceil(self.total / self.pageLimit);
    };

    self.isCurrentPageLimit = function (value) {
        return self.pageLimit == value;
    };

    function invokeCallback() {
        if (self.onUpdate) {
            self.onUpdate();
        }
    }
}