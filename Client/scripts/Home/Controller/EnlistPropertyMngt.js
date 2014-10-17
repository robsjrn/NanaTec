'use strict';

var EnlistPropertyMngt= angular.module('RentmngtAppEnlistProperty', ['ngRoute'] ); 


EnlistPropertyMngt.directive('pwCheck', function() {
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

 EnlistPropertyMngt.controller('MainCtrl', function ($scope,$http) {
 $scope.disableComponents=true;
$scope.Add=function(){
	$scope.disableComponents=false;
	$scope.contactExist=false;
	$scope.ErrorStatus=false;
	$scope.property="";
};

$scope.Clear=function(){
	$scope.property="";
	$scope.disableComponents=false;
   $scope.contactExist=false;
   $scope.ErrorStatus=false;

};

	$scope.CheckPhonenumberExists=function(){
$scope.ContactSpinner=true;
var qerr={"phonenumber":"+254"+$scope.property.contact};
$http.post('/web/property/ContactExists',qerr)
				 		 .success(function(data) {
			                  if (data.exist)
			                     { $scope.contactExist=true;
							        $scope.disableComponents=true;
							      }
							   else{ $scope.contactExist=false; 
								      $scope.disableComponents=false;
								
							   }
							   $scope.ContactSpinner=false;
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							    $scope.ContactSpinner=false;
			});
};

	

		 $scope.Save=function(){
			  $scope.property.AccessStatus=1;
              $scope.property.datecreated=new Date().toISOString();
           var data={"PropertyDet":$scope.property};
			   $http.post('/web/property/CreatePropertyOwner', data)
						 .success(function(data) {
                                 $scope.SuccessStatus=true; 
								 $scope.ErrorStatus=false;
								  $scope.disableComponents=true;
								  $scope.property="";
							 }) 
						 .error(function(data) {
								 $scope.ErrorStatus=true;
								  $scope.disableComponents=true;
							 });

     };

	$scope. clear=function(){

	};
                
		 
	
  });
EnlistPropertyMngt.controller('loginCtrl', function ($scope,$http,$window) {
	
     $scope.noFullyConfigured=false;
    $scope.showSpinner=false;
       $scope.Userlogin=function(){
               $scope.showSpinner=true;
                $http.post('/web/property/login',$scope.user)
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



	 });