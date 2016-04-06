angular.module('historyService', [])

        // super simple service
        // each function returns a promise object 
        .factory('Histories', ['$http', function ($http) {
                return {
                    //gets all the foods currently stored in the DB
                    get: function () {
                        return $http.get('/api/histories');
                    },
                    //creates a new food object in the DB with the name and price given from user input
                    create: function (orderData) {
                        return $http.post('/api/histories', orderData);
                    },
                    //deletes a food object from the DB. Identified with the unique ID number
                    delete: function (id) {
                        return $http.delete('/api/histories/' + id);
                    },
                    //remove all items from the history list
                    clear: function(){
                        return $http.delete('/api/histories/');
                    }
                };
            }]);
