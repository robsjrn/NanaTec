'use strict';

var Rentmngt= angular.module('RentmngtApp', [] ); 


 Rentmngt.controller('MainCtrl', function ($scope,$http,$window) {

// default values

	 $scope.lat="0.2280945";
	 $scope.lng="34.81523390000007";

 if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){		 
      $scope.$apply(function(){
		console.log(position);
		 $scope.lat=position.coords.latitude;
         $scope.lng=position.coords.longitude;
      });
    });
  }

$scope.clickToast=function(){
	
    toastr.info('Testing mic one two three ...yeaaah')
};

$scope.closeToast=function(){
	toastr['error']("Bad Bad Bad")
	
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


  Rentmngt.service('GoogleMapApi', ['$window', '$q', 
      function ( $window, $q ) {
        var deferred = $q.defer();
        function loadScript() {  
		
            var script = document.createElement('script');
            script.src = '//maps.googleapis.com/maps/api/js?v=3.6&sensor=false&key=AIzaSyBEZrkDl1LuGxjnnI4WXC7U5nx41NOmxy8&callback=initMap';
            document.body.appendChild(script);
        }

        // Script loaded callback, send resolve
        $window.initMap = function () {
            deferred.resolve();
        }
        loadScript();

        return deferred.promise;
    }]);


Rentmngt.directive('myMap', function(GoogleMapApi ) {
    // directive link function
    var link = function($scope, element, attrs) {
        var map, infoWindow,marker;
        var markers = [];
		       
	          //initialise map	
                function initMap() {
                    if (map === void 0) {
                      // map Options
		                var mapOptions = {
							center: new google.maps.LatLng($scope.lat, $scope.lng),
							zoom: 10,
							mapTypeId: google.maps.MapTypeId.ROADMAP
						};
                     
						map = new google.maps.Map(element[0], mapOptions);
                         setMarker(map, new google.maps.LatLng($scope.lat, $scope.lng), $scope.locname, $scope.plotname);
                          google.maps.event.addListener(map, 'click', function(event) {
                                 setMarker(map,event.latLng,"testLoc","Test Cont");
                            });
                       }
		        	}

                 GoogleMapApi.then(function () {
                      initMap();
					 
                    }, function () {
                        console.log("promise Rejected map not initialised");
                    });

                  function setMarker(map, position, title, content) {
					var marker;
					var markerOptions = {
						position: position,
						map: map,
						title: title,
						icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
					};
                   function DeleteMarker(obj){
					   var i;
                             for (i in markers) {
									if (markers[i].position.lat() == obj.getPosition().lat()  && markers[i].position.lng()==obj.getPosition().lng() ) {	
										markers[i].setMap(null); 
										markers.splice(i, 1);
									}
								}
                       

	                 }
					marker = new google.maps.Marker(markerOptions);
					markers.push(marker); // add marker to array
					google.maps.event.addListener(marker, 'dblclick',function (event) {
                              //right click on marker to delete
							  DeleteMarker(this);
					});
					google.maps.event.addListener(marker, 'click', function () {
						// close window if not undefined
						if (infoWindow !== void 0) {
							infoWindow.close();
						}
						// create new window
						var infoWindowOptions = {
							content: content
						};
						infoWindow = new google.maps.InfoWindow(infoWindowOptions);
						infoWindow.open(map, marker);
					});
				}
                      
    };
    
    return {
        restrict: 'A',
        template: '<div id="gmaps"></div>',
        replace: true,
			scope: {
                lat: '@',     // latitude
                lng: '@',     // longitude
				locname:'@',
				plotname:'@'
            },
        link: link
    };
});
