var app = angular.module('starWarsApp',['ui.router']);

app.config(['$stateProvider','$urlRouterProvider',function(stateProvider,urlRouterProvider){
    urlRouterProvider.otherwise('/');

    stateProvider
        .state('home',{
            url : '/',
            templateUrl : 'partials/login-partial.html'
        })
        .state('search',{
            url : '/search',
            templateUrl : 'partials/search-partial.html'
        })
        .state('search.landing',{
            url : '/landing',
            templateUrl : 'partials/search-partial.html'
        })
}]);

app.controller('loginCtrl',['$scope','$state','configServices',function($scope,$state,configServices){
    var invalidCredentials = false;
    $scope.username = '';
    $scope.password = '';
    $scope.login = function(){
        configServices.getLoginDetails('data/userlogin.json').then(
            function(data){
                Array.prototype.map.call(data.data,function(value){
                    if( value.username === $scope.username.trim() &&  value.password === $scope.password.trim() ){
                        sessionStorage.setItem('loggedIn',true);
                        $state.go('search.landing');
                        configServices.loggedInUser = $scope.username.trim();
                        invalidCredentials = false;
                    }
                    else{
                        sessionStorage.setItem('loggedIn',false)
                        invalidCredentials = true;
                    }
                });
                $scope.invalidLogin = invalidCredentials;
            }
        );
    }
}]);


app.controller('searchCtrl',['$state','$scope','configServices','$interval',function($state,$scope,configServices,$interval){
    $scope.numberOfSearch = 0;
    $scope.remainingTime = 0;
    if(!configServices.loggedInUser){
        $state.go('home');
    }

    // $interval(function(){
    //     $scope.numberOfSearch = 0;
    //     $scope.remainingTime++;
    // },60000);

    // $scope.$watch('numberOfSearch',function(nv,ov){
    //     $scope.remainingTime = 0;
    //     if(nv>=15 && configServices.loggedInUser !== 'Luke Skywalker'){
    //          $scope.disableSearch = true;
    //     }
    //     else{
    //         $scope.disableSearch = false;
    //     }
    // });

    $scope.getSearchResults = function(){
        $scope.numberOfSearch++;
        configServices.getPlanets().then(
            function(data){
                $scope.planetResults= data.data.results;
            }
        );
    }

}])

app.service('configServices',['$http',function($http){
    this.loggedInUser = '';
    this.getLoginDetails = function(url){
        return $http.get(url);
    };
    this.getPlanets = function(){
        return $http.get('data/planetall.json');
    }
}]);


app.filter('buha',[function(){
    var filtered = [];
    return function(item,input){
        filtered.length = 0;
        Array.prototype.map.call( item || [] , function(value){
            if( value.name.indexOf(input) !== -1 ){
                filtered.push(value);
            }
        } );

        if(!input){
                return [];
        }
        return filtered;
    }
}])