'use strict';

var LoginMngt= angular.module('RentmngtAppLogin', [] ); 

 LoginMngt.controller('loginCtrl', function ($scope,$http,$window) {
	 $scope.noFullyConfigured=false;
    $scope.showSpinner=false;
       $scope.Userlogin=function(){
            $scope.showSpinner=true;
                $http.post('web/Login',$scope.user)
				 		 .success(function(data) {
								     $scope.invalidcredential=false;
									 $window.sessionStorage.token = data.token;
									 console.log(data);
									  if (data.role=="tenant")
									  { $window.location.href='/Tenant.html';}
                                      if (data.role=="landlord")
									  { $window.location.href=data.homepage;}
									  if (data.role=="admin")
									  { $window.location.href='/Admin.html';}
									   if (data.role=="agent")
									  { $window.location.href='/Agent.html';}
									   
							 }) 
						 .error(function(data) {
							   $scope.invalidcredential=true;
							    $scope.showSpinner=false;
							    delete $window.sessionStorage.token;
							 });	
      };


      $scope.forgotPassword=function(){
             $http.post('web/sendmail',$scope.user)
				 .success(function(data) {
					 })
				.error(function(data) {
						  })
	  
	  };

	   });