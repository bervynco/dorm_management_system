 app.controller('BillingController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('billing');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    $scope.disable = true;
    $scope.errorNotification = null;
    var monthNow = new Date().getMonth() + 1;
    var yearNow = new Date().getFullYear();
    function getData() {
        DataFactory.GetBillingInformation($scope.branch.branch_id).success(function(response){
            $scope.rows = response.data;
        }).error(function(error){

        });
    }
    function initializeVariable() {
        $scope.billing = {
            "billing_name": "",
            "billing_description": "",
            "month": "",
            "year": ""
        }
        $scope.approval = {
            approval_section: 'billing',
            approval_mode: '',
            approval_data: '',
            request_id: '',
            user_id: $scope.userDetails.user_id,
            status: 'active',
            branch_id: $scope.branch.branch_id
        }
    }
    $scope.generateBilling = function(){
        DataFactory.GenerateBilling($scope.branch.branch_id).success(function(response){

        }).error(function(error){

        });
    }

    $scope.addBilling = function() {
        $scope.billing.branch_id = $scope.branch.branch_id;
            DataFactory.AddNewBilling($scope.billing).success(function(response){
                if(response.status == 200){
                    getAllData();
                    $scope.CloseSidebar();
                }
                else {
                    $scope.errorNotification = response.message;
                }
            }).error(function(error){

            });
        // if($scope.branch.role == "Staff"){
        //     $scope.approval.approval_mode = "add";
        //     $scope.approval.request_id = requestId;
        //     $scope.approval.approval_data = $scope.billing;
        //     DataFactory.AddApprovalRequest($scope.approval).success(function(response){
        //         if(response.status == 200){
        //             $scope.CloseSidebar();
        //         }
        //     }).error(function(error){

        //     });
        // }
        // else {
        //     $scope.billing.branch_id = $scope.branch.branch_id;
        //     DataFactory.AddNewBilling($scope.billing).success(function(response){
        //         if(response.status == 200){
        //             getAllData();
        //             $scope.CloseSidebar();
        //         }
        //         else {
        //             console.log(response.message);
        //         }
        //     }).error(function(error){

        //     });
        // }
    }
    $scope.addNewBilling = function() {
        $scope.showSideNav = true;
    }

    $scope.showCompleteDetails = function() {
        $scope.showCompleteDetailsFlag = true;
    }
    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
        $scope.disable = true;
        $scope.errorNotification = null;
        initializeVariables();
    }
    initializeVariable();
    getData();
});