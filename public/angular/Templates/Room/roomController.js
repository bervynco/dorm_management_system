 app.controller('RoomController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('manage-room');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.rows = [
        {
            'room_number': 100,
            'floor_number': 1,
            'capacity_count': 10,
            'tenant_count': 10
        },
        {
            'room_number': 101,
            'floor_number': 1,
            'capacity_count': 5,
            'tenant_count': 4
        },
        {
            'room_number': 102,
            'floor_number': 1,
            'capacity_count': 3,
            'tenant_count': 1
        },
        {
            'room_number': 103,
            'floor_number': 1,
            'capacity_count': 4,
            'tenant_count': 2
        },
    ];
    $scope.modalRows = [
        {
            'tenant_name': "Juan dela Cruz",
            'start_date': "01/10/2018",
            'end_date': "01/01/2019",
            "items": ['Fan,', 'Light Bulb'],
            "rent": 2500,
            "electricity_bill": 2500,
            "water_bill": 500,
            "laundry_bill": 100
        },
        {
            'tenant_name': "Jose Reyes",
            'start_date': "01/10/2018",
            'end_date': "01/01/2019",
            "items": ['Fan,', 'Light Bulb'],
            "rent": 2500,
            "electricity_bill": 1000,
            "water_bill": 500,
            "laundry_bill": 0,
        },
        {
            'tenant_name': "Jimmy Lacson",
            'start_date': "01/10/2018",
            'end_date': "01/01/2019",
            "items": ['Fan,', 'Light Bulb'],
            "rent": 2500,
            "electricity_bill": 2500,
            "water_bill": 1500,
            "laundry_bill": 100
        }
    ];
    $scope.addNewRoom = function(){
        $scope.showSideNav = true;
    }

    $scope.showCompleteRoomDetails = function(){
        $scope.showCompleteDetailsFlag = true;
    }
    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
    }
});