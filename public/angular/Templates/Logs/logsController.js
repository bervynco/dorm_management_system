 app.controller('LogsController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('logs');
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));

    $scope.log = {
        user_id: $scope.userDetails.user_id,
        page_name: "Logs",
        page_action: "View",
        branch_id: $scope.branch.branch_id
    }
    DataFactory.AddPageLog($scope.log).success(function(response){
    }).error(function(error){

    });

    function getAllData(){
        DataFactory.GetAllLogs($scope.branch.branch_id).success(function(response){
            console.log(response.data);
            $scope.rows = response.data;
        }).error(function(error){

        });
    }

   
    getAllData();
});