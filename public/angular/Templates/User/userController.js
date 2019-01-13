 app.controller('UserController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('user');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.disable = true;
    var requestId;
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    
    $scope.approval = {
        approval_section: 'user',
        approval_mode: '',
        approval_data: '',
        request_id: '',
        user_id: $scope.userDetails.user_id,
        status: 'active',
        branch_id: $scope.branch.branch_id
    }
    $scope.user = {
        name: '',
        username: '',
        password: '',
        mobile_number: '',
        request_id: '',
        branch_id: $scope.branch.branch_id
    }
    
    
    function getRequestID() {
        requestId = AppService.getRequestId();
    }
    function getAllUsers(){
        DataFactory.GetUserList($scope.branch.branch_id).success(function(response){
            $scope.rows = response;
        }).error(function(error){

        });
    }
    $scope.addNewUser = function(){
        $scope.showSideNav = true;
    }

    $scope.addUser = function(ev){
        if($scope.branch.role == "Staff"){
            $scope.approval.approval_mode = "add";
            $scope.approval.request_id = requestId;
            $scope.approval.approval_data = $scope.user;
            DataFactory.AddApprovalRequest($scope.approval).success(function(response){
                if(response.status == 200){
                    $scope.CloseSidebar($scope.approval);
                }
            }).error(function(error){

            });
        }
        else {
            DataFactory.AddNewUser($scope.user).success(function(response){
                if(response.status == 200){
                    $scope.CloseSidebar($scope.user);
                }
            }).error(function(error){

            });
        }
        
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

    $scope.downloadPage = function(page) {
        var object = {'page': page, 'branch_id': $scope.branch.branch_id}
        DataFactory.DownloadPage(object).success(function(response){
            $window.location.href = response;
        }).error(function(error){

        });
    }
    getAllUsers();
    getRequestID();
});