var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

var port = process.env.PORT || 3121;

app.use(bodyParser.json())

////////////////////////////////////////////////////////////////////////
// R O U T I N G
////////////////////////////////////////////////////////////////////////

// C R E A T E   A   T O D O ///////////////////////////////////////////
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  })
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// C R E A T E   A   U S E R //////////////////////////////////////////
app.post('/users', (req, res) => {
  var user = new User({
    name: req.body.name,
    email: req.body.email
  })
  user.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// F I N D   A L L   T O D O S ////////////////////////////////////////
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }, (e) => {
    res.status(400).send(e);
  });
});

// F I N D   T O D O   B Y   I D /////////////////////////////////////
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  };

  Todo.findById(id).then((todo) => {
    if(todo){
      res.send({todo});
    }else {
      return res.status(404).send();
    }
  }).catch((e) => console.log(e));
});

// R E M O V E ////////////////////////////////////////////////////////
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  };

  Todo.findByIdAndRemove(id).then((todo) => {
    if(todo){
      res.send(todo);
    }else{
      return res.status(404).send();
    };
  }).catch((e) => console.log(e));;
})

// L I S T E N E R /////////////////////////////////////////////////////
app.listen(port, ()=> {
  console.log(`Server up on port ${port}`);
});
// E X P O R T S ///////////////////////////////////////////////////////
module.exports = {app};
////////////////////////////////////////////////////////////////////////
