/* Factory */
var mainFactory = angular.module('Main-Factory', []); //
mainFactory.service('AppService', function(){
    var currBranch = {};
    this.setCurrBranch = function(branch){
        currBranch = branch;
    }
    this.getCurrBranch = function () {
        console.log(currBranch);
        return currBranch;
    }
});
mainFactory.factory('DataFactory', ['$http', function ($http) {
    var pre = "";

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        for (var i = 0; i < 3; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    var locationString = "/migatsu_api/public/api/";
    return {
        //Samples
        SampleGET: function () {
            return $http({
                url: "url/sampleget",
                method: 'GET', cache: false
            });
        },
        SamplePOST: function (obj) {
            return $http({
                method: "POST",
                url: "url/samplepost",
                data: obj,
            });
        },

        /* Login */
        SignIn: function(user){
            return $http({
                method: "POST",
                url: 'index.php/UserController/login',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: user
            });
        },
        /* End of Login */
        /** User Management  **/
        GetUserList: function(branchID){
            return $http({
                method: "GET",
                url: "index.php/UserController/getAllUsersPerBranch",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: branchID
            })
        },
        AddNewUser: function(user){
            return $http({
                method: "POST",
                url: "index.php/UserController/addNewUser",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:user
            })
        },
        /** Tenant **/
        GetTenantList: function(id) {
            return $http({
                method: "POST",
                url: "index.php/TenantController/getAllTenantsPerBranch",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'branch_id' : id}
            })
        },
        AddNewTenant: function(tenant){
            return $http({
                method: "POST",
                url: "index.php/TenantController/addNewTenant",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:tenant
            })
        },
        AddNewPayment: function(tenant) {
            return $http({
                method: "POST",
                url: "index.php/TenantController/addNewPayment",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:tenant
            })
        },
        /** Room **/
        GetRoomList: function(id) {
            return $http({
                method: "POST",
                url: "index.php/RoomController/getAllRoomsPerBranch",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'branch_id' : id}
            })
        },
        GetCountTenantPerRoomPerBranch: function(id){
            return $http({
                method: "POST",
                url: "index.php/RoomController/getTenantPerRoomPerBranchSummary",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'branch_id' : id}
            })
        },
        AddRoom: function(room){
            return $http({
                method: "POST",
                url: "index.php/RoomController/addRoom",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:room
            })
        },
        GetTenantPerRoom: function(room){
            return $http({
                method: "POST",
                url: "index.php/RoomController/getTenantPerRoom",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:room
            })
        },
        /** Service */
        AddService: function(service){
            return $http({
                method: "POST",
                url: "index.php/ServiceController/addService",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:service
            })
        },
        /** Inventory  **/
        GetInventoryList: function(id) {
            return $http({
                method: "POST",
                url: "index.php/InventoryController/getAllInventoryPerBranch",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'branch_id' : id}
            })
        },
        GetInventoryPerRoom: function(room) {
            return $http({
                method: "POST",
                url: "index.php/InventoryController/getAllInventoryPerBranchPerRoom",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: room
            })
        },
        AddNewInventory: function(inventory) {
            return $http({
                method: "POST",
                url: "index.php/InventoryController/addNewInventory",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: inventory
            })
        },
        EditInventory: function(inventory) {
            return $http({
                method: "POST",
                url: "index.php/InventoryController/editInventory",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: inventory
            })
        },
        /** Utility **/
        GetUtilityList: function(id) {
            return $http({
                method: "POST",
                url: "index.php/UtilityController/getAllUtility",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'branch_id' : id}
            })
        },
        AddNewUtility: function(utility) {
            return $http({
                method: "POST",
                url: "index.php/UtilityController/addNewUtility",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: utility
            })
        },
        EditUtility: function(utility) {
            return $http({
                method: "POST",
                url: "index.php/UtilityController/editUtility",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: utility
            })
        }
    }

}]);