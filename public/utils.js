//Verifica se CPF é válido
function ValidaCPF(strCPF) {
    let Soma;
    let Resto;
    Soma = 0;
    if (strCPF == "00000000000"){
      return false;
    }
    for (let i = 1; i<=9; i++){
	     Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
     }
    Resto = (Soma * 10) % 11;
    if ((Resto == 10) || (Resto == 11))  {
      Resto = 0;
    }
    if (Resto != parseInt(strCPF.substring(9, 10)) ){
      return false;
    }
	  Soma = 0;
    for (let i = 1; i <= 10; i++){
      Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    }
    Resto = (Soma * 10) % 11;
    if ((Resto == 10) || (Resto == 11)) {
      Resto = 0;
    }
    if (Resto != parseInt(strCPF.substring(10, 11) ) ){
      return false;
    }
    return true;
}

function ValidaCelular(strCelular) {
  const size = strCelular.replace(/\D/g, '').length;
  return size === 11 || size === 10;
}

function ValidaEmail(strEmail) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(strEmail);
}

function ValidaSenha(strSenha){
  return strSenha.length >= 6;
}

function ValidaBanco(strBanco){
  return strBanco.length >= 3;
}

function ValidaAgencia(strAgencia){
  return strAgencia.length >= 4;
}

function ValidaConta(strConta){
  return strConta.length >= 6;
}

function ValidaNome(strNome){
  return strNome.length >= 3;
}

function RemoveMak(e) {
  let strValor = ApenasNumeros(e.target.value);
  e.target.value = strValor;
}

function FormatarCPF(e) {
    let strValor = ApenasNumeros(e.value);

    if (strValor.length > 9) {
        strValor = `${strValor.substr(0, 3)}.${strValor.substr(3, 3)}.${strValor.substr(6, 3)}-${strValor.substr(9, 2)}`;
    }
    else if (strValor.length > 6) {
        strValor = `${strValor.substr(0, 3)}.${strValor.substr(3, 3)}.${strValor.substr(6, 3)}`;
    }
    else if (strValor.length > 3) {
        strValor = `${strValor.substr(0, 3)}.${strValor.substr(3, 3)}`;
    }

    e.value = strValor;

}

function FormatarCelular(e) {
    let strValor = ApenasNumeros(e.value);

    if (strValor.length === 11) {
        strValor = `(${strValor.substr(0, 2)}) ${strValor.substr(2,5)}-${strValor.substr(7,4)}`;
    }
    else if (strValor.length >= 7) {
        strValor = `(${strValor.substr(0, 2)}) ${strValor.substr(2,4)}-${strValor.substr(6,4)}`;
    }
    else if (strValor.length >= 2) {
        strValor = `(${strValor.substr(0, 2)}) ${strValor.substr(2,5)}`;
    }

    e.value = strValor;

}

function FormatarBanco(strValor) {
  return ApenasNumeros(strValor);
}
function FormatarAgencia(strValor) {
  return ApenasNumeros(strValor);
}
function FormatarConta(strValor) {
  let strTemp = strValor.replace(/[^A-Za-z0-9_-]*$/,'');
  return strTemp;
}
function ApenasNumeros(strValor) {
  let strTemp = strValor.replace(/\D/g, '');
  return strTemp;
}

function EntradaNumerica(evt) {
    const key_code = evt.keyCode  ? evt.keyCode  :
                   evt.charCode ? evt.charCode :
                   evt.which    ? evt.which    : void 0;

        // Habilita teclas <DEL>, <TAB>, <ENTER>, <ESC> e <BACKSPACE>
        if (key_code == 8  ||  key_code == 9  ||  key_code == 13  ||  key_code == 27  ||  key_code == 46) {
            return true;
        }
        // Habilita teclas <HOME>, <END>, mais as quatros setas de navegação (cima, baixo, direta, esquerda)
        else if ((key_code >= 35)  &&  (key_code <= 40)) {
            return true
        }
        // Habilita números de 0 a 9
        // 48 a 57 são os códigos para números
        else if ((key_code >= 48)  &&  (key_code <= 57)) {
            return true
        }
        return false;
}

function ValidaCadastro(event) {

  document.querySelector("input[name=cpf]").value = ApenasNumeros(document.querySelector("input[name=cpf]").value);
  document.querySelector("input[name=celular]").value = ApenasNumeros(document.querySelector("input[name=celular]").value);

  let cpf = document.querySelector("input[name=cpf]");
  let nome = document.querySelector("input[name=nome]");
  let email = document.querySelector("input[name=email]");
  let celular = document.querySelector("input[name=celular]");
  let senha = document.querySelector("input[name=senha]");

  cpf.classList.remove("is-invalid");
  nome.classList.remove("is-invalid");
  email.classList.remove("is-invalid");
  celular.classList.remove("is-invalid");
  senha.classList.remove("is-invalid");

    
  if(!ValidaCPF(cpf.value)){
      event.preventDefault();
      FormatarCelular(celular);
      cpf.focus();

      const validacao = cpf.nextElementSibling;
      validacao.innerText = "O CPF informado não é valido.";
      cpf.classList.add("is-invalid");

      return false;
  }

  if(!ValidaNome(nome.value)){
      event.preventDefault();
      FormatarCPF(cpf);
      FormatarCelular(celular);

      nome.focus();

      const validacao = nome.nextElementSibling;
      validacao.innerText = "O nome digitado é muito curto.";
      nome.classList.add("is-invalid");
     
      return false;
  }

  if(!ValidaEmail(email.value)){
      event.preventDefault();
      FormatarCPF(cpf);
      FormatarCelular(celular);

      email.focus();

      const validacao = email.nextElementSibling;
      validacao.innerText = "O email informado não é valido.";
      email.classList.add("is-invalid");

      return false;
  }

  if(!ValidaCelular(celular.value)){
      event.preventDefault();
      FormatarCPF(cpf);
      celular.focus();

      const validacao = celular.nextElementSibling;
      validacao.innerText = "O celular informado não é valido, por favor verifique se o mesmo possui 11/10 digitos contando com DDD.";
      celular.classList.add("is-invalid");

      return false;
  }

  if(!ValidaSenha(senha.value)){
      event.preventDefault();
      FormatarCPF(cpf);
      FormatarCelular(celular);
      senha.focus();

      const validacao = senha.nextElementSibling;
      validacao.innerText = "A senha informada deve conter no minimo 6 digitos.";
      senha.classList.add("is-invalid");

      return false;
  }

    return true;
}



function ValidaIndicacao(event) {


  document.querySelector("input[name=cpf]").value = ApenasNumeros(document.querySelector("input[name=cpf]").value);
  document.querySelector("input[name=celular]").value = ApenasNumeros(document.querySelector("input[name=celular]").value);

  let cpf = document.querySelector("input[name=cpf]");
  let nome = document.querySelector("input[name=nome]");
  let celular = document.querySelector("input[name=celular]");

  cpf.classList.remove("is-invalid");
  nome.classList.remove("is-invalid");
  celular.classList.remove("is-invalid");

  if(!ValidaCPF(cpf.value)){
    event.preventDefault();
    FormatarCelular(celular);
    cpf.focus();

    const validacao = cpf.nextElementSibling;
    validacao.innerText = "O CPF informado não é valido.";
    cpf.classList.add("is-invalid");

    return false;
  }

  if(!ValidaNome(nome.value)){
    event.preventDefault();
    FormatarCPF(cpf);
    FormatarCelular(celular);

    nome.focus();

    const validacao = nome.nextElementSibling;
    validacao.innerText = "O nome digitado é muito curto.";
    nome.classList.add("is-invalid");
  
    return false;
  }

  if(!ValidaCelular(celular.value)){
    event.preventDefault();
    FormatarCPF(cpf);
    celular.focus();

    const validacao = celular.nextElementSibling;
    validacao.innerText = "O celular informado não é valido, por favor verifique se o mesmo possui 11/10 digitos contando com DDD.";
    celular.classList.add("is-invalid");

    return false;
  }

    return true;
}



function ValidaDadosBancarios(event) {
  let banco = ApenasNumeros(document.querySelector("input[name=banco]").value);
  let agencia = ApenasNumeros(document.querySelector("input[name=agencia]").value);
  let conta = document.querySelector("input[name=conta]").value;
  let tpconta = document.querySelector("input[name=tpconta]").value;

  if(!ValidaBanco(banco)){
      event.preventDefault();
      alert("O Código do Banco informado não é valido ou deve contar no minimo 3 digitos.");
      return false;
  }

  if(!ValidaAgencia(agencia)){
      event.preventDefault();
      alert("O Código da Agencia informado não é valido ou deve contar no minimo 4 digitos.");
      return false;
  }

  if(!ValidaConta(FormatarConta(conta))){
      event.preventDefault();
      alert("O Código da Conta informado não é valido ou deve contar no minimo 6 digitos.");
      return false;
  }

    return true;
}
