 app.controller('UtilityController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('utility');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.assignServicesToTenantFlag = false;
    $scope.disable = true;

    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));

    function initializeVariables(){
        $scope.utility = {
            utility_name: '',
            utility_description: ''
        }
    }
    
    function getAllTenantData(){
        DataFactory.GetUtilityList($scope.branch.branch_id).success(function(response){
            if(response.status = 200)
                $scope.tenantList = response.data;
        }).error(function(error){

        });
    }
    function getAllData(){
        DataFactory.GetUtilityList($scope.branch.branch_id).success(function(response){
            if(response.status = 200)
                $scope.rows = response.data;
        }).error(function(error){

        });
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
        console.log($scope.utility);
    }

    $scope.addUtility = function() {
        $scope.utility.branch_id = $scope.branch.branch_id;
        DataFactory.AddNewUtility($scope.utility).success(function(response){
            if(response.status = 200){
                $scope.CloseSidebar();
            }
        }).error(function(error){

        });
    }

    $scope.editUtility = function(disable) {
        if($scope.disable == false){
            $scope.utility.branch_id = $scope.branch.branch_id;
            DataFactory.EditUtility($scope.utility).success(function(response){

            }).error(function(error){

            });
            $scope.CloseSidebar();
        }
        else {
            $scope.disable = !$scope.disable;
        }
    }
    getAllData();
    initializeVariables();
});