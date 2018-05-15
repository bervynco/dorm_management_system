 app.controller('LogController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog) {
    $scope.SVG = $scope.ConfigurableItems.SVG;
    $scope.$parent.CheckSessionData("logs");

    $scope.tableFieldNames = ['Employee Name', 'Page', 'Action', 'Timestamp'];
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    $scope.logDetails = {name: $scope.userDetails.name, page: 'System Logs Page', action: 'View'};

    $scope.currentPage = 0;
    DataFactory.SetPageLog($scope.logDetails).success(function(response){
        console.log(response);
    }).error(function(error){

    });

    DataFactory.GetPageLogs().success(function(response){
        $scope.logList = response;
    }).error(function(error){
        
    });

    $scope.ChangePage = function(i){
    }
    $scope.NextPage = function(i){
        if(($scope.currentPage + 1 )* 15 <= $scope.filtered.length){
            $scope.currentPage = $scope.currentPage + 1;
        }
        
    }
    $scope.PreviousPage = function(i){
        if($scope.currentPage != 0){
            $scope.currentPage = $scope.currentPage - 1;
        }
    }
});