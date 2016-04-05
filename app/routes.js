var Food = require('./models/food');

/*
 * Generates a list of all the foods in the DB
 */
function getFoods(res) {
    Food.find(function (err, foods) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(foods); // return all foods in JSON format
    });
} 

/*
 * Generates the total of the cost of the food in the list
 * Includes tax of 7.5% 
 * returns a single object with a 'total' field that is the total of the order including tax
 */
function getTotal(res){
    Food.aggregate([
        //generate the subtotal of each item (item cost * tax of 7.5%)
           {$project: {
                   _id: "$_id", 
                   subtotal: {$multiply: ["$price", "$tax"]}
           }},
        //sum all of the subtotals together
            {$group : {
                    _id: null, 
                    total: {$sum: "$subtotal"}
            }} 
       ], 
       function(err, result){
           if(err){
               res.send(err);
           }
           res.json(result);
       });
}
;
module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all foods
    app.get('/api/food', function (req, res) {
        // use mongoose to get all foods in the database
        getFoods(res);
    });
    
    //get the total of all the prices in the list, add 7.5% tax
    app.get('/api/total', function(req, res){
        getTotal(res);
    });

    // create food and send back all foods after creation
    app.post('/api/food', function (req, res) {
        // create a food, information comes from AJAX request from Angular
        Food.create({
            price: req.body.num,
            name: req.body.text,
            done: false
        }, function (err, food) {
            if (err)
                res.send(err);

            // get and return all the food after you create another
            getFoods(res);
        });

    });

    // delete a food
    app.delete('/api/food/:food_id', function (req, res) {
        Food.remove({
            _id: req.params.food_id
        }, function (err, food) {
            if (err)
                res.send(err);

            getFoods(res);
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};