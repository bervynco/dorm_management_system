 app.controller('RoomController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('manage-room');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.showSideNavPayWhole = false;
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.roomTabs = ['Room Details', 'Tenants', 'Inventory'];
    $scope.paymentType = ['Per Tenant', 'Whole'];
    $scope.selectedPaymentType = $scope.paymentType[0];
    var requestId;
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    $scope.errorNotification = null;
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

    $scope.payment_duration = {
        month: 0,
        year: 0
    }
    
    $scope.selectedTenant = {};
    function getRequestID() {
        requestId = AppService.getRequestId();
    }

    function getAllData(){
        DataFactory.GetRoomList($scope.branch.branch_id).success(function(response){
            console.log(response);
            $scope.rows = response.data;
        }).error(function(error){

        });

        DataFactory.GetRoomList($scope.branch.branch_id).success(function(response){
            $scope.roomList = response.data;
            if($scope.roomList.length > 0){
                $scope.selectedRoom = $scope.roomList[0];
            }
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
    
    function getPaymentTypes() {
        DataFactory.GetPaymentTypes().success(function(response){
            $scope.paymentList = response;
            $scope.currentPayment = response[0];
                
        }).error(function(error){

        });
    }

    function getTenantChequesPerRoom(roomId) {
        DataFactory.GetTenantChequesPerRoom(roomId).success(function(response){
            if(response.status == 200){
                console.log(response.data);
                $scope.tenantCheques = response.data;
            }
               
        }).error(function(error){

        });
    }
    $scope.log = {
        user_id: $scope.userDetails.user_id,
        page_name: "Room",
        page_action: "View",
        branch_id: $scope.branch.branch_id
    }
    DataFactory.AddPageLog($scope.log).success(function(response){
    }).error(function(error){

    });

    $scope.ChangeRoomTab = function(tab) {
        $scope.currentTab = tab;
    }

    $scope.ChangePayment = function(payment, key, index){
        $scope.tenantCheques[key].selected_payment = payment;

        console.log("Payment: ", $scope.tenantCheques[key]);
    }
    $scope.ChangePaymentWhole = function(payment, $index) {
        // console.log($scope.payment);
        // $scope.selectedTenant.selected_payment = payment;
        console.log($scope.selectedTenant);
    }
    $scope.ChangeCheque = function(cheque, key, index){
        console.log(key);
        console.log($scope.tenantCheques[key]);
        $scope.tenantCheques[key].selected_cheque = cheque;
        console.log("Cheque: ", $scope.tenantCheques[key]);
    }
    $scope.ChangeChequeWhole = function(cheque, $index) {
        // console.log($scope.cheque);
        $scope.selectedTenant.selected_cheque = cheque;
        console.log($scope.selectedTenant);
    }
    $scope.ChangePaymentType = function(type) {
        $scope.selectedPaymentType = type;
    }

    $scope.ChangeTenantWholePayment = function(selectedTenant){
        $scope.selectedTenant = selectedTenant;
        
    }

    $scope.payRent = function() {
        
        var object = {
            status: "",
            month: $scope.payment_duration.month,
            year: $scope.payment_duration.year,
            data : null
        }

        if($scope.branch.role !== "Administrator"){
            object.status = "active";
        }
        else{
            object.status = "approval";
        }

        if($scope.selectedPaymentType == 'Whole'){
            object.data = $scope.selectedTenant;

            DataFactory.PayRentPerRoom(object).success(function*(response){

            }).error(function(error){

            });

            
        }
        else {
            object.data = $scope.tenantCheques;
            
            DataFactory.PayRentPerTenant(object).success(function*(response){

            }).error(function(error){

            });
        }
    }
    $scope.addRoom = function() {
        $scope.room.branch_id = $scope.branch.branch_id;
        // if($scope.branch.role == "Staff"){
        //     $scope.approval.approval_mode = "add";
        //     $scope.approval.request_id = requestId;
        //     $scope.approval.approval_data = $scope.room;
        //     DataFactory.AddApprovalRequest($scope.approval).success(function(response){
        //         if(response.status == 200){
        //             $scope.CloseSidebar();
        //         }
        //         else{
        //             $scope.errorNotification = response.message;
        //         }
        //     }).error(function(error){

        //     });
        // }
        // else {
        DataFactory.AddRoom($scope.room).success(function(response){
            if(response.status == 200){
                $scope.log.page_action = "Add Room";
                DataFactory.AddPageLog($scope.log).success(function(response){
                }).error(function(error){

                });
                getAllData();
                $scope.CloseSidebar();
            }
            else {
                $scope.errorNotification = response.message;
            }
        }).error(function(error){

        });
        //}
    }
    $scope.addNewRoom = function(){
        $scope.showSideNav = true;
    }

    $scope.payRentWhole = function(){
        $scope.showSideNavPayWhole = true;
        getTenantChequesPerRoom($scope.selectedRoom.room_id);
    }

    $scope.ChangeRoom = function(room) {
        $scope.selectedRoom = room;
        console.log($scope.selectedRoom);
        // DataFactory.GetTenantPerRoom($scope.selectedRoom).success(function(response){
        //     console.log(response);
        //     if(response.status == 200)
        //         $scope.tenantRows = response.data;
        // }).error(function(error){

        // });
        getTenantChequesPerRoom($scope.selectedRoom.room_id);
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
        $scope.errorNotification = null;
        $scope.showSideNavPayWhole = false;
    }
    
    getAllData();
    initializeVariables();
});