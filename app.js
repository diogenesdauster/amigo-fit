const express = require("express");
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/login", function(req,res, next){
  res.sendFile(__dirname+"/public/login.html");
});

app.get("/", function(req,res, next){
  res.sendFile(__dirname+"/public/index.html");
});

app.get("/cadastro", function(req,res, next){
  res.sendFile(__dirname+"/public/cadastro.html");
});

app.get("/dadosbancarios", function(req,res, next){
  res.sendFile(__dirname+"/public/dadosbancarios.html");
});

app.get("/indicacoes", function(req,res, next){
  res.sendFile(__dirname+"/public/indicacoes.html");
});



app.listen(3000,function(){
  console.log("The server was started on port 3000");
});
