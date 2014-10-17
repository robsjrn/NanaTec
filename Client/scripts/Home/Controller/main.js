'use strict';

var Rentmngt= angular.module('RentmngtApp', ['ngRoute','google-maps'.ns()] ); 


 Rentmngt.controller('MainCtrl', function ($scope,$http,$window) {
  $scope.showSearch=false;
$scope.Data=[{"name":"Elgon Apartments","location":"Kahawa Sukari","contact":"075222144","Amount":5000,"Description":"test","Owner":"Test","size":"500 sq","imgUrl":"images/Properties/Lighthouse.jpg"},
	         {"name":"New Kiambu","location":"test","contact":"075222144","Amount":5000,"Description":"test","Owner":"Test","size":"500 sq","imgUrl":"images/Properties/Lighthouse.jpg"},
             {"name":"Mt Kenya Ridge","location":"test","contact":"075222144","Amount":5000,"Description":"test","Owner":"Test","size":"500 sq","imgUrl":"images/Properties/Lighthouse.jpg"}           
];


 $scope.map = {
    center: {
        latitude: -1.3048035,
        longitude: 36.8473969
    },
    zoom: 8,
	control: {},
    marker: {}
};

$scope.showResult=function(){
	$scope.showSearch=true;
};

$scope.SearchItems=[{"name":"Property","url":"/Property.html"},{"name":"Rentals","url":"/SearchRentals.html"},{"name":"Services","url":"/Services.html"}];


  $scope.items = ['item1', 'item2', 'item3'];
  $scope.locations = ['Kahawa', 'Kiambu', 'Ruiru'];

	
$scope.selectLocation=function(loc){
	
}
$scope.selectSearch=function(itm){
  $scope.choice=itm;
}

	$scope.awesomeThings = ['HTML5 Boilerplate','AngularJS','Karma' ];
  
  $scope.SearchItem=function(){
			 $window.location.href=$scope.choice.url;
  };
     
	 
	 $scope.Userlogin=function(){
    
        $http.post('/web/login',$scope.user)
				 		 .success(function(data) {
								    $scope.invalidcredential=false;
                                     $window.location.href='/LoginRedirect';							   
							 }) 
						 .error(function(data) {
							   $scope.invalidcredential=true;
							 });	
   };

  });


   Rentmngt.controller('homectrl', function ($scope) {
    

  });

  Rentmngt.controller('Servicesctrl', function ($scope) {
    

  });


   Rentmngt.controller('newsctrl', function ($scope) {
    

  });

  Rentmngt.controller('contactsctrl', function ($scope) {
    

  });

  Rentmngt.controller('aboutctrl', function ($scope) {
    

  });

