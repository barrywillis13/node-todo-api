// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var user = {name: 'Barry', age: 29};
var {name} = user;
console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

db.collection('Users').find({name: 'Barry Willis'}).toArray().then((result) => {
  console.log(JSON.stringify(result, undefined, 2));
}, (err) => {
  console.log(err);
})

  //db.close();
});


// db.collection('Todos').find()
// .count().then((count) => {
//   console.log(`Todos count: ${count}`);
// }, (err) => {
//   console.log('Unable to fetch todos', err);
// });

// db.collection('Todos').find({
//   _id: new ObjectID("58414755765f042b44bc2d48")
// })
// .toArray().then((docs) => {
//   console.log('Todos:');
//   console.log(JSON.stringify(docs, undefined, 2));
// }, (err) => {
//   console.log('Unable to fetch todos', err);
// });
