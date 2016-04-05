angular.module('foodController', [])

	// inject the Food factory to the controller
	.controller('mainController', ['$scope','$http','Foods', function($scope, $http, Foods) {
		$scope.formData = {};
		$scope.loading = true;

		// GET =====================================================================
		// when landing on the page, get all the foods to display
		// call the Foods service and get the foods
		Foods.get()
			.success(function(data) {
				$scope.foods = data;
				$scope.loading = false;
			});

		// CREATE ==================================================================
		// when submitting the add form, send the text and price to the node API
		$scope.createFood = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.text !== undefined && $scope.formData.num != undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				Foods.create($scope.formData)

					// if successful creation, call our get function to get all the new foods
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.foods = data; // assign our new list of foods
					});
			
                            Foods.total()
                            .success(function(data) {
                                    
                            });
                        }
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
		};
	}]);