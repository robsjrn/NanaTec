var myApp = angular.module('myApp', ['ngRoute']);

myApp.controller('MyCtrl', function($scope, $route) {
    
    $scope.defineRoute = function() {
		console.log($route);
        $route.routes['/test'] = {templateUrl: 'dynamic.tpl.html'};
    };
});

myApp.config(function($routeProvider) {
       
    $routeProvider.when('/test', {
        templateUrl: 'static.tpl.html'
    });

    
    $routeProvider.otherwise({templateUrl: 'default.tpl.html'});
});