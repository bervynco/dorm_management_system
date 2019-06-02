 app.controller('LoginController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    
    $scope.user = {
        username: '',
        password: ''
    }
    
    $scope.Login = function(){
        DataFactory.SignIn($scope.user).success(function(response){
            console.log(response);
            if(response.status == 200){
                
                
                localStorage.setItem("user", JSON.stringify(response.data[0]));
                $scope.LoadSessionData();
                sessionStorage.setItem("branch", JSON.stringify(response.data[0].branch[0]));
                $scope.LoadSelectedBranch();
                $scope.log = {
                    user_id: response.data[0].user_id,
                    page_name: "Login",
                    page_action: "Login",
                    branch_id: response.data[0].branch[0].branch_id
                }
                DataFactory.AddPageLog($scope.log).success(function(response){
                }).error(function(error){

                });

                $scope.$parent.ChangeState("home");
            }
        }).error(function(error){

        });
        // $scope.$parent.ChangeState("inventory");
        
    }
});