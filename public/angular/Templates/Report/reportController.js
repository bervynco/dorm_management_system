 app.controller('ReportController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('report');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.disable = true;
    $scope.errorNotification = null;
    
    $scope.reportList = ['User', 'Utility', 'Tenant', 'Room', 'Payable', 'Logs', 'Inventory', 'Calendar', 'Branch'];
    $scope.reportList = [
        {
            'name': 'User',
            'alternative': 'user'
        },
        {
            'name': 'Utility',
            'alternative': 'utility'
        },
        {
            'name': 'Tenant',
            'alternative': 'tenant'
        },
        {
            'name': 'Room',
            'alternative': 'room'
        },
        {
            'name': 'Payables',
            'alternative': 'payable'
        },
        {
            'name': 'Logs',
            'alternative': 'log'
        },
        {
            'name': 'Inventory',
            'alternative': 'inventory'
        },
        {
            'name': 'Calendar',
            'alternative': 'calendar'
        },
        {
            'name': 'Branch',
            'alternative': 'branch'
        },
        {
            'name': 'Inventory Summary Count',
            'alternative': 'summary_inventory'
        }
    ]
    
    $scope.reportTypeList = ["All Dates", "Monthly", "Quarterly", "Yearly"];
    $scope.monthList = [1,2,3,4,5,6,7,8,9,10,11,12];
    $scope.yearList = [2018, 2019, 2020, 2021, 2022, 2023];
    $scope.quarterList = [1,2,3,4]; 

    $scope.ChangeMonth = function(month){
        $scope.selectedMonth = month;
    }
    
    $scope.ChangeQuarter = function(quarter) {
        $scope.selectedQuarter = quarter;
    }

    $scope.ChangeYear = function(year){
        $scope.selectedYear = year;
    }

    $scope.ChangeReport = function(type) {
        $scope.selectedReport = type;
    }

    $scope.ChangeReportType = function(type) {
        $scope.selectedReportType = type;
    }

    function initializeVariable() {
        $scope.reportParams = {
            'selected_report': '',
            'selected_report_type': '',
            'selected_month': '',
            'selected_quarter': '',
            'selected_year': '',
        }
    }

    $scope.GenerateReport = function() {
        $scope.reportParams.branch_id = $scope.branch.branch_id;
        console.log($scope.reportParams);
        DataFactory.GenerateReport($scope.reportParams).success(function(respose){
            if(response.status == 200){
                $window.location.href = response;
            }
            else {
                $scope.errorNotification = response.message;
            }
        }).error(function(error){

        });
    }
    initializeVariable();
});