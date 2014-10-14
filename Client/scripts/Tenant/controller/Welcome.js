var TenantWelcome= angular.module('TenantWelcome', ['ngRoute','ngProgress'] ); 

		TenantWelcome.factory('authInterceptor', function ($rootScope, $q, $window) {
		  return {
			request: function (config) {
			  config.headers = config.headers || {};
			  if ($window.sessionStorage.token) {
				config.headers.token=  $window.sessionStorage.token;
			  }
			  else{
				   // no token in Store
                    $window.location.href = "Error.html";
			  }
			  return config;
			},
		
			response: function (response) {
			  if (response.status === 401) {
				// handle the case where the user is not authenticated
				   $window.location.href = "Error.html";
			  }
			 
			  return response || $q.when(response);
			}
		  };
		});


TenantWelcome.config(function ($httpProvider,$locationProvider) {
  $httpProvider.interceptors.push('authInterceptor');
  $locationProvider.html5Mode(true).hashPrefix("!");
});


TenantWelcome.controller('Mainctrl', function($scope,$http,$rootScope,$window,ngProgress,$location) {
 $scope.pwdUpdate =false;
var token = $location.url();

     console.log(token);
    $scope.createPassword=function(){ 
		  var data={};
              data.pwd=$scope.password;
	          data.token=token;
              $scope.pwdUpdate =true;
	};

 $scope.login=function(){ 
	$window.location.href='/Login.html';
 };
});


TenantWelcome.directive('pwCheck', function() {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                $(elem).add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        var v = elem.val()===$(firstPassword).val();
                        ctrl.$setValidity('pwcheck', v);
                    });
                });
            }
        }
    });
