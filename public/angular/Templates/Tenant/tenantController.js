 app.controller('TenantController', function ($scope, $rootScope, $interval, AppService, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('tenant');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.addPaymentFlag = false;
    $scope.displayFlag = false;
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    function getTenantPerRoomPerBranch(){
        DataFactory.GetCountTenantPerRoomPerBranch($scope.branch.branch_id).success(function(response){
            console.log(response);
            $scope.displayFlag = true;
            $scope.roomSummary = response.data;
        }).error(function(error){

        });
    }
    function getAllRoomData(){
        DataFactory.GetRoomList($scope.branch.branch_id).success(function(response){
            console.log(response);
            $scope.rooms = response.data;
        }).error(function(error){

        });
    }
    function getAllData(){
        DataFactory.GetTenantList($scope.branch.branch_id).success(function(response){
            console.log(response);
            $scope.rows = response.data;
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

        console.log($scope.tenantPayment);
        DataFactory.AddNewPayment($scope.tenantPayment).success(function(response){
            
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
                console.log(response);
            }
            else {
                console.log(response.message);
            }
        }).error(function(error){

        })
    }

    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
        $scope.addPaymentFlag = false;
        initializeVariables();
    }

    $scope.showCompleteDetails = function(row){
        $scope.showCompleteDetailsFlag = true;
        $scope.tenant = row;
    }

    getAllData();
    initializeVariables();
});