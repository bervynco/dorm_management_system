 app.controller('TenantController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('tenant');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.rows = [
        {
            'tenant_name': "Juan dela Cruz",
            'start_date': "01/10/2018",
            'end_date': "01/01/2019",
            "items": null,
            "rent": 2500,
            "electricity_bill": 2500,
            "water_bill": 500,
            "laundry_bill": 100
        },
        {
            'tenant_name': "Jose Reyes",
            'start_date': "01/10/2018",
            'end_date': "01/01/2019",
            "items": null,
            "rent": 2500,
            "electricity_bill": 1000,
            "water_bill": 500,
            "laundry_bill": 0,
        },
        {
            'tenant_name': "Jimmy Lacson",
            'start_date': "01/10/2018",
            'end_date': "01/01/2019",
            "items": null,
            "rent": 2500,
            "electricity_bill": 2500,
            "water_bill": 1500,
            "laundry_bill": 100
        }
    ];

    $scope.addNewTenant = function(){
        $scope.showSideNav = true;
    }

    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
    }

    $scope.showCompleteDetails = function(){
        $scope.showCompleteDetailsFlag = true;
    }
});