'use strict';

var Rentmngt= angular.module('RentmngtApp', [] ); 


 Rentmngt.controller('MainCtrl', function ($scope) {

	        		  
  });


  Rentmngt.service('GoogleMapApi', ['$window', '$q', 
      function ( $window, $q ) {
        var deferred = $q.defer();
        function loadScript() {  
		
            var script = document.createElement('script');
            script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=places&callback=initMap';
            document.body.appendChild(script);
        }

        // Script loaded callback, send resolve
        $window.initMap = function () {
		
            deferred.resolve();
        }
        loadScript();

        return deferred.promise;
    }]);

    Rentmngt.directive('googleautocomplete', function(GoogleMapApi) {
			
             var link = function(scope, element, attrs,model) {
				 var map,autocomplete;
                 function initMap() {
                    if (map === void 0) {
                         var options = {
                                    types : [],
                                    componentRestrictions: {}
                                  };

                        autocomplete=  new google.maps.places.Autocomplete(element[0],options);
						 google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);                         
		        	    }
				      }
                 GoogleMapApi.then(function () {
					 
                      initMap();
					 
                    }, function () {
                        console.log("promise Rejected map not initialised");
                    });

					function onPlaceChanged(){
							  if (autocomplete.getPlace().geometry) {
								  scope.$apply(function() {
                                           model.$setViewValue(element.val());
                                      });

							  } else {
								document.getElementById('autocomplete').placeholder = 'Enter a location';
							  }
					      }					
                      
                  };
    
						return {
							require : 'ngModel',
							link: link
						};



			});


