var TenantWelcome= angular.module('TenantWelcome', [] ); 



TenantWelcome.controller('tescontrl', function($scope,$http) {
  $scope.name="peter kathae";

  $scope.alertme=function(){
   

	    $http.get('/web/Landlord/kathae')
				 		 .success(function(data) {
			                   alert(data.success) 
							 }) 
						 .error(function(data) {
								  
							   
			              });
              }

     


});


TenantWelcome.controller('tescontrl2', function($scope) {
  $scope.add=$scope.amount1;
});


TenantWelcome.controller('tescontrl3', function($scope) {
  $scope.add=$scope.amount1;
});


TenantWelcome.controller('tescontrl4', function($scope) {
  $scope.add=$scope.amount1;
});