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
        DataFactory.GetChequePayment().success(function(response){
            $scope.rows = response.data;
            console.log($scope.rows);
        }).error(function(error){

        });
         DataFactory.GetTenantList($scope.branch.branch_id).success(function(response){
            $scope.tenantList = response.data;
            $scope.selectedTenant = $scope.tenantList[0];
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
                'branch_id': $scope.branch.branch_id
            }
        ]
    }
    
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

    $scope.addPayment = function(){
        $scope.showSideNavAddPaymentFlag = true;
    }

    $scope.AddNewPaymentDetail = function(){
        if($scope.paymentDetails.length == 1){
            $scope.paymentDetails[0].tenant_id = $scope.selectedTenant.tenant_id;
        }
        
        $scope.paymentDetails.push({
            'tenant_id': $scope.selectedTenant.tenant_id,
            'cheque_number': '',
            'cheque_bank': $scope.paymentDetails[$scope.paymentDetails.length - 1].cheque_bank,
            'cheque_date': '',
            'cheque_amount': $scope.paymentDetails[$scope.paymentDetails.length - 1].cheque_amount,
            'branch_id': $scope.branch.branch_id
        })
        console.log($scope.paymentDetails);
    }

    $scope.uploadCheques = function() {
        DataFactory.UploadCheques($scope.paymentDetails).success(function(response){
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

    $scope.addNewPayment = function() {
        // $scope.payables.branch_id = $scope.branch.branch_id;
        // if($scope.branch.role == "Staff"){
        //     $scope.approval.approval_mode = "add";
        //     $scope.approval.request_id = requestId;
        //     $scope.approval.approval_data = $scope.payables;
        //     DataFactory.AddApprovalRequest($scope.approval).success(function(response){
        //         if(response.status == 200){
        //             $scope.CloseSidebar();
        //         }
        //     }).error(function(error){

        //     });
        // }
        // else {
        //     DataFactory.AddNewPayable($scope.payables).success(function(response){
        //         if(response.status == 200){
        //             getAllData();
        //             $scope.CloseSidebar();
        //         }
        //         else {
        //             $scope.errorNotification = response.message;
        //         }
        //     }).error(function(error){

        //     });
        // }
        DataFactory.AddNewPayable($scope.payables).success(function(response){
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
        DataFactory.DeletePayable(item).success(function(response){
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