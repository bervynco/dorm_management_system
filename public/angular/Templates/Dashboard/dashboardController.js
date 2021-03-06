 app.controller('DashboardController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('home');
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    var requestId;
    $scope.viewTab = ['Tenant', 'Payables', 'Service Payment Approval', 'Billing Payment Approval', 'Cheque Upload Approval', 'Rent Payment Approval'];
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

        if($scope.branch.role == 'Administrator'){
            DataFactory.GetPaymentForApprovalBilling($scope.branch.branch_id).success(function(response){
                $scope.billingPaymentApprovalData = response.data;
            }).error(function(error){

            });

            DataFactory.GetPaymentForApprovalService($scope.branch.branch_id).success(function(response){
                $scope.servicePaymentApprovalData = response.data;
            }).error(function(error){

            });

            DataFactory.GetChequesForApproval($scope.branch.branch_id).success(function(response){
                $scope.chequeUploadApproval = response.data;
            }).error(function(error){

            });

            DataFactory.GetRentForApproval($scope.branch.branch_id).success(function(response){
                $scope.rentPaymentApproval = response.data;
                console.log(response.data);
            }).error(function(error){

            });
        }
        else{
            $scope.viewTab.splice(2);
        }
        
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
        else if(tab == 'Cheque Upload Approval'){
            $scope.rows = $scope.chequeUploadApproval;
        }
        else if(tab == 'Rent Payment Approval'){
            $scope.rows = $scope.rentPaymentApproval;
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

    //payment
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

    //payment
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

    //cheque upload
    $scope.approveCheque = function(row){
        var data = {};
        data.status = "active";
        data.tenant_cheque_id = row.tenant_cheque_id;
        DataFactory.MakeChequeApprovalChanges(data).success(function(response){
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

    //cheque upload
    $scope.rejectCheque = function(row){
        var data = {};
        data.status = "upload rejected";
        data.tenant_cheque_id = row.tenant_cheque_id;
        DataFactory.MakeChequeApprovalChanges(data).success(function(response){
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

    // approve rent payment
    $scope.acceptRentPayment = function(row){
        var data = {};
        data.status = "encashed";
        data.room_tenant_payment_id = row.room_tenant_payment_id;
        data.tenant_cheque_id = row.tenant_cheque_id;
        console.log(data);
        DataFactory.UpdateRoomPayment(data).success(function(response){
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
    $scope.rejectRentPayment = function(row){
        var data = {};
        data.status = "rejected";
        data.room_tenant_payment_id = row.room_tenant_payment_id;
        data.tenant_cheque_id = row.tenant_cheque_id;
        console.log(data);
        DataFactory.UpdateRoomPayment(data).success(function(response){
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