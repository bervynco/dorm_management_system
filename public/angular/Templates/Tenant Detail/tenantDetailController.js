 app.controller('TenantDetailController', function ($scope, $rootScope, $interval, AppService, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('tenant');
    $state.go('tenant.detail', {tenantId: $state.params.tenantId});
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));

    $scope.log = {
        user_id: $scope.userDetails.user_id,
        page_name: "Tenant",
        page_action: "View Tenant",
        branch_id: $scope.branch.branch_id
    }

    var param1 = $state.params;
    var decryptedBytes = CryptoJS.AES.decrypt(param1.tenantId, "Secret Passphrase Dorm Management System");
    var tenantID = decryptedBytes.toString(CryptoJS.enc.Utf8);
    $scope.tenantTab = ['Details', 'Inventory', 'Services', 'Cheque List'];
    $scope.currentTab = $scope.tenantTab[0];

    function getData() {
        var params = {'branch_id': $scope.branch.branch_id, 'tenant_id': tenantID};

        DataFactory.GetTenantDetails(tenantID).success(function(response){
            if(response.status == 200){
                $scope.tenantDetails = response.data;
                $scope.rows = response.data;
            }
        }).error(function(error){

        });
        // Get Inventory Per Tenant
        DataFactory.GetInventoryPerTenant(params).success(function(response){
            if(response.status == 200){
                $scope.inventoryPerTenant = response.data;
            }
            
        }).error(function(error){

        });

        // Get Service Per Tenant
        DataFactory.GetServicePerTenant(params).success(function(response){
            if(response.status == 200){
                $scope.servicePerTenant = response.data;
            }
            
        }).error(function(error){

        });

        // Get All Cheques
        DataFactory.GetChequeListPerTenant(params).success(function(response){
            if(response.status == 200){
                $scope.chequeList = response.data;
            }
        }).error(function(error){

        });

        // Get Payment History per Tenant
        DataFactory.GetPaymentHistoryPerTenant(tenantID).success(function(response){
            if(response.status == 200){
                $scope.paymentPerTenant = response.data;
            }
        }).error(function(error){

        });
    }

    $scope.ChangeTenantTab = function(tab){
        $scope.currentTab = tab;
        if(tab == 'Details'){
            $scope.rows = $scope.tenantDetails;
        }
        else if(tab == 'Inventory'){
            $scope.rows = $scope.inventoryPerTenant;
        }
        else if(tab == 'Services'){
            $scope.rows = $scope.servicePerTenant;
        }
        else if(tab == 'Cheque List'){
            $scope.rows = $scope.chequeList;
        }
        else {
            $scope.rows = $scope.paymentPerTenant;
        }
    }

    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.rows = $scope.tenantDetails;
        $scope.currentTab = $scope.tenantTab[0];
        $scope.errorNotification = null;
    }

    $scope.modifyTenantDetails = function(row){
        $scope.showSideNav = true;
        $scope.activeTenant = row;
    }

    $scope.backToTenant = function() {
        $scope.ChangeState('tenant');
    }
    getData();
});