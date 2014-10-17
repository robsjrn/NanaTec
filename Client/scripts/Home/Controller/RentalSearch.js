'use strict';

var Search= angular.module('RentmngtAppSearchRental', [] ); 


 Search.controller('Searchctrl', function ($scope,$http) {
   $scope.search={};
   $scope.dataLim=10;
   $scope.search.Amount={};


    $scope.loc = [
      {name:'All'},
      {name:'Nairobi'},
      {name:'Kahawa'},
      {name:'Buru Buru'},
      {name:'Kiambu'},
      {name:'Kasarani'}
    ];
	$scope.search.location=$scope.loc[0];
      $scope.Type = [
	  {name:'All'},	  
      {name:'BedSitter'},
      {name:'One Bedroom'},
      {name:'Two Bedroom'},
      {name:'Three Bedroom'},
      {name:'Bungalow'}
    ];
   $scope.search.type=$scope.Type[0];

  	 var max=99999999;
     var min=0;
	$scope.SearchRentals=function(){

     // check if user input Max and Min Amount..
	  if (($scope.search.Amount.Min ===undefined) || ($scope.search.Amount.Max ===undefined ))
	  {
		$scope.search.Amount.Min=min;
        $scope.search.Amount.Max=max;
	  }


	   // check if user Has specified location and Type
		if (($scope.search.type.name==!"All")&& ($scope.search.location.name==!"All"))
		{ 
            
		   $scope.search.querry={"plot.location.name":$scope.search.location.name,"type.name":$scope.search.type.name};	 
		}

        if (($scope.search.type.name=="All")&& ($scope.search.location.name=="All"))
			  {	 
			   $scope.search.querry={"status":"vacant"};
		      }
          else {
            if ($scope.search.type.name=="All")
               {
				$scope.search.querry={"plot.location.name":$scope.search.location.name};			 
                }
             if ($scope.search.location.name=="All")
               {
				 $scope.search.querry={"type.name":$scope.search.type.name};			 
                }
		  }


			  $http.post('web/VacantRentalListing',$scope.search)
	                   .success(function(data) {
							 $scope.Data=data;
							 }) 
						 .error(function(data) {

							 });
             
		 };

	

  });