var request = require('request');
var async = require('async');


async.series([function(cb) {
    getStatus(function(error, status) {
        console.log('getStatus: ', status);
        cb();
    });
}, function(cb) {
    addBook(4, 'ddd', 7, function(error, addedBook) {
        console.log('bookAdded: ', addedBook);
        cb();
    });
}, function(cb) {
    removeBook(4, function(error, removedBook) {
        console.log('bookRemoved: ', removedBook);
        cb();
    });
}, function(cb) {
    getStatus(function(error, status) {
        console.log('getStatus:', status);
        cb();
    });
}], function(err, results) {
    console.log('tasks ended!');
});



function rentBook(bookid, callback) {
    request({
        method: 'POST',
        uri: 'http://localhost:55555/rentbook',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: bookid})
    }, function (e, r, b) {
        var rentbook = JSON.parse(b);
        console.log(rentbook);
        callback(e, rentbook);
    });
}

function returnBook(bookid, callback) {
    request({
        method: 'POST',
        uri: 'http://localhost:55555/returnbook',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: bookid})
    }, function (e, r, b) {
        var returnbook = JSON.parse(b);
        console.log(returnbook);
        callback(e, returnbook);
    });
}

function addBook(bookid, bookname, bookprice, callback) {
    request({
        method: 'POST',
        uri: 'http://localhost:55555/addbook',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: bookid, name: bookname, price: bookprice})
    }, function (e, r, b) {
        var addbook = JSON.parse(b);
        console.log(addbook);
        callback(e, addbook);
    });
}

function removeBook(bookid, callback) {
    request({
        method: 'POST',
        uri: 'http://localhost:55555/removebook',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: bookid})
    }, function (e, r, b) {
        var removebook = JSON.parse(b);
        console.log(removebook);
        callback(e, removebook);
    });
}

function getAccount(callback) {
    request({
        method: 'GET',
        uri: 'http://localhost:55555/getaccount',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify()
    }, function (e, r, b) {
        var account = JSON.parse(b);
        console.log(account);
        callback(e, account);
    });
}

function getStatus(callback) {
    request({
        method: 'GET',
        uri: 'http://localhost:55555/getstatus',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify()
    }, function (e, r, b) {
        var bookstatus = JSON.parse(b);
        console.log(bookstatus);
        callback(e, bookstatus);
    });
}