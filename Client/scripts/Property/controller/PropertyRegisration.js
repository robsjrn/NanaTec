'use strict';

var PropertyRegistration= angular.module('PropertyRegistration', ['ngRoute','flow','angularFileUpload'] )

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


PropertyRegistration.controller('MainCtrl', function ($scope,$http,$window) {
   $scope.Measurements=["Ha","sqft","M","Inches"]
   $scope.Property={};
	  $scope.loc = [
      {name:'Nairobi'},
      {name:'Kahawa'},
      {name:'Buru Buru'},
      {name:'Kiambu'},
      {name:'Kasarani'}
    ];

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
     $scope.Property.type=$scope.type[0];

		$scope.selectMeasurements=function(measure){
			$scope.Property.Size=  $scope.Property.Size+" "+measure;
		};

		$scope.$on('flow::fileAdded', function (event, $flow, flowFile) {
			console.log("prevented file from uploadding..");
  event.preventDefault();//prevent file from uploading
});

});

PropertyRegistration.controller('profilectrl', function ($scope,$http,$window) {
	});
PropertyRegistration.controller('propertyctrl', function ($scope,$http,$window) {
	});
PropertyRegistration.controller('photoctrl', function ($scope,$http,$window,fileReader) {
  $scope.PropertyDetails=[];
  $scope.imageSrc=[];
  $scope.test=[];
       $scope.onFileSelect = function($files) {
		   
	        $scope.filess=$files;
			
			//$scope.filess.Details=$scope.Property;
			$scope.PropertyDetails.push($scope.filess);
			//console.log($scope.PropertyDetails.length);

         };

  $scope.addData= function () {
         var det=$scope.Property;
		 $scope.test.push(det);
  };

   $scope.removeData=function (index) {
	   $scope.PropertyDetails.splice(index);
   };

    $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
                      .then(function(result) {
                          $scope.imageSrc.push(result);

                      });
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
PropertyRegistration.controller('Viewsctrl', function ($scope,$http,$window) {
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


