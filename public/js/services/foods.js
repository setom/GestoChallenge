angular.module('foodService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Foods', ['$http',function($http) {
		return {
                        //gets all the foods currently stored in the DB
			get : function() {
				return $http.get('/api/food');
			},
                        //creates a new food object in the DB with the name and price given from user input
			create : function(foodData) {
				return $http.post('/api/food', foodData);
			},
                        //deletes a food object from the DB. Identified with the unique ID number
			delete : function(id) {
				return $http.delete('/api/food/' + id);
			},
                        //generates the total value of an order with fixed tax rate of 7.5%
                        //returns an object with a 'total' field
                        total : function() {
				return $http.get('/api/total');
			}
		}
	}]);