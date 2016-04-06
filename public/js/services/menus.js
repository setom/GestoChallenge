angular.module('menuService', [])

        // super simple service
        // each function returns a promise object 
        .factory('Menus', ['$http', function ($http) {
                return {
                    //gets all the foods currently stored in the DB
                    get: function () {
                        return $http.get('/api/menu');
                    },
                    //creates a new food object in the DB with the name and price given from user input
                    create: function (foodData) {
                        return $http.post('/api/menu', foodData);
                    },
                    //deletes a food object from the DB. Identified with the unique ID number
                    delete: function (id) {
                        return $http.delete('/api/menu/' + id);
                    }
                };
            }]);

