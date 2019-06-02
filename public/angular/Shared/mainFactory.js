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
        GetChequePaymentDetails: function(data){
            return $http({
                method: "POST",
                url: "index.php/TenantController/getChequeDetails",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:data
            })
        },
        AssignTenantToRoom: function(data){
            return $http({
                method: "POST",
                url: "index.php/TenantController/assignTenantToRoom",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:data
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
        GetAggregatedRoomList: function(id){
            return $http({
                method: "POST",
                url: "index.php/RoomController/getAggregatedRoomList",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'branch_id' : id}
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
        GetInventoryTransactions: function(id) {
            return $http({
                method: "POST",
                url: "index.php/InventoryController/getAllInventoryTransaction",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'branch_id': id}
            })

        },
        ModifyInventoryTransaction: function(transactions) {
            return $http({
                method: "POST",
                url: "index.php/InventoryController/updateInventoryTransactions",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: transactions
            })
        },
        GetInventoryPerRoom: function(data) {
            return $http({
                method: "POST",
                url: "index.php/InventoryController/getAllInventoryPerBranchPerRoom",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
        },
        GetInventoryPerTenant: function(data) {
            return $http({
                method: "POST",
                url: "index.php/InventoryController/getAllInventoryPerTenant",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
        },
        // GetCurrentInventoryStock: function(id) {
        //     return $http({
        //         method: "POST",
        //         url: "index.php/InventoryController/getCurrentInventoryStock",
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         data: {'branch_id' : id}
        //     })
        // },
        GetInventoryItemNotAssigned: function() {
            return $http({
                method: "POST",
                url: "index.php/InventoryController/getInventoryNotAssigned",
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
        AddNewUtilityPrice: function(utility){
            return $http({
                method: "POST",
                url: "index.php/UtilityController/addUtilityPrice",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: utility
            })
        },
        AddNewUtilityReading: function(utility){
            return $http({
                method: "POST",
                url: "index.php/UtilityController/addUtilityReading",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: utility
            })
        },
        GetAllReadingsAndPricings: function(utility){
            return $http({
                method: "POST",
                url: "index.php/UtilityController/getAllReadingAndPricing",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: utility
            })
        },
        /** Service **/
        GetServiceData: function(id) {
            return $http({
                method: "POST",
                url: "index.php/ServiceController/getAllServices",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'branch_id' : id}
            })
        },
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
        AssignServiceToTenant: function(data){
            return $http({
                method: "POST",
                url: "index.php/UtilityController/assignServiceToTenant",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
        },
        GetServicePerTenant: function(data){
            return $http({
                method: "POST",
                url: "index.php/ServiceController/getServicePerTenant",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
        },
        EditService: function(data){
            return $http({
                method: "POST",
                url: "index.php/ServiceController/editService",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
        },
        DeleteService: function(id){
            return $http({
                method: "POST",
                url: "index.php/ServiceController/deleteService",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'id': id}
            })
        },
        MakeServicePayment: function(data){
            return $http({
                method: "POST",
                url: "index.php/ServiceController/makeServicePayment",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
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
        GetPayableDues: function(id) {
            return $http({
                method: "POST",
                url: "index.php/PayableController/getAllPayableDues",
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
        GetBillingInformation: function(id) {
            return $http({
                method: "POST",
                url: "index.php/ComputeController/getBilling",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'branch_id' : id}
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
        AddNewBilling: function(data) {
            return $http({
                method: "POST",
                url: "index.php/ComputeController/addNewBilling",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
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
        },
        EditApprovalRequest: function(data) {
            return $http({
                method: "POST",
                url: "index.php/ApprovalRequestController/editApprovalRequest",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
        },
        /** Payment **/
        GetPaymentTypes: function() {
            return $http({
                method: "POST",
                url: "index.php/PaymentController/getPaymentTypes",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        GetChequePayment: function() {
            return $http({
                method: "POST",
                url: "index.php/PaymentController/getChequeList",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        UploadCheques: function(data) {
            return $http({
                method: "POST",
                url: "index.php/PaymentController/insertCheques",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
        },
        DeletePayment: function(data) {
            return $http({
                method: "POST",
                url: "index.php/PaymentController/deleteChequePayment",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
        },
        /** Logs */
        GetAllLogs: function(id){
            return $http({
                method: "POST",
                url: "index.php/LogsController/getAllLogs",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'branch_id' : id}
            })
        },
        AddPageLog: function(data) {
            return $http({
                method: "POST",
                url: "index.php/LogsController/addPageLog",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
        }
    }

}]);