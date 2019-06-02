 app.controller('ServiceController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('service');
    $scope.showSideNavAddService = false;
    $scope.addServiceFlag = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.showSideNavMakePayment = false;
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

    $scope.log = {
        user_id: $scope.userDetails.user_id,
        page_name: "Service",
        page_action: "View",
        branch_id: $scope.branch.branch_id
    }
    DataFactory.AddPageLog($scope.log).success(function(response){
    }).error(function(error){

    });

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
            if(response.status = 200){
                $scope.serviceData = response.data;
                $scope.currentService = response.data[0];
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

    function getPaymentTypes() {
        DataFactory.GetPaymentTypes().success(function(response){
            $scope.paymentList = response;
            $scope.currentPayment = response[0];
                
        }).error(function(error){

        });
    }
    $scope.CloseSidebar = function() {
        $scope.showSideNavAddService = false;
        $scope.showSideNavMakePayment = false;
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

    $scope.makePayment = function(service) {
        $scope.showSideNavMakePayment = true;
        
        $scope.currentService = _.filter($scope.serviceData, function(o) { 
            return o.service_id == service.service_id; 
        })[0];
        if($scope.currentPayment.payment_name == 'Cheque'){
            DataFactory.GetChequePaymentDetails($scope.currentService).success(function(response){
                $scope.chequeDetails = response.data;
                $scope.currentCheque = response.data[0];
            }).error(function(error){

            });
        }
    }

    $scope.showCompleteUtilityDetails = function(row){
        $scope.showCompleteDetailsFlag = true;
        $scope.service = angular.copy(row);
        $scope.service.service_fee = parseFloat($scope.service.service_fee);
        $scope.service.start_date = new Date($scope.service.start_date);
        $scope.service.end_date = new Date($scope.service.end_date);
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

    $scope.ChangeService = function(service){
        $scope.currentService = service;
        DataFactory.GetChequePaymentDetails(service).success(function(response){
            $scope.chequeDetails = response.data;
            $scope.currentCheque = response.data[0];
        }).error(function(error){

        });
    }

    $scope.ChangePayment = function(payment){
        $scope.currentPayment = payment;
    }

    $scope.ChangeCheque = function(cheque){
        $scope.currentCheque = cheque;
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
                $scope.log.page_action = "Add Service";
                DataFactory.AddPageLog($scope.log).success(function(response){
                }).error(function(error){

                });
                getServiceData();
                $scope.CloseSidebar();
            }
            else{
                $scope.errorNotification = response.message;
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
         if($scope.disable == false){
            DataFactory.EditService($scope.service).success(function(response){
                if(response.status == 200){
                    $scope.log.page_action = "Edit Service";
                    DataFactory.AddPageLog($scope.log).success(function(response){
                    }).error(function(error){

                    });
                    getServiceData();
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
                $scope.log.page_action = "Delete Service";
                DataFactory.AddPageLog($scope.log).success(function(response){
                }).error(function(error){

                });
                getServiceData();
                $scope.CloseSidebar();
            }
            else {
                $scope.errorNotification = response.message;
            }
        }).error(function(error){

        });
    }

    $scope.makeServicePayment = function() {
        $scope.servicePayment = {
            'tenant_cheque_id': $scope.currentCheque.tenant_cheque_id,
            'service_id': $scope.currentService.service_id,
            'payment_id': $scope.currentPayment.payment_id,
            'status': "",
            'branch_id' : $scope.branch.branch_id
        }

        if($scope.branch.role === "Administrator"){
            $scope.servicePayment.status = "encashed";
        }
        else{
            $scope.servicePayment.status = "approval";
        }

        DataFactory.MakeServicePayment($scope.servicePayment).success(function(response){
            if(response.status == 200){
                getServiceData();
                $scope.CloseSidebar();
            }
        }).error(function(error){

        });
    }
    getPaymentTypes();
    getServiceData();
    getAllTenantData();
    initializeVariables();
});