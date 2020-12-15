const express = require("express");
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/login", function(req,res, next){
  res.render("login");
});

app.get("/", function(req,res, next){
  res.render("index");
});

app.get("/cadastro", function(req,res, next){
  res.render("cadastro");
});

app.get("/dadosbancarios", function(req,res, next){
  res.render("dadosbancarios");
});

app.get("/indicacoes", function(req,res, next){
  res.render("indicacoes");
});



app.listen(3000,function(){
  console.log("The server was started on port 3000");
});
