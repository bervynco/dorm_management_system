 app.controller('TenantController', function ($scope, $rootScope, $interval, AppService, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('tenant');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.assignRoomFlag = false;
    // $scope.rows = [
    //     {
    //         'tenant_name': "Juan dela Cruz",
    //         'start_date': "01/10/2018",
    //         'end_date': "01/01/2019",
    //         "items": null,
    //         "rent": 2500,
    //         "electricity_bill": 2500,
    //         "water_bill": 500,
    //         "laundry_bill": 100
    //     },
    //     {
    //         'tenant_name': "Jose Reyes",
    //         'start_date': "01/10/2018",
    //         'end_date': "01/01/2019",
    //         "items": null,
    //         "rent": 2500,
    //         "electricity_bill": 1000,
    //         "water_bill": 500,
    //         "laundry_bill": 0,
    //     },
    //     {
    //         'tenant_name': "Jimmy Lacson",
    //         'start_date': "01/10/2018",
    //         'end_date': "01/01/2019",
    //         "items": null,
    //         "rent": 2500,
    //         "electricity_bill": 2500,
    //         "water_bill": 1500,
    //         "laundry_bill": 100
    //     }
    // ];
    function getAllData(){
        DataFactory.GetTenantList(AppService.getCurrBranch().branch_id).success(function(response){
            console.log(response);
            $scope.rows = response.data;
        }).error(function(error){

        });
    }
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

    $scope.assignToRoom = function(){
        $scope.assignRoomFlag = true;
    }
    $scope.addNewTenant = function(){
        $scope.showSideNav = true;
    }

    $scope.addTenant = function(ev){
        $scope.tenant.branch_id = AppService.getCurrBranch().branch_id;
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
        $scope.assignRoomFlag = false;
    }

    $scope.showCompleteDetails = function(){
        $scope.showCompleteDetailsFlag = true;
    }

    getAllData();
});