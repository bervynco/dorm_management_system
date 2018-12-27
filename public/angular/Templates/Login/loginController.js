 app.controller('LoginController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    
    $scope.user = {
        username: '',
        password: ''
    }
    $scope.Login = function(){
        DataFactory.SignIn($scope.user).success(function(response){
            if(response.status == 200){
                localStorage.setItem("user", JSON.stringify(response.data[0]));
                $scope.LoadSessionData();
                sessionStorage.setItem("branch", JSON.stringify(response.data[0].branch[0]));
                $scope.LoadSelectedBranch();
                $scope.$parent.ChangeState("inventory");
            }
        }).error(function(error){

        });
        // $scope.$parent.ChangeState("inventory");
        
    }
});