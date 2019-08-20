 app.controller('InventoryController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    var requestId;
    $scope.$parent.ChangeAppState('inventory');
    $scope.showSideNav = false;
    $scope.showSideNavAssignToTenant = false;
    $scope.showSideNavAssignToRoom = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.disable = true;
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    $scope.errorNotification = null;
    $scope.inventoryTab = [
                            {
                                'name': "room",
                                'text': "Assigned to Room" 
                            },
                            {
                                'name': "rent",
                                'text': "Rented by Tenant"
                            },
                            {
                                'name': "stock",
                                'text': "Current Inventory Stock"
                            }];
    $scope.currentTab = $scope.inventoryTab[0];
    
    function getRequestID() {
        requestId = AppService.getRequestId();
    }

    function initializeVariables() {
        $scope.inventory = {
            item_code: "",
            item_name: "",
            description: "",
            inventory_transaction_type: "",
            room_id: "",
            tenant_id: "",
            status: "active",
            start_date: null,
            end_date: null,
            rent_amount: 0,
            branch_id: $scope.branch.branch_id
        }
        $scope.approval = {
            approval_section: 'inventory',
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
        $scope.inventoryAssignment = {
            inventory_transaction_id: "",
            inventory_transaction_type: "",
            rent_amount: "",
            start_date: "",
            end_date: "",
            room_id: "",
            tenant_id: ""
        }
    }

    function filterData(data, currentTab) {
        return _.filter(data, function(o) { 
            return currentTab == o.inventory_transaction_type; 
        });
    }

    $scope.log = {
        user_id: $scope.userDetails.user_id,
        page_name: "Inventory",
        page_action: "View",
        branch_id: $scope.branch.branch_id
    }
    DataFactory.AddPageLog($scope.log).success(function(response){
    }).error(function(error){

    });
    
    function getAllData(){

        DataFactory.GetInventoryTransactions($scope.branch.branch_id).success(function(response){
            console.log(response.data);
            $scope.originalData = response.data;
            $scope.rows = filterData(response.data, $scope.currentTab.name);
            $scope.inventoryList = filterData(response.data, "stock");
            if($scope.inventoryList.length > 0){
                $scope.currentInventoryItem = $scope.inventoryList[0];
            }
            
        }).error(function(error){

        });
        DataFactory.GetRoomList($scope.branch.branch_id).success(function(response){
            $scope.roomList = response.data;
            $scope.currentRoom = $scope.roomList[0];
            if($scope.roomList.length > 0){
                $scope.currentRoom = $scope.roomList[0];
            }
        }).error(function(error){

        });

        DataFactory.GetTenantList($scope.branch.branch_id).success(function(response){
            $scope.tenantList = response.data;
            if($scope.tenantList.length > 0){
                $scope.currentTenant = $scope.tenantList[0];
            }
            
        }).error(function(error){

        });
    }

    $scope.addNewInventory = function(){
        $scope.showSideNav = true;
    }

    $scope.assignToRoom = function(){
        $scope.showSideNavAssignToRoom = true;
    }

    $scope.assignToTenant = function(){
        $scope.showSideNavAssignToTenant = true;
    }
    
    $scope.ChangePageTab = function(tab) {
        $scope.currentTab = tab;
        $scope.rows = filterData($scope.originalData, $scope.currentTab.name);
        
    }
    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
        $scope.showSideNavAssignToRoom = false;
        $scope.showSideNavAssignToTenant = false;
        $scope.disable = true;
        $scope.errorNotification = null;
        initializeVariables();
    }

    $scope.showCompleteDetails = function(item){
        $scope.inventory = angular.copy(item);
        if("start_date" in $scope.inventory && "end_date" in $scope.inventory){
            $scope.inventory.start_date = new Date(item.start_date);
            $scope.inventory.end_date = new Date(item.end_date);
        }
        $scope.showCompleteDetailsFlag = true;
        LoadDropdown(item, $scope.currentTab.name);
    }

    function LoadDropdown(item, tabName){
        var index = 0;
        if(tabName == 'room'){
            var index = _.findIndex($scope.roomList, function(o){
                return o.room_id == item.room_id;
            });
            $scope.currentRoom = $scope.roomList[index];
        }
        else{
            var index = _.findIndex($scope.tenantList, function(o){
                return o.tenant_id == item.tenant_id;
            });
            $scope.currentTenant = $scope.tenantList[index];
        }
    }

    $scope.ChangeInventoryRoom = function(room){
        $scope.currentRoom = room;
    }

    $scope.ChangeInventoryItem = function(inventoryItem){
        $scope.currentInventoryItem = inventoryItem;
    }
    
    $scope.ChangeTenant = function(tenant){
        $scope.currentTenant = tenant;
        console.log($scope.currentTenant)
    }
    $scope.assignInventoryToTenant = function() {
        $scope.inventoryAssignment['tenant_id'] = $scope.currentTenant['tenant_id'];
        $scope.inventoryAssignment['inventory_transaction_id'] = $scope.currentInventoryItem['inventory_transaction_id'];
        $scope.inventoryAssignment['inventory_transaction_type'] = "rent";
        $scope.inventoryAssignment['start_date'] = moment($scope.inventoryAssignment['start_date']).format("YYYY-MM-DD HH:mm");
        $scope.inventoryAssignment['end_date'] = moment($scope.inventoryAssignment['end_date']).format("YYYY-MM-DD HH:mm");
        DataFactory.ModifyInventoryTransaction($scope.inventoryAssignment).success(function(response){
            if(response.status == 200){
                $scope.log.page_action = "Assign Inventory to Tenant";
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

    $scope.assignInventoryToRoom = function() {
        $scope.inventoryAssignment['room_id'] = $scope.currentRoom['room_id'];
        $scope.inventoryAssignment['inventory_transaction_id'] = $scope.currentInventoryItem['inventory_transaction_id'];
        $scope.inventoryAssignment['inventory_transaction_type'] = "room";
        $scope.inventoryAssignment['start_date'] = moment($scope.inventoryAssignment['start_date']).format("YYYY-MM-DD HH:mm");
        $scope.inventoryAssignment['end_date'] = moment($scope.inventoryAssignment['end_date']).format("YYYY-MM-DD HH:mm");
        DataFactory.ModifyInventoryTransaction($scope.inventoryAssignment).success(function(response){
            if(response.status == 200){
                $scope.log.page_action = "Assign Inventory to Room";
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

    $scope.addNewItem = function() {
        // $scope.inventory.branch_id = $scope.branch.branch_id;
        $scope.inventory.inventory_transaction_type = "stock";
        // if($scope.branch.role == "Staff"){
        //     $scope.approval.approval_mode = "add";
        //     $scope.approval.request_id = requestId;
        //     $scope.approval.approval_data = $scope.inventory;
        //     DataFactory.AddApprovalRequest($scope.approval).success(function(response){
        //         if(response.status == 200){
        //             $scope.log.page_action = "Add New Inventory Item";
        //             DataFactory.AddPageLog($scope.log).success(function(response){
        //             }).error(function(error){

        //             });
        //             getAllData();
        //             $scope.CloseSidebar();
        //         }
        //         else {
        //             $scope.errorNotification = response.message;
        //         }
        //     }).error(function(error){

        //     });
        // }
        // else {
        DataFactory.AddNewInventory($scope.inventory).success(function(response){
            if(response.status == 200){
                $scope.log.page_action = "Add New Inventory Item";
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
        // }
    }

    $scope.editInventory = function(){
        if($scope.disable == false){    
            if($scope.currentTab.name == 'rent'){
                $scope.inventory.tenant_id = $scope.currentTenant.tenant_id;
            }
            else if($scope.currentTab.name == 'room'){
                $scope.inventory.room_id = $scope.currentRoom.room_id;
            }
            else{
                $scope.inventory.tenant_id = 0;
                $scope.inventory.room_id = 0;
            }
            DataFactory.EditInventory($scope.inventory).success(function(response){
                if(response.status == 200){
                    $scope.log.page_action = "Edit Inventory Item";
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

    $scope.deleteInventory = function(item){
        console.log(item);
        if($scope.currentTab.name == 'stock'){
            DataFactory.DeleteInventory(item).success(function(response){
                if(response.status == 200){
                    $scope.log.page_action = "Delete Inventory Item";
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
        else {
            console.log("Move back to stock");
            
            item['inventory_transaction_type'] = 'stock';
            item['tenant_id'] = 0;
            item['room_id'] = 0;
            item['start_date'] = null;
            item['end_date'] = null;
            item['rent_amount'] = null;
            console.log(item);
            DataFactory.ModifyInventoryTransaction(item).success(function(response){
                if(response.status == 200){
                    $scope.log.page_action = "Move item back to stock";
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
        
    }
    // $scope.showCompleteUtilityDetails = function(inventory){
        
    // }
    // $scope.downloadPage = function(page) {
    //     var object = {'page': page, 'branch_id': $scope.branch.branch_id}
    //     DataFactory.DownloadPage(object).success(function(response){
    //         $window.location.href = response;
    //     }).error(function(error){

    //     });
    // }

    
    getAllData();
    initializeVariables();
});