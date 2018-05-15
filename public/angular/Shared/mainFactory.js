/* Factory */
var mainFactory = angular.module('Main-Factory', []); //
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
            console.log(user);
            return $http({
                method: "POST",
                url: 'index.php/UserManagement/login',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: user
            });
        },
        /* End of Login */
        /** System Logs **/
        SetPageLog: function(logDetail){
            return $http({
                method: "POST",
                url: "index.php/LogManagement/setPageLog",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: logDetail
            });
        },
        GetPageLogs: function(){
            return $http({
                method: "GET",
                url: "index.php/LogManagement/getPageLogs",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        /** Inventory **/
        GetInventoryToday: function(){
            return $http({
                method: "GET",
                url: 'index.php/InventoryManagement/getTransactions',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        GetInventoryList: function(){
            return $http({
                method: "GET",
                url: 'index.php/InventoryManagement/getAllInventory',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        AddNewInventory: function(inventory){
            return $http({
                method: "POST",
                url: 'index.php/InventoryManagement/addNewInventory',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:inventory
            })
        },
        EditInventoryItem: function(inventory){
            return $http({
                method: "POST",
                url: 'index.php/InventoryManagement/editInventory',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:inventory
            })
        },
        DeleteInventoryItem: function(inventory){
            return $http({
                method: "DELETE",
                url: 'index.php/InventoryManagement/deleteInventory',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:inventory
            })
        },
        /** Customer **/
        GetCustomerList: function(){
            return $http({
                method: "GET",
                url: 'index.php/CustomerManagement/getAllCustomers',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        AddNewCustomer: function(customer){
            return $http({
                method: "POST",
                url: 'index.php/CustomerManagement/addNewCustomer',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:customer
            })
        },
        EditCustomer: function(customer){
            return $http({
                method: "POST",
                url: 'index.php/CustomerManagement/editCustomer',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:customer
            })
        },
        DeleteCustomer: function(customer){
            return $http({
                method: "DELETE",
                url: 'index.php/CustomerManagement/deleteCustomer',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:customer
            })
        },

        /** Receivables */
        GetReceivablesToday: function(){
            return $http({
                method: "GET",
                url: 'index.php/ReceivableManagement/getTransactions',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        GetReceivableList: function(){
            return $http({
                method: "GET",
                url: 'index.php/ReceivableManagement/getAllReceivable',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        AddNewReceivable: function(receivable){
            return $http({
                method: "POST",
                url: 'index.php/ReceivableManagement/addNewReceivable',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: receivable
            })
        },
        EditReceivable: function(receivable){
            return $http({
                method: "POST",
                url: 'index.php/ReceivableManagement/editReceivable',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:receivable
            })
        },
        DeleteReceivable: function(receivable){
            return $http({
                method: "DELETE",
                url: 'index.php/ReceivableManagement/deleteReceivable',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:receivable
            })
        },
        ToggleReceivableDone: function(receivable){
            return $http({
                method: "POST",
                url: "index.php/ReceivableManagement/toggleReceivableDone",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:receivable
            })
        },
        
        /** Payables **/
        GetPayablesToday: function(){
            return $http({
                method: "GET",
                url: "index.php/PayableManagement/getTransactions",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        GetPayableList: function(){
            return $http({
                method: "GET",
                url: "index.php/PayableManagement/getAllPayable",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        AddNewPayable: function(payable){
            return $http({
                method: "POST",
                url: "index.php/PayableManagement/addNewPayable",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: payable
            })
        },
        EditPayable: function(payable){
            return $http({
                method: "POST",
                url: "index.php/PayableManagement/editPayable",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:payable
            })
        },
        DeletePayable: function(payable){
            return $http({
                method: "DELETE",
                url: "index.php/PayableManagement/deletePayable",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:payable
            })
        },
        TogglePayableDone: function(payable){
            return $http({
                method: "POST",
                url: "index.php/PayableManagement/togglePayableDone",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:payable
            })
        },

        /** Purchase Order **/
        GetPurchaseOrderToday: function(){
            return $http({
                method: "GET",
                url: "index.php/PurchaseOrderManagement/getTransactions",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        GetInventoryPOList: function(){
            return $http({
                method: "GET",
                url: "index.php/InventoryManagement/getAllInventoryForPurchaseOrder",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        GetPurchaseOrderList: function(){
            return $http({
                method: "GET",
                url: "index.php/PurchaseOrderManagement/getAllPurchaseOrder",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        AddPurchaseOrder: function(po){
            return $http({
                method: "POST",
                url: "index.php/PurchaseOrderManagement/addNewPurchaseOrder",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: po
            })
        },
        EditPurchaseOrder: function(po){
            return $http({
                method: "POST",
                url: "index.php/PurchaseOrderManagement/editPurchaseOrder",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: po
            })
        },
        DeletePurchaseOrder: function(po){
            return $http({
                method: "POST",
                url: "index.php/PurchaseOrderManagement/deletePurchaseOrder",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: po
            })
        },
        ApplyInventoryChanges: function(po){
            return $http({
                method: "POST",
                url: "index.php/PurchaseOrderManagement/applyInventoryChanges",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: po
            })
        },
        TogglePurchaseOrderDone: function(po){
            return $http({
                method: "POST",
                url: "index.php/PurchaseOrderManagement/togglePurchaseOrderDone",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:po
            })
        },
        /** Suppliers **/
        GetSupplierList: function(){
            return $http({
                method: "GET",
                url: 'index.php/SupplierManagement/getAllSuppliers',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        AddNewSupplier: function(supplier){
            return $http({
                method: "POST",
                url: 'index.php/SupplierManagement/addNewSupplier',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:supplier
            })
        },
        EditSupplier: function(supplier){
            return $http({
                method: "POST",
                url: 'index.php/SupplierManagement/editSupplier',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:supplier
            })
        },
        DeleteSupplier: function(supplier){
            return $http({
                method: "DELETE",
                url: 'index.php/SupplierManagement/deleteSupplier',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:supplier
            })
        },
        /** User Management  **/
        GetUserList: function(){
            return $http({
                method: "GET",
                url: "index.php/UserManagement/getAllUsers",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        AddNewUser: function(user){
            return $http({
                method: "POST",
                url: "index.php/UserManagement/addNewUser",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:user
            })
        },
        EditUser: function(user){
            return $http({
                method: "POST",
                url: "index.php/UserManagement/editUser",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:user
            });
        },
        DeleteUser: function(user){
            return $http({
                method: "DELETE",
                url: "index.php/UserManagement/deleteUser",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:user
            })
        },
        ChangePassword: function(user){
            console.log(user);
            return $http({
                method: "POST",
                url: "index.php/UserManagement/changePassword",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:user
            })
        },
        /** Generate Report */
        GenerateReport: function(report){
            return $http({
                method: "POST",
                url: "index.php/ReportManagement/generateReport",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:report
            })
        },
        GetOutboundDeliveryToday: function(){
            return $http({
                method: "GET",
                url: "index.php/OutboundDeliveryManagement/getTransactions",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        GetOutboundDeliveryList: function(){
            return $http({
                method: "GET",
                url: "index.php/OutboundDeliveryManagement/getAllOutboundDelivery",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },

    }

}]);