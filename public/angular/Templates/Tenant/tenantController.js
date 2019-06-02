 app.controller('TenantController', function ($scope, $rootScope, $interval, AppService, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('tenant');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.assignTenantToRoomFlag = false;
    $scope.errorNotification = null;
    $scope.addPaymentFlag = false;
    $scope.displayFlag = false;
    $scope.tenantTab = ['Details', 'Inventory', 'Payment History', 'Services'];
    $scope.currentTab = $scope.tenantTab[0];
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    var requestId;
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    $scope.approval = {
        approval_section: 'tenant',
        approval_mode: '',
        approval_data: '',
        request_id: '',
        user_id: $scope.userDetails.user_id,
        status: 'active',
        branch_id: $scope.branch.branch_id
    }

    function getRequestID() {
        requestId = AppService.getRequestId();
    }

    function getTenantPerRoomPerBranch(){
        DataFactory.GetCountTenantPerRoomPerBranch($scope.branch.branch_id).success(function(response){
            console.log(response);
            $scope.displayFlag = true;
            $scope.roomSummary = response.data;
        }).error(function(error){

        });
    }

    function filterData() {
        var data = [];
        data = _.filter($scope.serviceData, function(o) { 
            return tab == o.recurrence; 
        });

        return data;
    }

    function getAllData(){
        DataFactory.GetTenantList($scope.branch.branch_id).success(function(response){
            console.log(response);
            $scope.tenantData = response.data;
            $scope.rows = $scope.tenantData;
            $scope.selectedTenant = $scope.rows[0];
        }).error(function(error){

        });
        DataFactory.GetRoomList($scope.branch.branch_id).success(function(response){
            $scope.roomList = response.data;
            $scope.selectedRoom = $scope.roomList[0];
            filterData();
        }).error(function(error){

        });
    }

    $scope.log = {
        user_id: $scope.userDetails.user_id,
        page_name: "Tenant",
        page_action: "View",
        branch_id: $scope.branch.branch_id
    }
    DataFactory.AddPageLog($scope.log).success(function(response){
    }).error(function(error){

    });

    function getModalData(branchID, tenantID){
        var params = {'branch_id': branchID, 'tenant_id': tenantID};
        DataFactory.GetInventoryPerTenant(branchID, tenantID).success(function(response){
            if(response.status == 200){
                $scope.inventoryPerTenant = response.data;
                console.log(response.data);
            }
            
        }).error(function(error){

        });
        DataFactory.GetServicePerTenant(params).success(function(response){
            if(response.status == 200){
                $scope.servicePerTenant = response.data;
                console.log(response.data);
            }
            
        }).error(function(error){

        });

        DataFactory.GetPaymentDetailsPerTenant(params).success(function(response){
            if(response.status == 200){
                $scope.inventoryPerTenant = response.data;
                console.log(response.data);
            }
            
        }).error(function(error){

        });
    }
    function initializeVariables () {
        $scope.tenant = {
            tenant_name: '',
            branch_id: '',
            birthday: '',
            contact_number: '',
            emergency_name: '',
            emergency_number: '',
            address: '',
            start_contract: '',
            end_contract: '',
        }
        $scope.tenantPayment = {
            'tenant_id': '',
            'mode':''
        }
        $scope.paymentDetails = [
            {
                'cheque_number': '',
                'cheque_bank': '',
                'cheque_date': '',
                'amount': ''
            }
        ]
    }
    
    
    // Add Payment Functions
    $scope.addPayment = function(){
        $scope.addPaymentFlag = true;
        $scope.paymentMethod = ['Cash', 'Cheque'];
        getAllData();
    }

    $scope.ChangeTenant = function(selectedTenant) {
        $scope.tenant = selectedTenant;
    }

    $scope.ChangeRoom = function(room){
        $scope.selectedRoom = room;
    }
    $scope.ChangePaymentMethod = function(selectedPaymentMethod) {
        $scope.selectedPaymentMethod = selectedPaymentMethod;
    }
    $scope.AddNewPaymentDetail = function(){
        $scope.paymentDetails.push({
            'cheque_number': '',
            'cheque_bank': '',
            'cheque_date': '',
            'amount': ''
        })
    }

    $scope.addNewPaymentDetails = function() {
        $scope.tenantPayment.tenant_id = $scope.tenant.tenant_id;
        $scope.tenantPayment.mode = $scope.selectedPaymentMethod;
        $scope.tenantPayment.paymentDetails = $scope.paymentDetails;

        DataFactory.AddNewPayment($scope.tenantPayment).success(function(response){
            if(response.status == 200){
                getAllData();
                $scope.CloseSidebar();
            }
            else {
                $scope.errorNotification = response.message;
            }
        }).error(function(error){

        });
    }
    // End of Add Payment Functions
    $scope.addNewTenant = function(){
        $scope.showSideNav = true;
        getTenantPerRoomPerBranch();
    }

    $scope.addTenant = function(ev){
        $scope.tenant.branch_id = $scope.branch.branch_id;
        
        DataFactory.AddNewTenant($scope.tenant).success(function(response){
            if(response.status == 200){
                $scope.log.page_action = "Add New Tenant";
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
    }

    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
        $scope.assignTenantToRoomFlag = false;
        $scope.addPaymentFlag = false;
        $scope.rows = $scope.tenantData;
        $scope.currentTab = $scope.tenantTab[0];
        initializeVariables();
        $scope.errorNotification = null;
    }

    $scope.showCompleteDetails = function(row){
        $scope.showCompleteDetailsFlag = true;
        $scope.tenant = row;
        getModalData($scope.branch.branch_id, $scope.tenant.tenant_id);
    }

    $scope.ChangeTenantTab = function(tab){
        $scope.currentTab = tab;
        if(tab == 'Inventory'){
            $scope.rows = $scope.inventoryPerTenant;
        }
        else if(tab == 'Payment History'){

        }
        else if(tab == 'Services'){
            $scope.rows = $scope.servicePerTenant;
        }
        else {
            $scope.rows = $scope.tenantData;
        }
    }

    $scope.assignToRoom = function() {
        $scope.assignTenantToRoomFlag = true;
    }

    $scope.assignTenantToRoom = function() {
        $scope.data = {'room_id': 0, 'tenant_id': 0, 'branch_id': 0};
        $scope.data.room_id = $scope.selectedRoom.room_id;
        $scope.data.tenant_id = $scope.selectedTenant.tenant_id;
        $scope.data.branch_id = $scope.selectedTenant.branch_id;

        DataFactory.AssignTenantToRoom($scope.data).success(function(response){
            if(response.status = 200){
                getAllData();
                $scope.CloseSidebar();
            }
        }).error(function(error){

        });
    }
    getAllData();
    initializeVariables();
});