const express = require("express");
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const {
  estatisticas,
  atualizaUserData,
  criarIndicadoData,
  createUser,
  loginUser,
  getBancoUser,
  createBancoUser,
  updateBancoUser
} = require("./api");


const dbData = {
  Users: {},
  Indicados: {}
}

passport.use(new LocalStrategy(
  function(username, password, done) {
    loginUser(username, password, (err, user) => {
      console.log(user);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: 'Incorrect username or password.'
        });
      }
    })
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(session({
  secret: "my little cats secret",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/login", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render("login");
  }
});

app.post("/login", passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect('/');
});


app.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    const dados = estatisticas(req.user.cpf, dbData);
    res.render("index", {
      dados: dados
    });
  } else {
    res.redirect("/login");
  }
});


app.get("/cadastro", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("cadastro");
  }
});

app.post("/cadastro", function(req, res, next) {

  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    createUser(req.body, function(err, user) {
      if (err) {
        res.redirect("/cadastro");
      } else {
        res.redirect("/login");
      }
    });
  }
});


app.get("/dadosbancarios", function(req, res, next) {
  if (req.isAuthenticated()) {
    const {token, cpf} = req.user;
    getBancoUser(token, cpf, function(err, userBanco){
      if(err){
        console.log(err);
      }else {
        console.log('OK: ',userBanco);
      }
    })
    res.render("dadosbancarios", {
      dados: {
        'id': 0,
        'banco': '',
        'agencia': '',
        'conta': '',
        'tpconta': 'POUPANCA'
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/dadosbancarios", function(req, res, next) {
  if (req.isAuthenticated()) {
    let { id: idBco  } = req.body;
    idBco = parseInt(idBco);
    const bancoJson = {
      "usuario_cpf": req.user.cpf,
      "id": idBco,
      "banco_codigo": req.body.banco,
      "agencia": req.body.agencia,
      "conta": req.body.conta,
      "tipoConta": req.body.tpconta
    }
    const { token } = req.user;

    if(idBco){
      updateBancoUser(token, bancoJson, function(err, bancoUser){
        if(err){
          console.log(err);
          res.redirect("/dadosbancarios");
        }else{
          console.log('updateBancoUser:' ,bancoUser);
          res.redirect("/");
        }
      });
    }else{
      createBancoUser(token, bancoJson, function(err, bancoUser){
        if(err){
          console.log(err);
          res.redirect("/dadosbancarios");
        }else{
          console.log('createBancoUser:' ,bancoUser);
          res.redirect("/");
        }
      });
    }
  } else {
    res.redirect("/login");
  }
});


app.get("/indicacoes", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("indicacoes");
  } else {
    res.redirect("/login");
  }
});

app.post("/indicacoes", function(req, res, next) {
  if (req.isAuthenticated()) {

    if (criarIndicadoData(req.body, req.user.cpf, dbData)) {
      res.redirect("/");
    } else {
      res.redirect("/indicacoes");
    }

  } else {

    res.redirect("/login");
  }
});


app.listen(process.env.PORT || 3000, function() {
  console.log("The server was started on port 3000");
});
