 app.controller('TenantController', function ($scope, $rootScope, $interval, AppService, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('tenant');
    $scope.disable = true;
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.assignTenantToRoomFlag = false;
    $scope.errorNotification = null;
    $scope.addPaymentFlag = false;
    $scope.displayFlag = false;
    $scope.tenantTab = ['Details', 'Inventory', 'Services', 'Cheque List'];
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
            if($scope.rows.length > 0){
                $scope.selectedTenant = $scope.rows[0];
            }
            
        }).error(function(error){

        });
        DataFactory.GetRoomList($scope.branch.branch_id).success(function(response){
            $scope.roomList = response.data;
            if($scope.roomList.length > 0){
                $scope.selectedRoom = $scope.roomList[0];
            }
            filterData();
        }).error(function(error){

        });
        DataFactory.GetPaymentTypes().success(function(response){
            $scope.paymentList = response;
            $scope.currentPayment = response[0];
                
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

        // Get Inventory Per Tenant
        DataFactory.GetInventoryPerTenant(branchID, tenantID).success(function(response){
            if(response.status == 200){
                $scope.inventoryPerTenant = response.data;
                console.log(response.data);
            }
            
        }).error(function(error){

        });

        // Get Service Per Tenant
        DataFactory.GetServicePerTenant(params).success(function(response){
            if(response.status == 200){
                $scope.servicePerTenant = response.data;
                console.log(response.data);
            }
            
        }).error(function(error){

        });

        // Get Payment History per Tenant
        DataFactory.GetPaymentHistoryPerTenant(tenantID).success(function(response){
            if(response.status == 200){
                $scope.paymentPerTenant = response.data;
            }
        }).error(function(error){

        });

        
        // Get Cheque List


        // DataFactory.GetPaymentDetailsPerTenant(params).success(function(response){
        //     if(response.status == 200){
        //         $scope.inventoryPerTenant = response.data;
        //         console.log(response.data);
        //     }
            
        // }).error(function(error){

        // });
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
            end_contract: ''
        }
        $scope.tenantPayment = {
            'tenant_id': '',
            'mode':''
        }
        $scope.paymentDetails = {
            'payment_id': '',
            'payment_type': '',
            'cheque_number': '',
            'cheque_bank': '',
            'cheque_date': '',
            'amount': '',
            'status': ''
        }
        
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

    // $scope.ChangePaymentMethod = function(selectedPaymentMethod) {
    //     $scope.selectedPaymentMethod = selectedPaymentMethod;
    // }

    $scope.ChangePayment = function(payment){
        $scope.currentPayment = payment;
    }

    // $scope.AddNewPaymentDetail = function(){
    //     $scope.paymentDetails.push({
    //         'cheque_number': '',
    //         'cheque_bank': '',
    //         'cheque_date': '',
    //         'amount': ''
    //     })
    // }

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

    // function changeTimeZone(datetime) {
    //     return new Date(datetime.toLocaleString("en-US", {timeZone: "Asia/Singapore"}));
    // }
    $scope.addTenant = function(ev){
        $scope.tenant.branch_id = $scope.branch.branch_id;
        $scope.paymentDetails.payment_type = $scope.currentPayment.payment_name;
        $scope.tenant.payment = $scope.paymentDetails;
        $scope.tenant.payment.payment_id = $scope.currentPayment.payment_id;
        
        if($scope.branch.role == 'Administrator'){
            $scope.tenant.payment.status = 'active';
        }
        else {
            $scope.tenant.payment.status = 'upload approval';
        }
        // console.log("Before: ", $scope.tenant);
        // $scope.tenant.birthday = changeTimeZone($scope.tenant.birthday);
        // $scope.tenant.start_contract = changeTimeZone($scope.tenant.start_contract);
        // $scope.tenant.end_contract = changeTimeZone($scope.tenant.end_contract);
        console.log("After: ", $scope.tenant);
        DataFactory.AddNewTenant($scope.tenant).success(function(response){
            if(response.status == 200){
                $scope.log.page_action = "Add New Tenant";
                DataFactory.AddPageLog($scope.log).success(function(response){
                }).error(function(error){

                });
                $scope.CloseSidebar();
                getAllData();
                
            }
            else {
                $scope.errorNotification = response.message;
            }
        }).error(function(error){

        });
    }

    $scope.editTenant = function(){
        if($scope.disable == false){
            $scope.tenant.start_contract = moment($scope.tenant.start_contract).format("YYYY-MM-DD HH:mm");
            $scope.tenant.end_contract = moment($scope.tenant.end_contract).format("YYYY-MM-DD HH:mm");
            // $scope.payables.branch_id = $scope.branch.branch_id;
            DataFactory.EditTenant($scope.tenant).success(function(response){
                if(response.status == 200){
                    $scope.log.page_action = "Edit Tenant";
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
        else {
            $scope.disable = !$scope.disable;
        }
        
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
        $state.go('tenant.detail', {tenantId: CryptoJS.AES.encrypt(row.tenant_id, "Secret Passphrase Dorm Management System")}); 
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
        $scope.data.tenant_id = $scope.tenant.tenant_id;
        $scope.data.branch_id = $scope.tenant.branch_id;

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