const loginData = function(username, password, data) {
  const user = data[username];
  if(user){
    if(user.senha === password){
      return user
    }else {
      return false;
    }
  }

  return user;

}

const criarUserData = function(data,db) {
  db.Users = {
       ...db.Users,
       [data.email]:{
      'cpf':data.cpf,
      'nome':data.nome,
      'email':data.email,
      'celular':data.celular,
      'senha':data.senha,
      'banco':'',
      'agencia':'',
      'conta':'',
      'tpconta':''
    }}
}

const atualizaUserData = function(data,user,db) {

  if(db.Users[user.email]){
    db.Users = {
      ...db.Users,
      [user.email]: {
        ...db.Users[user.email],
        'banco':data.banco,
        'agencia':data.agencia,
        'conta':data.conta,
        'tpconta':data.tpconta
      }
    }
    user.banco = data.banco;
    user.agencia = data.agencia;
    user.conta = data.conta;
    user.tpconta = data.tpconta;
  }

}

const criarIndicadoData = function(dados, cpf, db){

  if(!db.Indicados[dados.cpf]){
    db.Indicados = {
      ...db.Indicados,
      [dados.cpf]: {
        'cpf':dados.cpf,
        'nome':dados.nome,
        'celular':dados.celular,
        'usuariocpf':cpf,
      }
    }
    return true;
  }

  return false;

}

const estatisticas = function(cpf,data){
  const dados = {indicados:0, ativos:0, inativos:0, bonus:0 };

  for (var indicado in data.Indicados) {
    if (data.Indicados[indicado].usuariocpf === cpf) {
        dados.indicados++
        data.Indicados[indicado].nome ='dauster';
    }
  }

  return dados;
}

module.exports = {loginData, estatisticas, criarUserData, atualizaUserData, criarIndicadoData};
