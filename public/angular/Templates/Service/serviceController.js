 app.controller('ServiceController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('service');
    $scope.showSideNavAddService = false;
    $scope.addServiceFlag = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.disable = true;
    $scope.rentInventoryFlag = false;
    $scope.servicesTab = ['One Time', 'Weekly', 'Monthly'];
    $scope.currentTab = $scope.servicesTab[0];
    $scope.errorNotification = null;
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    var requestId;
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    function initializeVariables(){

        $scope.service = {
            service_name: '',
            service_description: '',
            service_fee: 0,
            recurrence: '',
            tenant_id: '',
            branch_id: '',
            start_date: 0,
            end_date: 0,
            status: ""
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
                $scope.currentTenant = $scope.tenantList[0];
                
            }
        }).error(function(error){

        });
    }

    function getServiceData(){
        DataFactory.GetServiceData($scope.branch.branch_id).success(function(response){
            console.log(response);
            if(response.status = 200){
                $scope.serviceData = response.data;
                filterData($scope.currentTab);
            }
                
        }).error(function(error){

        });
    }

    function filterData(tab){
        $scope.rows = [];
        $scope.rows = _.filter($scope.serviceData, function(o) { 
            return tab == o.recurrence; 
        });
    }

    $scope.CloseSidebar = function() {
        console.log("Close Sidebar");
        $scope.showSideNavAddService = false;
        $scope.showCompleteDetailsFlag = false;
        $scope.disable = true;
        initializeVariables();
        $scope.errorNotification = null;
    }

    $scope.addNewUtility = function() {
        $scope.showSideNav = true;
    }

    $scope.addNewService = function() {
        $scope.showSideNavAddService = true;
    }

    $scope.showCompleteUtilityDetails = function(row){
        $scope.showCompleteDetailsFlag = true;
        $scope.service = row;
        $scope.service.service_fee = parseFloat($scope.service.service_fee);
        $scope.service.start_contract = new Date($scope.service.start_contract);
        $scope.service.end_contract = new Date($scope.service.end_contract);
        // console.log($scope.utility);
    }

    // tenant dropdown list
    $scope.ChangeTenant = function(item){
        $scope.currentTenant = item;
    }

    //tabbing purposes
    $scope.ChangeServiceTab = function(tab){
        $scope.currentTab = tab;
        filterData(tab);
        
    }

    //recurrence dropdown list in add new service
    $scope.ChangeRecurrence = function(recurrence){
        $scope.currentTab = recurrence;
    }
    $scope.addService = function() {
        $scope.service.branch_id = $scope.branch.branch_id;
        $scope.service.tenant_id = $scope.currentTenant.tenant_id;
        $scope.service.recurrence = $scope.currentTab;
        $scope.service.status = "active";
        DataFactory.AddService($scope.service).success(function(response){
            if(response.status == 200){
                getServiceData();
                $scope.CloseSidebar();
            }
            else{
                $scope.errorNotification = response.message;
            }
            else {
                console.log(response.message);
            }
        }).error(function(error){

        });
    }
    // $scope.addService = function() {
    //     $scope.service.branch_id = $scope.branch.branch_id;
    //     $scope.service.tenant_id = $scope.selectedTenant.tenant_id;
    //     if($scope.branch.role == "Staff"){
    //         $scope.approval.approval_section = "service";
    //         $scope.approval.approval_mode = "add";
    //         $scope.approval.request_id = requestId;
    //         $scope.approval.approval_data = $scope.service;
    //         DataFactory.AddApprovalRequest($scope.approval).success(function(response){
    //             if(response.status == 200){
    //                 $scope.CloseSidebar();
    //             }
    //         }).error(function(error){

    //         });
    //     }
    //     else {
    //         DataFactory.AddService($scope.service).success(function(response){
    //             if(response.status == 200){
    //                 getAllData();
    //                 $scope.CloseSidebar();
    //             }
    //             else {
    //                 console.log(response.message);
    //             }
    //         }).error(function(error){

    //         });
    //     }
    // }

    $scope.editService = function(disable) {
        console.log($scope.service);
         if($scope.disable == false){
            $scope.utility.branch_id = $scope.branch.branch_id;
            
            DataFactory.EditService($scope.service).success(function(response){
                if(response.status == 200){
                    getAllData();
                    $scope.CloseSidebar();
                }
                else {
                    scope.errorNotification = response.message;
                }
            }).error(function(error){

            });
        }
        else {
            $scope.disable = !$scope.disable;
        }
    }

    $scope.deleteService = function(service) {
        DataFactory.DeleteService($scope.service.service_id).success(function(response){
            if(response.status == 200){
                getAllData();
                $scope.CloseSidebar();
            }
            else {
                $scope.errorNotification = response.message;
            }
        }).error(function(error){

        });
    }
    
    getServiceData();
    getAllTenantData();
    initializeVariables();
});