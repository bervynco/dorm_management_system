 app.controller('InventoryController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('inventory');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.disable = true;
    var requestId;
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    
    $scope.approval = {
        approval_section: 'inventory',
        approval_mode: '',
        approval_data: '',
        request_id: '',
        user_id: $scope.userDetails.user_id,
        status: 'active',
        branch_id: $scope.branch.branch_id
    }
    $scope.user = {
        name: '',
        username: '',
        password: '',
        mobile_number: '',
        request_id: '',
        branch_id: $scope.branch.branch_id
    }
    
    function getRequestID() {
        requestId = AppService.getRequestId();
    }

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
        if($scope.branch.role == "Staff"){
            $scope.approval.approval_mode = "Add";
            $scope.approval.request_id = requestId;
            $scope.approval.approval_data = $scope.inventory;
            DataFactory.AddApprovalRequest($scope.approval).success(function(response){
                if(response.status == 200){
                    $scope.CloseSidebar();
                }
            }).error(function(error){

            });
        }
        else {
            DataFactory.AddNewInventory($scope.inventory).success(function(response){
                if(response.status == 200){
                    getAllData();
                    $scope.CloseSidebar();
                }
                else {
                    console.log(response.message);
                }
            }).error(function(error){

            });
        }
    }

    $scope.editInventory = function(){
        if($scope.disable == false){
            $scope.inventory.branch_id = $scope.branch.branch_id;
            $scope.inventory.room_id = $scope.selectedRoom.room_id;
            DataFactory.EditInventory($scope.inventory).success(function(response){
                if(response.status == 200){
                    getAllData();
                    $scope.CloseSidebar();
                }
            }).error(function(error){

            });
        }
        else {
            $scope.disable = !$scope.disable;
        }
        
    }

    $scope.deleteInventory = function(item){
        DataFactory.DeleteInventory(item).success(function(response){
            if(response.status == 200){
                getAllData();
                $scope.CloseSidebar();
            }
            else{

            }
        }).error(function(error){

        });
    }
    getAllData();
    initializeVariables();
});