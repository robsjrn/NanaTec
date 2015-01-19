'use strict';

var Rentmngt= angular.module('RentmngtApp', [] ); 


 Rentmngt.controller('MainCtrl', function ($scope,$http,$window,GoogleMapApi) {

	           if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(function(position){		 
						  $scope.$apply(function(){
							 $scope.lat=position.coords.latitude;
							 $scope.lng=position.coords.longitude;
							 toastr['error']('Your location is ' +$scope.lat + $scope.lng);
                               $scope.loc="Your Location";
							   $scope.plotname ="Your Location";
						  });
						});
				  }
				  else {
					  toastr['error']('Sorry We Could not get Your Location..');
					  //default location
					   $scope.lat="-1.2920658999999999";
	                   $scope.lng="36.8219462";
                      }

			         

            
 $scope.codeAddress = function () {
   var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': $scope.addr}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
		   $scope.$apply(function(){
		     $scope.lng=results[0].geometry.location.lng();
             $scope.lat=results[0].geometry.location.lat();
             console.log($scope.lng);

			 $scope.loc=$scope.addr;
			 $scope.plotname =$scope.addr;
			 $scope.mymarkers=[{"test":"test"},{"test":"test"}];
         });
      } else {
	
           toastr['error']('Sorry We could not get The Location')

		   // default to nairobi kenya
			$scope.lat="-1.2920658999999999";
	        $scope.lng="36.8219462";

      }
    });
    return;
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
        var map, infoWindow,marker,markerBounds;
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
                             google.maps.event.addDomListener(window, 'resize', function() { 
								    map.setCenter(new google.maps.LatLng($scope.lat,$scope.lng));
								}); 
                      
                       }


                     $scope.$watch('lat + lng', function (newValue, oldValue) {
						  if (newValue !== oldValue) { 
							var center = map.getCenter(),
							  latitude = center.lat(),
							  longitude = center.lng();
							if ($scope.lat !== latitude || $scope.lng !== longitude)
                             setMarker(map, new google.maps.LatLng($scope.lat, $scope.lng), $scope.locname, $scope.plotname,'https://maps.google.com/mapfiles/ms/icons/green-dot.png');
							  map.setCenter(new google.maps.LatLng($scope.lat, $scope.lng));
							  
						  }
						});

		        	}
				function addSearchbox(){
                   var input = (document.getElementById('pac-input'));
                     map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

				    }

				
                   GoogleMapApi.then(function () {
                      initMap();
				     addSearchbox();
                    

                    }, function () {
                        console.log("promise Rejected map not initialised");
						toastr['error']('Sorry Error in Initialising Map..');
                    });
            
                 
                 
                  function setMarker(map, position, title, content,iconimg) {
					var marker;
					var markerOptions = {
						position: position,
						map: map,
						title: title,
						icon: iconimg
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
				plotname:'@',
				mymarkers:'@'
            },
        link: link
    };
});
