 app.controller('BillingController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window, $location) {
    $scope.$parent.ChangeAppState('compute');
    $state.go('compute.detail', {billingId: $state.params.billingId});
    $scope.disable = true;
    $scope.showCompleteDetailsFlag = false;
    $scope.showSideNavMakePayment = false;
    $scope.errorNotification = null;
    $scope.convert = Number;
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.log = {
        user_id: $scope.userDetails.user_id,
        page_name: "Billing",
        page_action: "View",
        branch_id: $scope.branch.branch_id
    }

    var param1 = $state.params;
    var decryptedBytes = CryptoJS.AES.decrypt(param1.billingId, "Secret Passphrase Dorm Management System");
    var billingId = decryptedBytes.toString(CryptoJS.enc.Utf8);

    function getData(){
        DataFactory.GetBillingDataPerBilling(billingId).success(function(response){
            console.log(response);
            if(response.status == 200){
                $scope.rows = response.data;
            }
            else {

            }
        }).error(function(error){

        });
    }

    function getCheques()
    {
        DataFactory.GetChequePaymentDetails($scope.billing).success(function(response){
            $scope.chequeDetails = response.data;
            $scope.currentCheque = response.data[0];
        }).error(function(error){

        });
    }

    function getTotalBill(data) {
        console.log($scope.breakdown);
        var totalBill = 0;
        // Service
        for(var key in data['Service']){
            totalBill = totalBill + data['Service'][key]['Service Fee'];
        }

        // Inventory Rent
        for(var key in data['Inventory']){
            totalBill = totalBill + data['Inventory'][key]['inventory_rent_amount'];
        }

        // Room Rent
        totalBill = totalBill + data['Room']['room_rent'];

        // Utility
        for(var key in data['Utility']){
            totalBill = totalBill + data["Utility"][key]['bill'];
        }
        
        return totalBill;
    }

    $scope.$watch('breakdown', function() { 
        $scope.totalBill = getTotalBill($scope.breakdown);
    }, true);

    $scope.showCompleteDetails = function(row){
        $scope.billing = row;
        $scope.showCompleteDetailsFlag = true;
        $scope.breakdown = JSON.parse(row.billing_json);
        delete $scope.breakdown.total_bill;
        delete $scope.breakdown.tenant_count;

        $scope.totalBill = getTotalBill($scope.breakdown);
        getCheques();
    }

    $scope.CloseSidebar = function() {
        $scope.showCompleteDetailsFlag = false;
        $scope.showSideNavMakePayment = false;
        $scope.disable = true;
        $scope.errorNotification = null;
    }

    $scope.editBilling = function(){
        if($scope.disable == false){    
            $scope.billing.billing_json = JSON.stringify($scope.breakdown);
            $scope.billing.total_amount = $scope.totalBill;
            DataFactory.EditBilling($scope.billing).success(function(response){
                if(response.status == 200){
                    $scope.log.page_action = "Edit Billing Item";
                    DataFactory.AddPageLog($scope.log).success(function(response){
                    }).error(function(error){

                    });
                    getData();
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

    $scope.deleteBilling = function() {
        $scope.billing.billing_json = JSON.stringify($scope.breakdown);
        $scope.billing.total_amount = $scope.totalBill;
        DataFactory.DeleteBilling($scope.billing).success(function(response){
            if(response.status == 200){
                $scope.log.page_action = "Delete Billing Item";
                DataFactory.AddPageLog($scope.log).success(function(response){
                }).error(function(error){

                });
                getData();
                $scope.CloseSidebar();
            }
            else {
                $scope.errorNotification = response.message;
            }
        }).error(function(error){

        });
    }

    function getPaymentTypes() {
        DataFactory.GetPaymentTypes().success(function(response){
            $scope.paymentList = response;
            $scope.currentPayment = response[0];
                
        }).error(function(error){

        });
    }

    $scope.payBilling = function(billing) {
        $scope.showSideNavMakePayment = true;
        $scope.billingPayment = billing;
        DataFactory.GetChequePaymentDetails(billing).success(function(response){
            $scope.chequeDetails = response.data;
            $scope.currentCheque = response.data[0];
            console.log($scope.chequeDetails);
        }).error(function(error){

        });
    }

    $scope.ChangePayment = function(payment){
        $scope.currentPayment = payment;
    }

    $scope.ChangeCheque = function(cheque){
        $scope.currentCheque = cheque;
    }

    $scope.makeBillingPayment = function(){
        $scope.bill = {
            'tenant_cheque_id': $scope.currentCheque.tenant_cheque_id,
            'billing_data_id': $scope.billingPayment.billing_data_id,
            'payment_id': $scope.currentPayment.payment_id,
            'status': "",
            'branch_id' : $scope.branch.branch_id
        }
        if($scope.branch.role === "Administrator"){
            $scope.bill.status = "encashed";
        }
        else{
            $scope.bill.status = "approval";
        }

        console.log($scope.bill);
        DataFactory.MakeBillingPayment($scope.bill).success(function(response){
            if(response.status == 200){
                $scope.CloseSidebar();
            }
        }).error(function(error){

        });
    }
    // $scope.ChangeModelValue = function(parent, keyBreakdown, key, value){
    //     console.log(parent, keyBreakdown, key, value);
    // }
    getData();
    getPaymentTypes();
});