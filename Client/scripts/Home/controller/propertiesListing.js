var PropertyListing= angular.module('PropertyListingApp', [] ); 



PropertyListing.controller('Mainctrl', function($scope,$location) {



console.log("url"+$location.absUrl())

});