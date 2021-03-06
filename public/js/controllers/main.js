angular.module('foodController', [])

	// inject the Food factory to the controller
	.controller('mainController', ['$scope','$http','Foods', 'Menus', 'Histories', function($scope, $http, Foods, Menus, Histories) {
		$scope.formData = {};
                $scope.menuItem = {};
                $scope.orderData = {};
		$scope.loading = true;

		//Immediately on landing on the page, query the Foods DB to get anything in the order
                //Query the Menus database to get any menu items that are saved to the Menu DB
		Foods.get()
			.success(function(data) {
				$scope.foods = data;
				$scope.loading = false;
			});
                Menus.get()
                        .success(function(data){
                            $scope.menus = data;
                            $scope.loading = false;
                        });
                
                //What is the current cost of the order?
                Foods.total()
                        .success(function(data) {
                             $scope.orderTotal = data[0];                              
                        });
                        
                Histories.get()
                        .success(function(data){
                            $scope.histories = data;
                        });

		// CREATE ==================================================================
		// when submitting the add form, send the text and price to the node API
		$scope.createFood = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.text !== undefined && $scope.formData.num != undefined) {
				$scope.loading = true;
                                
                                //add the new item to the menu
                                Menus.create($scope.formData)
                                    .success(function(data) {
						$scope.loading = false; // clear the form so our user is ready to enter another
						$scope.menus = data; // assign our new list of foods
					});
				// call the create function from our service (returns a promise object)
				Foods.create($scope.formData)
					// if successful creation, call our get function to get all the new foods
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.foods = data; // assign our new list of foods
					});
                                        
                                //update the costs
                                Foods.total()
                                        .success(function(data) {
                                             $scope.orderTotal = data[0];                              
                                        });
                        }
		};

                $scope.addToOrder = function(item){
                    $scope.menuItem.text = item.name;
                    $scope.menuItem.num = item.price;
                    
                    Foods.create($scope.menuItem)
                        .success(function(data) {
                            $scope.loading = false;
                            $scope.menuItem = {}; // clear the form so our user is ready to enter another
                            $scope.foods = data; // assign our new list of foods
                        });

                    //update the costs
                    Foods.total()
                        .success(function(data) {
                             $scope.orderTotal = data[0];                              
                        });
                };
                
                $scope.submitOrder = function(){
                    if($scope.foods.length !== 0){
                    $scope.loading = true;
                    $scope.orderData.date = new Date();
                    $scope.orderData.total = $scope.orderTotal.total;
                    Histories.create($scope.orderData)
                            .success(function(data){
                                $scope.orderData = {};
                                $scope.orderHistory = data;
                                Foods.clear()
                                        .success(function(data){
                                            $scope.loading = false;
                                            $scope.foods = data;
                                });
                    });
                    Histories.get()
                        .success(function(data){
                            $scope.histories = data;
                        });
                    //What is the current cost of the order?
                    Foods.total()
                        .success(function(data) {
                             $scope.orderTotal = data[0];                              
                        });
                };
            };
                
		// DELETE ==================================================================
		// delete a food
		$scope.deleteFood = function(id) {
			$scope.loading = true;

			Foods.delete(id)
				// if successful creation, call our get function to get all the new foods
				.success(function(data) {
					$scope.loading = false;
					$scope.foods = data; // assign our new list of foods
				});
                        //update the costs
                        Foods.total()
                                .success(function(data) {
                                     $scope.orderTotal = data[0];                              
                                });        
                };
                
                //delete an item from the menu
                $scope.deleteMenuItem = function(id){
                    $scope.loading = true;
                    
                    Menus.delete(id)
                            .success(function(data){
                                $scope.loading = false;
                                $scope.menus = data;
                    });
                };
                
                //delete an order history 
                $scope.deleteHistory = function(id){
                    $scope.loading = true;
                    
                    Histories.delete(id)
                            .success(function(data){
                                $scope.histories = data;
                                $scope.loading = false;
                    });
                };
                
                //delete all items from the food/order list
                $scope.clearAll = function(){
                    $scope.loading = true;
                    
                    Foods.clear()
                            .success(function(data){
                                $scope.loading = false;
                                $scope.foods = data;
                    });
                    
                    //update the costs
                    Foods.total()
                            .success(function(data) {
                                 $scope.orderTotal = data[0];                              
                            });  
                };
                
                //delete all histories from the history list
                $scope.clearAllHistory = function(){
                    $scope.loading = true;
                    Histories.clear()
                            .success(function(data){
                                $scope.histories = data;
                                $scope.loading = false;
                    });
                };
	}]);