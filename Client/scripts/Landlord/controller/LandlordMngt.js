var landlordtmngt= angular.module('LandlordmngtApp', ['ngResource','ngRoute','ui.bootstrap','angularFileUpload','ngProgress','textAngular','google-maps'.ns()] ); 



 
	landlordtmngt.factory('authInterceptor', function ($rootScope, $q, $window) {
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

landlordtmngt.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});

var ModalInstanceCtrl = function ($scope, $modalInstance, lat, lng, $timeout) {

  $scope.map = {
    center: {
        latitude: lat,
        longitude: lng
    },
    zoom: 8,
	control: {},
    marker: {
		 latitude: lat,
          longitude: lng
		}
};



  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

$scope.$watch("visible", function(newvalue) {
        $timeout(function() {
             var map = $scope.map.control.refresh();
        }, 0);
    });
                                                   

};


landlordtmngt.controller('MainLandlordctrl', function($scope,$http,$rootScope,$window,ngProgress) {
$scope.firsttimelogin=true;

 $http.get('/web/Landlord/LandLordDetails',{ cache: true })
	 .success(function (data){
			ngProgress.start();
				 $rootScope.landlordDetails=data;
				 if (typeof data.plots!="undefined")
			{
					  $rootScope.plot=data.plots;	
			} else{

              
				$rootScope.plot=[];
			}	 
	 });
  $http.get('/web/Landlord/LandLordConfiguration',{ cache: true }).success(function (data)
	  {
	   $scope.config=data;
	  $rootScope.expenseType=$scope.config.expenseType;
      $rootScope.paymentMethod=$scope.config.paymentmethod;
	  $rootScope.TransactionType=$scope.config.transactiontype;
	  $rootScope.hsetype=$scope.config.hsetype;
     ngProgress.complete();
  });
  $scope.emails = {};


$http.get('/web/Viewmail',{ cache: true })
	.success(function (data){
		$scope.UserMail=data; 
		$scope.emails.messages=$scope.UserMail.Received;
		ngProgress.complete();
       })
   .error(function(data) {
	 ngProgress.complete();
   });

 
 $scope.Logout=function(){
            $http.get('/web/logout')
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


landlordtmngt.controller('Noticectrl', function($scope,$rootScope,$http,ngProgress) {
       $scope.noticeSent=false;
		$scope.noticeSentError=false;
		$scope.btndisable=false;
$scope.noticelist=[];

		$http.get('/web/Landlord/GetLandlordNotice')
			.success(function (data){
					$scope.noticelist=data;
				   //  $scope.notice=$scope.noticelist[0];
				ngProgress.complete();
			   })
		   .error(function(data) {
			   ngProgress.complete();
		   });

 $scope.selectnotice=function(not){
	 $scope.noticeSent=false;
	 $scope.noticeSentError=false;
      $scope.notice=not;
 };

  $scope.updateNotificationStatus=function(index){
     
$scope.btndisable=true;
	  
		    var dt={"tenantid":$scope.notice.Tenantid};
          $http.post('/web/Landlord/LandlordNoticeUpdate',dt)
				 		 .success(function(data) {
			                    $scope.btndisable=false;
			                    $scope.noticeSent=true;
								$scope.noticelist.splice(index, 1);
								$scope.notice="";
							 }) 
						 .error(function(data) {
								    $scope.btndisable=false;
								 	$scope.noticeSentError=true;
							   
			});
 };
   

});


landlordtmngt.controller('editTenantCtrl', function modalController ($scope, $modalInstance, Tenant) {
    $scope.Tenant = Tenant;
    $scope.ok = function () {
        $modalInstance().close($scope.Tenant);
    };
    $scope.cancel = function () {
        $modalInstance().dismiss('cancel');
  
    };
});



landlordtmngt.controller('VacateNoticectrl', function($scope,$rootScope,$http,ngProgress) {
      $scope.disableSearchHse=true;
	  $scope.disableTenantid=true;
  	 $scope.NoticeSent=false;
	 $scope.NoticeSentError=false;
	 $scope.btnSend=true;
      $scope.search={};
	  $scope.notice={};
   $scope.add=function(){
	     $scope.disableSearchHse=false;
	  $scope.disableTenantid=false;
	  $scope.btnSend=false;
   };

   $scope.SearchTenantid=function(){
	$scope.disableSearchHse=true;
    ngProgress.start();
         $http.post('/web/Landlord/tenantDataID',  $scope.search)
						 .success(function(data) {
								
							  $scope.disableTenantid=true;
							  $scope.search.housename=data.housename;
							  $scope.search.names=data.names;
							  ngProgress.complete();
							 }) 
						 .error(function(data) {
							$scope.TenantNotFound=true;
							 ngProgress.complete();
							 $scope.disableComponents=true;
							 });

}
$scope.SearchHouseid=function(){
	$scope.disableTenantid=true;
    ngProgress.start();
	                  $http.post('/web/Landlord/tenantDataHseName',  $scope.search)
						 .success(function(data) {
							 
								ngProgress.complete();
							    $scope.disableSearchHse=true;
								$scope.search.tenantid=data._id;
								 $scope.search.names=data.names;
							 }) 
						 .error(function(data) {
							 ngProgress.complete();
							$scope.TenantNotFound=true;
							$scope.disableComponents=true;
							 });
}


  $scope.sendNotification=function(){
    if (typeof $scope.search.names!="undefined")
  { 
	 $scope.btnSend=true;
	  $scope.text="<br> To"+$scope.search.names+"<br><br>"+new Date().toISOString()+"<br>"+
		           "<br><strong>RE : Notice To Vacate</strong><br><br>Dear Tenant <p><br>"+
		           "<br>" +$scope.Noticetext +"</br>"+
		           "<p>This letter constitutes my Vacation notice as required by our rental agreement and the Landlord/Tenant Act</p>"+
		           "<br>Sincerely,"+
		           "<br>"+$rootScope.landlordDetails.names + "</br>";
    

	   $scope.notice.processed=0;
       $scope.notice.text=$scope.text;
       $scope.notice.tenantid=$scope.search.tenantid;
       $scope.notice.date=new Date().toISOString();
       $scope.notice.landlordid=$rootScope.landlordDetails._id;
       $scope.notice.hseno=$scope.search.housename;
       $scope.notice.contact=$scope.search.contact;
          $http.post('/web/Landlord/ServeEvictionNotice',$scope.notice )
						   .success(function(data) {
							   ngProgress.complete();
							  $scope.NoticeSent=true;
	
							 }) 
							.error(function(data) {
								 ngProgress.complete();
								 $scope.btndisable=true;
								 	$scope.NoticeSentError=true;
								});
  }
  else{
	  alert("You have to Select a Tenant");
  }
	 
  };


});




landlordtmngt.controller('tenantctrl', function($scope,$modal,$rootScope,$http,tenantlist,ngProgress) {
 $scope.tenantcreated=false;
 $scope.tenanterror=false;
 $scope.plots=$rootScope.plot;
 $scope.showSpinner=false;
 $scope.ContactSpinner=false;
 $scope.Tenant={};
  $scope.Tnt={};
 $scope.Tnt.plot=$scope.plots[0];

 $scope.disableComponents=true;

$scope.CheckidExists=function(){
 $scope.showSpinner=true;
          var dt={"idnumber":$scope.Tenant._id};
          $http.post('/web/CheckidExists',dt)
				 		 .success(function(data) {
			                  if (data.exist)
			                     { $scope.userExist=true;
							        $scope.disableComponents=true;
									$scope.Tenant._id="";
							      }
							   else{ $scope.userExist=false; 
								      $scope.disableComponents=false;
							   }
							   $scope.showSpinner=false;
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							    $scope.showSpinner=false;
			});
};


$scope.CheckPhonenumberExists=function(){
$scope.ContactSpinner=true;
var qerr={"phonenumber":"+254"+$scope.Tenant.contact};
$http.post('/web/CheckPhonenumberExists',qerr)
				 		 .success(function(data) {
			                  if (data.exist)
			                     { $scope.contactExist=true;
							        $scope.disableComponents=true;
									$scope.Tenant.contact="";
							      }
							   else{ $scope.contactExist=false; 
								      $scope.disableComponents=false;
							   }
							   $scope.ContactSpinner=false;
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							    $scope.ContactSpinner=false;
			});
};




           $scope.addTenant=function(){
				    $scope.tenantcreated=false;
					$scope.tenanterror=false;
                    $scope.disableComponents=false;
					$scope.userExist=false; 
					$scope.Tenant="";
		   };
                 $scope.clearTenant=function(){
                  $scope.Tenant="";
				  $scope.userExist=false; 
				 
		   };

		   
            $scope.saveTenant=function(){
            $scope.tform.tenantnames.$setValidity("size", false);
			       $scope.Tenant.plot={};
				   $scope.Tenant.Landlordid=$rootScope.landlordDetails._id;
				   $scope.Tenant.plot.Plotname =$scope.Tnt.plot.Plotname;
				   $scope.disableComponents=true;
				   $scope.Tenant.AccessStatus=0;
				   $scope.Tenant.hsestatus=0;
				   $scope.Tenant.role="tenant";
				   $scope.Tenant.AgreementStatus=false;
				   $scope.Tenant.datecreated=new Date().toISOString();
 //change this later
            $scope.Tenant.password= $scope.Tenant._id;

				   ngProgress.start();
                   $http.post('/web/Landlord/createTenant', $scope.Tenant)
						 .success(function(data) {
							    $scope.tenantcreated=true;
								$scope.msg=data.success;
								ngProgress.complete();
							 }) 
						 .error(function(data) {
							 $scope.tenanterror=true;
							 $scope.msg=data.error;
							 ngProgress.complete();
							 });	

                     }

    $scope.open = function (TenantDetails) {
        var modalInstance = $modal.open({
            templateUrl: 'views/partials/landlordEditTenantDetails.html',
            controller: 'editTenantCtrl',
            resolve: {
                '$modalInstance': function() { return function() { return modalInstance; } },
                'Tenant': function() { return TenantDetails; }
            }
        });
    
        modalInstance.result.then(function (response) {
            $scope.selected = response;
        }, function () {
			//console.log("Cancell Cliked 3we");
        });
    }; 
  
});


landlordtmngt.controller('housemngtctrl', function($scope,$rootScope,$http,ngProgress) {
   $scope.House={};
     $scope.housecreated=false;
	 $scope.houseterror=false;
	  $scope.disableComponents=true;
	   $scope.showSpinner=false;
 
    $scope.House.status="vacant";
	$scope.plot=$rootScope.plot;
 
	$scope.hsetype=$rootScope.hsetype;


     $scope.addHouse=function(){
          $scope.disableComponents=false; 
		  $scope.housecreated=false;
			 $scope.houseterror=false;
			    $scope.House.plot=$scope.plot[0];
				$scope.House.type=$scope.hsetype[0];

				$scope.House.number="";
				$scope.House.amount="";
                $scope.House.description="";
				$scope.HsenoExist=false;
	 };
$scope.CheckHseNoExists=function(){
           
      $scope.showSpinner=true;
          var dt={"hseno":$scope.House.number,"plotname":$scope.House.plot.Plotname};
          $http.post('/web/Landlord/CheckHseNoExists',dt)
				 		 .success(function(data) {
			                  if (data.exist)
			                     { $scope.HsenoExist=true;
							        $scope.disableComponents=true;
									$scope.House.number="";
							      }
							   else{ $scope.HsenoExist=false; 
								      $scope.disableComponents=false;
							   }
							   $scope.showSpinner=false;
							 }) 
						 .error(function(data) {
							   $scope.houseterror=true;
							    $scope.showSpinner=false;
								$scope.House.number="";
			});

};

  $scope.clearTenant=function(){
         $scope.House="";
  };
          $scope.saveHouse=function(){

                $scope.userForm.hsenum.$setValidity("size", false);

			     $scope.disableComponents=true;
				 ngProgress.start();
				 $scope.House.landlordid=$rootScope.landlordDetails._id;
                   $http.post('/web/Landlord/createHouse', $scope.House)
						 .success(function(data) {
							    $scope.housecreated=true;
								$scope.msg=data.success;

                               if (typeof $rootScope.landlordDetails.nohse=="undefined")
							   {$rootScope.landlordDetails.nohse=1; 
							  // $rootScope.landlordDetails.expcMonthlyIncome=1;
							   }
							   else{
								$rootScope.landlordDetails.nohse =$rootScope.landlordDetails.nohse + 1;
                                $rootScope.landlordDetails.expcMonthlyIncome=$rootScope.landlordDetails.expcMonthlyIncome+ $scope.House.amount;
								   }

								
							   
								ngProgress.complete();
							 }) 
						 .error(function(data) {
							 $scope.houseterror=true;
							 $scope.msg=data.error;
							 ngProgress.complete();
							 });	
                     }





  
});
landlordtmngt.controller('plotmngtctrl', function($scope,$http,$rootScope,ngProgress,$modal) {
	$scope.LandlordPlot={};
 $scope.enablemap=true;
 $scope.map = {
    center: {
        latitude: 10,
        longitude: -20
    },
    zoom: 8,
	control: {},
    marker: {}
};


 $scope.codeAddress = function () {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': $scope.LandlordPlot.address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
		  console.log("Testing "+$scope.map.control.getGMap().toString());
        $scope.map.control.getGMap().setCenter(results[0].geometry.location);
        $scope.map.marker.latitude = results[0].geometry.location.lat();
        $scope.map.marker.longitude = results[0].geometry.location.lng();

		$scope.LandlordPlot.location.longitude=results[0].geometry.location.lng();
        $scope.LandlordPlot.location.latitude=results[0].geometry.location.lat();
		$scope.enablemap=false;
      } else {
		  $scope.enablemap=true;
       console.log("geo code not Successfull..")
      }
    });
    return;
  };

	

	$scope.disableComponents=true;
   $scope.LandlordPlot.location={};
  $scope.showSpinner=false;
   $scope.showmap=function(){
	  var modalInstance = $modal.open({
      templateUrl: 'map.html',
      controller: ModalInstanceCtrl,
      resolve: {
        lat: function () {
          return $scope.LandlordPlot.location.latitude;
        },
        lng: function () {
          return $scope.LandlordPlot.location.longitude;
        }
      }


    });

    modalInstance.result.then(function (selectedItem) {
    }, function () {
     // $log.info('Modal dismissed at: ' + new Date());
    });
  };




$scope.CheckplotExists=function(){ 
  
   $scope.showSpinner=true;
          var dt={"plotname":$scope.LandlordPlot.Plotname};
          $http.post('/web/Landlord/CheckPlotExist',dt)
				 		 .success(function(data) {
			                  if (data.exist)
			                     { $scope.plotExist=true;
							        $scope.disableComponents=true;
									$scope.LandlordPlot.Plotname="";
							      }
							   else{ $scope.plotExist=false; 
								      $scope.disableComponents=false;
							   }
							   $scope.showSpinner=false;
							 }) 
						 .error(function(data) {
							   $scope.ploterror=true;
							    $scope.showSpinner=false;
			});

}

 $scope.loc = [
		  {name:'Nairobi'},
		  {name:'Kahawa'},
		  {name:'Buru Buru'},
		  {name:'Kiambu'},
		  {name:'Kasarani'}
        ];
	  $scope.LandlordPlot.location=$scope.loc[0];
	   $scope.Addplot=function(){ 
        $scope.disableComponents=false;
		$scope.LandlordPlot.Plotname="";
		$scope.plotExist=false;
	   }
   $scope.Saveplot=function(){  
      $scope.userForm.plotname.$setValidity("size", false);

		  $http.post('/web/Landlord/LandlordAddPlots', $scope.LandlordPlot)
			  
						 .success(function(data) {
							  ngProgress.start();
							   $scope.plotSuccess=true; 
							   if (typeof $rootScope.landlordDetails.noplots=="undefined")
							   {$rootScope.landlordDetails.noplots=1; }
							   else{$rootScope.landlordDetails.noplots =$rootScope.landlordDetails.noplots+ 1;}
                                $rootScope.plot.push($scope.LandlordPlot);
								ngProgress.complete();
								 $scope.disableComponents=true;
							 }) 
						 .error(function(data) {

							  $scope.ploterror=true;
							  ngProgress.complete();
							 });
}
  
});

landlordtmngt.controller('trxntypectrl', function($scope) {
	    $scope.url='Singletransaction';
			
});

landlordtmngt.controller('trxnmngtctrl', function($scope,$http,$rootScope,ngProgress, $window,$filter,tenant,BatchTrxnService) {



$scope.Transaction={};
$scope.data=BatchTrxnService.list()
$scope.Transaction.PostedDate=new Date();
$scope.Transaction.transactiondate=new Date();
$scope.paymentmethod=$rootScope.paymentMethod;
$scope.Transaction.paymentmethod=$scope.paymentmethod[0];
$scope.transactiontype=$rootScope.TransactionType;
$scope.Transaction.transactiontype=$scope.transactiontype[0];
$scope.ApplyCharges=false;
$scope.paymentposted=false;
$scope.paymenterror=false;
$scope.disableComponents=true;
$scope.TenantNotFound=false;
      $scope.disableSearchHse=true;
	  $scope.disableTenantid=true;
	  $scope.ReceiptFound=false;
	  $scope.ShowCharges=false;
	   $scope.disablePosting=true;
$scope.crit={};
$scope.Tenant={};


$scope.SearchType=[{id: 1, type: "_id", name: "Tenant Id"},
	               {id: 2, type: "housename", name: "House Name"},
	               {id: 3, type: "contact", name: "Tenant Telephone"},
                   {id: 4, type: "email", name: "Email Address"}
];

$scope.search=function(searchtype){
  var search ={}
      search.id=searchtype.id;
      search.detail=$scope.lookup;
    tenant.Search(search)
						 .success(function(data) {
							  $scope.Tenant=data
							  $scope.search.housename=$scope.Tenant.housename;
							  $scope.TenantNotFound=false;
								ngProgress.complete();
							  $scope.disableTenantid=true;
							 }) 
						 .error(function(data) {
							$scope.Tenants=data
							$scope.TenantNotFound=true;
							 ngProgress.complete();
							 $scope.disableComponents=true;
							 });

}

  $scope.toggleMin = function() {
  //  $scope.maxDate = $scope.maxDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 1
  };

  
  $scope.format = 'yyyy-MM-dd';

 $scope.landlordplots=$rootScope.plot;
 try{
 $scope.Tenant.plot=$scope.landlordplots[0];
 }catch(e){
	 alert("You Have to Add a Plot First..");
 }



$scope.CheckCharges=function(){

	$scope.Transaction.customCharge={};
   if (!$scope.ApplyCharges){ 
	   $scope.ShowCharges=true;
	   $scope.ApplyCharges=true;
   }
   else{$scope.ShowCharges=false;}
	
};
$scope.CustomPaymentCharges=function(){
	$scope.Charge={};
	$scope.CustomCharge=true;
	$scope.LateCharge=false;
	$scope.customDisable=false;
	$scope.Charge={};
	$scope.Charge.Amount="";
	$scope.Charge.comment="";
};

$scope.NoCharges=function(){
	$scope.Transaction.customCharge={};
	$scope.ShowCharges=false;
	$scope.ApplyCharges=false;
};

$scope.LatePaymentCharges=function(){

	$scope.Charge={};
	$scope.CustomCharge=false;
    $scope.LateCharge=true;
	$scope.customDisable=true;
	$scope.ApplyCharges=true;
	$scope.Charge.Amount=1200;
	$scope.Charge.comment="Late Payment Charge";
	$scope.Charge.transactiontype="Late Rent Payment"
};

$scope.Receipt=function(){
 ngProgress.start();

  var data ={
     "receiptno":$scope.Transaction.receiptno,
  }
      $http.post('/web/Landlord/SearchReceipt',  data)
						 .success(function(data) {							
								ngProgress.complete();
								  if (data === ""){
									$scope.ReceiptFound=false;
									$scope.userForm.$invalid=false;
								  }
								  else{	
									   $scope.Transaction.receiptno="";
									    $scope.userForm.$invalid=true;						   
					                    $scope.Receiptdata=data;
										$scope.ReceiptFound=true;
										  ;}
		  
							 }) 
						 .error(function(data) {
							 ngProgress.complete();	
							 $scope.ReceiptFound=false;
							 });
};





 $scope.AddPayment=function(){
	 addpayment();
 };

  function addpayment(){
	  $scope.Charge={};
	  $scope.disableComponents=false;
      $scope.disableSearchHse=false;
	  $scope.disableTenantid=false;
      $scope.paymentposted=false;
      $scope.ShowCharges=false;
	  $scope.ApplyCharges=false;
	     $scope.Transaction.amount="";
		 $scope.Transaction.comments="";
		 $scope.Transaction.receiptno="";
		  $scope.Tenant="";
		  $scope.search="";
  $scope.Tenant.balance=0;
	  $scope.Transaction.amount =0;
	  $scope.Charge.Amount=0;

  };

 $scope.ClearPayment=function(){
	     $scope.Transaction.amount="";
		 $scope.Transaction.comments="";
		 $scope.Transaction.receiptno="";
		 $scope.Tenant="";
		 $scope.search="";
 };


$scope.InsertRec=function(){
 $scope.disableComponents=true;
 var charges={};
 var today = $filter('date')(new Date(),'yyyy-MM-dd');
 var trandate=$filter('date')($scope.Transaction.TransactionDate,'yyyy-MM-dd');

     if ($scope.ApplyCharges)
     {
		charges ={
			      "ApplyCharge":true,
                  "body":{
                  "receiptno":$scope.Transaction.receiptno,
	              "tenantid":$scope.Tenant._id,
	              "housenumber":$scope.Tenant.housename,
	              "plotnumber":$scope.Tenant.plot.Plotname,
                  "names":$scope.Tenant.names,
                  "contact":$scope.Tenant.contact,
	              "PostedDate":today,
                  "transactiondate":trandate,
	              "transactiontype":$scope.Charge.transactiontype,
	              "paymentmethod":$scope.Transaction.paymentmethod.name,
	              "Description":$scope.Charge.comment,
	              "tranAmount":$scope.Charge.Amount,
				  "currentBal":$scope.Tenant.balance,
	              "balcf":$scope.Tenant.balance-$scope.Transaction.amount+$scope.Charge.Amount
				  }
		 };
     }
	 else{
		   charges={
			   "ApplyCharge":false
		  };
	 }

  $scope.Payment={	             
	              "receiptno":$scope.Transaction.receiptno,
	              "tenantid":$scope.Tenant._id,
	              "housenumber":$scope.Tenant.housename,
	              "plotnumber":$scope.Tenant.plot.Plotname,
                  "names":$scope.Tenant.names,
                  "contact":$scope.Tenant.contact,
	              "PostedDate":today,
                  "transactiondate":trandate,
	              "transactiontype":$scope.Transaction.transactiontype.name,
	              "paymentmethod":$scope.Transaction.paymentmethod.name,
	              "Description":$scope.Transaction.comments,
	              "tranAmount":$scope.Transaction.amount,
                  "currentBal":$scope.Tenant.balance,
	              "balcf":$scope.Tenant.balance-$scope.Transaction.amount,
                  "Charges":charges
	 
 };

 
	

  $scope.BatchTotal.Amount =$scope.BatchTotal.Amount-$scope.Payment.tranAmount;
     if ($scope.BatchTotal.Amount==0){ $scope.disablePosting=false ; }
	 else { BatchTrxnService.save($scope.Payment);}
    
}


    $scope.delete = function (id) {
        $scope.EditTenant=BatchTrxnService.delete(id); 
		$scope.BatchTotal.Amount=$scope.BatchTotal.Amount+$scope.EditTenant.tranAmount;
    }

	 $scope.edit = function (id) {
        $scope.EditTenant = BatchTrxnService.get(id);
        $scope.Tenant.names=$scope.EditTenant.names;
		$scope.Tenant._id=$scope.EditTenant.tenantid;
        $scope.Tenant.housename=$scope.EditTenant.housenumber;
        $scope.Tenant.plot.Plotname=$scope.EditTenant.plotnumber;
		$scope.Tenant.housename=$scope.EditTenant.housenumber;
		$scope.Tenant.balance=$scope.EditTenant.currentBal;
		$scope.Transaction.receiptno=$scope.EditTenant.receiptno;
		$scope.Transaction.comments=$scope.EditTenant.Description;
		$scope.Transaction.amount=$scope.EditTenant.tranAmount;
		$scope.Transaction.transactiontype=$scope.EditTenant.transactiontype;
		$scope.Transaction.paymentmethod=$scope.EditTenant.paymentmethod;
		$scope.Transaction.transactiondate=$scope.EditTenant.transactiondate
		$scope.balcf=$scope.EditTenant.balcf;
	//	$scope.Charge.Amount=$scope.EditTenant.Charges.body.tranAmount;
		$scope.Transaction.PostedDate=$scope.EditTenant.PostedDate;
	//	$scope.Charge.comment=$scope.EditTenant.Charges.body.Description;
    };


$scope.postPayment=function(){
ngProgress.start();
 $scope.userForm.$invalid=true;
 $scope.disableComponents=true;
 var charges={};
 var today = $filter('date')(new Date(),'yyyy-MM-dd');
 var trandate=$filter('date')($scope.Transaction.TransactionDate,'yyyy-MM-dd');

     if ($scope.ApplyCharges)
     {
		charges ={
			      "ApplyCharge":true,
                  "body":{
                  "receiptno":$scope.Transaction.receiptno,
	              "tenantid":$scope.Tenant._id,
	              "housenumber":$scope.Tenant.housename,
	              "plotnumber":$scope.Tenant.plot.Plotname,
                  "names":$scope.Tenant.names,
                  "contact":$scope.Tenant.contact,
	              "PostedDate":today,
                  "transactiondate":trandate,
	              "transactiontype":$scope.Charge.transactiontype,
	              "paymentmethod":$scope.Transaction.paymentmethod.name,
	              "Description":$scope.Charge.comment,
	              "tranAmount":$scope.Charge.Amount,
	              "balcf":$scope.Tenant.balance-$scope.Transaction.amount+$scope.Charge.Amount
				  }
		 };
     }
	 else{
		   charges={
			   "ApplyCharge":false
		  };
	 }

  $scope.Payment={
	              "receiptno":$scope.Transaction.receiptno,
	              "tenantid":$scope.Tenant._id,
	              "housenumber":$scope.Tenant.housename,
	              "plotnumber":$scope.Tenant.plot.Plotname,
                  "names":$scope.Tenant.names,
                  "contact":$scope.Tenant.contact,
	              "PostedDate":today,
                  "transactiondate":trandate,
	              "transactiontype":$scope.Transaction.transactiontype.name,
	              "paymentmethod":$scope.Transaction.paymentmethod.name,
	              "Description":$scope.Transaction.comments,
	              "tranAmount":$scope.Transaction.amount,
	              "balcf":$scope.Tenant.balance-$scope.Transaction.amount,
                  "Charges":charges
	 
 };


                  $http.post('/web/Landlord/RentalPayment', $scope.Payment)
						 .success(function(data) {
							    $scope.paymentposted=true;
								$scope.msg=data.success;
								ngProgress.complete();
							 }) 
						 .error(function(data) {
							 $scope.paymenterror=true;
							 $scope.msg=data.error;
							 ngProgress.complete();
							 });

       }


});




landlordtmngt.controller('expensemngtctrl', function($scope,$http,$rootScope,ngProgress) {

$scope.paymentposted=false;
$scope.paymenterror=false;
$scope.disableComponents=true;
$scope.Tenant={};

 $scope.toggleMin = function() {
  //  $scope.maxDate = $scope.maxDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 1
  };

  
  $scope.format = 'yyyy-MM-dd';

 $scope.landlordplots=$rootScope.plot;
 $scope.Tenant.plot=$scope.landlordplots[0];

    $scope.GetDetails=function(){
 // have this in a nested Promise
 ngProgress.start();
     $http.get('/web/Landlord/tenantList/'+$scope.Tenant.plot.Plotname,{ cache: true }).success(function (data){$scope.Tenants=data ;ngProgress.complete();}); 
}


$scope.Expense=[];
$scope.crit={};


$scope.expensetype=$rootScope.expenseType;

 $scope.Expense.type=$scope.expensetype[0];
 $scope.Expense.date=new Date();

$scope.AddExpense=function(){
	 $scope.disableComponents=false;

	    $scope.Expense.amount="";
		 $scope.Expense.description="";
 };

 $scope.ClearExpense=function(){
	     $scope.Expense.amount="";
		 $scope.Expense.description="";
	
 };
 

 $scope.PostExpense=function(){

ngProgress.start();
  $scope.expense={"tenantid":$scope.crit._id,
	              "housenumber":$scope.crit.housename,
	              "plotnumber":$scope.crit.plot.Plotname,
	              "transactiondate":new Date(),
	              "transactiontype":"Expense Posting",
	              "Description":$scope.Expense.description,
	              "tranAmount":-$scope.Expense.amount,
	              "balcf": $scope.Expense.amount + $scope.crit.balance 
	 
 };

         

  $http.post('/web/Landlord/RentalPayment', $scope.expense)
						 .success(function(data) {
							    $scope.paymentposted=true;
								$scope.msg=data.success;
								ngProgress.complete();
							 }) 
						 .error(function(data) {
							 $scope.paymenterror=true;
							 $scope.msg=data.error;
							 ngProgress.complete();
							 });

$scope.disableComponents=true;

 };



  
});


landlordtmngt.controller('summarymngtctrl', function($scope) {

$scope.chartType = 'bar';
$scope.messages = [];
   $scope.data = {
		series: ['Expense', 'Income'],
		data : [
		{
			x : "Jan",
			y: [210, 384]
		
		},
		{
			x : "Feb",
			y: [ 289, 456]
		},
		{
			x : "March",
			y: [ 170, 255]
		},
		{
			x : "April",
			y: [ 341, 879]
		},
		{
			x : "May",
			y: [ 500, 900]
		}
			
			]     
	}


$scope.config = {
		labels: false,
		title : "Amount",
		legend : {
			display: true,
			position:'right'
		},
		click : function(d) {
			$scope.messages.push('clicked!');
		}
	}



});


landlordtmngt.controller('documentmngtctrl', function($scope,$http,$rootScope,ngProgress) {
   $scope.landlordplots=$rootScope.plot;
  $scope.documents=[{"name":"Tenant Agreement Doc","type":"TenantAgreement"},
	                {"name":"Water Agreement Doc","type":"WaterAgreement"}
	               ];
	$scope.doc={};
  $scope.showdoc=false;
   $scope.documenterror=false;
   $scope.documenterror=false;
  $scope.btndisabled=false;

	 $scope.selectdocType=function(docType) { 
		 $scope.doc.docType=docType.name;
	 };
  
 $scope.adddoc=function(){
	 if ($scope.doc.docType) { $scope.showdoc=true; }
	 else{alert("Choose a Document..");}
	 
 };
 $scope.clearEdit=function(){
   $scope.doctext="";
 }
 
 $scope.SaveDoc=function(pname){
	 if (typeof pname =="undefined") {
	   alert("Kindly Select a Plot..");
	 }
	 else{
      $scope.btndisabled=true;
	  ngProgress.start();
	    var Details={
			         "plotName": pname,
			         "DocumentType":$scope.doc.docType,
			         "DocumentText":$scope.doctext,
			         "DocumentDate":new Date().toISOString()
		  }
                  $http.post('/web/Landlord/SaveDocument',Details )
				 		 .success(function(data) {
                                ngProgress.complete();
                                $scope.documentSaved=true;
							 }) 
						 .error(function(data) {
								 ngProgress.complete();
							    $scope.msg=data.error;
								 $scope.documenterror=true;
							 });	
   };
	 
 }
});

landlordtmngt.controller('ReportsPortalctrl', function($scope,$http,$rootScope,ngProgress,$filter) {


  $scope.landlordplots=$rootScope.plot;
  $scope.showData=false;
  $scope.showError=false;
  $scope.ViewReport=false;
  $scope.ViewDownloadReport=false;
  $scope.disablebtn=true;


 $scope.toggleMin = function() {
  //  $scope.maxDate = $scope.maxDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 1
  };

  
  $scope.format = 'yyyy-MM-dd';
    $scope.selectReport=function(name){
	  $scope.pname=name;
	  $scope.disablebtn=false;
  };

			  $scope.clear = function () {
				$scope.fromdt = null;
				$scope.todt= null;
			  };

				


   $scope.ShowReport=function(){
	    ngProgress.start();
		  var fromdt=$filter('date')($scope.fromdt,'yyyy-MM-dd');
		   var todt=$filter('date')($scope.todt,'yyyy-MM-dd');
  $scope.reportData={"startdate" :fromdt,
	                  "enddate":todt,
	                   "plot":$scope.pname,
	                   "option":"view"
  };
               $http.post('/web/Reports/TransactionReport', $scope.reportData)
						 .success(function(data) {
				    ngProgress.complete();
                       $scope.ViewReport=true;
					   $scope.ViewDownloadReport=false;
                         $scope.content=data.result;
					
								
							 }) 
						 .error(function(data) {

							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 ngProgress.complete();
								  $scope.showData=false;
							 });
							   
	
   }



 $scope.DownloadReport=function(){
            
ngProgress.start();

  $scope.reportData={"startdate" :$scope.fromdt,
	                  "enddate":$scope.todt,
	                  "plot":$scope.pname,
	                  "option":"download"
  };
               $http.post('/web/Reports/TransactionReport', $scope.reportData)
						 .success(function(data) {
				    ngProgress.complete();
                      $scope.ViewReport=false;
		         	$scope.ViewDownloadReport=true;
					    $scope.file=data;
								
							 }) 
						 .error(function(data) {
							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 ngProgress.complete();
								  $scope.showData=false;
							 });
        

	};




  
});

landlordtmngt.controller('Settingsctrl', function($scope,$rootScope,ngProgress,$http) {
//anything here should be cached...,{ cache: true }
$scope.TenantNotification={};
$scope.MonthlyPosting={};
$scope.Payment={};
$scope.Landlord={};

 $scope.plot=$rootScope.plot;
 $scope.Landlord.plot=$scope.plot[0];

$scope.MonthlyPosting=false;
$scope.latePaymentPosted=false;
$scope.NotificationPosted=false;
$scope.NotificationError=false;

$scope.btnNotification=true;
$scope.btnLatePayment=true;
$scope.btnPosting=true;


	 $scope.saveTnotifications=function(){

      var Notificationdata={
		   "Rundate" : $scope.TenantNotification.month,
		   "ProcessName" : "Daily Tenant balance Process",
		   "ProcessDetails" : {
			"plotname" : $scope.Landlord.plot.Plotname,
			"title" : "Scheduled Tenant Balance Notification for  "+$scope.Landlord.plot.Plotname,
			"month" : "Monthly"
		   }
		 }
      ngProgress.start();
                   $http.post('/web/Landlord/CreateNotification',Notificationdata )
				 		 .success(function(data) {
							ngProgress.complete();
								   $scope.NotificationPosted=true;
								 						 
							 }) 
						 .error(function(data) {
								 ngProgress.complete();
							   $scope.NotificationError=true;
							 });
   

     }
	 $scope.saveMPosting=function(){
       $scope.MonthlyPosting=true;


          var MonthlyPostingdata={
		   "Rundate" : $scope.MPosting.month,
		   "ProcessName" : "Monthly Posting Process",
		   "ProcessDetails" : {
			"plotname" : $scope.Landlord.plot.Plotname,
			"title" : "Scheduled Monthly Posting for "+$scope.Landlord.plot.Plotname,
			"month" : "Monthly"
		   }
		 }
      ngProgress.start();
                   $http.post('/web/Landlord/CreateNotification',MonthlyPostingdata )
				 		 .success(function(data) {
							ngProgress.complete();
								   $scope.MonthlyPosting=true;
								 						 
							 }) 
						 .error(function(data) {
								 ngProgress.complete();
							   $scope.MonthlyPostingError=true;
							 });	



     }

	$scope.LatePayment=function(){
       $scope.latePaymentPosted=true;
     }


	 $scope.addMPosting=function(){
		 $scope.btnPosting=false;
		 $scope.MonthlyPosting=false;
	 };

	 $scope.addLatePayment=function(){
		 $scope.btnLatePayment=false;
		 $scope.latePaymentPosted=false;
	 };

	  $scope.addTnotifications=function(){
		  $scope.btnNotification=false;
		  $scope.NotificationPosted=false;
         $scope.NotificationError=false;
	    
	    };

});

landlordtmngt.controller('RentPostingctrl', function($scope,$rootScope,$http,ngProgress) {
   $scope.Months=[{"month":"1","value":"January"},
	              {"month":"2","value":"February"},
	              {"month":"3","value":"March"},
	              {"month":"4","value":"April"},
				  {"month":"5","value":"May"},
				  {"month":"6","value":"June"},
	              {"month":"7","value":"July"},
				  {"month":"8","value":"August"},
                  {"month":"9","value":"September"},
                  {"month":"10","value":"October"},
				  {"month":"11","value":"November"},
                  {"month":"12","value":"December"}
          ] ;
   $scope.Landlord={};
 
    
   $scope.rentPosted=false;
   $scope.rentPostedError=false;
   $scope.plot=$rootScope.plot;
   $scope.Landlord.plot=$scope.plot[0];
    $scope.Landlord.dateChoosen=$scope.Months[0];

  // $scope.Landlord;
   $scope.PostMonthlyRent=function(){ 
ngProgress.start();
	    
		var Details={"plotName": $scope.Landlord.plot.Plotname,
			         "Month":$scope.Landlord.dateChoosen.value,
			         "ReceiptNo":$scope.Landlord.receipt,
			         "PostDateTime":new Date().toISOString()
		  };
        
				  $http.post('/web/Landlord/MonthlyRentPosting',Details )
				 		 .success(function(data) {
					
                                ngProgress.complete();
								$scope.rentPosted=true;
							 }) 
						 .error(function(data) {
                 
								 ngProgress.complete();
							   $scope.rentPostedError=true;
							   $scope.msg=data.error;
							 });	
   }

});


landlordtmngt.controller('inboxctrl', function($scope,$http,$rootScope,ngProgress) {
$scope.SuccessStatus=false;
 $scope.ErrorStatus=false;
$scope.Sentemails=[];
$http.get('/web/Landlord/LandlordTenants',{ cache: true })
	.success(function (data)
	{ 
	$scope.MailTo=data
    $scope.Mail.to=$scope.MailTo[0];
	}
	);

$http.get('/web/Viewmail').success(function (data){
	$scope.UserMail=data; 
	$scope.emails = $scope.UserMail.Received;
	$scope.Sentemails= $scope.UserMail.Sent;
	if (typeof $scope.Sentemails=="undefined")
	  {
		  $scope.Sentemails=[];
	  }

	});



$scope.Mail={};
$scope.UserMail={};


 $scope.viewMail=false;
 $scope.viewSentMail=false;


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


 $scope.SendMail=function(){
	  if (typeof $scope.Mail.msg=="undefined")
	  {
		   alert("No Message Defined ..Kindly Type a Message");
	  }
	  else{
  ngProgress.start();

    var mail ={"update":{
		"senderDetails":{         
		 "to": $scope.Mail.to.names,
         "subject": $scope.Mail.subject,
         "msg": $scope.Mail.msg,
         "date": new Date()
		},
         "ReceiverId":$scope.Mail.to._id,
         "ReceiverDetails":{
		   "from": $rootScope.landlordDetails.names,
           "subject": $scope.Mail.subject,
           "msg": $scope.Mail.msg,
           "date": new Date()

		}
	  }
	};

                  $http.post('Landlord/Mail',mail )
				 		 .success(function(data) {
							ngProgress.complete();
								   $scope.SuccessStatus=true;
								   $scope.Sentemails.push(mail.update.senderDetails );							 
							 }) 
						 .error(function(data) {
								 ngProgress.complete();
							   $scope.ErrorStatus=true;
							 });	

	 

			}
 }

});



landlordtmngt.controller('vacatectrl', function($scope,$http,$rootScope,ngProgress) {


 $scope.disableComponents=true;
  $scope.vacateupdate=false;
  $scope.vacateerror=false;

$scope.crit={};
$scope.Tenant={};

 $scope.landlordplots=$rootScope.plot;
 $scope.Tenant.plot=$scope.landlordplots[0];


   $scope.GetDetails=function(){
 ngProgress.start();
     $http.get('/web/Landlord/bookedtenantList/'+$scope.Tenant.plot.Plotname,{ cache: true })
		 .success(function (data){
		    $scope.tenantdata=data;
			$scope.crit=$scope.tenantdata[0];
			ngProgress.complete(); 
	 }); 
}



$scope.Add=function(){
    $scope.disableComponents=false;
};

$scope.Update=function(){

ngProgress.start();

	 data={"update":{
		 "tenantupdate":{"hsestatus":0,"housename":$scope.crit.housename},
		 "houseUpdate":{"status":"vacant","tenantid":$scope.crit._id},
		 "details":{"_id":$scope.crit._id,"number":$scope.crit.housename}
               }
		  };


      $http.post('/web/Landlord/vacate', data)
	.success(function(data){
		  ngProgress.complete();
      $scope.vacateupdate=true;
       
  })
	.error(function(data) {
	  ngProgress.complete();
		$scope.vacateerror=true;
		$scope.msg=data.error;
	 });
	 
	  $scope.disableComponents=true;


};


});



landlordtmngt.controller('LandlordProfilectrl', function($scope,$http,$rootScope,$upload,ngProgress) {

  $scope.updateUserDetails= function() {
     var file=$scope.file;  
       ngProgress.start();
   
      $scope.upload = $upload.upload({
        url: '/web/Landlord/Landlordphotoupload', //upload.php script, node.js route, or servlet url
        method: 'POST',
        // headers: {'header-key': 'header-value'},
        // withCredentials: true,
        data: {myObj: $scope.myModelObj},
        file: file, 
      }).progress(function(evt) {
       // console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
		ngProgress.complete();
		$scope.Profileupdate=true;
		  $rootScope.landlordDetails.Details.imageUrl=data.imageUrl;
        
      });

 


  };

  $scope.onFileSelect = function($files) {
	  $scope.file=$files;   
  };

});

landlordtmngt.controller('rentctrl', function($scope,$http,$rootScope,ngProgress) {
$scope.Tenant={};
$scope.House={};
$scope.housetaken=false;
$scope.housetakenerror=false;
 $scope.disableComponents=true;


 $scope.landlordplots=$rootScope.plot;
$scope.Tenant.plot=$scope.landlordplots[0];


$scope.GetDetails=function(){
 // have this in a nested Promise
ngProgress.start();

   $http.get('/web/Landlord/UnbookedtenantList/'+ $scope.Tenant.plot.Plotname).success(function (data){$scope.tenantdata=data ;$scope.Tenant.names=$scope.tenantdata[0];});
   $http.get('/web/Landlord/VacanthouseList/'+$scope.Tenant.plot.Plotname).success(function (data){$scope.housedata=data;$scope.Tenant.housename=$scope.housedata[0]; ngProgress.complete();});
 
}


 $scope.Add=function(){
	  $scope.disableComponents=false;

 };
 $scope.save=function(){
ngProgress.start();

	  data={"update":{
		 "tenantupdate":{"AgreementStatus":true,"AccessStatus":0,"hsestatus":1,"housename":$scope.House.housename.number,"balance":($scope.House.housename.amount * 2)},
		 "houseUpdate":{"status":"rented","tenantid":$scope.Tenant.names._id},
         "Trxn":{"tenantid":$scope.Tenant.names._id, "housenumber":$scope.House.housename.number,
	             "plotnumber":$scope.Tenant.plot.name,"transactiondate":new Date(),
	              "transactiontype":"Posting", "Description":"Rent And Deposit",
	              "tranAmount":($scope.House.housename.amount * 2)},
		 "details":{"_id":$scope.Tenant.names._id,"number":$scope.House.housename.number}
               }
		  };

  $http.post('/web/Landlord/Rent', data)
	.success(function(data){
	  ngProgress.complete();
      $scope.housetaken=true;

       
  })
	.error(function(data) {
	  ngProgress.complete();
		$scope.housetakenerror=true;
		$scope.msg=data.error;
	 });	
	  
   $scope.disableComponents=true;
 }
  
});




//Directives


//////

landlordtmngt.directive("clickToEdit", function() {
    var editorTemplate = '<div class="click-to-edit">' +
        '<div ng-hide="view.editorEnabled">' +
            '{{value}} ' +
            '<a ng-click="enableEditor()">Edit</a>' +
        '</div>' +
        '<div ng-show="view.editorEnabled">' +
            '<input ng-model="view.editableValue">' +
            '<a href="#" ng-click="save()">Save</a>' +
            ' or ' +
            '<a ng-click="disableEditor()">cancel</a>.' +
        '</div>' +
    '</div>';

    return {
        restrict: "A",
        replace: true,
        template: editorTemplate,
        scope: {
            value: "=clickToEdit",
        },
        controller: function($scope) {
            $scope.view = {
                editableValue: $scope.value,
                editorEnabled: false
            };

            $scope.enableEditor = function() {
                $scope.view.editorEnabled = true;
                $scope.view.editableValue = $scope.value;
            };

            $scope.disableEditor = function() {
                $scope.view.editorEnabled = false;
            };

            $scope.save = function() {
                $scope.value = $scope.view.editableValue;
                $scope.disableEditor();
            };
        }
    };
});





landlordtmngt.provider("ngModalDefaults", function() {    return {      options: {        closeButtonHtml: "<span class='ng-modal-close-x'>X</span>"      },      $get: function() {        return this.options;      },      set: function(keyOrHash, value) {        var k, v, _results;        if (typeof keyOrHash === 'object') {          _results = [];          for (k in keyOrHash) {            v = keyOrHash[k];            _results.push(this.options[k] = v);          }          return _results;        } else {          return this.options[keyOrHash] = value;        }      }    };  });
landlordtmngt.directive('modalDialog', [    'ngModalDefaults', '$sce', function(ngModalDefaults, $sce) {      return {        restrict: 'E',        scope: {          show: '=',          dialogTitle: '@',          onClose: '&?'        },        replace: true,        transclude: true,        link: function(scope, element, attrs) {          var setupCloseButton, setupStyle;          setupCloseButton = function() {            return scope.closeButtonHtml = $sce.trustAsHtml(ngModalDefaults.closeButtonHtml);          };          setupStyle = function() {            scope.dialogStyle = {};            if (attrs.width) {              scope.dialogStyle['width'] = attrs.width;            }            if (attrs.height) {              return scope.dialogStyle['height'] = attrs.height;            }          };          scope.hideModal = function() {            return scope.show = false;          };          scope.$watch('show', function(newVal, oldVal) {            if (newVal && !oldVal) {              document.getElementsByTagName("body")[0].style.overflow = "hidden";            } else {              document.getElementsByTagName("body")[0].style.overflow = "";            }            if ((!newVal && oldVal) && (scope.onClose != null)) {              return scope.onClose();            }          });          setupCloseButton();          return setupStyle();        }, template: "<div class='ng-modal' ng-show='show'>\n  <div class='ng-modal-overlay' ng-click='hideModal()'></div>\n  <div class='ng-modal-dialog' ng-style='dialogStyle'>\n    <span class='ng-modal-title' ng-show='dialogTitle && dialogTitle.length' ng-bind='dialogTitle'></span>\n    <div class='ng-modal-close' ng-click='hideModal()'>\n      <div ng-bind-html='closeButtonHtml'></div>\n    </div>\n    <div class='ng-modal-dialog-content' ng-transclude></div>\n  </div>\n</div>"      };    }  ]);


//Services
//{

landlordtmngt.factory('tenantcreation', function($resource) {
  return $resource('/web/Landlord/createTenant', {}, {
      create: {method:'POST', params:{}}
   });
});

landlordtmngt.factory('tenantlist', function($resource) {
  return $resource('/web/Landlord/tenantList/:crit', {}, {
      query: {method:'GET', params:{"plot.name":"kahawa_2"}, isArray:true}
   });
});




landlordtmngt.controller('pwdchangectrl', function($scope,$http) {

$scope.btnStatus=true;
$scope.pwdchanged=false;
$scope.pwderror=false;
$scope.SubmitPwd=function(){
	ngProgress.start();
    $http.post('/web/ChangePwd',$scope.pwd )
		   .success(function(data) {
		   // console.log(data.success)
		   ngProgress.complete();
		    $scope.pwdchanged=true;
		     }) 
			.error(function(data) {
				 ngProgress.complete();
				 $scope.pwderror=true;	 
				});	
}


$scope.CheckPwd=function(){
	$scope.busy=true;
     $http.post('/web/CheckPwd',$scope.pwd )
		   .success(function(data) {
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
				});	
}
     
});

landlordtmngt.controller('TenantPaidReportctrl', function($scope,$http,$rootScope,$window,ngProgress) {
  
	         $scope.landlordplots=$rootScope.plot;
   $scope.PaidTenant=[];
   $scope.numPerPage=6;
  $scope.showData=false;
  $scope.showError=false;
  $scope.ViewReport=false;
  $scope.ViewDownloadReport=false;
$scope.disablebtn=true;

  $scope.selectReport=function(name){
	  $scope.pname=name;
	  $scope.disablebtn=false;
  };

   $scope.ShowReport=function(){
	    ngProgress.start();
	    $scope.reportData={
	                   "plot":$scope.pname,
                       "option":"view"
                    };
	  
               $http.post('/web/Reports/Tenantpaid', $scope.reportData)
						 .success(function(data) {
				    ngProgress.complete();
                       $scope.ViewReport=true;
					   $scope.ViewDownloadReport=false;
                       $scope.content=data.result;
					
								
							 }) 
						 .error(function(data) {

							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 ngProgress.complete();
								  $scope.showData=false;
							 });
							   
	
   }


    $scope.DownloadReport=function(){
            
ngProgress.start();
			$scope.reportData={
	                   "plot":$scope.pname,
                       "option":"download"
                    };
               $http.post('/web/Reports/Tenantpaid', $scope.reportData)
						 .success(function(data) {
				    ngProgress.complete();
                      $scope.ViewReport=false;
		         	$scope.ViewDownloadReport=true;
					    $scope.file=data;
								
							 }) 
						 .error(function(data) {
							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 ngProgress.complete();
								  $scope.showData=false;
							 });
        

	};

 
});
landlordtmngt.controller('TenantUnpaidReportctrl', function($scope,$http,$rootScope,$window,ngProgress) {

         $scope.landlordplots=$rootScope.plot;
   $scope.PaidTenant=[];
  $scope.showData=false;
  $scope.showError=false;
  $scope.ViewReport=false;
  $scope.ViewDownloadReport=false;
$scope.disablebtn=true;

  $scope.selectReport=function(name){
	  $scope.pname=name;
	  $scope.disablebtn=false;
  };

   $scope.ShowReport=function(){
	    ngProgress.start();
	    $scope.reportData={
	                   "plot":$scope.pname,
                       "option":"view"
                    };
	  
               $http.post('/web/Reports/TenantUnpaid', $scope.reportData)
						 .success(function(data) {
				    ngProgress.complete();
                       $scope.ViewReport=true;
					   $scope.ViewDownloadReport=false;
                       $scope.content=data.result;

								
							 }) 
						 .error(function(data) {

							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 ngProgress.complete();
								  $scope.showData=false;
							 });
							   
	
   }


    $scope.DownloadReport=function(){
            
ngProgress.start();
			$scope.reportData={
	                   "plot":$scope.pname,
                       "option":"download"
                    };
               $http.post('/web/Reports/TenantUnpaid', $scope.reportData)
						 .success(function(data) {
				    ngProgress.complete();
                      $scope.ViewReport=false;
		         	$scope.ViewDownloadReport=true;
					    $scope.file=data;
								
							 }) 
						 .error(function(data) {
							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 ngProgress.complete();
								  $scope.showData=false;
							 });
        

	};
});

landlordtmngt.controller('TenantListReportctrl', function($scope,$http,$rootScope,$window,ngProgress) {

     $scope.landlordplots=$rootScope.plot;
   $scope.PaidTenant=[];
   $scope.numPerPage=6;
  $scope.showData=false;
  $scope.showError=false;
  $scope.ViewReport=false;
  $scope.ViewDownloadReport=false;
$scope.disablebtn=true;

  $scope.selectReport=function(name){
	  $scope.pname=name;
	  $scope.disablebtn=false;
  };

   $scope.ShowReport=function(){
	    ngProgress.start();
	    $scope.reportData={
	                   "plot":$scope.pname,
                       "option":"view"
                    };
	  
               $http.post('/web/Reports/TenantList', $scope.reportData)
						 .success(function(data) {
				    ngProgress.complete();
                       $scope.ViewReport=true;
					   $scope.ViewDownloadReport=false;
                       $scope.content=data.result;
	
								
							 }) 
						 .error(function(data) {
	
							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 ngProgress.complete();
								  $scope.showData=false;
							 });
							   
	
   }


    $scope.DownloadReport=function(){
            
ngProgress.start();
			$scope.reportData={
	                   "plot":$scope.pname,
                       "option":"download"
                    };
               $http.post('/web/Reports/TenantList', $scope.reportData)
						 .success(function(data) {
				    ngProgress.complete();
                      $scope.ViewReport=false;
		         	$scope.ViewDownloadReport=true;
					    $scope.file=data;
								
							 }) 
						 .error(function(data) {
							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 ngProgress.complete();
								  $scope.showData=false;
							 });
        

	};

});


landlordtmngt.controller('OccupiedHousectrl', function($scope,$http,$rootScope,$window,ngProgress) {
	 
	         $scope.landlordplots=$rootScope.plot;
   $scope.numPerPage=6;
  $scope.showData=false;
  $scope.showError=false;
  $scope.ViewReport=false;
  $scope.ViewDownloadReport=false;
$scope.disablebtn=true;

  $scope.selectReport=function(name){
	  $scope.pname=name;
	  $scope.disablebtn=false;
  };

   $scope.ShowReport=function(){
	    ngProgress.start();
	    $scope.reportData={
	                   "plot":$scope.pname,
                       "option":"view"
                    };
	  
               $http.post('/web/Reports/OccupiedHouses', $scope.reportData)
						 .success(function(data) {
				    ngProgress.complete();
                       $scope.ViewReport=true;
					   $scope.ViewDownloadReport=false;
                       $scope.content=data.result;
					
								
							 }) 
						 .error(function(data) {

							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 ngProgress.complete();
								  $scope.showData=false;
							 });
							   
	
   }


    $scope.DownloadReport=function(){
            
ngProgress.start();
			$scope.reportData={
	                   "plot":$scope.pname,
                       "option":"download"
                    };
               $http.post('/web/Reports/OccupiedHouses', $scope.reportData)
						 .success(function(data) {
				    ngProgress.complete();
                      $scope.ViewReport=false;
		         	$scope.ViewDownloadReport=true;
					    $scope.file=data;
								
							 }) 
						 .error(function(data) {
							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 ngProgress.complete();
								  $scope.showData=false;
							 });
        

	};

});
landlordtmngt.controller('VacantHousectrl', function($scope,$http,$rootScope,$window,ngProgress) {
                    $scope.landlordplots=$rootScope.plot;
   $scope.numPerPage=6;
  $scope.showData=false;
  $scope.showError=false;
  $scope.ViewReport=false;
  $scope.ViewDownloadReport=false;
$scope.disablebtn=true;

  $scope.selectReport=function(name){
	  $scope.pname=name;
	  $scope.disablebtn=false;
  };

   $scope.ShowReport=function(){
	    ngProgress.start();
	    $scope.reportData={
	                   "plot":$scope.pname,
                       "option":"view"
                    };
	  
               $http.post('/web/Reports/VacantHouses', $scope.reportData)
						 .success(function(data) {
				    ngProgress.complete();
                       $scope.ViewReport=true;
					   $scope.ViewDownloadReport=false;
                       $scope.content=data.result;
					
								
							 }) 
						 .error(function(data) {

							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 ngProgress.complete();
								  $scope.showData=false;
							 });
							   
	
   }


    $scope.DownloadReport=function(){
            
ngProgress.start();
			$scope.reportData={
	                   "plot":$scope.pname,
                       "option":"download"
                    };
               $http.post('/web/Reports/VacantHouses', $scope.reportData)
						 .success(function(data) {
				    ngProgress.complete();
                      $scope.ViewReport=false;
		         	$scope.ViewDownloadReport=true;
					    $scope.file=data;
								
							 }) 
						 .error(function(data) {
							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 ngProgress.complete();
								  $scope.showData=false;
							 });
        

	};
});


//Services



landlordtmngt.factory('tenant', function($http) {
    var tenant={}    
    var url='/web/Landlord';
	 tenant.gethouse = function (Houseid) {
		return $http.post(url + '/tenantDataHseName', Houseid);
    };
      tenant.getTenantid = function (Tenantid) {
		return $http.post(url + '/tenantDataID', Tenantid);
    };

    tenant.Search = function (search) {
		return $http.post(url + '/GeneralSearch', search);
    };

	
	return tenant;
});







landlordtmngt.service('BatchTrxnService', function () {
    //to create unique contact id
    //contacts array to hold list of all contacts
    var data = [];
       var uid = 0;
    //save method create a new contact if not already exists
    //else update the existing object
    this.save = function (user) {
           user.traceid=uid++;
		   data.push(user);
       

    }

    //simply search contacts list for given id
    //and returns the contact object if found
    this.get = function (id) {
        for (i in data) {
            if (data[i].traceid == id) {	
                return data[i];
            }
        }

    }
    
    //iterate through contacts list and delete 
    //contact if found
    this.delete = function (id) {
        for (i in data) {
            if (data[i].traceid == id) {
				var dt=data[i];
                data.splice(i, 1);
				return dt;
            }
        }
    }

    //simply returns the contacts list
    this.list = function () {
        return data;
    }
});







//Routes 

landlordtmngt.config(function($routeProvider,$locationProvider)	{

  $locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/tenantsmngt', {
     templateUrl: 'views/Landlord/landlordTenantmngt.html',   
      controller: 'tenantctrl'
        })
  .when('/housemngt', {
     templateUrl: 'views/Landlord/landlordHousemngt.html',   
     controller: 'housemngtctrl'
        })
   .when('/plotmngt', {
       templateUrl: 'views/Landlord/landlordPlotmngt.html',   
       controller: 'plotmngtctrl'
        })
   .when('/trxnmngt', {
       templateUrl: 'views/Landlord/TransactionSelect.html',   
       controller: 'trxntypectrl'
        })
    .when('/Singletransaction', {
       templateUrl: 'views/Landlord/landlordTrxnmgt.html',   
       controller: 'trxnmngtctrl'
        })

    .when('/Batchtransaction', {
       templateUrl: 'views/Landlord/LandlordBatchTrxn.html',   
       controller: 'trxnmngtctrl'
        })

    .when('/expensemngt', {
       templateUrl: 'views/Landlord/landlordExpensemngt.html',   
       controller: 'expensemngtctrl'
        })
	.when('/summarymngt', {
       templateUrl: 'views/LandlordlandlordSummarymngt.html',   
       controller: 'summarymngtctrl'
        })
    .when('/documentmngt', {
       templateUrl: 'views/Landlord/landlordDocumentmngt.html',   
       controller: 'documentmngtctrl'
        })
    .when('/inbox', {
       templateUrl: 'views/Landlord/landlordMessageInbox.html',   
       controller: 'inboxctrl'
        })

    .when('/rent', {
       templateUrl: 'views/Landlord/landlordRent.html',   
       controller: 'rentctrl'
        })

      .when('/vacate', {
       templateUrl: 'views/Landlord/LandlordVacate.html',   
       controller: 'vacatectrl'
        })

    .when('/pwdchange', {
     templateUrl: 'views/Landlord/PwdChange.html',   
     controller: 'pwdchangectrl'
        })

    .when('/profile', {
     templateUrl: 'views/Landlord/LandlordProfile.html',   
     controller: 'LandlordProfilectrl'
        })
	.when('/ReportsPortal', {
     templateUrl: 'views/Landlord/ReportsViews/ReportsPortal.html',   
     controller: 'ReportsPortalctrl'
        })		
	.when('/Settings', {
     templateUrl: 'views/Landlord/LandlordDashboard.html',   
     controller: 'Settingsctrl'
        })

	.when('/RentPosting', {
     templateUrl: 'views/Landlord/RentPosting.html',   
     controller: 'RentPostingctrl'
        })
	.when('/TenantPaidReport', {
     templateUrl: 'views/Landlord/ReportsViews/TenantPaidReport.html',   
     controller: 'TenantPaidReportctrl'
        })	
 .when('/TenantUnPaidReport', {
     templateUrl: 'views/Landlord/ReportsViews/TenantUnpaidReport.html',   
     controller: 'TenantUnpaidReportctrl'
        })	
 .when('/TenantListReport', {
     templateUrl: 'views/Landlord/ReportsViews/TenantListReport.html',   
     controller: 'TenantListReportctrl'
        })
.when('/OccupiedHouseReport', {
     templateUrl: 'views/Landlord/ReportsViews/OccupiedHouseReport.html',   
     controller: 'OccupiedHousectrl'
        })	
  .when('/VacantHouseReport', {
     templateUrl: 'views/Landlord/ReportsViews/VacantHouseReport.html',   
     controller: 'VacantHousectrl'
        })
.when('/Notice', {
     templateUrl: 'views/Landlord/LandlordNotice.html',   
     controller: 'Noticectrl'
        })
 .when('/VacateNotice', {
     templateUrl: 'views/Landlord/LandlordVacateNotice.html',   
     controller: 'VacateNoticectrl'
        })			
		
		
	.otherwise({
         redirectTo: '/plotmngt'
      });

});