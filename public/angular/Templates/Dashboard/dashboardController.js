 app.controller('DashboardController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('home');
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    var requestId;
    $scope.viewTab = ['Tenant', 'Payables', 'Service Payment Approval', 'Billing Payment Approval'];
    $scope.action = "";
    $scope.currentTab = $scope.viewTab[0];
    $scope.errorNotification = null;
    $scope.showBillingApprovalFlag = false;
    $scope.showServiceApprovalFlag = false;

    function getRequestID() {
        requestId = AppService.getRequestId();
    }

    function initializeVariables() {
        $scope.payables = {
            'name': '',
            'description': '',
            'payable_date':'',
            'amount': 0,
            'branch_id': ''
        }

        
    }

    $scope.log = {
        user_id: $scope.userDetails.user_id,
        page_name: "Dashboard",
        page_action: "View",
        branch_id: $scope.branch.branch_id
    }
    DataFactory.AddPageLog($scope.log).success(function(response){
    }).error(function(error){

    });

    function getAllData(){
        DataFactory.GetTenantList($scope.branch.branch_id).success(function(response){
            $scope.tenantData = response.data;
            $scope.rows = $scope.tenantData;
        }).error(function(error){

        });
        DataFactory.GetPayableDues($scope.branch.branch_id).success(function(response){
            $scope.payableData = response.data;
        }).error(function(error){

        });

        DataFactory.GetPaymentForApprovalBilling($scope.branch.branch_id).success(function(response){
            $scope.billingPaymentApprovalData = response.data;
        }).error(function(error){

        });

        DataFactory.GetPaymentForApprovalService($scope.branch.branch_id).success(function(response){
            $scope.servicePaymentApprovalData = response.data;
        }).error(function(error){

        });
        // DataFactory.GetAggregatedRoomList($scope.branch.branch_id).success(function(response){

        // }).error(function(error){

        // });

        // DataFactory.GetRequestApprovalData($scope.branch.branch_id).success(function(response){

        // }).error(function(error){

        // });
    }

    $scope.ChangeViewTab = function(tab){
        $scope.currentTab = tab;
        if(tab == 'Payables'){
            $scope.rows = $scope.payableData;
        }
        else if(tab == 'Tenant'){
            $scope.rows = $scope.tenantData;
        }
        else if(tab == 'Billing'){
            $scope.rows = [];
        }
        else if(tab == 'Request'){
            $scope.rows = $scope.requestData;
        }
        else if(tab == 'Service Payment Approval'){
            $scope.rows = $scope.servicePaymentApprovalData;
        }
        else if(tab == 'Billing Payment Approval'){
            $scope.rows = $scope.billingPaymentApprovalData;
        }
    }

    $scope.approve = function(action){
        $scope.action = action;
        $scope.message = "Are you sure?"
    }
    $scope.reject = function(action){
        $scope.action = action;
    }
    $scope.cancel = function(){
        $scope.action = "";
        $scope.message = "Are you sure?"
    }

    $scope.approvePayment = function(row){
        var data = {};
        data.status = "encashed";
        if($scope.currentTab == "Service Payment Approval"){
            data.service_payment_id = row.service_payment_id;
            data.page = "Service";
        }
        else{
            data.billing_data_id = row.billing_data_id;
            data.page = "Billing";
        }

        DataFactory.MakePaymentApprovalChanges(data).success(function(response){
            if(response.status == 200){
                $scope.currentTab = $scope.viewTab[0];
                getAllData();
            }
            else{
                $scope.errorNotification = response.message;
            }
        }).error(function(error){

        });
    }

    $scope.rejectPayment = function(row){
        var data = {};
        data.status = "active";
        if($scope.currentTab == "Service Payment Approval"){
            data.service_payment_id = row.service_payment_id;
            data.page = "Service";
        }
        else{
            data.billing_data_id = row.billing_data_id;
            data.page = "Billing";
        }

        DataFactory.MakePaymentApprovalChanges(data).success(function(response){
            if(response.status == 200){
                $scope.currentTab = $scope.viewTab[0];
                getAllData();
            }
            else{
                $scope.errorNotification = response.message;
            }
        }).error(function(error){

        });
    }
    getAllData();
});