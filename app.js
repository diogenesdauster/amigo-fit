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
  updateBancoUser,
  getBancos,
  createIndicacaoUser,
  getIndicacaoBonusUser
} = require("./api");


const dbData = {
  Users: {},
  Indicados: {}
}

passport.use(new LocalStrategy(
  function(username, password, done) {
    loginUser(username, password, (err, user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(err, null);
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
    res.render("login", { error:null } );
  }
});

/*
app.post("/login", passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));
*/


app.post('/login', function(req, res) {
  passport.authenticate('local', function(err, user) {
    if (err) {
      return res.render('login', { error: { message: err } });
    }

    if (!user) {
      return res.render('login', { error: { message: "Ocorreu um erro ao tentar logar, tente novamente!" } });
    }

    req.logIn(user, function(err) {
      if (err) {
        console.log(err);
        return res.render('login', { error: { message: "Ocorreu um erro ao tentar logar, tente novamente!" } });
      }
      return res.redirect('/');
    });
  })(req, res);
});


app.get("/logout", function(req, res) {
  req.logout();
  res.redirect('/');
});


app.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    const { token, cpf} = req.user;
    const ret = {
      'dados' : {
        'indicados': 0,
        'ativos': 0,
        'inativos':0,
        'bonus': 0
      }
    }

    getIndicacaoBonusUser(token, cpf , function(err, data){
      if(data){
          ret.dados.indicados = data.indicacoes;
          ret.dados.ativos = data.ativacoes;
          ret.dados.inativos = data.inativacoes;
          ret.dados.bonus = data.totalBonus;
      }
      res.render("index", ret);
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
    const ret = { 'dados': {
      'id': 0,
      'banco': '',
      'agencia': '',
      'conta': '',
      'tpconta': 'POUPANCA'
    },
      'bancos': []
    };

    getBancos(token, function(err, bancos){
      if(bancos){
        ret.bancos = bancos;
      }else{
        console.log(err);
      }

      getBancoUser(token, cpf, function(err, userBanco){
        if(userBanco){
          ret.dados = userBanco;
          res.render("dadosbancarios", ret);
        }else {
          console.log(err);
          res.render("dadosbancarios", ret);
        }
      });


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
      "id": idBco,
      "conta": req.body.conta,
      "agencia": req.body.agencia,
      "tipoConta": req.body.tpconta,
      "banco_codigo": req.body.banco,
      "usuario_cpf": req.user.cpf
    }
    const { token } = req.user;


    if(idBco){
      updateBancoUser(token, bancoJson, function(err, bancoUser){
        if(bancoUser){
          res.redirect("/");
        }else{
          console.log(err);
          res.redirect("/dadosbancarios");
        }
      });
    }else{
      createBancoUser(token, bancoJson, function(err, bancoUser){
        if(bancoUser){
          res.redirect("/");
        }else{
          console.log(err);
          res.redirect("/dadosbancarios");
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
    const {token, cpf} = req.user;
    const data = {
      "academiaId": 1,
      "cpfIndicado": req.body.cpf,
      "foneIndicado": req.body.celular,
      "nomeIndicado": req.body.nome,
      "usuarioCpf": cpf
    }

    createIndicacaoUser( token , data , function(err, indicado){
      if(indicado){
        res.redirect("/");
      } else {
        console.log(err);
        res.redirect("/indicacoes");
      }
    });

  } else {

    res.redirect("/login");
  }
});


app.listen(process.env.PORT || 3000, function() {
  console.log("The server was started on port 3000");
});
