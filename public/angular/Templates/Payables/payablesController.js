 app.controller('PayablesController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('payables');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.disable = true;
    var requestId;
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    $scope.viewTab = ['List', 'Calendar'];
    $scope.currentTab = $scope.viewTab[0];
    $scope.errorNotification = null;
    $scope.approval = {
        approval_section: 'payables',
        approval_mode: '',
        approval_data: '',
        request_id: '',
        user_id: $scope.userDetails.user_id,
        status: 'active',
        branch_id: $scope.branch.branch_id
    }
    $scope.user = {
        name: '',
        username: '',
        password: '',
        mobile_number: '',
        request_id: '',
        branch_id: $scope.branch.branch_id
    }
    
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

    $scope.log = {
        user_id: $scope.userDetails.user_id,
        page_name: "Payables",
        page_action: "View",
        branch_id: $scope.branch.branch_id
    }
    DataFactory.AddPageLog($scope.log).success(function(response){
    }).error(function(error){

    });

    function getAllData(){
        DataFactory.GetPayableList($scope.branch.branch_id).success(function(response){
            $scope.rows = response.data;
        }).error(function(error){

        });
    }

    $scope.ChangeViewTab = function(tab){
        $scope.currentTab = tab;
    }

    $scope.addPayable = function(){
        $scope.showSideNav = true;
    }

    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
        $scope.disable = true;
        initializeVariables();
        $scope.errorNotification = null;
    }

    $scope.showCompleteDetails = function(item){
        $scope.showCompleteDetailsFlag = true;
        $scope.payables = angular.copy(item);
        $scope.payables.payable_date = new Date($scope.payables.payable_date);
        $scope.payables.amount = parseFloat($scope.payables.amount);
        
    }

    $scope.addNewPayable = function() {
        // $scope.payables.branch_id = $scope.branch.branch_id;
        // if($scope.branch.role == "Staff"){
        //     $scope.approval.approval_mode = "add";
        //     $scope.approval.request_id = requestId;
        //     $scope.approval.approval_data = $scope.payables;
        //     DataFactory.AddApprovalRequest($scope.approval).success(function(response){
        //         if(response.status == 200){
        //             $scope.CloseSidebar();
        //         }
        //     }).error(function(error){

        //     });
        // }
        // else {
        //     DataFactory.AddNewPayable($scope.payables).success(function(response){
        //         if(response.status == 200){
        //             getAllData();
        //             $scope.CloseSidebar();
        //         }
        //         else {
        //             $scope.errorNotification = response.message;
        //         }
        //     }).error(function(error){

        //     });
        // }
        $scope.payables.branch_id = $scope.branch.branch_id;
        DataFactory.AddNewPayable($scope.payables).success(function(response){
                if(response.status == 200){
                    $scope.log.page_action = "Add New Payable";
                    DataFactory.AddPageLog($scope.log).success(function(response){
                    }).error(function(error){

                    });
                    getAllData();
                    $scope.CloseSidebar();
                }
                else {
                    $scope.errorNotification = response.message;
                }
            }).error(function(error){

            });
    }

    $scope.editPayable = function(){
        if($scope.disable == false){
            $scope.payables.branch_id = $scope.branch.branch_id;
            DataFactory.EditPayable($scope.payables).success(function(response){
                if(response.status == 200){
                    $scope.log.page_action = "Edit Payable";
                    DataFactory.AddPageLog($scope.log).success(function(response){
                    }).error(function(error){

                    });
                    getAllData();
                    $scope.CloseSidebar();
                }
                else {
                    $scope.errorNotification = response.message;
                }
            }).error(function(error){

            });
        }
        else {
            $scope.disable = !$scope.disable;
        }
        
    }
    $scope.deletePayable = function(item){
        DataFactory.DeletePayable(item, "inactive").success(function(response){
            if(response.status == 200){
                $scope.log.page_action = "Delete Payable";
                DataFactory.AddPageLog($scope.log).success(function(response){
                }).error(function(error){

                });
                getAllData();
                $scope.CloseSidebar();
            }
            else{
                $scope.errorNotification = response.message;
            }
        }).error(function(error){

        });
    }

    $scope.markAsComplete = function(item) {
        DataFactory.DeletePayable(item, "complete").success(function(response){
            if(response.status == 200){
                $scope.log.page_action = "Delete Payable";
                DataFactory.AddPageLog($scope.log).success(function(response){
                }).error(function(error){

                });
                getAllData();
                $scope.CloseSidebar();
            }
            else{
                $scope.errorNotification = response.message;
            }
        }).error(function(error){

        });
    }
    getAllData();
    initializeVariables();
});