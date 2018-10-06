 app.controller('ServiceController', function ($scope, $rootScope, $interval, DataFactory, $state, $mdDialog, $mdToast, $window) {
    $scope.$parent.ChangeAppState('service');
    $scope.showSideNav = false;
    $scope.showCompleteDetailsFlag = false;
    $scope.assignServicesToTenantFlag = false;
    $scope.disable = true;

    $scope.branch = JSON.parse(sessionStorage.getItem("branch"));

    function initializeVariables(){
        $scope.service = {
            service_name: '',
            service_description: ''
        }

        $scope.assignService = {
            tenant_id: '',
        }
    }
    
    function getAllTenantData(){
        DataFactory.GetTenantList($scope.branch.branch_id).success(function(response){
            
            $scope.tenantList = response.data;
            // $scope.tenantArray = $scope.tenantList.map(obj =>{ 
            //     return obj.tenant_name;
            // });
        }).error(function(error){

        });
    }
    function getAllData(){
        DataFactory.GetRoomList($scope.branch.branch_id).success(function(response){
            console.log(response);
            $scope.rows = response.data;
        }).error(function(error){

        });
    }

    $scope.CloseSidebar = function() {
        $scope.showSideNav = false;
        $scope.showCompleteDetailsFlag = false;
        $scope.assignServicesToTenantFlag = false;
        initializeVariables();
    }

    $scope.addNewService = function() {
        $scope.showSideNav = true;
    }

    $scope.assignServices = function() {
        $scope.assignServicesToTenantFlag = true;
        getAllTenantData();
    }
    $scope.addService = function () {
        DataFactory.AddService($scope.service).success(function(response){
            if(response.status == 200){
                $scope.CloseSidebar();
            }
        }).error(function(error){

        });
    }
    $scope.showCompleteRoomWithService = function(row){
        $scope.showCompleteDetailsFlag = true;
    }
    getAllData();
    initializeVariables();


    $scope.querySearch = function(query) {
        var results = query ? $scope.tenantArray.filter( createFilterFor(query) ) :
            $scope.tenantArray, deferred;
        
        console.log(results);
        if (self.simulateQuery) {
            deferred = $q.defer();
                
            $timeout(function () { 
                deferred.resolve( results ); 
            }, 
            Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
    }
    
    $scope.searchTextChange = function(text) {
        console.log('Text changed to ' + text);
    }
    
    $scope.selectedItemChange = function(item) {
        console.log('Item changed to ' + JSON.stringify(item));
    }

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
            console.log(query);
            console.log(state);
            return ($scope.tenantArray.indexOf() > 0);
        };
    }
});