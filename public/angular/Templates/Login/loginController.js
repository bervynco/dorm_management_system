 app.controller('LoginController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    
    $scope.user = {
        username: '',
        password: ''
    }
    $scope.Login = function(){
        console.log("LOGIN");
        // $scope.$parent.ShowCustomToast(null, 'loading', 'login');
        $scope.$parent.ChangeState("inventory");
        
    }
});