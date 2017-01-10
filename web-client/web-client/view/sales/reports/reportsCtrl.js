(function () {

    'use strict';

    angular.module('reports', []);

})();
(function () {
    'use strict';
    angular.module('reports').controller('reportMenuCtrl', reportMenuCtrl);
    function reportMenuCtrl($scope, $rootScope, reportsDataServices) {

        $scope.reportData = function () {
            reportsDataServices.getReportDetails().then(function (data) {
                $scope.data = data.data;
                $scope.reportNames = data.data.report_names;
            })
                .catch(function () {
                    $scope.error = 'data not fount';
                });
        }
        $scope.reportData();

        $scope.reportData = reportsDataServices.getReportDetails();

        $rootScope.reportTabs = [
            {
                title: 'Activity Report',
                // url: 'view/sales/reports/printTest.html'
                url: 'view/sales/reports/activityReport.html'
            },
            {
                title: 'Conversion Report',
                url: 'view/sales/reports/conversionReport.html'
            },

            {
                title: 'Pipeline Report',
                url: 'view/sales/reports/pipelineReport.html'
            },
            {
                title: 'Call Report',
                url: 'view/sales/reports/callReport.html'
            },
            {
                title: 'Forcast Report',
                url: 'view/sales/reports/forcastReport.html'
            }
        ];

        $rootScope.reportCurrentTab = 'view/sales/reports/activityReport.html';

        $scope.onClickTab = function (tab) {
            $rootScope.reportCurrentTab = tab.url;

        }

        $scope.isActiveTab = function (tabUrl) {
            return tabUrl == $rootScope.reportCurrentTab;
        }
    }


})();
(function () {
    'use strict';
    angular.module('reports').controller('activityReportCtrl', activityReportCtrl);
    function activityReportCtrl($scope, $rootScope, $uibModal, $filter, uiGridConstants, reportsDataServices) {
        $scope.date_types = [
            {
                "value": "td",
                "text": "Today"
            },
            {
                "value": "yd",
                "text": "Yesterday"
            },
            {
                "value": "tw",
                "text": "This Week"
            },
            {
                "value": "tm",
                "text": "This Month"
            },
            {
                "value": "tq",
                "text": "This Quarter"
            },
            {
                "value": "ty",
                "text": "This Year"
            },
            {
                "value": "lw",
                "text": "Last Week"
            },
            {
                "value": "lm",
                "text": "Last Month"
            },
            {
                "value": "lq",
                "text": "Last Quarter"
            },
            {
                "value": "ly",
                "text": "Last Year"
            },
            {
                "value": "cust",
                "text": "Custom"
            }
        ]
        $scope.picker3 = {
            date: ""
        };
        $scope.picker4 = {
            date: ""
        };
        $scope.openCalendar = function (e, picker) {
            $scope[picker].open = true;
        };

        $scope.paramChart = {
            "due_by": "td",
            "from_date": "",
            "to_date": "",
            "user_names": "All"
        }

        $scope.alertPopup = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/reports/alert.html',
                controller: 'ModalInstanceCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function () {
                        return 'fromdate';
                    }
                }

            });
        }

        var activity_by_salesrep, activity_by_type;

        $scope.reports = function () {
            // console.log('Reports called');
            $scope.reportApicall = function (_data) {
                reportsDataServices.activityReport(JSON.stringify(_data)).then(function (data) {
                    $scope.activityReport = data.data;
                    $scope.matrix = data.data.activity_matrix;
                    $scope.mydata = data.data.activity_by_type.chart_data;
                    $scope.chart_data = data.data.activity_by_salesrep.chart_data;

                    if ($scope.chart_data == undefined) {
                        $scope.score1 = [];

                    } else {
                        $scope.score1 = [];
                        for (var i = 0; i < $scope.chart_data.length; i++) {
                            $scope.score1.push($scope.chart_data[i].y);
                        }
                    }
                    if ($scope.mydata == undefined) {
                        $scope.score = [];
                    } else {
                        $scope.score = [];
                        for (var i = 0; i < $scope.mydata.length; i++) {
                            $scope.score.push($scope.mydata[i].y);
                        }
                    }
                    activity_by_salesrep = Highcharts.chart({
                        chart: {
                            type: $scope.activityReport.activity_by_salesrep.chart_type,
                            renderTo: 'container',
                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: $scope.activityReport.activity_by_salesrep.title,
                            align: 'left',
                            x: 60,
                            style: {
                                color: '#058AE5',
                                fontSize: '24px'
                            }
                        },

                        tooltip: {
                            formatter: function () {
                                return '<b>' + this.x + '</b> : ' + this.y
                            }
                        },

                        xAxis: {
                            categories: $scope.activityReport.activity_by_salesrep.categories,
                            labels: {
                                useHTML: true,
                                formatter: function () {
                                    return '<div class="hastip" title="' + this.value + '">' + this.value + '</div>';
                                }
                            }

                        },
                        yAxis: {
                            title: {
                                text: $scope.activityReport.activity_by_salesrep.y_axis_name
                            }
                        },
                        plotOptions: {
                            series: {
                                pointWidth: 35
                            },
                            column: {
                                events: {
                                    legendItemClick: function () {
                                        return false; // <== returning false will cancel the default action
                                    }
                                },
                            },
                            allowPointSelect: false,
                        },
                        series: [{
                            name: $scope.activityReport.activity_by_salesrep.x_axis_name,
                            data: $scope.score1
                        }]

                    });



                    activity_by_type =  Highcharts.chart({
                        chart: {
                            renderTo: 'container1',
                            type: $scope.activityReport.activity_by_type.chart_type

                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: $scope.activityReport.activity_by_type.title,
                            align: 'left',
                            x: 60,
                            style: {
                                color: '#058AE5',
                                fontSize: '24px'
                            }
                        },

                        xAxis: {
                            categories: $scope.activityReport.activity_by_type.categories,
                            labels: {
                                useHTML: true,
                                formatter: function () {
                                    return '<div class="hastip" title="' + this.value + '">' + this.value + '</div>';
                                }
                            }
                        },

                        yAxis: {
                            title: {
                                text: $scope.activityReport.activity_by_type.y_axis_name
                            }
                        },

                        tooltip: {
                            formatter: function () {
                                return '<b>' + this.x + '</b> : ' + this.y
                            }
                        },

                        plotOptions: {
                            series: {
                                pointWidth: 35
                            },
                            column: {
                                events: {
                                    legendItemClick: function () {
                                        return false; // <== returning false will cancel the default action
                                    }
                                },
                            },
                            allowPointSelect: false,
                        },

                        series: [{
                            name: $scope.activityReport.activity_by_type.x_axis_name,
                            data: $scope.score

                        }]

                    });
                    
                })
                    .catch(function () {
                        console.log('error');
                    });


            }
            var types = [];

            if ($scope.paramChart.due_by == 'cust') {

                if ($scope.paramChart.from_date == "") {
                    $rootScope.msg = "from date"
                    $scope.alertPopup();
                } else if ($scope.paramChart.to_date == "") {
                    $rootScope.msg = "to date"
                    $scope.alertPopup();
                }
                var _data = {
                    parameter_id: 11,
                    item_type: "Activity Report",
                    due_by: $scope.paramChart.due_by,
                    user_names: $scope.paramChart.user_names,
                    from_date: $filter('date')($scope.paramChart.from_date, 'yyyy-MM-dd'),
                    to_date: $filter('date')($scope.paramChart.to_date, 'yyyy-MM-dd'),
                    type: types
                }
                console.log('_data with date', _data);
                $scope.reportApicall(_data);

            }
            else {
                var _data = {
                    parameter_id: 11,
                    item_type: "Activity Report",
                    due_by: $scope.paramChart.due_by,
                    user_names: $scope.paramChart.user_names,
                    from_date: "",
                    to_date: "",
                    type: types
                }
                console.log('_data without date', _data);
                $scope.reportApicall(_data);

            }




        }
        $scope.reports();

        $scope.print = function () {
            // window.print();
            $scope.printCharts([activity_by_salesrep, activity_by_type]);
        }

        $scope.printCharts = function (charts) {

            var origDisplay = [],
                origParent = [],
                body = document.body,
                childNodes = body.childNodes;

            // hide all body content
            Highcharts.each(childNodes, function (node, i) {
                if (node.nodeType === 1) {
                    origDisplay[i] = node.style.display;
                    node.style.display = "none";
                }
            });

            // put the charts back in
            angular.forEach(charts, function (i, chart) {
                console.log('CHART', chart.container);
                origParent[i] = chart.container.parentNode;
                body.appendChild(chart.container);
            });

            // print
            window.print();

            // allow the browser to prepare before reverting
            setTimeout(function () {
                // put the chart back in
                angular.forEach(charts, function (i, chart) {
                    origParent[i].appendChild(chart.container);
                });

                // restore all body content
                Highcharts.each(childNodes, function (node, i) {
                    if (node.nodeType === 1) {
                        node.style.display = origDisplay[i];
                    }
                });
            }, 500);
        }

    }
})();

(function () {
    'use strict';

    angular.module('reports').controller('conversionReportCtrl', conversionReportCtrl);

    function conversionReportCtrl($scope, $rootScope, $uibModal, reportsDataServices) {
        $scope.date_types = [
            {
                "value": "td",
                "text": "Today"
            },
            {
                "value": "yd",
                "text": "Yesterday"
            },
            {
                "value": "tw",
                "text": "This Week"
            },
            {
                "value": "tm",
                "text": "This Month"
            },
            {
                "value": "tq",
                "text": "This Quarter"
            },
            {
                "value": "ty",
                "text": "This Year"
            },
            {
                "value": "lw",
                "text": "Last Week"
            },
            {
                "value": "lm",
                "text": "Last Month"
            },
            {
                "value": "lq",
                "text": "Last Quarter"
            },
            {
                "value": "ly",
                "text": "Last Year"
            },
            {
                "value": "cust",
                "text": "Custom"
            }
        ]

        $scope.print = function () {
            window.print();
        }



        $scope.picker3 = {
            date: ""
        };
        $scope.picker4 = {
            date: ""
        };
        $scope.openCalendar = function (e, picker) {
            $scope[picker].open = true;
        };

        $scope.paramChart = {
            "due_by": "lq",
            "from_date": "",
            "to_date": "",
            "user_names": "All",
            "object_name": "Accounts"
        }
        $scope.alertPopup = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/reports/alert.html',
                controller: 'ModalInstanceCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function () {
                        return 'fromdate';
                    }
                }

            });
        }

        $scope.reports = function () {
            var types = [];

            if ($scope.paramChart.due_by == 'cust') {

                if ($scope.paramChart.from_date == "") {
                    $rootScope.msg = "from date"
                    $scope.alertPopup();
                } else if ($scope.paramChart.to_date == "") {
                    $rootScope.msg = "to date"
                    $scope.alertPopup();
                }
            }
            else {

                var _data = {
                    parameter_id: 10,
                    item_type: "Conversion Report",
                    due_by: $scope.paramChart.due_by,
                    user_names: 'All',
                    from_date: $scope.paramChart.from_date,
                    to_date: $scope.paramChart.to_date,
                    object_name: $scope.paramChart.object_name,
                    type: types
                }


                reportsDataServices.conversionReport(JSON.stringify(_data)).then(function (data) {
                    $scope.conversionReport = data.data;
                    $scope.matrix_by_status = data.data.matrix_by_status;

                    $scope.matrix_by_source = data.data.matrix_by_source;
                    console.log('matrix -by sporce', $scope.matrix_by_source);
                    console.log('matrix -by status', $scope.matrix_by_status);

                    $scope.conversion_by_source = data.data.conversion_by_source.chart_data;

                    if ($scope.conversion_by_source == undefined) {
                        if ($scope.conversion_by_sourceY.length > 0) {
                            $scope.conversion_by_sourceY = [];
                        }
                    } else {
                        $scope.conversion_by_sourceY = [];
                        for (var i = 0; i < $scope.conversion_by_source.length; i++) {
                            $scope.conversion_by_sourceY.push($scope.conversion_by_source[i].y);



                        }
                    }

                    Highcharts.chart('container1', {
                        chart: {
                            type: $scope.conversionReport.conversion_by_source.chart_type,
                            options3d: {
                                enabled: true,
                                alpha: 0,
                                beta: 0,
                                depth: 50,
                                viewDistance: 25
                            }

                        },
                        credits: {
                            enabled: false
                        },

                        title: {
                            text: $scope.conversionReport.conversion_by_source.title,
                            align: 'left',
                            x: 60,
                            style: {
                                color: '#058AE5',
                                fontSize: '24px'
                            }
                        },


                        tooltip: {
                            formatter: function () {
                                return '<b>' + this.x + '</b> : ' + this.y
                            }
                        },

                        xAxis: {
                            categories: $scope.conversionReport.conversion_by_source.categories,
                            labels: {
                                useHTML: true,
                                formatter: function () {
                                    console.log(this);
                                    return '<div class="hastip" title="' + this.value + '">' + this.value + '</div>';
                                }
                            }
                        },
                        yAxis: {
                            title: {
                                text: $scope.conversionReport.conversion_by_source.y_axis_name
                            }
                        },
                        plotOptions: {
                            series: {
                                pointWidth: 35
                            },
                            column: {
                                events: {
                                    legendItemClick: function () {
                                        return false; // <== returning false will cancel the default action
                                    }
                                },
                            },
                            allowPointSelect: false,
                        },
                        series: [{
                            name: $scope.conversionReport.conversion_by_source.x_axis_name,
                            data: $scope.conversion_by_sourceY

                        }]

                    });

                    $scope.conversion_by_status = data.data.conversion_by_status.chart_data;

                    if ($scope.conversion_by_status == undefined) {
                        if ($scope.conversion_by_sourceY.length > 0) {
                            $scope.conversion_by_sourceY = [];
                        }
                    } else {
                        $scope.conversion_by_statusY = [];
                        for (var i = 0; i < $scope.conversion_by_status.length; i++) {
                            $scope.conversion_by_statusY.push($scope.conversion_by_status[i].y);

                        }
                    }

                    Highcharts.chart('container2', {
                        chart: {
                            // type: $scope.conversionReport.conversion_by_status.chart_type
                            type: 'column',
                            options3d: {
                                enabled: true,
                                alpha: 15,
                                beta: 1,
                                depth: 39,
                                viewDistance: 25
                            }

                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: $scope.conversionReport.conversion_by_status.title,
                            align: 'left',
                            x: 60,
                            style: {
                                color: '#058AE5',
                                fontSize: '24px'
                            }
                        },

                        tooltip: {
                            formatter: function () {
                                return '<b>' + this.x + '</b> : ' + this.y
                            }
                        },

                        xAxis: {
                            categories: $scope.conversionReport.conversion_by_status.categories,
                            labels: {
                                useHTML: true,
                                formatter: function () {
                                    console.log(this);
                                    return '<div class="hastip" title="' + this.value + '">' + this.value + '</div>';
                                }
                            }
                        },
                        yAxis: {
                            title: {
                                text: $scope.conversionReport.conversion_by_status.y_axis_name
                            }
                        },

                        series: [{
                            name: $scope.conversionReport.conversion_by_status.x_axis_name,
                            data: $scope.conversion_by_sourceY

                        }]

                    });

                })
                    .catch(function () {
                        console.log('error');
                    });
            }
        }
        $scope.reports();

    }
})();

(function () {
    'use strict';

    angular.module('reports').controller('callReportCtrl', callReportCtrl);

    function callReportCtrl($scope, $rootScope, $uibModal, reportsDataServices) {
        $scope.date_types = [
            {
                "value": "td",
                "text": "Today"
            },
            {
                "value": "yd",
                "text": "Yesterday"
            },
            {
                "value": "tw",
                "text": "This Week"
            },
            {
                "value": "tm",
                "text": "This Month"
            },
            {
                "value": "tq",
                "text": "This Quarter"
            },
            {
                "value": "ty",
                "text": "This Year"
            },
            {
                "value": "lw",
                "text": "Last Week"
            },
            {
                "value": "lm",
                "text": "Last Month"
            },
            {
                "value": "lq",
                "text": "Last Quarter"
            },
            {
                "value": "ly",
                "text": "Last Year"
            },
            {
                "value": "cust",
                "text": "Custom"
            }
        ]

        $scope.picker3 = {
            date: ""
        };
        $scope.picker4 = {
            date: ""
        };
        $scope.openCalendar = function (e, picker) {
            $scope[picker].open = true;
        };




        $scope.reports = function () {
            var types = [];
            var _data = {
                parameter_id: 47,
                item_type: "Call Report",
                due_by: $scope.parametersData.due_by,
                user_names: $scope.parametersData.user_name,
                from_date: $scope.parametersData.from_date,
                to_date: $scope.parametersData.to_date,
                type: types
            }

            reportsDataServices.callReport(JSON.stringify(_data)).then(function (data) {
                $scope.conversionReport = data.data;

                $scope.mydata = data.data.activity_by_type.chart_data;
                var score = [];
                for (var i = 0; i < $scope.mydata.length; i++) {
                    score.push($scope.mydata[i].y);

                }

                Highcharts.chart('container', {
                    chart: {
                        type: $scope.conversionReport.activity_by_salesrep.chart_type

                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: $scope.conversionReport.activity_by_salesrep.title,
                        align: 'left',
                        x: 60,
                        style: {
                            color: '#058AE5',
                            fontSize: '24px'
                        }
                    },

                    xAxis: {
                        categories: $scope.conversionReport.activity_by_salesrep.categories,
                        labels: {
                            useHTML: true,
                            formatter: function () {
                                console.log(this);
                                return '<div class="hastip" title="' + this.value + '">' + this.value + '</div>';
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: $scope.conversionReport.activity_by_salesrep.y_axis_name,
                        }
                    },

                    series: [{
                        name: $scope.conversionReport.activity_by_salesrep.chart_data[0].x_axis_name,
                        data: [$scope.conversionReport.activity_by_salesrep.chart_data[0].y]

                    }]

                });



                Highcharts.chart('container1', {
                    chart: {
                        type: $scope.activityReport.activity_by_type.chart_type

                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: $scope.activityReport.activity_by_type.title,
                        align: 'left',
                        x: 60,
                        style: {
                            color: '#058AE5',
                            fontSize: '24px'
                        }
                    },

                    xAxis: {
                        categories: $scope.activityReport.activity_by_type.categories,
                        labels: {
                            useHTML: true,
                            formatter: function () {
                                console.log(this);
                                return '<div class="hastip" title="' + this.value + '">' + this.value + '</div>';
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: $scope.activityReport.activity_by_type.y_axis_name
                        }
                    },
                    series: [{
                        name: $scope.activityReport.activity_by_type.x_axis_name,
                        data: score

                    }]

                });


            })
                .catch(function () {
                    console.log('error');
                });
        }
        $scope.reports();
        // date and time picker

    }
})();

(function () {
    'use strict';

    angular.module('reports').controller('pipelineReportCtrl', pipelineReportCtrl);

    function pipelineReportCtrl($scope, $uibModal, $rootScope, reportsDataServices) {
        $scope.date_types = [
            {
                "value": "td",
                "text": "Today"
            },
            {
                "value": "yd",
                "text": "Yesterday"
            },
            {
                "value": "tw",
                "text": "This Week"
            },
            {
                "value": "tm",
                "text": "This Month"
            },
            {
                "value": "tq",
                "text": "This Quarter"
            },
            {
                "value": "ty",
                "text": "This Year"
            },
            {
                "value": "lw",
                "text": "Last Week"
            },
            {
                "value": "lm",
                "text": "Last Month"
            },
            {
                "value": "lq",
                "text": "Last Quarter"
            },
            {
                "value": "ly",
                "text": "Last Year"
            },
            {
                "value": "cust",
                "text": "Custom"
            }
        ]
        $scope.picker3 = {
            date: ""
        };
        $scope.picker4 = {
            date: ""
        };
        $scope.openCalendar = function (e, picker) {
            $scope[picker].open = true;
        };

        $scope.print = function () {
            window.print();
        }

        $scope.alertPopup = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'view/sales/reports/alert.html',
                controller: 'ModalInstanceCtrl',
                size: '350px alert',
                resolve: {
                    modelType: function () {
                        return 'fromdate';
                    }
                }

            });
        }


        $scope.paramChart = {
            "due_by": "yd",
            "from_date": "",
            "to_date": "",
            "user_names": "All"
        }

        $scope.reports = function (_data) {
            var types = [];
            var _data = {
                parameter_id: 3,
                item_type: "Pipeline Report",
                due_by: $scope.paramChart.due_by,
                user_names: $scope.paramChart.user_name,
                from_date: $scope.paramChart.from_date,
                to_date: $scope.paramChart.to_date,
                type: types
            }

            console.log(_data);
            reportsDataServices.pipelineReport(JSON.stringify(_data)).then(function (data) {
                $scope.pipelineReport = data.data;
                $scope.deals_by_sales_rep = data.data.deals_by_sales_rep.chart_data;

                if ($scope.deals_by_sales_rep == undefined) {
                    if ($scope.deals_by_sales_rep.length > 0) {
                        $scope.deals_by_sales_repY = [];
                    }
                } else {
                    $scope.deals_by_sales_repY = [];
                    for (var i = 0; i < $scope.deals_by_sales_rep.length; i++) {
                        $scope.deals_by_sales_repY.push({ name: $scope.deals_by_sales_rep[i].name, y: $scope.deals_by_sales_rep[i].y })

                    }
                }

                Highcharts.chart('container1', {
                    chart: {
                        type: $scope.pipelineReport.deals_by_sales_rep.chart_type

                    },
                    credits: {
                        enabled: false
                    },

                    title: {
                        text: $scope.pipelineReport.deals_by_sales_rep.title,
                        align: 'left',
                        x: 60,
                        style: {
                            color: '#058AE5',
                            fontSize: '24px'
                        }
                    },

                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        },

                        series: {
                            point: {
                                events: {
                                    legendItemClick: function () {
                                        return false; // <== returning false will cancel the default action
                                    }
                                }
                            },
                            pointWidth: 35
                        }
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',

                    },
                    series: [{
                        name: ' ',
                        data: $scope.deals_by_sales_repY
                    }]

                });

                $scope.deals_by_stages = data.data.deals_by_stages.chart_data;

                if ($scope.deals_by_stages == undefined) {
                    if ($scope.deals_by_stages.length > 0) {
                        $scope.deals_by_stagesY = [];
                    }
                } else {
                    $scope.deals_by_stagesY = [];
                    for (var i = 0; i < $scope.deals_by_stages.length; i++) {
                        $scope.deals_by_stagesY.push({ name: $scope.deals_by_stages[i].name, y: $scope.deals_by_stages[i].y })
                    }
                }


                Highcharts.chart('container2', {
                    chart: {
                        type: $scope.pipelineReport.deals_by_stages.chart_type

                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: $scope.pipelineReport.deals_by_stages.title,
                        align: 'left',
                        x: 60,
                        style: {
                            color: '#058AE5',
                            fontSize: '24px'
                        }
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        },
                        series: {
                            point: {
                                events: {
                                    legendItemClick: function () {
                                        return false; // <== returning false will cancel the default action
                                    }
                                }
                            },
                            pointWidth: 30,
                        }
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',

                    },
                    series: [{
                        name: ' ',
                        data: $scope.deals_by_stagesY
                    }]
                });
                $scope.pipeline_report = data.data.pipeline_report.chart_data;
                if ($scope.pipeline_report == undefined) {
                    if ($scope.pipeline_report.length > 0) {
                        $scope.pipeline_reportY = [];
                    }
                } else {
                    $scope.pipeline_reportY = [];
                    for (var i = 0; i < $scope.pipeline_report.length; i++) {
                        $scope.pipeline_reportY.push({ name: $scope.pipeline_report[i].name, y: $scope.pipeline_report[i].y })
                    }
                }
                Highcharts.chart('container', {
                    chart: {
                        type: $scope.pipelineReport.pipeline_report.chart_type,
                        marginRight: 100
                    },
                    title: {
                        text: $scope.pipelineReport.pipeline_report.title,
                        align: 'left',
                        x: 60,
                        style: {
                            color: '#058AE5',
                            fontSize: '24px'
                        }
                    },
                    plotOptions: {
                        series: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },

                            showInLegend: true,
                            point: {
                                events: {
                                    legendItemClick: function () {
                                        return false; // <== returning false will cancel the default action
                                    }
                                }
                            },
                            pointWidth: 30
                        }

                    },


                    legend: {
                        enabled: true
                    },
                    tooltip: {
                        pointFormat: '<b>{point.percentage:.1f}%</b>',

                    },
                    series: [{
                        name: ' ',
                        data: $scope.pipeline_reportY
                    }]
                });


            })
                .catch(function () {
                    console.log('error');
                });
        }
        $scope.reports();
        // date and time picker

    }
})();

//modelInnsta ctrl
(function () {

    'use strict';

    angular.module('account').controller('ModalInstanceCtrl', ModalInstanceCtrl);

    function ModalInstanceCtrl($scope, $uibModalInstance, modelType) {

        console.log('mt : ', modelType);

        if ('fromdate' == modelType) {
            $scope.title = 'from date'
        } else {
            $scope.title = 'to date'
        }

        $scope.ok = function () {
            console.log(modelType);
            $uibModalInstance.close('open');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }

})();