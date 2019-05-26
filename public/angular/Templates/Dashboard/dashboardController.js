 app.controller('DashboardController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('home');
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    var requestId;
    $scope.viewTab = ['Tenant', 'Payables', 'Billing', 'Request', 'Room Status'];
    
    $scope.currentTab = $scope.viewTab[0];
    $scope.errorNotification = null;

    
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
        DataFactory.GetTenantList($scope.branch.branch_id).success(function(response){
            $scope.tenantData = response.data;
            $scope.rows = $scope.tenantData;
        }).error(function(error){

        });
        DataFactory.GetPayableDues($scope.branch.branch_id).success(function(response){
            $scope.payableData = response.data;
        }).error(function(error){

        });

        DataFactory.GetAggregatedTenantList($scope.branch.branch__id).success(function(response){

        }).error(function(error){

        });

        DataFactory.GetAggregatedRoomList($scope.branch.branch_id).success(function(response){

        }).error(function(error){

        });

        DataFactory.GetRequestApprovalData($scope.branch.branch_id).success(function(response){

        }).error(function(error){

        });
    }

    $scope.ChangeViewTab = function(tab){
        $scope.currentTab = tab;
        if(tab == 'Payables'){
            $scope.rows = $scope.payableData;
        }
        else if(tab == 'Tenant'){
            $scope.rows = $scope.tenantData;
        }
    }
    getAllData();
});