
require('./config/config.js')
const _ =require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {logger} = require('./middleware/logger')
const {authenticate} = require('./middleware/authenticate')
const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const bcrypt = require('bcryptjs')
var app = express();

var port = process.env.PORT;

////////////////////////////////////////////////////////////////////////
// M I D D L E W A R E
////////////////////////////////////////////////////////////////////////

app.use(bodyParser.json())
app.use(logger)

////////////////////////////////////////////////////////////////////////
// R O U T I N G
////////////////////////////////////////////////////////////////////////

//*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/
//*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/
// U S E R S
//*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/
//*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/

// C R E A T E   A   U S E R //////////////////////////////////////////
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

// F E T C H   C U R R E N T   U S E R ///////////////////////////////////////////////
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
})

// L O G I N /////////////////////////////////////////////////////////////
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    })
  }).catch((e) => {
    res.status(400).send()
  })
})

// L O G O U T /////////////////////////////////////////////////////////////
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {server
    res.status(400).send();
  });
});

//*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/
//*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/
// T O D O S
//*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/
//*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/

// C R E A T E   A   T O D O ///////////////////////////////////////////
app.post('/todos', authenticate,  (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// F I N D   A L L   T O D O S ////////////////////////////////////////
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos})
  }, (e) => {
    res.status(400).send(e);
  });
});

// F I N D   T O D O   B Y   I D /////////////////////////////////////
app.get('/todos/:id', authenticate, (req, res) => {
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
app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  };

  Todo.findByIdAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(todo){
      res.send(todo);
    }else{
      return res.status(404).send();
    };
  }).catch((e) => console.log(e));;
})

// U P D A T E ////////////////////////////////////////////////////////
  app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    };

    if(_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }
    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set:body}, {new: true}).then((todo) => {
      if(!todo) {
        return res.status(404).send()
      }
      res.send({todo});
    })
    // Todo.findOneAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    //   if (!todo){
    //     return res.status(404).send();
    //   }
    //   res.send({todo});
    // }).catch ((e) => {
    //   res.status(400).send();
    // })
  });
////////////////////////////////////////////////////////////////////////
// L I S T E N E R /////////////////////////////////////////////////////
app.listen(port, ()=> {
  console.log(`Server up on port ${port}`);
});
// E X P O R T S ///////////////////////////////////////////////////////
module.exports = {app};
////////////////////////////////////////////////////////////////////////
