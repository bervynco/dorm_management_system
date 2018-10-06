 app.controller('RoomController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('manage-room');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.roomTabs = ['Tenants', 'Inventory'];
    $scope.currentTab = 'Tenants';
    function getAllData(){
        DataFactory.GetRoomList($scope.branch.branch_id).success(function(response){
            console.log(response);
            $scope.rows = response.data;
        }).error(function(error){

        });
    }

    function initializeVariables() {
        $scope.room = {
            room_number: '',
            floor_number: '',
            capacity_count: '',
            branch_id: '',
        }
    }
    
    $scope.ChangeRoomTab = function(tab) {
        $scope.currentTab = tab;
    }
    $scope.addRoom = function() {
        $scope.room.branch_id = $scope.branch.branch_id;
        DataFactory.AddRoom($scope.room).success(function(success){

        }).error(function(error){

        });
    }
    $scope.addNewRoom = function(){
        $scope.showSideNav = true;
    }

    $scope.showCompleteRoomDetails = function(room){
        $scope.showCompleteDetailsFlag = true;
        DataFactory.GetTenantPerRoom(room).success(function(response){
            if(response.status == 200)
                $scope.tenantRows = response.data;
        }).error(function(error){

        });

        DataFactory.GetInventoryPerRoom(room).success(function(response){
            if(response.status == 200)
                $scope.inventoryRows = response.data;
        }).error(function(error){

        });
    }
    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
        initializeVariables();
    }

    getAllData();
    initializeVariables();
});