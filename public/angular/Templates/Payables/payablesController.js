 app.controller('PayablesController', function ($scope, $rootScope, $interval, DataFactory, AppService, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('payables');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));
    $scope.disable = true;
    var requestId;
    $scope.userDetails = JSON.parse(localStorage.getItem("user"));
    $scope.viewTab = ['List', 'Calendar'];
    $scope.currentTab = $scope.viewTab[0];
    $scope.errorNotification = null;
    $scope.approval = {
        approval_section: 'payables',
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

    function initializeVariables() {
        $scope.payables = {
            'name': '',
            'description': '',
            'payable_date':'',
            'amount': 0,
            'branch_id': ''
        }

        
    }

    function getAllData(){
        DataFactory.GetPayableList($scope.branch.branch_id).success(function(response){
            $scope.rows = response.data;
        }).error(function(error){

        });
    }

    $scope.ChangeViewTab = function(tab){
        $scope.currentTab = tab;
    }

    $scope.addPayable = function(){
        $scope.showSideNav = true;
    }

    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
        $scope.disable = true;
        initializeVariables();
        $scope.errorNotification = null;
    }

    $scope.showCompleteDetails = function(item){
        console.log(item);
        $scope.showCompleteDetailsFlag = true;
        item.payable_date = new Date(item.payable_date);
        item.amount = parseFloat(item.amount);
        $scope.payables = item;
    }

    $scope.addNewPayable = function() {
        // $scope.payables.branch_id = $scope.branch.branch_id;
        // if($scope.branch.role == "Staff"){
        //     $scope.approval.approval_mode = "add";
        //     $scope.approval.request_id = requestId;
        //     $scope.approval.approval_data = $scope.payables;
        //     DataFactory.AddApprovalRequest($scope.approval).success(function(response){
        //         if(response.status == 200){
        //             $scope.CloseSidebar();
        //         }
        //     }).error(function(error){

        //     });
        // }
        // else {
        //     DataFactory.AddNewPayable($scope.payables).success(function(response){
        //         if(response.status == 200){
        //             getAllData();
        //             $scope.CloseSidebar();
        //         }
        //         else {
        //             $scope.errorNotification = response.message;
        //         }
        //     }).error(function(error){

        //     });
        // }
        DataFactory.AddNewPayable($scope.payables).success(function(response){
                if(response.status == 200){
                    getAllData();
                    $scope.CloseSidebar();
                }
                else {
                    $scope.errorNotification = response.message;
                }
            }).error(function(error){

            });
    }

    $scope.editPayable = function(){
        if($scope.disable == false){
            $scope.payables.branch_id = $scope.branch.branch_id;
            DataFactory.EditPayable($scope.payables).success(function(response){
                if(response.status == 200){
                    getAllData();
                    $scope.CloseSidebar();
                }
                else {
                    $scope.errorNotification = response.message;
                }
            }).error(function(error){

            });
        }
        else {
            $scope.disable = !$scope.disable;
        }
        
    }
    $scope.deletePayable = function(item){
        DataFactory.DeletePayable(item).success(function(response){
            if(response.status == 200){
                getAllData();
                $scope.CloseSidebar();
            }
            else{
                $scope.errorNotification = response.message;
            }
        }).error(function(error){

        });
    }
    getAllData();
    initializeVariables();

    $scope.changeMode = function (mode) {
        $scope.mode = mode;
    };

    $scope.today = function () {
        $scope.currentDate = new Date();
    };

    $scope.isToday = function () {
        var today = new Date(),
            currentCalendarDate = new Date($scope.currentDate);

        today.setHours(0, 0, 0, 0);
        currentCalendarDate.setHours(0, 0, 0, 0);
        return today.getTime() === currentCalendarDate.getTime();
    };

    $scope.loadEvents = function () {
        $scope.eventSource = createRandomEvents();
    };

    $scope.onEventSelected = function (event) {
        $scope.event = event;
    };

    $scope.onTimeSelected = function (selectedTime, events) {
        console.log('Selected time: ' + selectedTime + ' hasEvents: ' + (events !== undefined && events.length !== 0));
    };

    function createRandomEvents() {
        var events = [];
        for (var i = 0; i < 50; i += 1) {
            var date = new Date();
            var eventType = Math.floor(Math.random() * 2);
            var startDay = Math.floor(Math.random() * 90) - 45;
            var endDay = Math.floor(Math.random() * 2) + startDay;
            var startTime;
            var endTime;
            if (eventType === 0) {
                startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
                if (endDay === startDay) {
                    endDay += 1;
                }
                endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
                events.push({
                    title: 'All Day - ' + i,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: true
                });
            } else {
                var startMinute = Math.floor(Math.random() * 24 * 60);
                var endMinute = Math.floor(Math.random() * 180) + startMinute;
                startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
                endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
                events.push({
                    title: 'Event - ' + i,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: false
                });
            }
        }
        return events;
    }
});