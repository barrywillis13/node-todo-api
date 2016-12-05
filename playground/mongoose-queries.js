const {mongoose} =require('./../server/db/mongoose');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '584556f63b969250214ecef111';
//
// if(!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// };

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.find({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found')
//   };
//   console.log('Todo by id', todo);
// }).catch((e) => console.log(e));

var userId = '5841a98ccba14d3827618729';

User.findById(userId).then((user) => {
  if(!user){
    return console.log('User not found');
  };
  console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));


//User.findById - no user, user found, errors
