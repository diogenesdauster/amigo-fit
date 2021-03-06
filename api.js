const https = require("https");
const HOST = "amigofit-ws.herokuapp.com";

const createUser = function (data, callback) {
  const jsonData = JSON.stringify(data);
  const options = {
    host: HOST,
    port: 443,
    path: "/usuario/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": jsonData.length,
    },
  };

  const req = https.request(options, (res) => {
    res.on("data", (d) => {
      const userJson = JSON.parse(d);
      callback(null, userJson);
    });
  });

  req.on("error", (e) => {
    console.error(e);
    callback(e, null);
  });

  req.write(jsonData);
  req.end();
};

const UpdateUser = function (token, data, callback) {
  const jsonData = JSON.stringify(data);
  const options = {
    host: HOST,
    port: 443,
    path: "/usuario/",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      "Content-Length": jsonData.length,
    },
  };

  const req = https.request(options, (res) => {
    res.on("data", (d) => {
      const userJson = JSON.parse(d);
      if (res.statusCode === 200) {
        callback(null, userJson);
      } else {
        console.log(userJson);
        callback(userJson.error, null);
      }
    });
  });

  req.on("error", (e) => {
    console.error(e);
    callback(e, null);
  });

  req.write(jsonData);
  req.end();
};

const authUser = function (data, callback) {
  const jsonData = JSON.stringify(data);
  const options = {
    host: HOST,
    port: 443,
    path: "/auth/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": jsonData.length,
    },
  };

  const req = https.request(options, (res) => {
    res.on("data", (d) => {
      if (res.statusCode === 200) {
        const authJson = JSON.parse(d);
        callback(null, authJson);
      } else {
        callback("Login ou senha Inválidos!", null);
      }
    });
  });

  req.on("error", (e) => {
    console.error(e);
    callback(e, null);
  });

  req.write(jsonData);
  req.end();
};

const loginUser = function (login = "", password = "", callback) {
  const loginJson = {
    email: login,
    senha: password,
  };

  authUser(loginJson, (err, auth) => {
    if (auth) {
      const options = {
        host: HOST,
        port: 443,
        path: "/usuario/" + auth.idUsuario,
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      };

      const req = https.get(options, (res) => {
        res.on("data", (d) => {
          if (res.statusCode === 200) {
            const user = JSON.parse(d);
            const userJson = {
              token: auth.token,
              ...user,
            };
            callback(null, userJson);
          } else {
            callback("Login ou Senha Inválidos!", null);
          }
        });
      });

      req.on("error", (e) => {
        console.error("erro :" + e);
        callback(e, null);
      });

      req.end();
    } else {
      callback(err, null);
    }
  });
};

const getBancoUser = function (token, cpf, callback) {
  const options = {
    host: HOST,
    port: 443,
    path: "/usuarioBanco/" + cpf,
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const req = https.get(options, (res) => {
    res.on("data", (d) => {
      const bancoUserJson = JSON.parse(d);
      callback(null, bancoUserJson);
    });
  });

  req.on("error", (e) => {
    console.error(e);
    callback(e, null);
  });

  req.end();
};

const createBancoUser = function (token, data, callback) {
  const jsonData = JSON.stringify(data);
  const options = {
    host: HOST,
    port: 443,
    method: "POST",
    path: "/usuarioBanco/",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  const req = https.request(options, (res) => {
    res.on("data", (d) => {
      const bancoUserJson = JSON.parse(d);
      callback(null, bancoUserJson);
    });
  });

  req.on("error", (e) => {
    console.error(e);
    callback(e, null);
  });

  req.write(jsonData);
  req.end();
};

const updateBancoUser = function (token, data, callback) {
  const jsonData = JSON.stringify(data);
  const options = {
    host: HOST,
    port: 443,
    method: "PATCH",
    path: "/usuarioBanco/",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  const req = https.request(options, (res) => {
    res.on("data", (d) => {
      const bancoUserJson = JSON.parse(d);
      callback(null, bancoUserJson);
    });
  });

  req.on("error", (e) => {
    console.error(e);
    callback(e, null);
  });
  req.write(jsonData);
  req.end();
};

const getBancos = function (token, callback) {
  const options = {
    host: HOST,
    port: 443,
    method: "GET",
    path: "/banco/",
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  const req = https.request(options, (res) => {
    let result = "";
    res.on("data", (data) => {
      result += data;
    });
    res.on("end", () => {
      const bancos = JSON.parse(result);
      if (res.statusCode === 200) {
        callback(null, bancos);
      } else {
        callback(bancos.erros, null);
      }
    });
  });

  req.on("error", (e) => {
    console.log(e);
    callback(e, null);
  });

  req.end();
};

const createIndicacaoUser = function (token, data, callback) {
  const jsonData = JSON.stringify(data);
  const options = {
    host: HOST,
    port: 443,
    method: "POST",
    path: "/indicacao/",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  const req = https.request(options, (res) => {
    let result = "";
    res.on("data", (data) => {
      result += data;
    });

    res.on("end", () => {
      if (res.statusCode === 201) {
        callback(null, true);
      } else {
        const { erros } = JSON.parse(result);
        console.log(JSON.parse(result));
        callback(erros, null);
      }
    });
  });

  req.on("error", (e) => {
    console.error(e);
    callback(e, null);
  });

  req.write(jsonData);
  req.end();
};

const getIndicacaoBonusUser = function (token, cpf, callback) {
  const options = {
    host: HOST,
    port: 443,
    method: "GET",
    path: "/indicacaoBonus/" + cpf,
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  const req = https.request(options, (res) => {
    let result = "";
    res.on("data", (data) => {
      result += data;
    });

    res.on("end", () => {
      const bonus = JSON.parse(result);
      if (res.statusCode === 200) {
        callback(null, bonus);
      } else {
        callback(bonus.erros, null);
      }
    });
  });

  req.on("error", (e) => {
    console.log(e);
    callback(e, null);
  });

  req.end();
};

const esqueciSenhaUser = function (data, callback) {
  const jsonData = JSON.stringify(data);
  const options = {
    host: HOST,
    port: 443,
    method: "PATCH",
    path: "/usuarioSenha/alterarSenha",
  };

  const req = https.request(options, (res) => {
    res.on("data", (d) => {
      if (res.statusCode == 204) {
        callback(null, true);
      } else {
        const response = JSON.parse(d);
        callback(response.error, null);
      }
    });
  });

  req.on("error", (e) => {
    console.error(e);
    callback(e, null);
  });

  req.write(jsonData);
  req.end();
};

const getConfigVideo = function (callback) {
  const options = {
    host: HOST,
    port: 443,
    method: "GET",
    path: "/configuracao",
    headers: {
      Accept: "*/*",
    },
  };

  const req = https.request(options, (res) => {
    res.on("data", (d) => {
      const response = JSON.parse(d);
      if (res.statusCode == 200) {
        const objVideo = response.filter(
          (element) => element.chave == "PROPAGANDA_ABERTURA"
        );
        if (objVideo.length) {
          callback(null, objVideo[0].valor);
        } else {
          callback(null, "MrY3je1gMMo");
        }
      } else {
        callback(response.error, null);
      }
    });
  });

  req.on("error", (e) => {
    console.log(e);
    callback(e, null);
  });

  req.end();
};

module.exports = {
  UpdateUser,
  createUser,
  loginUser,
  getBancoUser,
  createBancoUser,
  updateBancoUser,
  getBancos,
  createIndicacaoUser,
  getIndicacaoBonusUser,
  esqueciSenhaUser,
  getConfigVideo,
};
