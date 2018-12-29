/* Factory */
var mainFactory = angular.module('Main-Factory', []); //
mainFactory.service('AppService', function(){
    var currBranch = {};
    var branch = JSON.parse(sessionStorage.getItem("branch"));
    this.setCurrBranch = function(branch){
        currBranch = branch;
    }
    this.getCurrBranch = function () {
        return currBranch;
    }
    this.getRequestId = function() {
        if(branch.role == 'Administrator')
            return 2;
        else
            return 1;
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
        GetUserList: function(id){
            return $http({
                method: "POST",
                url: "index.php/UserController/getAllUsersPerBranch",
                headers: {
                    'Content-Type': 'application/json'
                },
               data: {'branch_id' : id}
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
        DeleteInventory: function(inventory) {
            return $http({
                method: "POST",
                url: "index.php/InventoryController/deleteInventory",
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
        },
        DeleteUtility: function(utility){
            return $http({
                method: "POST",
                url: "index.php/UtilityController/deleteUtility",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: utility
            })
        },
        AssignUtilityToTenant: function(assign){
            return $http({
                method: "POST",
                url: "index.php/UtilityController/assignUtilityToTenant",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: assign
            })
        },
        /** Calendar **/
        GetCalendarList: function(id) {
            return $http({
                method: "POST",
                url: "index.php/CalendarController/getAllCalendar",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'branch_id' : id}
            })
        },
        AddNewCalendar: function(calendar) {
            return $http({
                method: "POST",
                url: "index.php/CalendarController/addNewCalendar",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: calendar
            })
        },
        EditCalendar: function(calendar){
            return $http({
                method: "POST",
                url: "index.php/CalendarController/editCalendar",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: calendar
            })
        },
        /** Generate Report **/
        GenerateReport: function(report){
            return $http({
                method: "POST",
                url: "index.php/ReportController/generateReport",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: report
            })
        },
        /** Payables **/
        GetPayableList: function(id) {
            return $http({
                method: "POST",
                url: "index.php/PayableController/getAllPayable",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'branch_id' : id}
            })
        },
        AddNewPayable: function(payables) {
            return $http({
                method: "POST",
                url: "index.php/PayableController/addNewPayable",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: payables
            })
        },
        EditPayable: function(payables){
            return $http({
                method: "POST",
                url: "index.php/PayableController/editPayable",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: payables
            })
        },
        DeletePayable: function(payables){
            return $http({
                method: "POST",
                url: "index.php/PayableController/deletePayable",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: payables
            })
        },
        GenerateBilling: function(id) {
            return $http({
                method: "POST",
                url: "index.php/ComputeController/generateBilling",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'branch_id' : id}
            })
        },
        GetRequestApprovalData: function(id) {
             return $http({
                method: "POST",
                url: "index.php/ApprovalRequestController/getAllRequest",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'branch_id' : id}
            })
        },
        AddApprovalRequest: function(data) {
            return $http({
                method: "POST",
                url: "index.php/ApprovalRequestController/addApprovalRequest",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
        }
    }

}]);