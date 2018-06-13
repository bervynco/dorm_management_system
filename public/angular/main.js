/* MAIN MODULE */
var app = angular.module('MainApplication', [
    "ds.clock",
    "Main-Factory",
    "Main-Directives",
    "Main-Router",
    "Main-ContentManager",
    'ngSanitize',
    'ngAnimate',
    "ngMaterial",
    "jQueryScrollbar",
    "LocalStorageModule"]); //
app.controller('MainController', function ($mdDialog, $mdToast, $state, $mdSidenav, $rootScope, $scope, $log, AppService, DataFactory, ConfigurableItems) {
    $scope.currState = 'login';
    $scope.ChangeState = function (num) {
        $state.go(num);
    }

    $scope.ChangeAppState = function (num) {
        $scope.currState = num;
    }

    $scope.LoadSessionData = function(){
        $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    }

    $scope.ChangeBranch = function(branch){
        console.log(branch);
        AppService.setCurrBranch(branch);
    }
    $scope.LoadSessionData();
    
});