
'use strict';
var ServiceAcctMngt= angular.module('ServiceAccount', ['ngRoute'] ); 


 ServiceAcctMngt.controller('mainctrl', function ($scope,$http,$window ) {
  
    	 $scope.Logout=function(){
            $http.get('/web/logout')
              .success(function(data) {
			    	delete $window.sessionStorage.token;
					$window.location.href = "/";
					}) 
				 .error(function(data) {
				   delete $window.sessionStorage.token;
					$window.location.href = "/";
					});	

       } 
	
  });
 ServiceAcctMngt.controller('setupctrl', function ($scope ) {
  	
  });

 ServiceAcctMngt.controller('viewsctrl', function ($scope ) {
  	
  });
 
 ServiceAcctMngt.controller('profilectrl', function ($scope ) {
  	
  });
 
 ServiceAcctMngt.controller('Helpctrl', function ($scope ) {
  	
  });

 ServiceAcctMngt.controller('Termsctrl', function ($scope ) {
  	
  });
 
 ServiceAcctMngt.controller('Aboutctrl', function ($scope ) {
  	
  });

ServiceAcctMngt.controller('pwdchangectrl', function($scope,$http) {

$scope.busy=false;
$scope.pwdchanged=false;
$scope.disableComponents=true;
$scope.SubmitPwd=function(){
	
	var dat={"newPwd":$scope.newpassword};
    $http.post('/web/ChangePwd',dat )
		   .success(function(data) {
		
		    $scope.pwdchanged=true;
			$scope.disableComponents=true;
		     }) 
			.error(function(data) {
	
				 $scope.pwderror=true;	 
				});	
}


$scope.CheckPwd=function(){
	$scope.busy=true;
     $http.post('/web/CheckPwd',$scope.pwd )
		   .success(function(data) {
		     if (data.status)
		     {
				 $scope.busy=false; 
				 $scope.btnStatus=false;
				 $scope.invalidcredential=false;
				 $scope.disableComponents=false;
				 
		     }
			 else{$scope.invalidcredential=true;$scope.busy=false;$scope.disableComponents=true}
				
							 }) 
			.error(function(data) {
					  $scope.invalidcredential=true;
					  $scope.msg=data.error
				});	
}
     
});
ServiceAcctMngt.directive('pwCheck', function() {
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


  //Routes 

ServiceAcctMngt.config(function($routeProvider,$locationProvider)	{

  $locationProvider.hashPrefix("!");

  $routeProvider
    .when('/setup', {
      templateUrl: 'views/Services/setup.html',   
      controller: 'setupctrl',
        })	
 
    .when('/views', {
     templateUrl: 'views/Services/views.html',   
     controller: 'viewsctrl'
        })
    .when('/profile', {
     templateUrl: 'views/Services/profile.html',   
     controller: 'profilectrl'
        })			

    .when('/pwdchange', {
     templateUrl: 'views/Landlord/PwdChange.html',   
     controller: 'pwdchangectrl'
        })
 
    .when('/help', {
     templateUrl: 'views/Tenant/Help.html',   
     controller: 'Helpctrl'
        })
    .when('/Terms', {
     templateUrl: 'views/Tenant/Terms.html',   
     controller: 'Termsctrl'
        })  
   .when('/about', {
     templateUrl: 'views/Tenant/About.html',   
     controller: 'Aboutctrl'
        })
   .otherwise({
         redirectTo: '/setup'
      });
			

});