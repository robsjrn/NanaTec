'use strict';

var LandlordAgentMngt= angular.module('RentmngtAppLandlordAgent', ['ngRoute'] ); 


LandlordAgentMngt.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/landlord', {
     templateUrl: '/templates/landlord.html',   
      controller: 'landlordctrl'
        })
  .when('/Agents', {
     templateUrl: '/templates/Agents.html',   
     controller: 'Agentsctrl'
        })
	.otherwise({
         redirectTo: '/landlord'
      });

});

LandlordAgentMngt.directive('pwCheck', function() {
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




LandlordAgentMngt.controller('landlordctrl', function ($scope,$http) {
$scope.landlord={};
 $scope.showSpinner=false;
 $scope.disableComponents=true;
$scope.ContactSpinner=false;

$scope.AddLandlord=function(){
   $scope.disableComponents=false;
     $scope.landlord.id="";
	 $scope.landlord.names="";
		 $scope.landlord.occupation="";
		 $scope.landlord.email="";
		 $scope.landlord.contact="";
         $scope.userExist=false;
}
$scope.Clear=function(){
	 $scope.landlord.id="";
	 $scope.landlord.names="";
		 $scope.landlord.occupation="";
		 $scope.landlord.email="";
		 $scope.landlord.contact="";
}

$scope.CheckidExists=function(){
 $scope.showSpinner=true;
          var dt={"idnumber":$scope.landlord.id};
          $http.post('/CheckidExists',dt)
				 		 .success(function(data) {
		
			                  if (data.exist)
			                     { $scope.userExist=true;
							        $scope.disableComponents=true;
									$scope.landlord.id="";
							      }
							   else{ $scope.userExist=false; 
								      $scope.disableComponents=false;
							   }
							   $scope.showSpinner=false;
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							    $scope.showSpinner=false;
			});
};

$scope.CheckPhonenumberExists=function(){
$scope.ContactSpinner=true;
var qerr={"phonenumber":"+254"+$scope.landlord.contact};
$http.post('/CheckPhonenumberExists',qerr)
				 		 .success(function(data) {
			                  if (data.exist)
			                     { $scope.contactExist=true;
							        $scope.disableComponents=true;
									$scope.landlord.contact="";
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

$scope.SaveLandlord=function(){
      $scope.landlord._id= $scope.landlord.id;
	  $scope.landlord.role="landlord";
	  $scope.landlord.AccessStatus=1;
      $scope.landlord.datecreated=new Date().toISOString();

         var data={"LandlordDet":$scope.landlord};
             	$http.post('landlord/CreateLandlord',data)
				 		 .success(function(data) {
								   $scope.SuccessStatus=true;
								   $scope.disableComponents=true;
								   $scope.landlord.id="";
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							   $scope.disableComponents=true;
							     $scope.landlord.id="";
							 });	
	}
	
  });

LandlordAgentMngt.controller('Agentsctrl', function ($scope,$http) {

	$scope.search={};
	    $scope.loc = [
		  {name:'Nairobi'},
		  {name:'Kahawa'},
		  {name:'Buru Buru'},
		  {name:'Kiambu'},
		  {name:'Kasarani'}
        ];
	  $scope.search.agent=$scope.loc[0];
  });
