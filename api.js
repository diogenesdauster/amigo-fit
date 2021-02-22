const https = require('https');
const HOST = "amigofit-ws.herokuapp.com";


const loginData = function(username, password, data) {
  const user = data[username];
  if (user) {
    if (user.senha === password) {
      return user
    } else {
      return false;
    }
  }

  return user;

}

const criarUserData = function(data, db) {
  db.Users = {
    ...db.Users,
    [data.email]: {
      'cpf': data.cpf,
      'nome': data.nome,
      'email': data.email,
      'celular': data.celular,
      'senha': data.senha,
      'banco': '',
      'agencia': '',
      'conta': '',
      'tpconta': ''
    }
  }
}

const atualizaUserData = function(data, user, db) {

  if (db.Users[user.email]) {
    db.Users = {
      ...db.Users,
      [user.email]: {
        ...db.Users[user.email],
        'banco': data.banco,
        'agencia': data.agencia,
        'conta': data.conta,
        'tpconta': data.tpconta
      }
    }
    user.banco = data.banco;
    user.agencia = data.agencia;
    user.conta = data.conta;
    user.tpconta = data.tpconta;
  }

}

const criarIndicadoData = function(dados, cpf, db) {

  if (!db.Indicados[dados.cpf]) {
    db.Indicados = {
      ...db.Indicados,
      [dados.cpf]: {
        'cpf': dados.cpf,
        'nome': dados.nome,
        'celular': dados.celular,
        'usuariocpf': cpf,
      }
    }
    return true;
  }

  return false;

}

const estatisticas = function(cpf, data) {
  const dados = {
    indicados: 0,
    ativos: 0,
    inativos: 0,
    bonus: 0
  };

  for (var indicado in data.Indicados) {
    if (data.Indicados[indicado].usuariocpf === cpf) {
      dados.indicados++
      data.Indicados[indicado].nome = 'dauster';
    }
  }

  return dados;
}


const createUser = function(data, callback) {
  const jsonData = JSON.stringify(data);
  const options = {
    host: HOST,
    port: 443,
    path: '/usuario/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': jsonData.length
    }
  };

  const req = https.request(options, (res) => {

    res.on('data', (d) => {
      console.log(d)
      const userJson = JSON.parse(d);
      callback(null, userJson)
    });

  });

  req.on('error', (e) => {
    console.error(e);
    callback(e, null);

  });

  req.write(jsonData);
  req.end();

}

const authUser = function(data, callback) {
  const jsonData = JSON.stringify(data);
  const options = {
    host: HOST,
    port: 443,
    path: '/auth/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': jsonData.length
    }
  };

  const req = https.request(options, (res) => {

    res.on('data', (d) => {

      if( res.statusCode === 200 ){
        const authJson = JSON.parse(d);
        callback(null, authJson);
      }else{
        callback("Login ou senha Inválidos!", null);
      }
    });

  });

  req.on('error', (e) => {
    console.error(e);
    callback(e, null);
  });

  req.write(jsonData);
  req.end();
}

const loginUser = function(login = "", password = "", callback) {

  const loginJson = {
    "email": login,
    "senha": password
  }

  authUser(loginJson, (err, auth) => {

    if (auth) {
      const options = {
        host: HOST,
        port: 443,
        path: '/usuario/' + auth.idUsuario,
        headers: {
          Authorization: 'Bearer ' + auth.token
        }
      };


      const req = https.get(options, (res) => {
        res.on('data', (d) => {
          if(res.statusCode === 200){
            const user = JSON.parse(d);
            const userJson = {
              token: auth.token,
              ...user
            }
            callback(null, userJson);
          } else {
            callback("Login ou Senha Inválidos!", null);
          }
        });
      });

      req.on('error', (e) => {
        console.error("erro :" + e);
        callback(e, null);
      });

      req.end();

    }else {
      callback(err, null);
    }

  });
}


const getBancoUser = function(token, cpf, callback) {
  const options = {
    host: HOST,
    port: 443,
    path: '/usuarioBanco/' + cpf,
    headers: {
      Authorization: 'Bearer ' + token
    }
  }

  const req = https.get(options, (res) => {
    res.on('data', (d) => {
      const bancoUserJson = JSON.parse(d);
      callback(null, bancoUserJson);
    });
  });

  req.on('error', (e) => {
    console.error(e);
    callback(e, null);
  });

  req.end();

}

const createBancoUser = function(token, data, callback) {
  const jsonData = JSON.stringify(data);
  const options = {
    host: HOST,
    port: 443,
    method: 'POST',
    path: '/usuarioBanco/',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }

  const req = https.request(options, (res) => {
    res.on('data', (d) => {

      const bancoUserJson = JSON.parse(d);
      callback(null, bancoUserJson);
    });
  });

  req.on('error', (e) => {
    console.error(e);
    callback(e, null);
  });

  req.write(jsonData);
  req.end();

}

const updateBancoUser = function(token, data, callback) {
  const jsonData = JSON.stringify(data);
  const options = {
    host: HOST,
    port: 443,
    method: 'PATCH',
    path: '/usuarioBanco/',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  }

  const req = https.request(options, (res) => {
    res.on('data', (d) => {
      const bancoUserJson = JSON.parse(d);
      callback(null, bancoUserJson);
    });
  });

  req.on('error', (e) => {
    console.error(e);
    callback(e, null);
  });
  req.write(jsonData);
  req.end();

}

const getBancos = function(token, callback){
  const options = {
    host: HOST,
    port: 443,
    method: 'GET',
    path: '/banco/',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }
  const req = https.request(options, (res) => {

    let result = '';
    res.on("data", (data) =>{
        result += data;
    });
    res.on('end', () => {
      const bancos = JSON.parse(result);
      if (res.statusCode === 200){
        callback(null, bancos);
      } else {
        callback(bancos.erros, null);
      }
    });


  });

  req.on('error', (e) => {
    console.log(e);
    callback(e, null);
  });

  req.end();

}

const createIndicacaoUser = function(token, data, callback) {
  const jsonData = JSON.stringify(data);
  const options = {
    host: HOST,
    port: 443,
    method: 'POST',
    path: '/indicacao/',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  }

  const req = https.request(options, (res) => {
    res.on('data', (d) => {
      if (res.statusCode === 201){
        callback(null, true);
      }else{
        const { erros } = JSON.parse(d);
        callback(erros[0], null);
      }
    });
  });

  req.on('error', (e) => {
    console.error(e);
    callback(e, null);
  });

  req.write(jsonData);
  req.end();

}

const getIndicacaoBonusUser = function(token, cpf,callback){
  const options = {
    host: HOST,
    port: 443,
    method: 'GET',
    path: '/indicacaoBonus/' + cpf,
    headers: {
      Authorization: 'Bearer ' + token
    }
  }
  const req = https.request(options, (res) => {

    res.on("data", (d) =>{
      const bonus = JSON.parse(d);
      if (res.statusCode === 200){
        callback(null, bonus);
      } else {
        callback(bonus.erros, null);
      }
    });
  });

  req.on('error', (e) => {
    console.log(e);
    callback(e, null);
  });

  req.end();

}

module.exports = {
  loginData,
  estatisticas,
  criarUserData,
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
};
