 app.controller('ComputeController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('compute');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.disable = true;

    $scope.generateBilling = function(){
        DataFactory.GenerateBilling($scope.branch.branch_id).success(function(response){

        }).error(function(error){

        });
    }
});