 app.controller('InventoryController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('inventory');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.disable = true;
    
    function initializeVariables() {
        $scope.inventory = {
            'item_name': '',
            'description': '',
            'branch_id':'',
            'room_id': ''
        }

        
    }

    function getAllData(){
        DataFactory.GetInventoryList($scope.branch.branch_id).success(function(response){
            console.log(response);
            $scope.rows = response.data;
        }).error(function(error){

        });

        DataFactory.GetRoomList($scope.branch.branch_id).success(function(response){
            console.log(response);
            $scope.roomList = response.data;
            $scope.selectedRoom = $scope.roomList[0];
        }).error(function(error){

        });
    }

    $scope.addNewInventory = function(){
        $scope.showSideNav = true;
    }

    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
        $scope.disable = true;
        initializeVariables();
    }

    $scope.showCompleteDetails = function(item){
        LoadDropdown(item);
        $scope.showCompleteDetailsFlag = true;
        $scope.inventory = item;
    }

    function LoadDropdown(item) {
        var roomIndex = 0;
        var roomIndex = _.findIndex($scope.roomList, function(o){
            return o.room_number == item.room_number;
        });
        $scope.selectedRoom = $scope.roomList[roomIndex];
    }

    $scope.ChangeInventoryRoom = function(selectedRoom){
        $scope.selectedRoom = selectedRoom;
    }

    $scope.addNewItem = function() {
        $scope.inventory.branch_id = $scope.branch.branch_id;
        $scope.inventory.room_id = $scope.selectedRoom.room_id;

        DataFactory.AddNewInventory($scope.inventory).success(function(response){
            if(response.status == 200){
                console.log(response);
                $scope.rows.push(response.data);
            }
            else {
                console.log(response.message);
            }
        }).error(function(error){

        });
    }

    $scope.editInventory = function(){
        if($scope.disable == false){
            $scope.inventory.branch_id = $scope.branch.branch_id;
            $scope.inventory.room_id = $scope.selectedRoom.room_id;
            DataFactory.EditInventory($scope.inventory).success(function(response){

            }).error(function(error){

            });
            $scope.CloseSidebar();
        }
        else {
            $scope.disable = !$scope.disable;
        }
        
    }
    getAllData();
    initializeVariables();
});