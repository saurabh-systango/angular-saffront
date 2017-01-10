(function () {

    'use strict';

      // Controller for get GET API
    angular.module('soffrontApp').controller('loginCtrl', loginCtrl);

    function loginCtrl($scope, $rootScope , $http, $q, $state, config, toastr, accountsDataServices, $localStorage, $sessionStorage, $window) {
		
		$scope.showInput = true;
		$scope.submitForm = function(isValid) {

			if (isValid) { 
				
				var configHeader = {
					headers: {
	                    dataType: 'josnp',
	                    contentType: 'application/json; charset=utf-8',
	                    Authentication: JSON.stringify($scope.user)
	                }
				}

				var deferred = $q.defer();

				if($scope.rememberMe){
					$localStorage.email = $scope.user.email;
				}

				if($localStorage.email){
					$scope.user.email = $localStorage.email;
				}

				console.log($scope.rememberMe);

				$http.get(config.api +"get", configHeader).success(function(data) {
		            deferred.resolve(data);	            

		            if (data.status==0) {		            
                		$sessionStorage.SessionToken = {token: data.data.token }; 

                		console.log( '$sessionStorage.SessionToken ', $sessionStorage.SessionToken)

                		var configHeader2 = {
				          headers: {
				              Authentication: JSON.stringify({token: data.data.token })
				          }
				        }

				        var deferred2 = $q.defer();

						$http.get(config.apiFileds +"users", configHeader2).success(function(data) {
				            deferred2.resolve(data);	            

				            if (data.status==0) {

				            angular.forEach(data.data.users, function(users) {
				                if ($scope.user.email == users.email){
				                	$sessionStorage.loginEmail = users.email; 
				                	$sessionStorage.loginUsername = users.name; 
				                }
				            });

								$state.go('home');
				            }else{
				            	alert('not working user api');
				            }

				        })
				        .error(function() {
				            deferred2.reject();
				        });
					    
					    return deferred2.promise;
			    
		            }else{
		            	$scope.msg = 'The username or password you entered is incorrect';
		            }

		        })
		        .error(function() {
		            deferred.reject();
		        });
			    
			    return deferred.promise;

			}

		};

		$scope.mailSend = false;
		$scope.user ={};
		$scope.msgcheck = false;

		$scope.submitForgotForm = function(isValid) {

			if($scope.user.email == undefined){
				$scope.msgcheck = true
			}else{
				
			}

			$scope.showMeError = true;

			if (isValid) { 
				
				var configHeader = {
					headers: {
	                    dataType: 'josnp',
	                    contentType: 'application/json; charset=utf-8',
	                    Authentication: JSON.stringify($scope.user)
	                }
				}

				var deferred = $q.defer();

				$http.get("https://testapi.snapshotcrm.com/v3/login/forgetpassword?input_param="+$scope.email, configHeader).success(function(data) {
		            deferred.resolve(data);	            

		            if (data.status==0) {

		            	$scope.mailSend = true;	
		            	$scope.showInput = true;	           
	                    //$state.go('home');
		            }else{
		            	$scope.showMeError = false;
		            }

		        })
		        .error(function() {
		            deferred.reject();
		        });
			    
			    return deferred.promise;

			}

		};
    	
    }

})();


(function() {

    'use strict';

    angular.module('soffrontApp').controller('ModalInstanceCtrl', ModalInstanceCtrl);

    function ModalInstanceCtrl($scope, $uibModalInstance) {
     
     	$scope.ok = function() {
            $uibModalInstance.close('open');
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

	}

})();