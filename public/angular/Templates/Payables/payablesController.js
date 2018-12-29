 app.controller('PayablesController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('payables');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.disable = true;
    var requestId;
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    
    $scope.approval = {
        approval_section: 'payables',
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

    function initializeVariables() {
        $scope.payables = {
            'name': '',
            'description': '',
            'payable_date':'',
            'amount': 0,
            'branch_id': ''
        }

        
    }

    function getAllData(){
        DataFactory.GetPayableList($scope.branch.branch_id).success(function(response){
            $scope.rows = response.data;
        }).error(function(error){

        });
    }

    $scope.addPayable = function(){
        $scope.showSideNav = true;
    }

    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
        $scope.disable = true;
        initializeVariables();
    }

    $scope.showCompleteDetails = function(item){
        console.log(item);
        $scope.showCompleteDetailsFlag = true;
        item.payable_date = new Date(item.payable_date);
        item.amount = parseFloat(item.amount);
        $scope.payables = item;
    }

    $scope.addNewPayable = function() {
        $scope.payables.branch_id = $scope.branch.branch_id;
        if($scope.branch.role == "Staff"){
            $scope.approval.approval_mode = "Add";
            $scope.approval.request_id = requestId;
            $scope.approval.approval_data = $scope.payables;
            DataFactory.AddApprovalRequest($scope.approval).success(function(response){
                if(response.status == 200){
                    $scope.CloseSidebar();
                }
            }).error(function(error){

            });
        }
        else {
            DataFactory.AddNewPayable($scope.payables).success(function(response){
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

    $scope.editPayable = function(){
        if($scope.disable == false){
            $scope.payables.branch_id = $scope.branch.branch_id;
            DataFactory.EditPayable($scope.payables).success(function(response){
                if(response.status == 200){
                    getAllData();
                    $scope.CloseSidebar();
                }
                else {
                    console.log(response.message);
                }
            }).error(function(error){

            });
            $scope.CloseSidebar();
        }
        else {
            $scope.disable = !$scope.disable;
        }
        
    }
    $scope.deletePayable = function(item){
        DataFactory.DeletePayable(item).success(function(response){
            if(response.status == 200){
                $scope.CloseSidebar();
            }
            else{

            }
        }).error(function(error){

        });
    }
    
    getAllData();
    initializeVariables();
});