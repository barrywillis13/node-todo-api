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

  db.close(() => {
    console.log('Connection Closed')
  });
});



// db.collection('Users').insertOne({
//   name: 'Barry Willis',
//   age: 29,
//   location: 'Letterkenny'
// }, (err, result) => {
//   if(err){
//     console.log('Unable to insert user');
//   } else {
//     console.log('User created \n')
//     console.log(result.ops[0]._id.getTimestamp());
//   }
// });
// db.collection('Todos').insertOne({
//   text: 'Something to do',
//   completed: false
// }, (err, result) => {
//   if(err){
//     console.log('Unable to insert todo', err);
//   }else {
//   console.log(JSON.stringify(result.ops, undefined, 2));
//   }
// });

// Insert new doc into Users (name, age, location)
