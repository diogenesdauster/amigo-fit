const express = require("express");
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const helpers = require("./helpers");


const dbData = {
  Users:{},
  Indicados:{}
}

passport.use(new LocalStrategy(
  function(username, password, done){
      const user = helpers.loginData(username, password, dbData.Users);

      if(user){
        return done(null,user);
      } else {
        return done(null, false, { message: 'Incorrect username or password.'});
      }
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: "my little cats secret",
  resave: false,
  saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/login", function(req,res, next){
  if(req.isAuthenticated()){
    res.redirect('/');
  }else{
    res.render("login");
  }
});

app.post("/login", passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login'}));

app.get("/logout", function(req, res){
 req.logout();
 res.redirect('/');
});


app.get("/", function(req,res, next){
    if(req.isAuthenticated()){
        const dados = helpers.estatisticas(req.user.cpf, dbData);
        res.render("index",{dados: dados});
     }else{
       res.redirect("/login");
     }
});


app.get("/cadastro", function(req,res, next){
  if(req.isAuthenticated()){
     res.redirect("/");
   }else{
     res.render("cadastro");
   }
});

app.post("/cadastro", function(req,res, next){

  if(req.isAuthenticated()) {
     res.redirect("/");
   } else {
     helpers.criarUserData(req.body, dbData);
     res.redirect("/login");
  }
});


app.get("/dadosbancarios", function(req,res, next){
  if(req.isAuthenticated()) {
    res.render("dadosbancarios",{ dados: {'banco':req.user.banco,
    'agencia':req.user.agencia,
    'conta':req.user.conta,
    'tpconta':req.user.tpconta} });
  } else {
    res.redirect("/login");
  }
});

app.post("/dadosbancarios", function(req,res, next){
  if(req.isAuthenticated()) {

    helpers.atualizaUserData(req.body, req.user, dbData)

    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});


app.get("/indicacoes", function(req,res, next){
  if(req.isAuthenticated()){
    res.render("indicacoes");
   }else{
     res.redirect("/login");
   }
});

app.post("/indicacoes", function(req,res, next){
  if(req.isAuthenticated()) {

    if(helpers.criarIndicadoData(req.body, req.user.cpf, dbData)){
      res.redirect("/");
    }else {
      res.redirect("/indicacoes");
    }

  } else {

    res.redirect("/login");
  }
});


app.listen(3000,function(){
  console.log("The server was started on port 3000");
});
