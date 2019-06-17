<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!--<base href="http://localhost:8080/pektounleashed/app/">-->
    <title>Dorm Management</title>
    <!--build:js public/assets/js/main.min.js -->
    <script src="public/assets/js/jquery-2.2.1.js"></script>
    <script src="public/assets/js/angular.min.js"></script>
    <script src="public/assets/js/angular-animate.min.js"></script>
    <script src="public/assets/js/angular-aria.min.js"></script>
    <script src="public/assets/js/angular-material.min.js"></script>
    <script src="public/assets/js/angular-messages.min.js"></script>
    <script src="public/assets/js/jquery.scrollbar.min.js"></script>
    
    <!-- <script src="public/assets/libraries/Highcharts/highcharts.js"></script>
    <script src="public/assets/libraries/Highcharts/highcharts-custom.js"></script> -->
    <!-- <script src="public/assets/js/calendar.js"></script> -->
    <script src="public/assets/js/peity.js"></script>
    <script src="public/assets/js/tinycolor.js"></script>
    <script src="public/assets/js/md-color-picker.js"></script>
    <script src="public/assets/js/uirouter.js"></script>
    <script src="public/assets/js/moment.js"></script>
    <script src="public/assets/js/lodash.js"></script>
    <script src="public/assets/js/angular-local-storage.js"></script>
    <script src="public/assets/js/aes.js"></script>
    <!-- endbuild -->
    <!--build:js angular/angular.min.js -->
    <script src="public/angular/Shared/mainContentManager.js"></script>
    <script src="public/angular/Shared/mainDirectives.js"></script>
    <script src="public/angular/Shared/mainFactory.js"></script>
    <script src="public/angular/Shared/mainRouter.js"></script>
    <script src="public/angular/main.js"></script>

    <!-- Project -->
    <script src="public/angular/Templates/Billing/billingController.js"></script>
    <script src="public/angular/Templates/Dashboard/dashboardController.js"></script>
    <script src="public/angular/Templates/Login/loginController.js"></script>
    <script src="public/angular/Templates/Logs/logsController.js"></script>
    <script src="public/angular/Templates/Inventory/inventoryController.js"></script>
    <script src="public/angular/Templates/Payables/payablesController.js"></script>
    <script src="public/angular/Templates/Tenant/tenantController.js"></script>
    <script src="public/angular/Templates/Room/roomController.js"></script>
    <script src="public/angular/Templates/User/userController.js"></script>
    <script src="public/angular/Templates/Branch/branchController.js"></script>
    <script src="public/angular/Templates/Utility/utilityController.js"></script>
    <script src="public/angular/Templates/Calendar/calendarController.js"></script>
    <script src="public/angular/Templates/Report/reportController.js"></script>
    <script src="public/angular/Templates/Compute/computeController.js"></script>
    <script src="public/angular/Templates/Request/requestController.js"></script>
    <script src="public/angular/Templates/Service/serviceController.js"></script>
    <script src="public/angular/Templates/Upload Payment/paymentController.js"></script>
    <script src="public/angular/Templates/Tenant Detail/tenantDetailController.js"></script>
    <!--build:css css/styles.min.css-->
    <link rel="stylesheet" href="public/assets/css/jquery.scrollbar.css">
    <link rel="stylesheet" href="public/assets/css/material.css">
    <link rel="stylesheet" href="public/assets/css/calendar.css">
    <!-- <link rel="stylesheet" href="public/assets/css/styles.css"> -->
    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.css"> -->
    <link rel="stylesheet" href="public/assets/scss/styles.css">
    <!-- <link rel="stylesheet" href="public/assets/css/mainstyle.css"> -->

    <!--endbuild-->
</head>

<body ng-app="MainApplication" ng-controller="MainController" ng-class="{'login': currState == 'login'}" ng-cloak layout="row" layout-align="start stretch">
    <hud-styles></hud-styles>
    <!--START: LOADER-->
     <div ng-if="loadstate" class="load-container">
        <div class="loader-circle"></div>
        <div class="loader-line-mask">
            <div class="loader-line"></div>
        </div>
    </div> 
    <!--END: LOADER-->
    <div flex="none" id="side-menubar" layout="column" layout-align="start stretch" ng-if="currState != 'login'">
        <div flex="none" id="sidebar-logo" layout layout-align="start stretch">
            <span id="sidebar-text" flex layout layout-align="center center"> Management </span>
        </div>
        <!-- -->
        <div flex="none" id="sidebar-content" layout="column" layout-align="start stretch">
            
            <div class="sidebar-content-item" flex="none" layout layout-align="start stretch" 
                ng-click="ChangeState('home')">
                <span flex="none" ng-class="currState === 'home' ? 'status-active' : 'status-inactive'"></span>
                <div flex layout layout-align="start center">Dashboard</div>
            </div>
            <div class="sidebar-content-item" flex="none" layout layout-align="start stretch" 
                ng-click="ChangeState('user')">
                <span flex="none" ng-class="currState === 'user' ? 'status-active' : 'status-inactive'"></span>
                <div flex layout layout-align="start center">User Management</div>
            </div>
             <!-- <div class="sidebar-content-item" flex="none" layout layout-align="start stretch" 
                ng-click="ChangeState('manage-branch')">
                <span flex="none" ng-class="currState === 'manage-branch' ? 'status-active' : 'status-inactive'"></span>
                <div flex layout layout-align="start center">Branch Management</div>
            </div>  -->
            <div class="sidebar-content-item" flex="none" layout layout-align="start stretch" 
                ng-click="ChangeState('manage-room')">
                <span flex="none" ng-class="currState === 'manage-room' ? 'status-active' : 'status-inactive'"></span>
                <div flex layout layout-align="start center">Room Mangement</div>
            </div>
            <div class="sidebar-content-item" flex="none" layout layout-align="start stretch" 
                ng-click="ChangeState('tenant')">
                <span flex="none" ng-class="currState === 'tenant' ? 'status-active' : 'status-inactive'"></span>
                <div flex layout layout-align="start center">Tenant Management</div>
            </div>
            <div class="sidebar-content-item" flex="none" layout layout-align="start stretch" 
                ng-click="ChangeState('utility')">
                <span flex="none" ng-class="currState === 'utility' ? 'status-active' : 'status-inactive'"></span>
                <div flex layout layout-align="start center">Utility</div>
            </div>
            <div class="sidebar-content-item" flex="none" layout layout-align="start stretch" 
                ng-click="ChangeState('service')">
                <span flex="none" ng-class="currState === 'service' ? 'status-active' : 'status-inactive'"></span>
                <div flex layout layout-align="start center">Services</div>
            </div>
            <div class="sidebar-content-item" flex="none" layout layout-align="start stretch"  
                ng-click="ChangeState('inventory')" ng-class="currState === 'inventory' ? 'state-active' : ''">
                <span flex="none" ng-class="currState === 'inventory' ? 'status-active' : 'status-inactive'"></span>
                <div flex layout layout-align="start center">Inventory</div>
            </div>
            <div class="sidebar-content-item" flex="none" layout layout-align="start stretch" 
                ng-click="ChangeState('payables')" ng-class="currState === 'payables' ? 'state-active' : ''">
                <span flex="none" ng-class="currState === 'payables' ? 'status-active' : 'status-inactive'"></span>
                <div flex layout layout-align="start center">Payables</div>
            </div>
            <div class="sidebar-content-item" flex="none" layout layout-align="start stretch" 
                ng-click="ChangeState('uploadpayment')">
                <span flex="none" ng-class="currState === 'uploadpayment' ? 'status-active' : 'status-inactive'"></span>
                <div flex layout layout-align="start center">Upload Cheque Payment</div>
            </div>
            <!-- <div class="sidebar-content-item" flex="none" layout layout-align="start stretch" 
                ng-click="ChangeState('calendar')">
                <span flex="none" ng-class="currState === 'calendar' ? 'status-active' : 'status-inactive'"></span>
                <div flex layout layout-align="start center">Calendar</div>
            </div> -->
            <div class="sidebar-content-item" flex="none" layout layout-align="start stretch" 
                ng-click="ChangeState('report')">
                <span flex="none" ng-class="currState === 'report' ? 'status-active' : 'status-inactive'"></span>
                <div flex layout layout-align="start center">Reports</div>
            </div>
            <!-- <div class="sidebar-content-item" flex="none" layout layout-align="start stretch" 
                ng-click="ChangeState('request')">
                <span flex="none" ng-class="currState === 'request' ? 'status-active' : 'status-inactive'"></span>
                <div flex layout layout-align="start center">Request Management</div>
            </div> -->
            <div class="sidebar-content-item" flex="none" layout layout-align="start stretch" 
                ng-click="ChangeState('compute')">
                <span flex="none" ng-class="currState === 'compute' ? 'status-active' : 'status-inactive'"></span>
                <div flex layout layout-align="start center">Compute Billing</div>
            </div>
            <!-- <div class="sidebar-content-item" flex="none" layout layout-align="start stretch" 
                ng-click="ChangeState('billing')">
                <span flex="none" ng-class="currState === 'billing' ? 'status-active' : 'status-inactive'"></span>
                <div flex layout layout-align="start center">Billing Data</div>
            </div> -->
            <div class="sidebar-content-item" flex="none" layout layout-align="start stretch" 
                ng-click="ChangeState('logs')">
                <span flex="none" ng-class="currState === 'logs' ? 'status-active' : 'status-inactive'"></span>
                <div flex layout layout-align="start center">Logs</div>
            </div>
        </div>
    </div>
    <div flex layout="column" layout-align="start stretch">
        <div flex="none" id="navbar" layout layout-align="start stretch" ng-if="currState != 'login'">
            <div flex="none" class="navbar-dropdown" layout layout-align="start stretch">
                <select ng-model="selectedBranch" ng-options="branch.branch_name for branch in userDetails.branch track by branch.user_branch_id" ng-selected="selectedBranch" ng-change="ChangeBranch(selectedBranch)"></select>
                
                <!-- <select ng-change="ChangeBranch()" ng-model="selectedBranch">
                    <option ng-repeat="branch in userDetails.branch" ng-value="branch.branch_id">{{branch.branch_name}}</option>
                </select> -->
            </div>
            <div flex="85"></div>
            <div flex="10" class="navbar-dropdown" layout layout-align="start stretch">
                <div flex="none" layout layout-align="center center"> Hi, <div id="profile-details">{{userDetails.name}} </div></div>
            </div>
            <div flex="5" class="navbar-dropdown" layout layout-align="center center">
                <img flex="none" id="signout-icon"src="public/assets/images/icons/sign-out-option.png" width="30" height="30" ng-click="SignOut()">
            </div>

            
        </div>
        <div flex ui-view layout class="main-container" layout-align="start stretch"></div>
    </div>
    
</body>
</html>
