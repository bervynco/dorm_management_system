 app.controller('UserController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('user');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.disable = true;
    $scope.user = {
        name: '',
        username: '',
        password: '',
        mobile_number: '',
        request_id: '',
        branch_id: ''
    }
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    var requestId;
    function getRequestID() {
        requestId = AppService.getRequestId();
    }
    function getAllUsers(){
        DataFactory.GetUserList($scope.branch.branch_id).success(function(response){
            console.log(response);
            $scope.rows = response;
        }).error(function(error){

        });
    }
    $scope.addNewUser = function(){
        $scope.showSideNav = true;
    }

    $scope.addUser = function(ev){
        $scope.user.request_id = requestId;
        $scope.user.branch_id = $scope.branch.branch_id;
        DataFactory.AddNewUser($scope.user).success(function(response){
            if(response.status == 200){
                $scope.CloseSidebar($scope.user);
                $scope.showConfirm(ev);

            }
        }).error(function(error){

        });
    }
    $scope.editUser = function(flag){
        if(flag == true)
            $scope.disable = false;
        else {
        }
    }
    $scope.CloseSidebar = function(object) {
        $scope[object] = null;
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
    }

    $scope.showCompeleteDetails = function(user){
        $scope.showCompleteDetailsFlag = true;
        $scope.user = user;
    }

    $scope.showConfirm = function(ev) {
        var confirm = $mdDialog.confirm()
            .title('Would you like to add user in a branch?')
            .textContent('You will be redirected to another page.')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Yes')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
            $scope.$parent.ChangeAppState('manage-branch');
            $state.go('manage-branch');
        }, function() {
        });
    };
    getAllUsers();
    getRequestID();
});