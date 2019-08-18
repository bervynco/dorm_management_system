 app.controller('UploadPaymentController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('uploadpayment');
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.selectedTenant = null;
    $scope.disable = true;
    var requestId;
   
    $scope.errorNotification = null;
    
    function getRequestID() {
        requestId = AppService.getRequestId();
    }

    function getAllData(){
        DataFactory.GetChequePayment($scope.branch.branch_id).success(function(response){
            $scope.rows = response.data;
        }).error(function(error){

        });
         DataFactory.GetTenantList($scope.branch.branch_id).success(function(response){
            $scope.tenantList = response.data;
            if($scope.tenantList.length > 0){
                $scope.selectedTenant = $scope.tenantList[0];
            }
            
        }).error(function(error){

        });
    }

    function initializeVariables() {
        $scope.paymentDetails = [
            {
                'tenant_id': 0,
                'cheque_number': '',
                'cheque_bank': '',
                'cheque_date': '',
                'cheque_amount': '',
                'branch_id': $scope.branch.branch_id,
                'status': ''
            }
        ]
    }
    
    $scope.log = {
        user_id: $scope.userDetails.user_id,
        page_name: "Upload Payment",
        page_action: "View",
        branch_id: $scope.branch.branch_id
    }
    DataFactory.AddPageLog($scope.log).success(function(response){
    }).error(function(error){

    });

    $scope.addPayable = function(){
        $scope.showSideNav = true;
    }

    $scope.ChangeTenant = function(selectedTenant) {
        $scope.selectedTenant = selectedTenant;
        initializeVariables();
    }

    $scope.CloseSidebar = function() {
        $scope.showSideNavAddPaymentFlag = false;
        $scope.showCompleteDetailsFlag = false;
        $scope.disable = true;
        initializeVariables();
        $scope.errorNotification = null;
    }

    $scope.showCompleteDetails = function(payment) {

        $scope.showCompleteDetailsFlag = true;
        $scope.payment = angular.copy(payment);
        $scope.payment.cheque_date = new Date(payment.cheque_date);
        $scope.currentTenant = $scope.payment.tenant_id;
        $scope.selectedTenant = _.filter($scope.tenantList, function(o) { 
            return o.tenant_id == $scope.payment.tenant_id; 
        })[0];
    }
    $scope.addPayment = function(){
        $scope.showSideNavAddPaymentFlag = true;
    }

    $scope.AddNewPaymentDetail = function(){
        if($scope.paymentDetails.length == 1){
            $scope.paymentDetails[0].tenant_id = $scope.selectedTenant.tenant_id;
            if($scope.branch.role == "Administrator"){
                $scope.paymentDetails[0].status = "active";
            }
            else{
                $scope.paymentDetails[0].status = "upload approval";
            }
        }
        
        $scope.paymentDetails.push({
            'tenant_id': $scope.selectedTenant.tenant_id,
            'cheque_number': '',
            'cheque_bank': $scope.paymentDetails[$scope.paymentDetails.length - 1].cheque_bank,
            'cheque_date': '',
            'cheque_amount': $scope.paymentDetails[$scope.paymentDetails.length - 1].cheque_amount,
            'branch_id': $scope.branch.branch_id,
            'status': $scope.paymentDetails[$scope.paymentDetails.length - 1].status
        })
    }

    $scope.removePayment = function(idx){
        if($scope.paymentDetails.length > 1)
            $scope.paymentDetails.splice(idx,1);
    }
    $scope.uploadCheques = function() {
        DataFactory.UploadCheques($scope.paymentDetails).success(function(response){
            if(response.status == 200){
                $scope.log.page_action = "Upload Cheques";
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

    $scope.editPayment = function(){
        if($scope.disable == false){
            $scope.payables.branch_id = $scope.branch.branch_id;
            DataFactory.EditPayable($scope.payables).success(function(response){
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
        else {
            $scope.disable = !$scope.disable;
        }
        
    }
    $scope.deletePayment = function(item){
        DataFactory.DeletePayment(item).success(function(response){
            if(response.status == 200){
                getAllData();
                $scope.CloseSidebar();
            }
            else{
                $scope.errorNotification = response.message;
            }
        }).error(function(error){

        });
    }
    getAllData();
    initializeVariables();
});