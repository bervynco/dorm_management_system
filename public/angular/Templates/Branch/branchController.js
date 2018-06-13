 app.controller('BranchController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('manage-branch');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.disable = true;

    $scope.addNewBranch = function(){
        $scope.showSideNav = true;
    }

    $scope.CloseSidebar = function(object) {
        $scope[object] = null;
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
    }

    $scope.editUser = function(flag){
        if(flag == true)
            scope.disable = false;
        else {
            console.log("EDIT Underway");
        }
    }
    
    $scope.addBranch = function(ev){
        // DataFactory.AddNewUser($scope.user).success(function(response){
        //     if(response.status == 200){
        //         $scope.CloseSidebar($scope.user);
        //         $scope.showConfirm(ev);

        //     }
        // }).error(function(error){

        // });
    }
});