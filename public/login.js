function esqueciSenha(myEmail, callback) {
    const jsonData = JSON.stringify({email: myEmail});         
    const options = {
        method: 'POST', 
        headers: {
            'Content-Type':"application/json",
            'Accept':"*/*",
            'Content-Length':jsonData.length
        },
        body: jsonData,
        mode: 'cors'        
    }

    fetch('https://amigofit-ws.herokuapp.com/usuarioSenha/esqueciSenha', options)
      .then( response => {           
          
          if (response.status === 201 || response.status === 400) {
              callback(null, true);

          }else {              
              callback('Ops! Houve um erro em nosso servidor, tente novamente.', null);              
          }

      }).catch(error => {
        console.log(error);
        callback('Ops! Houve um erro em nosso servidor, tente novamente.', null);
      });
}

function enviarBtn() {
  const btnSubmit = document.getElementById("btnSubmit");
  btnSubmit.click();
}


function submitFESenha(evt) {
  
  evt.preventDefault();    

  const btnEnviar = document.getElementById("btnEnviar");
  const email = evt.target[0].value;  
  const form = evt.target;
  
  btnEnviar.disabled = true;  
 
  esqueciSenha(email, function(err,sucess){
      if(sucess) {                           
         alert("Por favor verifique seu email");
         
         form.reset();

         btnEnviar.disabled = false;  
        
         $('#myModal').modal('hide');


      }else {
         btnEnviar.disabled = false;  
         alert(err);
      }
  });

}


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("formESenha");    
  const btnEnviar = document.getElementById("btnEnviar");
  form.addEventListener("submit", submitFESenha);
  btnEnviar.addEventListener("click", enviarBtn);    
});