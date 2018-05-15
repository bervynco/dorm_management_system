 app.controller('InventoryController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('inventory');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.rows = [
        {
            'item_number': 1,
            'item_name': 'Lamp',
            'description': 'Lamp Shade',
            'status': 'Working',
            'location': 'Room 101'
        },
        {
            'item_number': 2,
            'item_name': 'Fan',
            'description': 'Electric Fan',
            'status': 'Working',
            'location': 'Room 101'
        },
        {
            'item_number': 3,
            'item_name': 'Pillow',
            'description': 'Feather Pillow',
            'status': 'Working',
            'location': 'Room 101'
        }
    ];

    $scope.addNewInventory = function(){
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