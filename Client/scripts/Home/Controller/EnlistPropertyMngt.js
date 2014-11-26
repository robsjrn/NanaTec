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

	


	$scope. clear=function(){

	};
                
		 
	
  });



	 });