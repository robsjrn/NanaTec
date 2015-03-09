var PropertyListing= angular.module('PropertyListingApp', [] ); 



PropertyListing.controller('Mainctrl', function($scope,$location) {

   

                  console.log("url"+$location.absUrl())

$scope.data=[
	{"tag":"for Sale",
	"price":"11000",
	"location":"3398 Lodgeville Road",
	"curency":"Ksh",
	"locationDetails" :"Golden Valley, MN 55427",
	"description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras et dui vestibulum",
	"status":"sale",
	"size":"860",
    "beds":"3",
    "baths":"4",
    "assetimg":"/images/assets/apartment.png",
	"propertyimg":"/images/properties/prop2.jpg",
	"propertyid":"1"}
    ];



});