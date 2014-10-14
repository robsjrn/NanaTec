var Tenantmngt= angular.module('TenantmngtApp', ['ngRoute','ui.bootstrap','ngAnimate' ,'angularFileUpload','ngSanitize','ngProgress'] ); 

		Tenantmngt.factory('authInterceptor', function ($rootScope, $q, $window) {
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



Tenantmngt.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});


var ModalInstanceCtrl = function ($scope, $modalInstance, doc) {

  $scope.doc = doc;


  $scope.ok = function () {
	   $modalInstance.dismiss('cancel');
        console.log("Closing ..")
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

Tenantmngt.controller('MainTenantsctrl', function($scope,$http,$rootScope,$window,$modal,ngProgress) {
    		
  $scope.pageClass = 'page-nyumbakumi';
  ngProgress.start();
  $http.get('Tenant/tenantDetails').success(function (data){


	  $rootScope.Tenant=data
      $scope.TenantData={};
            if (typeof $rootScope.Tenant.Details!="undefined")
			{
					  //tenant has details already setup
			} else{

				$rootScope.Tenant.Details={};
				
			}	 

	  $scope.TenantData= $rootScope.Tenant; 
	
  ngProgress.complete();
            if ($scope.TenantData.AgreementStatus)
            {
				 $scope.doc1={"txt":"Dear "+$rootScope.Tenant.names+",Welcome to your new home. Please take a few moments to read the following information about living here"};
				var modalInstance = $modal.open({
					  templateUrl: 'myModalContent.html',
					  controller: ModalInstanceCtrl,
					  resolve: {
						doc: function () {
						  return $scope.doc1;
						}
					  }
					});

					modalInstance.result.then(function (selectedItem) {
					  $scope.selected = selectedItem;
					}, function () {
					  console.info('Modal dismissed at: ' + new Date());
					});
				 
	
            }


	  });

   $scope.emails = {};
   
$http.get('/Viewmail',{ cache: true }).success(function (data){
	$scope.UserMail=data;
	$scope.emails.messages=$scope.UserMail.Received;
});


  
  $scope.Logout=function(){
	 
            $http.get('/logout')
              .success(function(data) {	
				   delete $window.sessionStorage.token; 
					$window.location.href = "/";
					}) 
				 .error(function(data) {
				   delete $window.sessionStorage.token; 
					$window.location.href = "/";
					});	

       }

}); 

Tenantmngt.controller('statementsctrl', function($scope,$http,$window,ngProgress) {
  $scope.pageClass = 'page-nyumbakumi';
  ngProgress.start();
  $http.get('Tenant/tenantStatement',{ cache: true })
	   
                      .success(function(data) {
							   $scope.statement=data;
							   ngProgress.complete();
							 }) 
						 .error(function(data) {
								 ngProgress.complete();
							 });	



});

Tenantmngt.controller('evictionNoticectrl', function($scope,$http,$window,ngProgress) {
           $http.get('Tenant/EvictionNotice')
			.success(function (data){
					$scope.notice=data;
				ngProgress.complete();
			   })
		   .error(function(data) {
			   ngProgress.complete();
		   });
});

Tenantmngt.controller('Profilectrl', function($scope,$http,$window,$upload,$rootScope,ngProgress) {
   $scope.pageClass = 'page-nyumbakumi';
   $scope.det={};
 $scope.det.details=$rootScope.Tenant.Details;
  $scope.Profileupdate=false;
$scope.btnsave=true;
$scope.showChild=false;
 $scope.showme=function(status){
	
      $scope.showChild=status;
 };
 $scope.add=function(){
	 $scope.btnsave=false;
 };

$scope.updateUserDetails=function(){
	 $scope.btnsave=true;
	ngProgress.start();
  $scope.det.details.imageUrl= $rootScope.Tenant.Details.imageUrl
 $http.post('Tenant/updateTenantData',$scope.det )
		   .success(function(data) {
              $scope.Profileupdate=true;
		       ngProgress.complete();
			   $scope.btnsave=true;
		     }) 
			.error(function(data) {
				 ngProgress.complete();
                 $scope.btnsave=true;
				});
	

}

$scope.uploadFiles= function($files) {
	alert($files);
}

$scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
	ngProgress.start();
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: 'Tenant/photoupload', //upload.php script, node.js route, or servlet url
        method: 'POST',
        // headers: {'header-key': 'header-value'},
        // withCredentials: true,
        data: {myObj: $scope.myModelObj},
        file: file, // or list of files: $files for html5 only
        /* set the file formData name ('Content-Desposition'). Default is 'file' */
        //fileFormDataName: myFile, //or a list of names for multiple files (html5).
        /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
        //formDataAppender: function(formData, key, val){}
      }).progress(function(evt) {
       // console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
       ngProgress.complete();
		$rootScope.Tenant.Details.imageUrl=data.imageUrl;
 
      });
      //.error(...)
      //.then(success, error, progress); 
      //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
	  ngProgress.complete();
    }
    /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
       It could also be used to monitor the progress of a normal http post/put request with large data*/
    // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
  };
	

});


Tenantmngt.controller('nyumbakumictrl', function($scope,$http,$window,$rootScope,ngProgress) {
   $scope.pageClass = 'page-nyumbakumi';
          ngProgress.start();
				 $http.get('Tenant/Findneighbours',{params:{plot_name:$rootScope.Tenant.plot.Plotname}},{ cache: true })   
                      .success(function(data) {
							    $scope.Neighbours=data;
								ngProgress.complete();
							 }) 
						 .error(function(data) {
								 ngProgress.complete();
							 });	
 });



Tenantmngt.controller('vacateNoticectrl', function($scope,$http,$window,$rootScope,ngProgress) {
	  $scope.pageClass = 'page-nyumbakumi';
	  $scope.notice={};
	   $scope.btndisable=false;
	   $scope.noticeSent=false;
		$scope.noticeSentError=false;
	  $scope.notice.text="<br>"+$rootScope.Tenant.names+"<br><br>"+new Date().toISOString()+"<br>"+
		                 "<br><strong>RE :Notice Of Intent to Vacate</strong><br><br>Dear Landlord <p><br>" + 
	                     "This is a Notice that i will Vacate the Premise Located at <u>"+
		                   $rootScope.Tenant.plot.Plotname + " </p>"  +
		                 "<p>This letter constitutes my  notice as required by our rental agreement and the Landlord/Tenant Act</p>"+
		                  "<br>Sincerely,"+
		                  "<br>"+$rootScope.Tenant.names;
	 $scope.sendNotice =function(){

		    if (typeof $scope.notice.period!="undefined")
			{         
				       $scope.notice.processed=0;
                       $scope.notice.plot=$rootScope.Tenant.plot.Plotname;
                       $scope.notice.hse=$rootScope.Tenant.housename;
                       $scope.notice.Tenantid=$rootScope.Tenant._id;
					   $scope.notice.Landlordid=$rootScope.Tenant.Landlordid;
					   $scope.notice.LandlordProcessed=0;
                       $scope.notice.loc=$rootScope.Tenant.location;


					   $http.post('Tenant/VacateNotice',$scope.notice )
						   .success(function(data) {
							   ngProgress.complete();
							   $scope.btndisable=false;
							    $scope.noticeSent=true;
	
							 }) 
							.error(function(data) {
								 ngProgress.complete();
								 $scope.btndisable=true;
								 	$scope.noticeSentError=true;
								});
			} else{

				alert("Kindly Select The Notice Period");
			}

	 }

});

Tenantmngt.controller('Termsctrl', function($scope,$http,$window,$rootScope,ngProgress) {
	  $scope.pageClass = 'page-nyumbakumi';

});

Tenantmngt.controller('Aboutctrl', function($scope,$http,$window,$rootScope,ngProgress) {
  $scope.pageClass = 'page-nyumbakumi';
});

Tenantmngt.controller('Helpctrl', function($scope,$http,$window,$rootScope,ngProgress) {
  $scope.pageClass = 'page-nyumbakumi';
});

Tenantmngt.controller('ViewDetailsctrl', function($scope,$http,$window,$rootScope,ngProgress,$routeParams) {
  $scope.pageClass = 'page-nyumbakumi';
      
  ngProgress.start();
  $http.get('Tenant/TenantInfo/',{params:{tenant_id:$routeParams.neighbourid}},{ cache: true })
                .success(function(data) {
								$scope.tenant=data;
								  ngProgress.complete();
									
							 }) 
						 .error(function(data) {
								  ngProgress.complete();
							 });	
	$scope.viewTenantDetails=true;


});



Tenantmngt.controller('Documentctrl', function($scope,$http,$window,$rootScope,ngProgress) {
 $scope.btndisabled=$rootScope.Tenant.AgreementStatus;
 ngProgress.start();
  $http.get('Tenant/GetDocument',{params:{plot_name:$rootScope.Tenant.plot.Plotname}},{ cache: true })
	  .success(function (data){
	  $scope.documents=data;
	    ngProgress.complete();
	  })
   .error(function(data) {
	 ngProgress.complete();
   });


$scope.showdoc=false;

  $scope.CancelTerms=function(){
	   
	   alert("You need to Agree to the Terms");

  }
  $scope.AgreeTerms=function(){ 
	  ngProgress.start();
	  $scope.btndisabled=false;
			 $http.get('Tenant/UpdateTenantAgreement')
	                  .success(function(data) {
						 ngProgress.complete();
							 }) 
						 .error(function(data) {
						ngProgress.complete();
							 });			
  }
           
 $scope.selectdocType=function(item){
	 $scope.showdoc=true;
	 $scope.docname=item.DocumentType;
	 $scope.docDate=item.DocumentDate;
     $scope.Document = item.DocumentText;
    };
				  
});

Tenantmngt.controller('inboxsctrl', function($scope,$http, $rootScope,ngProgress) {

$scope.pageClass = 'page-nyumbakumi';

$scope.Mail={};
$scope.UserMail={};
$scope.Sentemails={};

 $scope.viewMail=false;
 $scope.viewSentMail=false;

 $scope.MailTo=[{"name":"Landlord"}];

 $scope.Mail.to=$scope.MailTo[0];
 



 $scope.emails = {};

 $scope.ShowMailpopUp=function(mailinbox){
        $scope.viewMail=true;
		$scope.Mail=mailinbox;
 }

$scope.ShowSentMailpopUp=function(mailinbox){
        $scope.viewSentMail=true;
		$scope.Mail=mailinbox;
 }


 $scope.CloseViewMailpopup=function(){
        $scope.viewMail=false;
 }


  $http.get('/Viewmail',{ cache: true }).success(function (data){$scope.UserMail=data; $scope.emails = $scope.UserMail.Received; $scope.Sentemails= $scope.UserMail.Sent;});


 $scope.SendMail=function(){
ngProgress.start();
    var mail ={"update":{
		"senderDetails":{         
		 "to": $rootScope.Tenant.Owner.name,
         "subject": $scope.Mail.subject,
         "msg": $scope.Mail.msg,
         "date": new Date()
		},
         "ReceiverId":$rootScope.Tenant.Owner.id,
         "ReceiverDetails":{
		   "from": $rootScope.Tenant.name,
           "subject": $scope.Mail.subject,
           "msg": $scope.Mail.msg,
           "date": new Date()

		}
	  }
	}

                  $http.post('/Mail',mail )
				 		 .success(function(data) {
								   $scope.SuccessStatus=true;
								   $scope.Sentemails.push(mail.update.senderDetails );	
								   ngProgress.complete();
								 
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							  // console.log("Erororro" + data);
							  ngProgress.complete();
							 });	

	 

 }
 

 




});

Tenantmngt.controller('pwdchangectrl', function($scope,$http,ngProgress) {
  $scope.pageClass = 'page-nyumbakumi';
$scope.btnStatus=true;
$scope.pwdchanged=false;
$scope.pwderror=false;
$scope.SubmitPwd=function(){
ngProgress.start();
    $http.post('/ChangePwd',$scope.pwd )
		   .success(function(data) {
		  //  console.log(data.success)
		    $scope.pwdchanged=true;
			ngProgress.complete();
		     }) 
			.error(function(data) {
				 $scope.pwderror=true;
				 ngProgress.complete();
				});	
}


$scope.CheckPwd=function(){
	ngProgress.start();
	$scope.busy=true;
     $http.post('/CheckPwd',$scope.pwd )
		   .success(function(data) {
		 ngProgress.complete();
		     if (data.success)
		     {
				 $scope.busy=false; 
				 $scope.btnStatus=false;
				 $scope.invalidcredential=false;
				 
		     }
			 else{$scope.invalidcredential=true;}
				
							 }) 
			.error(function(data) {
					  $scope.invalidcredential=true;
					  $scope.msg=data.error
						  ngProgress.complete();
				});	
}
     
});





   Tenantmngt.directive('match', [function () {
		 return {
			 require: 'ngModel',
			 link: function (scope, elem, attrs, ctrl) {     
			 scope.$watch('[' + attrs.ngModel + ', ' + attrs.match + ']', function(value){
			 ctrl.$setValidity('match', value[0] === value[1] );
			   }, true);
	    }
		 }
	}]);




Tenantmngt.provider("ngModalDefaults", function() {    return {      options: {        closeButtonHtml: "<span class='ng-modal-close-x'>X</span>"      },      $get: function() {        return this.options;      },      set: function(keyOrHash, value) {        var k, v, _results;        if (typeof keyOrHash === 'object') {          _results = [];          for (k in keyOrHash) {            v = keyOrHash[k];            _results.push(this.options[k] = v);          }          return _results;        } else {          return this.options[keyOrHash] = value;        }      }    };  });
Tenantmngt.directive('modalDialog', [    'ngModalDefaults', '$sce', function(ngModalDefaults, $sce) {      return {        restrict: 'E',        scope: {          show: '=',          dialogTitle: '@',          onClose: '&?'        },        replace: true,        transclude: true,        link: function(scope, element, attrs) {          var setupCloseButton, setupStyle;          setupCloseButton = function() {            return scope.closeButtonHtml = $sce.trustAsHtml(ngModalDefaults.closeButtonHtml);          };          setupStyle = function() {            scope.dialogStyle = {};            if (attrs.width) {              scope.dialogStyle['width'] = attrs.width;            }            if (attrs.height) {              return scope.dialogStyle['height'] = attrs.height;            }          };          scope.hideModal = function() {            return scope.show = false;          };          scope.$watch('show', function(newVal, oldVal) {            if (newVal && !oldVal) {              document.getElementsByTagName("body")[0].style.overflow = "hidden";            } else {              document.getElementsByTagName("body")[0].style.overflow = "";            }            if ((!newVal && oldVal) && (scope.onClose != null)) {              return scope.onClose();            }          });          setupCloseButton();          return setupStyle();        },        template: "<div class='ng-modal' ng-show='show'>\n  <div class='ng-modal-overlay' ng-click='hideModal()'></div>\n  <div class='ng-modal-dialog' ng-style='dialogStyle'>\n    <span class='ng-modal-title' ng-show='dialogTitle && dialogTitle.length' ng-bind='dialogTitle'></span>\n    <div class='ng-modal-close' ng-click='hideModal()'>\n      <div ng-bind-html='closeButtonHtml'></div>\n    </div>\n    <div class='ng-modal-dialog-content' ng-transclude></div>\n  </div>\n</div>"      };    }  ]);

Tenantmngt.directive('tnPrivacyCheck', function() {
  return {
   
    template: '<label>Public</label>Yes <input type="radio" name="view" value="true" ng-model="details.view">No <input type="radio" name="view" value="false" ng-model="details.view"> '
  };
});



Tenantmngt.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/statements', {
     templateUrl: 'views/Tenant/tenantstatements.html',   
      controller: 'statementsctrl'
        })
  .when('/inbox', {
     templateUrl: 'views/Tenant/tenantinbox.html',   
     controller: 'inboxsctrl'
        })
.when('/pwdchange', {
     templateUrl: 'views/Tenant/PwdChange.html',   
     controller: 'pwdchangectrl'
        })

.when('/nyumbakumi', {
     templateUrl: 'views/Tenant/nyumbakumiTenant.html',   
     controller: 'nyumbakumictrl'
        })
.when('/Profile', {
     templateUrl: 'views/Tenant/TenantProfile.html',   
     controller: 'Profilectrl'
        })
.when('/Terms', {
     templateUrl: 'views/Tenant/Terms.html',   
     controller: 'Termsctrl'
        })  
.when('/about', {
     templateUrl: 'views/Tenant/About.html',   
     controller: 'Aboutctrl'
        }) 
.when('/Document', {
     templateUrl: 'views/Tenant/Document.html',   
     controller: 'Documentctrl'
        }) 			
			
.when('/help', {
     templateUrl: 'views/Tenant/Help.html',   
     controller: 'Helpctrl'
        }) 

  .when('/viewDetails/:neighbourid', {
     templateUrl: 'views/Tenant/ViewTanantProfile.html',   
     controller: 'ViewDetailsctrl'
        }) 
 .when('/vacateNotice', {
     templateUrl: 'views/Tenant/vacateNotice.html',   
     controller: 'vacateNoticectrl'
        }) 
 .when('/evictionNotice', {
     templateUrl: 'views/Tenant/evictionNotice.html',   
     controller: 'evictionNoticectrl'
        }) 
			

		.otherwise({
         redirectTo: '/statements'
      });


});