'use strict';

var PropertyRegistration= angular.module('PropertyRegistration', ['ngRoute','flow','angularFileUpload','ngProgress'] )



	PropertyRegistration.factory('authInterceptor', function ($rootScope, $q, $window) {
		  return {
			request: function (config) {
				
			  config.headers = config.headers || {};
			  if ($window.sessionStorage.token) {
				config.headers.token=  $window.sessionStorage.token;
			  }
			   else{
				   // no token in Store
                    $window.location.href = "Error.html";
			  }
			  return config;
			},
			response: function (response) {
			  if (response.status === 401) {
				// handle the case where the user is not authenticated
				$window.location.href = "Error.html";
			  }
			  return response || $q.when(response);
			}
		  };
		});

PropertyRegistration.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});




PropertyRegistration.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/Profile', {
     templateUrl: 'views/Property/profile.html',   
      controller: 'profilectrl'
        })
  .when('/Property', {
     templateUrl: 'views/Property/property.html',   
     controller: 'propertyctrl'
        })
   .when('/Photos', {
     templateUrl: 'views/Property/photo.html',   
     controller: 'photoctrl'
        })

   .when('/Views', {
     templateUrl: 'views/Property/Views.html',   
     controller: 'Viewsctrl'
        })


		.otherwise({
         redirectTo: '/Property'
      });


});


PropertyRegistration.controller('MainCtrl', function ($scope,$http,$window,PropertyOwnerDetails,ngProgress) {
   $scope.Measurements=["Ha","sqft","M","Inches"]
   $scope.property={};
	  $scope.loc = [
      {name:'Nairobi'},
      {name:'Kahawa'},
      {name:'Buru Buru'},
      {name:'Kiambu'},
      {name:'Kasarani'}
    ];

	 
  $scope.$on('flow::fileAdded', function (event, $flow, flowFile) {
			console.log("prevented file from uploadding..");
  event.preventDefault();//prevent file from uploading
    });
    ngProgress.start();
     PropertyOwnerDetails.getDetails()
	     .success(function(data) {							 
			ngProgress.complete();
			 $scope.properties=data.Properties;
             $scope.property.Owner=data.Profile;
							 }) 
			.error(function(data) {
			ngProgress.complete();
							 });




});

PropertyRegistration.controller('profilectrl', function ($scope,$window,PropertyRegistration,ngProgress) {
      $scope.disableComponents=true;
	 $scope.SaveProfile =function(){ 
		ngProgress.start();
			PropertyRegistration.SaveProfile($scope.property.Owner)
						  .success(function(data) {							 
									ngProgress.complete();
						              $scope.ProfilePosted=true;
									   $scope.ProfileError=false;
									   $scope.disableComponents=true;
								 }) 
							 .error(function(data) {
								 ngProgress.complete();
                                  $scope.ProfilePosted=false;
								    $scope.ProfileError=true;
									$scope.disableComponents=true;
								 });
	 };  
	 
	 $scope.addData=function(){ 
	    $scope.disableComponents=false;
	 };

	});
PropertyRegistration.controller('propertyctrl', function ($scope,$window,PropertyRegistration,ngProgress) {
	      $scope.disableComponents=true;
   $scope.propertyDetails={};  
	 $scope.type = [
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
     $scope.propertyDetails.type=$scope.type[0];

		$scope.selectMeasurements=function(measure){
			$scope.propertyDetails.Size=  $scope.propertyDetails.Size+" "+measure;
		};

	 $scope.addData=function(){ 
	    $scope.disableComponents=false;
	 };
	 $scope.addProperty =function(){ 
		 ngProgress.start();
        PropertyRegistration.save($scope.propertyDetails)
		              .success(function(data) {							 
								ngProgress.complete();
								  $scope.PropertyPosted=true;
									   $scope.PropertyError=false;
									   $scope.disableComponents=true;
							 }) 
						 .error(function(data) {
							 ngProgress.complete();
							   $scope.PropertyPosted=false;
									   $scope.PropertyError=true;
									   $scope.disableComponents=true;
                                     $scope.msg=data;

							 });
	       };
	});
PropertyRegistration.controller('photoctrl', function ($scope,$window,fileReader,DataEntry,PropertyOwnerDetails,ngProgress,PropertyRegistration,$upload) {
		 $scope.PhotoPosted=false;
				$scope.PhotoError=false;
$scope.Props={};
ngProgress.start();
  PropertyOwnerDetails.getDetails()
	     .success(function(data) {							 
			ngProgress.complete();
			 $scope.Ownproperty=data.Properties;
			 $scope.Props.name=$scope.Ownproperty[0];
							 }) 
			.error(function(data) {
			ngProgress.complete();
							 });

  
  $scope.disableComponents=true;
  
     $scope.Add=function(){
	       $scope.disableComponents=false;
		   clear();
       }

        $scope.imageSrc=[];
       
	    $scope.onFileSelect = function($files) {
	         $scope.filess=$files;
			 
         };


  $scope.addData= function (Property) {
	  
	    $scope.property={
			 "name":$scope.Props.name,
		     "view":$scope.Props.viewName,
             "Description":$scope.Props.PhotoDescription,
             "file":$scope.filess
		    };
     	 DataEntry.save($scope.property);
		$scope.Details=DataEntry.list();
		$scope.disableComponents=true;
  };

  function clear(){
   $scope.Props.viewName="";
   $scope.Props.PhotoDescription="";
  }

   $scope.removeData=function (index) {
	     DataEntry.delete(index);
   };

    $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
                      .then(function(result) {
                          $scope.imageSrc.push(result);

                      });
    };


   $scope.UploadPhoto=function(){
   ngProgress.start();
	var Photodata = DataEntry.list();
for (var i = 0; i < Photodata.length; i++) {
    $scope.upload = $upload.upload({
        url: '/web/Property/PropertyPhotoUpload', 
        method: 'POST',
        data: {"name":Photodata[i].name,"view":Photodata[i].view,"Description":Photodata[i].Description},
        file: Photodata[i].file, 
      }).success(function(data, status, headers, config) {
		     var datauploaded=i;
			 if (datauploaded==Photodata.length)
			 {
				 $scope.PhotoPosted=true;
				$scope.PhotoError=false;
				 ngProgress.complete();
			 }
			 
        })
		.error(function(data) {
							 ngProgress.complete();
							   $scope.PhotoPosted=false;
									   $scope.PhotoError=true;
									   $scope.disableComponents=true;
                                        $scope.msg=data;

							 });
    }
        

   };

      




	});

PropertyRegistration.directive("ngFileSelect",function(){    
  return {
    link: function($scope,el){          
      el.bind("change", function(e){          
        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile();
      });          
    }        
  }
});
PropertyRegistration.controller('Viewsctrl', function ($scope,$http,$window,PropertyRegistration,ngProgress) {
  $scope.test={"view":"Testiiiing"};
 
 $scope.checkProperty=function (prop) {
	 var property={"propertyname":prop};
	ngProgress.start();
    PropertyRegistration.GetProperty(property)
			.success(function (data){
			    $scope.propertyData=data
				 $scope.photos=$scope.propertyData.PhotoDetails;
			  	$scope.Detail=$scope.photos[0];
				ngProgress.complete();
			   })
		   .error(function(data) {
			   ngProgress.complete();
		   });

 };
   

   $scope._Index = 0;

    $scope.isActive = function (index) {
		
        return $scope._Index === index;
    };
    $scope.showPrev = function () {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
		$scope.Detail=$scope.photos[$scope._Index];
    };
    $scope.showNext = function () {
        $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
		$scope.Detail=$scope.photos[$scope._Index];
    };
    $scope.showPhoto = function (index) {
        $scope._Index = index;
		$scope.Detail=$scope.photos[$scope._Index];
    };



	});

PropertyRegistration.factory('fileReader', function ($q, $log){
	
	var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };
 
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };
 
        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };
 
        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };
 
        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();
             
            var reader = getReader(deferred, scope);         
            reader.readAsDataURL(file);
             
            return deferred.promise;
        };
 
        return {
            readAsDataUrl: readAsDataURL  
        };

});


PropertyRegistration.service('DataEntry', function () {
    
    var data = [];
       var uid = 0;
        var i;
    this.save = function (property) {
           property.traceid=uid++;
		   data.push(property);
          
    }


    this.get = function (id) {
        for (i in data) {
            if (data[i].traceid == id) {	
                return data[i];
            }
        }

    }
    
    this.delete = function (id) {
        for (i in data) {
            if (data[i].traceid == id) {
				var dt=data[i];
                data.splice(i, 1);
				return dt;
            }
        }
    }
    this.Drop=function(){
         data.length = 0;
       }
    this.list = function () {
        return data;
    }


});


PropertyRegistration.service('PropertyRegistration', function ($http) {

  var property={}    
    var resource='/web/Property';

	property.save = function (property) {
		return $http.post(resource + '/PropertyRegistration', property);
    };
   property.SaveProfile = function (profile) {
		return $http.post(resource + '/PropertyOwnerProfile', profile);
    };
    property.getProfile = function (username) {
		return $http.post(resource + '/PropertyOwnerProfile', username);
    };

    property.Uploadphoto = function (data) {
		return $http.post(resource + '/PropertyPhotoUpload', data);
       
    };
	  property.GetProperty = function (propertyname) {
		return $http.post(resource + '/GetProperty', propertyname);
       
    };

  return property;
});

PropertyRegistration.service('PropertyOwnerDetails', function ($http) {
  var Details={};
    var url='/web/Property';
    
     Details.getDetails = function () {
		return $http.get(url + '/PropertyOwnerDetails');
    };


  return Details;
});
