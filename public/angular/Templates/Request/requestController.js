 app.controller('RequestController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('request');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.servicesTab = ['User', 'Room', 'Tenant', 'Utility', 'Inventory', 'Payables', 'Calendar', 'Billing'];
    $scope.modesTab = ['Add', 'Edit', 'Delete'];
    $scope.currentTab = $scope.servicesTab[0];
    $scope.modeTab = $scope.modesTab[0];
    function getAllData(){
        DataFactory.GetRequestApprovalData($scope.branch.branch_id).success(function(response){
            $scope.requestData = response.data;
            filterData($scope.currentTab, $scope.modeTab);
        }).error(function(error){

        });
    }

    function initializeVariables() {
        $scope.room = {
            room_number: '',
            floor_number: '',
            capacity_count: '',
            room_rate: '',
            branch_id: '',
        }
    }

    function filterData(currentTab, modeTab){
        $scope.rows = [];
        $scope.rows = _.filter($scope.requestData, function(o) { 
            return currentTab.toLowerCase() == o.approval_section && modeTab.toLowerCase() == o.approval_mode; 
        });
        console.log($scope.rows);
    }
    $scope.ChangeServiceTab = function(tab) {
        $scope.currentTab = tab;
        filterData($scope.currentTab, $scope.modeTab);
    }
    $scope.ChangeModeTab = function(tab) {
        $scope.modeTab = tab;
        filterData($scope.currentTab, $scope.modeTab);
    }
    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
        $scope.assignServicesToTenantFlag = false;
        $scope.disable = true;
        initializeVariables();
    }
    
    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
        initializeVariables();
    }

    getAllData();
    initializeVariables();
});