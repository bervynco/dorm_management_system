/* For Authentication and UI-Router */
var mainRouter = angular.module('Main-Router', ["ui.router"]); //
mainRouter.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
        .state('site', {
            'abstract': true,
            template: '<div ui-view layout flex/>'
        })
        //Login
        .state('login', {
            parent: 'site',
            data: {
                roles: []
            },
            url: "/login",
            templateUrl: "public/angular/Templates/Login/login.html",
            controller: "LoginController"
        })
        .state('home', {
            parent: 'site',
            data: {
                roles: []
            },
            url: "/home",
            templateUrl: "public/angular/Templates/Home/home.html",
            controller: "HomeController"
        })
        .state('user', {
            parent: 'site',
            data: {
                roles: []
            },
            url: "/user",
            templateUrl: "public/angular/Templates/User/user.html",
            controller: "UserController"
        })
        .state('manage-branch', {
            parent: 'site',
            data: {
                roles: []
            },
            url: "/manage-branch",
            templateUrl: "public/angular/Templates/Branch/branch.html",
            controller: "BranchController"
        })
        .state('manage-room', {
            parent: 'site',
            data: {
                roles: []
            },
            url: "/manage-room",
            templateUrl: "public/angular/Templates/Room/room.html",
            controller: "RoomController"
        })
        .state('tenant', {
            parent: 'site',
            data: {
                roles: []
            },
            url: "/tenant",
            templateUrl: "public/angular/Templates/Tenant/tenant.html",
            controller: "TenantController"
        })
        .state('utility', {
            parent: 'site',
            data: {
                roles: []
            },
            url: "/utility",
            templateUrl: "public/angular/Templates/Utility/utility.html",
            controller: 'UtilityController'
        })
        .state('inventory', {
            parent: 'site',
            data: {
                roles: []
            },
            url: "/inventory",
            templateUrl: "public/angular/Templates/Inventory/inventory.html",
            controller: 'InventoryController'
        })
        .state('payables', {
            parent: 'site',
            data: {
                roles: []
            },
            url: "/payables",
            templateUrl: "public/angular/Templates/Payables/payables.html",
            controller: 'PayablesController'
        })
        .state('calendar', {
            parent: 'site',
            data: {
                roles: []
            },
            url: "/calendar",
            templateUrl: "public/angular/Templates/Calendar/calendar.html",
            controller: 'CalendarController'
        })
        .state('report', {
            parent: 'site',
            data: {
                roles: []
            },
            url: "/report",
            templateUrl: "public/angular/Templates/Report/report.html",
            controller: 'ReportController'
        })
        .state('compute', {
            parent: 'site',
            data: {
                roles: []
            },
            url: "/compute",
            templateUrl: "public/angular/Templates/Compute/compute.html",
            controller: 'ComputeController'
        })
        .state('request', {
            parent: 'site',
            data: {
                roles: []
            },
            url: "/request",
            templateUrl: "public/angular/Templates/Request/request.html",
            controller: 'RequestController'
        })

}]);