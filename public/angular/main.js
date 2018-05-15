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
app.controller('MainController', function ($mdDialog, $mdToast, $state, $mdSidenav, $rootScope, $scope, $log, DataFactory, ConfigurableItems) {
    $scope.currState = 'login';
    $scope.ChangeState = function (num) {
        $state.go(num);
    }

    $scope.ChangeAppState = function (num) {
        $scope.currState = num;
        console.log(num);
    }

});