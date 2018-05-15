 app.controller('UserController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('user');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.rows = [
        {
            'name': "Juan dela Cruz",
            'username': 'juandelacruz',
            'mobile_number': '09172828282',
            'role': 'Administrator'
        },
        {
            'name': "Jose Reyes",
            'username': 'josereyes',
            'mobile_number': '09172828283',
            'role': 'Administrator'
        },
        {
            'name': "Jimmy Santos",
            'username': 'jimmysantos',
            'mobile_number': '09172828282',
            'role': 'Administrator'
        }
    ];

    $scope.addNewUser = function(){
        $scope.showSideNav = true;
    }

    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
    }

    $scope.showCompeleteDetails = function(){
        $scope.showCompleteDetailsFlag = true;
    }
});