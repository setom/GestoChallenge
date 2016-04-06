//the DB for food in the order
var Food = require('./models/food');
//the DB for food on the menu
var Menu = require('./models/menu');
//the DB for the order history
var History = require('./models/history');

/*
 * Generates a list of all foods on the menu
 */
function getMenu(res){
    Menu.find(function(err, menus){
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(menus); // return all foods in JSON format
    });
}
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
 * Generates a list of all historical orders
 */
function getHistory(res){
    History.find(function(err, histories){
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(histories); // return all foods in JSON format
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
    
    //get all the menu items
    app.get('/api/menu', function (req, res) {
        // use mongoose to get all foods in the database
        getMenu(res);
    });
    
    //get all the historical orders
    app.get('/api/histories', function(req, res){
        getHistory(res);
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
    
        // create food and send back all foods after creation
    app.post('/api/menu', function (req, res) {
        // create a food, information comes from AJAX request from Angular
        Menu.create({
            price: req.body.num,
            name: req.body.text,
            done: false
        }, function (err, food) {
            if (err)
                res.send(err);

            // get and return all the food after you create another
            getMenu(res);
        });

    });
    
    // create history and send back all foods after creation
    app.post('/api/histories', function (req, res) {
        // create a food, information comes from AJAX request from Angular
        History.create({
            date: req.body.date,
            orderTotal: req.body.total,
            done: false
        }, function (err, history) {
            if (err)
                res.send(err);

            // get and return all the food after you create another
            getHistory(res);
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
    
    // delete a menu item
    app.delete('/api/menu/:menu_id', function (req, res) {
        Menu.remove({
            _id: req.params.menu_id
        }, function (err, food) {
            if (err)
                res.send(err);

            getMenu(res);
        });
    });
    
    // delete a history item
    app.delete('/api/histories/:history_id', function (req, res) {
        History.remove({
            _id: req.params.history_id
        }, function (err, history) {
            if (err)
                res.send(err);

            getHistory(res);
        });
    });
    
    //delete ALL foods
    app.delete('/api/food/', function(req, res){
        Food.remove({}, function (err, food) {
            if (err)
                res.send(err);

            getFoods(res);
        });
    });
    
    //delete ALL histories
    app.delete('/api/histories/', function(req, res){
        History.remove({}, function (err, history) {
            if (err)
                res.send(err);

            getHistory(res);
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};