 app.controller('CalendarController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('calendar');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.assignServicesToTenantFlag = false;
    $scope.disable = true;

    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));

    function initializeVariables(){
        $scope.calendar = {
            calendar_event_name: '',
            calendar_description: '',
            calendar_date: ''

        }
    }

    function getAllData(){
        DataFactory.GetCalendarList($scope.branch.branch_id).success(function(response){
            if(response.status = 200)
                $scope.rows = response.data;
        }).error(function(error){

        });
    }

    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
        $scope.assignServicesToTenantFlag = false;
        $scope.disable = true;
        initializeVariables();
    }

    $scope.addNewCalendar = function() {
        $scope.showSideNav = true;
    }

    $scope.showCompleteDetails = function(calendar){
        $scope.showCompleteDetailsFlag = true;
        calendar.calendar_date = new Date(calendar.calendar_date);
        $scope.calendar = calendar;
    }

    $scope.addCalendar = function() {
        $scope.calendar.branch_id = $scope.branch.branch_id;
        DataFactory.AddNewCalendar($scope.calendar).success(function(response){
            if(response.status = 200){
                $scope.CloseSidebar();
            }
        }).error(function(error){

        });
    }

    $scope.editCalendar = function(disable) {
        if($scope.disable == false){
            $scope.calendar.branch_id = $scope.branch.branch_id;
            // $scope.calendar.start_date = moment($scope.calendar.start_date).format("YYYY-MM-DD HH:mm:ss");
            // $scope.calendar.end_date = moment($scope.calendar.end_date).format("YYYY-MM-DD HH:mm:ss");

            DataFactory.EditCalendar($scope.calendar).success(function(response){

            }).error(function(error){

            });
            $scope.CloseSidebar();
        }
        else {
            $scope.disable = !$scope.disable;
        }
    }
    getAllData();
    initializeVariables();
});