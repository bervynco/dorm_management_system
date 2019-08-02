 app.controller('UtilityController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('utility');
    $scope.showSideNavUtilityAdd = false;
    // $scope.showSideNavUtilityChangeReading = false;
    // $scope.showSideNavUtilityChangePrice = false;
    $scope.payUtilityFlag = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.disable = true;
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    var requestId;
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    $scope.utilityTab = ['Reading', 'Pricing'];
    $scope.mainTab = ['Utility List', 'Utility Billing List'];
    $scope.paymentArrangement = ['Pay as a whole', 'Self Service'];
    $scope.currentPaymentArrangement = $scope.paymentArrangement[0];
    $scope.currentMainTab = $scope.mainTab[0];
    $scope.errorNotification = null;
    $scope.currentTab = $scope.utilityTab[0];

    function initializeVariables(){
        $scope.utility = {
            utility_name: '',
            utility_description: '',
            status: '',
            branch_id: ''
            
        }
        $scope.utilityPrice = {
            utility_id: '',
            price: '',
            status: '',
            branch_id: ''
        }
        $scope.utilityReading = {
            utility_id: '',
            current_reading: '',
            status: '',
            branch_id: ''
        }
        $scope.utilityReadingAndPricing = {
            utility_id: '',
            branch_id: ''
        }
        $scope.utilityBillingCollection = [{
            bill_amount: 0
        }]

        $scope.utility_date = {
            month: 0,
            year: 0
        }
    }
    
    // $scope.approval = {
    //     approval_section: 'utility',
    //     approval_mode: '',
    //     approval_data: '',
    //     request_id: '',
    //     user_id: $scope.userDetails.user_id,
    //     status: 'active',
    //     branch_id: $scope.branch.branch_id
    // }

    function getRequestID() {
        requestId = AppService.getRequestId();
    }

    function filterData(tab){
        return _.filter($scope.readingAndPricingRows, function(o) { 
            return tab == o.state; 
        });
    }

    $scope.log = {
        user_id: $scope.userDetails.user_id,
        page_name: "Utility",
        page_action: "View",
        branch_id: $scope.branch.branch_id
    }
    DataFactory.AddPageLog($scope.log).success(function(response){
    }).error(function(error){

    });

    function getData(){
        DataFactory.GetUtilityList($scope.branch.branch_id).success(function(response){
            if(response.status = 200){
                console.log(response.data);
                $scope.utilityData = response.data;
                $scope.rows = response.data;
                // filterData($scope.currentTab);
                if($scope.rows.length > 0){
                    $scope.currentUtility = $scope.rows[0];
                }
                
            }
                
        }).error(function(error){

        });

        DataFactory.GetRoomList($scope.branch.branch_id).success(function(response){
            $scope.roomList = response.data;
            if($scope.roomList.length > 0){
                $scope.selectedRoom = $scope.roomList[0];
            }
            filterData();
        }).error(function(error){

        });

        DataFactory.GetPaymentTypes().success(function(response){
            $scope.paymentList = response;
            $scope.currentPayment = response[0];
                
        }).error(function(error){

        });
    }

    function getTenantPerRoom(room){
        DataFactory.GetTenantPerRoom(room).success(function(response){
            if(response.status == 200){
                $scope.tenantList = response.data;
                if($scope.tenantList.length > 0)
                    $scope.selectedTenant = $scope.tenantList[0];
            }
        }).error(function(error){

        });
    }

    function getChequesPerTenant(tenant){
        DataFactory.GetChequeListPerTenant(tenant).success(function(response){
            if(response.status == 200){
                console.log(response);
                $scope.chequeDetails = response.data;
                if($scope.chequeDetails.length > 0)
                    $scope.currentCheque = $scope.chequeDetails[0];
            }
        }).error(function(error){

        });
    }

    $scope.ChangeCheque = function(cheque){
        $scope.currentCheque = cheque;
    }
    
    $scope.ChangeTenant = function(tenant){
        $scope.selectedTenant = tenant;
        getChequesPerTenant(tenant);
    }
    $scope.CloseSidebar = function() {
        $scope.showSideNavUtilityAdd = false;
        // $scope.showSideNavUtilityChangePrice = false;
        // $scope.showSideNavUtilityChangeReading = false;
        $scope.payUtilityFlag = false;
        $scope.showCompleteDetailsFlag = false;
        $scope.showUtilityBillingNav = false;
        $scope.disable = true;
        $scope.errorNotification = null;
        initializeVariables();
    }

    $scope.ChangeMainTab = function(tab) {
        $scope.currentMainTab = tab;
    }

    $scope.ChangePaymentArrangement = function(arrangement){
        $scope.currentPaymentArrangement = arrangement;
    }
    $scope.ChangeUtility = function(utility) {
        $scope.currentUtility = utility;
        $scope.utilityBillingCollection = [];
        $scope.utilityBillingCollection.push({
            room_id: $scope.roomList[0].room_id,
            bill_amount: 0
        });
        
    }

    $scope.ChangePayment = function(payment){
        $scope.currentPayment = payment
    }
    /* Utility sidenav functions */
    $scope.addNewUtility = function() {
        $scope.showSideNavUtilityAdd = true;
    }

    // $scope.addPricePerUnit = function() {
    //     $scope.showSideNavUtilityChangePrice = true;
    // }

    // $scope.addCurrentReading = function() {
    //     $scope.showSideNavUtilityChangeReading = true;
    // }

    $scope.addUtilityBilling = function() {
        $scope.showUtilityBillingNav = true;
    }

    $scope.payUtility = function() {
        $scope.payUtilityFlag = true;
        getTenantPerRoom($scope.selectedRoom);
    }

    $scope.showCompleteUtilityDetails = function(row){
        $scope.showCompleteDetailsFlag = true;
        $scope.utility = row;
        $scope.currentUtility = row.utility_name;
        $scope.utility.utility_amount = parseFloat($scope.utility.utility_amount);
        $scope.utilityReadingAndPricing.utility_id = row.utility_id;
        $scope.utilityReadingAndPricing.branch_id = $scope.branch.branch_id
        DataFactory.GetAllReadingsAndPricings($scope.utilityReadingAndPricing).success(function(response){
            if(response.status == 200){
                $scope.readingAndPricingRows = response.data;
                $scope.filteredData = filterData($scope.currentTab);
            }
            else{

            }
        }).error(function(error){

        });

    }
    /* End of Utility sidenav functions */

    // $scope.addUtility = function() {
    //     $scope.utility.branch_id = $scope.branch.branch_id;
    //     if($scope.branch.role == "Staff"){
    //         $scope.approval.approval_mode = "add";
    //         $scope.approval.request_id = requestId;
    //         $scope.approval.approval_data = $scope.utility;
    //         DataFactory.AddApprovalRequest($scope.approval).success(function(response){
    //             if(response.status == 200){
    //                 $scope.CloseSidebar();
    //             }
    //         }).error(function(error){

    //         });
    //     }
    //     else {
    //         DataFactory.AddNewUtility($scope.utility).success(function(response){
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
    
    $scope.ChangeRoom = function(room, idx){
        $scope.selectedRoom = room;
        $scope.utilityBillingCollection[idx].room_id = $scope.selectedRoom.room_id;
    }
    $scope.ChangePaymentRoom = function(room){
        $scope.selectedRoom = room;
        getTenantPerRoom(room);
    }
    $scope.ChangeUtilityTab = function(tab) {
        $scope.currentTab = tab;   
        $scope.filteredData = filterData($scope.currentTab);
    }
    $scope.addUtilityPrice = function() {
        $scope.utilityBilling = [];
        for(var i = 0; i < $scope.roomList.length; i++){
            var object = {
                room_id: $scope.roomList[i].room_id,
                bill_amount: $scope.roomList[i].bill_amount,
                utility_id: $scope.currentUtility.utility_id,
                month: $scope.utility_date.month,
                year: $scope.utility_date.year
            }
            $scope.utilityBilling.push(object);
        }

        console.log($scope.utilityBilling);
        DataFactory.MakeUtilityBillingStatement($scope.utilityBilling).success(function(response){
            if(response.status == 200){
                $scope.CloseSidebar();
            }
        }).error(function(error){

        })
    }
    // $scope.addUtilityPrice = function() {
    //     $scope.utilityPrice.status = "active";
    //     $scope.utilityPrice.utility_id = $scope.currentUtility.utility_id;
    //     $scope.utilityPrice.branch_id = $scope.branch.branch_id;
    //     DataFactory.AddNewUtilityPrice($scope.utilityPrice).success(function(response){
    //         if(response.status == 200){
    //             $scope.log.page_action = "Add New Utility Price";
    //             DataFactory.AddPageLog($scope.log).success(function(response){
    //             }).error(function(error){

    //             });
    //             getData();
    //             $scope.CloseSidebar();
    //         }
    //         else  {
    //             $scope.errorNotification = response.message;
    //         }
    //     }).error(function(error){

    //     });
    // }

    // $scope.addUtilityReading = function() {
    //     $scope.utilityReading.status = "active";
    //     $scope.utilityReading.utility_id = $scope.currentUtility.utility_id;
    //     $scope.utilityReading.branch_id = $scope.branch.branch_id;
    //     DataFactory.AddNewUtilityReading($scope.utilityReading).success(function(response){
    //         if(response.status == 200){
    //             $scope.log.page_action = "Add New Utility Reading";
    //             DataFactory.AddPageLog($scope.log).success(function(response){
    //             }).error(function(error){

    //             });
    //             getData();
    //             $scope.CloseSidebar();
    //         }
    //         else {
    //             $scope.errorNotification = response.message;
    //         }
    //     }).error(function(error){

    //     });
    // }
    $scope.addUtility = function() {
        $scope.utility.branch_id = $scope.branch.branch_id;
        $scope.utility.status = "active";
        DataFactory.AddNewUtility($scope.utility).success(function(response){
            if(response.status == 200){
                $scope.log.page_action = "Add New Utility";
                DataFactory.AddPageLog($scope.log).success(function(response){
                }).error(function(error){

                });
                getUtilityDagetDatata();
                $scope.CloseSidebar();
            }
            else {
                $scope.errorNotification = response.message;
            }
        }).error(function(error){

        });
    }
    
    $scope.editUtility = function(disable) {
        if($scope.disable == false){
            $scope.utility.branch_id = $scope.branch.branch_id;
            DataFactory.EditUtility($scope.utility).success(function(response){
                if(response.status == 200){
                    $scope.log.page_action = "Edit Utility";
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

    $scope.deleteUtility = function(item){
        DataFactory.DeleteUtility(item).success(function(response){
            if(response.status == 200){
                $scope.log.page_action = "Delete Utility";
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
    
    getData();
    initializeVariables();
});