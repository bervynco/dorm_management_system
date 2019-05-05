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
    "LocalStorageModule",
    "ui.rCalendar"]); //
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

    $scope.LoadSelectedBranch = function(){
        // $scope.selectedBranch = response.data[0].branch[0].branch_name;
        $scope.selectedBranch = JSON.parse(sessionStorage.getItem("branch"));
        console.log($scope.selectedBranch);
    }
    $scope.ChangeBranch = function(branch){
        console.log(branch);
        sessionStorage.setItem("branch", JSON.stringify(branch));
        window.location.reload();
    }
    $scope.LoadSessionData();
    $scope.LoadSelectedBranch();
    
});