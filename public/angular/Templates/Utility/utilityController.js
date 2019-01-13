 app.controller('UtilityController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('utility');
    $scope.showSideNav = false;
    $scope.showSideNeavService = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.assignUtilityToTenantFlag = false;
    $scope.assignServicesToTenantFlag = false;
    $scope.disable = true;
    $scope.servicesTab = ['Utility', 'Services'];
    $scope.currentTab = $scope.servicesTab[0];
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    var requestId;
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    function initializeVariables(){
        $scope.utility = {
            utility_name: '',
            utility_description: '',
            utility_amount: 0,
        }

        $scope.service = {
            service_name: '',
            service_description: '',
            service_fee: 0,
            tenant_id: ''
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
                // filterData($scope.currentTab);
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
        // filterData(tab);
    }
    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showSideNavService = false;
        $scope.showCompleteDetailsFlag = false;
        $scope.assignUtilityToTenantFlag = false;
        $scope.assignServicesToTenantFlag = false;
        $scope.disable = true;
        initializeVariables();
    }

    $scope.addNewUtility = function() {
        $scope.showSideNav = true;
    }

    $scope.addNewService = function() {
        getAllTenantData();
        $scope.showSideNavService = true;
    }

    $scope.showCompleteUtilityDetails = function(row){
        $scope.showCompleteDetailsFlag = true;
        $scope.utility = row;
        $scope.utility.utility_amount = parseFloat($scope.utility.utility_amount);
        console.log($scope.utility);
    }

    $scope.assignUtility = function() {
        $scope.assignUtilityToTenantFlag = true;
        getAllTenantData();
        getAllData();
    }
    $scope.assignServices = function() {
        $scope.assignServicesToTenantFlag = true;
        getAllTenantData();
    }
    $scope.ChangeTenantName = function(item){
        $scope.selectedTenant = item;
    }

    $scope.ChangeUtilityName = function(item){
        $scope.selectedUtility = item;
    }

    $scope.assignUtilityToTenant = function() {
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

    $scope.assignServiceToTenant = function() {
        DataFactory.AssignServiceToTenant($scope.service).success(function(response){
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

    $scope.addService = function() {
        $scope.service.branch_id = $scope.branch.branch_id;
        $scope.service.tenant_id = $scope.selectedTenant.tenant_id;
        if($scope.branch.role == "Staff"){
            $scope.approval.approval_section = "service";
            $scope.approval.approval_mode = "add";
            $scope.approval.request_id = requestId;
            $scope.approval.approval_data = $scope.service;
            DataFactory.AddApprovalRequest($scope.approval).success(function(response){
                if(response.status == 200){
                    $scope.CloseSidebar();
                }
            }).error(function(error){

            });
        }
        else {
            DataFactory.AddService($scope.service).success(function(response){
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

    $scope.addUtility = function() {
        $scope.utility.branch_id = $scope.branch.branch_id;
        if($scope.branch.role == "Staff"){
            $scope.approval.approval_mode = "add";
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
    $scope.downloadPage = function(page) {
        var object = {'page': page, 'branch_id': $scope.branch.branch_id}
        DataFactory.DownloadPage(object).success(function(response){
            $window.location.href = response;
        }).error(function(error){

        });
    }
    getAllData();
    initializeVariables();
});