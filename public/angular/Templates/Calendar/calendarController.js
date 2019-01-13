 app.controller('CalendarController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('calendar');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.assignServicesToTenantFlag = false;
    $scope.disable = true;

    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    var requestId;
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    
    $scope.approval = {
        approval_section: 'calendar',
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
        if($scope.branch.role == "Staff"){
            $scope.approval.approval_mode = "add";
            $scope.approval.request_id = requestId;
            $scope.approval.approval_data = $scope.calendar;
            DataFactory.AddApprovalRequest($scope.approval).success(function(response){
                if(response.status == 200){
                    $scope.CloseSidebar($scope.approval);
                }
            }).error(function(error){

            });
        }
        else {
            DataFactory.AddNewCalendar($scope.calendar).success(function(response){
                if(response.status = 200){
                    $scope.CloseSidebar();
                }
            }).error(function(error){

            });
        }
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
    $scope.downloadPage = function(page) {
        var object = {'page': page, 'branch_id': $scope.branch.branch_id}
        DataFactory.DownloadPage(object).success(function(response){
            $window.location.href = response;
        }).error(function(error){

        });
    }
    getAllData();
    initializeVariables();
});