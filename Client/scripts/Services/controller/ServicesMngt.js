

'use strict';

var ServiceMngt= angular.module('RentmngtAppServices', [] ); 




 ServiceMngt.controller('mainctrl', function ($scope,$http) {
  $scope.errorMsg="mt test error msg";
	
  });

 ServiceMngt.controller('ViewServicectrl', function ($scope,$http) {
 $scope.service={};
	  $scope.loc = [
      {name:'Nairobi'},
      {name:'Kahawa'},
      {name:'Buru Buru'},
      {name:'Kiambu'},
      {name:'Kasarani'}
    ];

	 $scope.type = [
      {name:'Shopkeeper'},
      {name:'Grocery'},
      {name:'Plumber'},
      {name:'Home Delivery'},
      {name:'Movie'},
	  {name:'Hardware'},
	  {name:'Kinyozi/Salon'},
    ];

	     $scope.service.type = $scope.type[0];  
         $scope.service.location = $scope.loc[0]; 

		 $scope.search=function(){
    
			  $http.post('//web/ServiceListing',$scope.service)
	                   .success(function(data) {
							 $scope.SearchResults=data;
							 }) 
						 .error(function(data) {

							 });
                
		 };

  });
  

 ServiceMngt.controller('Enlistctrl', function ($scope,$http) {
   
    $scope.service={};
    $scope.isCollapsed = true;
 
  $scope.loc = [
      {name:'Nairobi'},
      {name:'Kahawa'},
      {name:'Buru Buru'},
      {name:'Kiambu'},
      {name:'Kasarani'}
    ];


	 $scope.type = [
      {name:'Shopkeeper'},
      {name:'Grocery'},
      {name:'Plumber'},
      {name:'Home Delivery'},
      {name:'Movie'},
	  {name:'Hardware'},
	  {name:'Kinyozi/Salon'},
    ];

     $scope.service.type = $scope.type[0];  
    $scope.service.location = $scope.loc[0]; 
    $scope.clear=function(){
			$scope.service.servicenames="";
		   $scope.service.contact="";
			$scope.service.details="";
     };

$scope.add=function(){
        $http.post('//web/ServiceRegistration', $scope.service)
						 .success(function(data) {
                                 $scope.saved=true;
							     
							 }) 
						 .error(function(data) {
				                 $scope.error=true;
							 });

     };
  
     
 });


  ServiceMngt.directive('eqValidate', function( ) {
      var link = function($scope, element, attrs,ngModel) {
            console.log(attrs.eqValidate);
		  if (attrs.eqValidate)
		    { doValidation(attrs.type); }	  
	       };
		  function doValidation(type){
			   console.log("Doing valdation....on type ." + type);
			}

	   return {
        restrict: 'A',
        require: 'ngModel',    
        link: link
    };
 });

   