 app.controller('RoomController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('manage-room');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.roomTabs = ['Room Details', 'Tenants', 'Inventory'];
    var requestId;
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    
    $scope.approval = {
        approval_section: 'room',
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
            room_rate: '',
            branch_id: '',
        }
    }
    
    $scope.ChangeRoomTab = function(tab) {
        $scope.currentTab = tab;
    }
    $scope.addRoom = function() {
        $scope.room.branch_id = $scope.branch.branch_id;
        if($scope.branch.role == "Staff"){
            $scope.approval.approval_mode = "Add";
            $scope.approval.request_id = requestId;
            $scope.approval.approval_data = $scope.room;
            DataFactory.AddApprovalRequest($scope.approval).success(function(response){
                if(response.status == 200){
                    $scope.CloseSidebar();
                }
            }).error(function(error){

            });
        }
        else {
            DataFactory.AddRoom($scope.room).success(function(response){
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
    $scope.addNewRoom = function(){
        $scope.showSideNav = true;
    }

    $scope.showCompleteRoomDetails = function(room){
        $scope.currentTab = $scope.roomTabs[0];
        $scope.showCompleteDetailsFlag = true;
        DataFactory.GetTenantPerRoom(room).success(function(response){
            console.log(response);
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