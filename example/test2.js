var express = require('express');
var bodyparser = require('body-parser');

var app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.listen(55555, function(){
    console.log('Port : '+this.address().port);
});

var bookstore = {
    bookshelf :
        {'1' : {id:1, name:'aaa', price:'2'},
        '2' : {id:2, name:'bbb', price:'5'}},
    rentedbooklist : {},
    totalaccount : 0
};

app.post('/rentbook', function(req, res){
    var rentbookid = req.body.id;
    var rentbook = bookstore.bookshelf[rentbookid];
    delete bookstore.bookshelf[rentbookid];
    bookstore.rentedbooklist[rentbookid] = rentbook;
    bookstore.totalaccount += rentbook.price;
    res.json(rentbook);
});

app.post('/returnbook', function(req, res){
    var returnbookid = req.body.id;
    var returnbook = bookstore.rentedbooklist[returnbookid];
    delete bookstore.rentedbooklist[returnbookid];
    bookstore.bookshelf[returnbookid] = returnbook;
    bookstore.totalaccount -= returnbook.price;
    res.json(returnbook);
});

app.post('/addbook/', function(req,res){
    var addbookid = req.body.id;
    var addbook = req.body;
    bookstore.bookshelf[addbookid] = addbook;
    res.json(addbook);
});

app.post('/removebook', function(req, res){
    var removebookid = req.body.id;
    var removebook = bookstore.bookshelf[removebookid];
    delete bookstore.bookshelf[removebookid];
    res.json(removebook);
});

app.get('/getaccount', function(req, res){
    res.json(bookstore.totalaccount);
});

app.get('/getstatus', function(req,res){
    res.json(bookstore);
});