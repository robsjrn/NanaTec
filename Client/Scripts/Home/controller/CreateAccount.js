'use strict';

var Registration= angular.module('Registration', ['ngMessages'] ); 

Registration.controller('Mainctrl', function($scope,$http,$window,CreateAcctService) {
//remove
 $scope.Registration={};
 $scope.Registration="";
 $scope.submitted = false;
  $scope.noFullyConfigured=false;
  $scope.showSpinner=false;
  $scope.disableComponents=false;
   $scope.interacted = function(field) {
      return $scope.submitted || field.$dirty;
    };
	    
    $scope.submit = function() {
      $scope.submitted = true;
    };


       $scope.Userlogin=function(){
               $scope.showSpinner=true;
                 CreateAcctService.userLogin($scope.user)
				 		 .success(function(data) {
								     $scope.invalidcredential=false;
									$window.sessionStorage.token = data.token;
									  $window.location.href='/PropertyRegistration.html';
									   
							 }) 
						 .error(function(data) {
							   $scope.invalidcredential=true;
							    $scope.showSpinner=false;
							    delete $window.sessionStorage.token;
							 });	
      };

     
		 $scope.Save=function(){
			  $scope.Registration.AccessStatus=1;
              $scope.Registration.datecreated=new Date().toISOString();
             var data={"PropertyDet":$scope.Registration};
			   CreateAcctService.CreatePropertyOwner(data)
						 .success(function(data) {
                                 $scope.SuccessStatus=true; 
								 $scope.ErrorStatus=false;
								 $scope.disableComponents=true;
							 }) 
						 .error(function(data) {
								 $scope.ErrorStatus=true;
								 $scope.SuccessStatus=false; 
								 $scope.disableComponents=true;
								
							 });

               };





});

 Registration.directive('matchValidator', function() {
    return {
      require: 'ngModel',
      link : function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(value) {
          ngModel.$setValidity('match', value == scope.$eval(attrs.matchValidator));
          return value;
        });
      }
    }
  });

  Registration.directive('checkUsername',  function(CreateAcctService) {
  return {
    require : 'ngModel',
    link : function($scope, element, attrs, ngModel) {
      ngModel.$asyncValidators.usernameAvailable = function(username) {
        return CreateAcctService.getusername(username);
      };
    }
  }
});


Registration.service('CreateAcctService', function ($http,$q) {
    var transaction={};
    var url='/web/Property';
	  this.getusername = function (username) {
		   var user={"username":username};
		    var deferred = $q.defer();
		 $http.post(url + '/UsernameExists', user)
		 .success(function(data) { 
          deferred.reject(data);
        }).error(function(data) {    
    	  deferred.resolve(data);
       });
     return deferred.promise;
    };

	  this.CreatePropertyOwner = function (data) {
		return  $http.post('/web/property/CreatePropertyOwner', data);
    };
      this.userLogin = function (user) {
		return  $http.post('/web/property/login',user);

      

    };

});



	

