 app.controller('UtilityController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('utility');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.assignServicesToTenantFlag = false;
    $scope.disable = true;
    $scope.servicesTab = ['One Time', 'Recurring'];
    $scope.currentTab = $scope.servicesTab[0];
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    var requestId;
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    function initializeVariables(){
        $scope.utility = {
            utility_name: '',
            utility_description: '',
            utility_amount: 0,
            utility_recurrence: ''
        }
    }
    
    $scope.approval = {
        approval_section: 'utility',
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

    function getAllTenantData(){
        DataFactory.GetTenantList($scope.branch.branch_id).success(function(response){
            if(response.status = 200){
                $scope.tenantList = response.data;
                $scope.selectedTenant = $scope.tenantList[0];
                
            }
        }).error(function(error){

        });
    }

    function getAllData(){
        DataFactory.GetUtilityList($scope.branch.branch_id).success(function(response){
            if(response.status = 200){
                $scope.utilityData = response.data;
                $scope.rows = response.data;
                filterData($scope.currentTab);
                $scope.selectedUtility = $scope.rows[0];
            }
                
        }).error(function(error){

        });
    }

    function filterData(tab){
        $scope.rows = [];
        $scope.rows = _.filter($scope.utilityData, function(o) { 
            return tab.toLowerCase() == o.utility_recurrence; 
        });
        console.log($scope.rows);
    }
    $scope.ChangeServiceTab = function(tab) {
        $scope.currentTab = tab;
        filterData(tab);
    }
    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
        $scope.assignServicesToTenantFlag = false;
        $scope.disable = true;
        initializeVariables();
    }

    $scope.addNewUtility = function() {
        $scope.showSideNav = true;
    }

    $scope.showCompleteUtilityDetails = function(row){
        $scope.showCompleteDetailsFlag = true;
        $scope.utility = row;
        $scope.utility.utility_amount = parseFloat($scope.utility.utility_amount);
        console.log($scope.utility);
    }

    $scope.assignServices = function() {
        $scope.assignServicesToTenantFlag = true;
        getAllTenantData();
        getAllData();
    }

    $scope.ChangeTenantName = function(item){
        $scope.selectedTenant = item;
    }

    $scope.ChangeUtilityName = function(item){
        $scope.selectedUtility = item;
    }

    $scope.assignServicesToTenant = function() {
        $scope.assign = {
            'tenant': $scope.selectedTenant,
            'utility': $scope.selectedUtility,
            'branch_id': $scope.branch.branch_id
        }
        DataFactory.AssignUtilityToTenant($scope.assign).success(function(response){
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

    $scope.addUtility = function() {
        $scope.utility.branch_id = $scope.branch.branch_id;
        if($scope.branch.role == "Staff"){
            $scope.approval.approval_mode = "Add";
            $scope.approval.request_id = requestId;
            $scope.approval.approval_data = $scope.utility;
            DataFactory.AddApprovalRequest($scope.approval).success(function(response){
                if(response.status == 200){
                    $scope.CloseSidebar();
                }
            }).error(function(error){

            });
        }
        else {
            DataFactory.AddNewUtility($scope.utility).success(function(response){
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

    $scope.editUtility = function(disable) {
        if($scope.disable == false){
            $scope.utility.branch_id = $scope.branch.branch_id;
            DataFactory.EditUtility($scope.utility).success(function(response){
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

    $scope.deleteUtility = function(item){
        DataFactory.DeleteUtility(item).success(function(response){
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
    getAllData();
    initializeVariables();
});