'use strict';

var Propertymngt= angular.module('RentmngtAppProperty', ['ngRoute'] ); 


Propertymngt.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/Apartments', {
     templateUrl: '/templates/Apartments.html',   
      controller: 'Apartmentsctrl'
        })
  .when('/Villas', {
     templateUrl: '/templates/Villas.html',   
     controller: 'Villasctrl'
        })
   .when('/Condos', {
     templateUrl: '/templates/Condos.html',   
      controller: 'Condosctrl'
        })
  .when('/Loft', {
     templateUrl: '/templates/Loft.html',   
     controller: 'Loftctrl'
        })
  .when('/Duplexes', {
     templateUrl: '/templates/Duplexes.html',   
     controller: 'Duplexesctrl'
        })
   .when('/PropertySearch', {
     templateUrl: '/templates/SearchProperty.html',   
     controller: 'PropertySearchctrl'
        })
	.otherwise({
         redirectTo: '/Apartments'
      });

});

 Propertymngt.controller('Apartmentsctrl', function ($scope,$http) {

	
  });
   Propertymngt.controller('Villasctrl', function ($scope,$http) {

	
  });
   Propertymngt.controller('Condosctrl', function ($scope,$http) {

	
  });
   Propertymngt.controller('Loftctrl', function ($scope,$http) {

	
  });
  Propertymngt.controller('Duplexesctrl', function ($scope,$http) {

	
  });

   Propertymngt.controller('PropertySearchctrl', function ($scope,$http) {
$scope.search={};
	    $scope.loc = [
		  {name:'Nairobi'},
		  {name:'Kahawa'},
		  {name:'Buru Buru'},
		  {name:'Kiambu'},
		  {name:'Kasarani'}
        ];
	  $scope.search.location=$scope.loc[0];

	  $scope.Type = [
      {name:'House'},
      {name:'Land'},
      {name:'Flat'},
      {name:'Farm'},
      {name:'Apartments'},
	  {name:'Villas'},
	  {name:'Condos'},
      {name:'Loft'},
      {name:'Duplexes'}
    ];
   $scope.search.Propertytype=$scope.Type[0];


  $scope.SearchForProperty=function(){
	   $http.post('web/Property/PropertyListing',$scope.search)
	                   .success(function(data) {
		  
							 $scope.SearchResults=data;
							 }) 
						 .error(function(data) {

							 });

  };


  });

  