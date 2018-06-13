 app.controller('LoginController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    
    $scope.user = {
        username: '',
        password: ''
    }
    $scope.Login = function(){
        console.log("LOGIN");
        // $scope.$parent.ShowCustomToast(null, 'loading', 'login');
        DataFactory.SignIn($scope.user).success(function(response){
            if(response.status == 200){
                localStorage.setItem("user", JSON.stringify(response.data[0]));
                $scope.LoadSessionData();
                $scope.ChangeBranch($scope.userDetails.branch[0]);
                $scope.$parent.ChangeState("inventory");
            }
        }).error(function(error){

        });
        // $scope.$parent.ChangeState("inventory");
        
    }
});