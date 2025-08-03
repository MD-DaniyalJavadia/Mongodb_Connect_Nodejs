const { MongoClient } = require('mongodb');

let dbconnect; // Global variable

module.exports = {
    connecttodb: (cb) => {
        MongoClient.connect('mongodb://127.0.0.1:27017/dbdemo')
            .then((client) => {
                dbconnect = client.db(); 
                cb(); // success callback
            })
            .catch((err) => {
                console.log('MongoDB Connection Error:', err);
                cb(err); // error callback
            });
    },
    getDb: () => dbconnect
};
