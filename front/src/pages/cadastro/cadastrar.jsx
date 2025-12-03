import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Imageback from "../../assets/back.svg"
import ImageEyeOpen from "../../assets/eyeopen.svg"
import ImageEyeClose from "../../assets/eyeclose.svg"
import '../../css/global.css'
import api from '../../services/api'


function Cadastrar() {

  const inputUser = useRef()
  const inputSenha = useRef()
  const inputSenhaConfirm = useRef()
  const inputNome = useRef()
  const inputIdade = useRef()
  const inputCPF = useRef()
  const inputTelefone = useRef()
  const inputEmail = useRef() 
  const navigate = useNavigate();

  

  const maskCPF = (event) => {
    const input = event.target;
    //Remove caractere que não seja dígito
    let value = input.value.replace(/\D/g, '');

    //Aplica a máscara
    value = value.replace(/(\d{3})(\d)/, '$1.$2'); //primeiro ponto
    value = value.replace(/(\d{3})(\d)/, '$1.$2'); //segundo ponto
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // hífen

    //Define o novo valor
    input.value = value;
  }

  const maskTelefone = (event) => {
    const input = event.target;
    //Remove caractere que não seja dígito
    let value = input.value.replace(/\D/g, ''); 

    // Aplica a máscara 
    value = value.replace(/^(\d{2})/, '($1) '); 
    value = value.replace(/(\d)(\d{4})$/, '$1-$2'); 

    //Define o novo valor
    input.value = value;
   }

   async function eyesenha() {
        const senhaInput = document.getElementById('senha');
        const eyeImgSenha = document.querySelector('#imgeye1');

        if (senhaInput.type === 'password') {
            senhaInput.type = 'text';
            eyeImgSenha.src = ImageEyeOpen; 
        } else {
            senhaInput.type = 'password';
            eyeImgSenha.src = ImageEyeClose; 
        }

    }
   async function eyeConfirm() {
        const senhaInput = document.getElementById('confirm');
        const eyeImgSenha = document.querySelector('#imgeye2');

        if (senhaInput.type === 'password') {
            senhaInput.type = 'text';
            eyeImgSenha.src = ImageEyeOpen; 
        } else {
            senhaInput.type = 'password';
            eyeImgSenha.src = ImageEyeClose; 
        }

    }
    

   async function testApi() {
    try {
        await fetch(api.defaults.baseURL);
    } catch (error) {
      toast.error('Erro: A API não está respondendo.')
        
    }
   }

  
  async function postUsers() {

    try {
      
      const email = inputEmail.current.value;
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const verificarEmail = regex.test(email);
  
      const idade = parseInt(inputIdade.current.value);

  
    if (!inputUser.current.value || !inputSenha.current.value || !inputSenhaConfirm.current.value || !inputNome.current.value || !inputIdade.current.value || !inputCPF.current.value || !inputTelefone.current.value || !inputEmail.current.value) {
       toast.error('Preencha todos os campos')
    }else if(!verificarEmail){
      toast.error('E-mail inválido, adicione @ e .com')
    }else if(inputSenha.current.value !== inputSenhaConfirm.current.value){
       toast.error('Senha não foi confirmada corretamente')
    }else if (isNaN(idade) || idade < 1 || idade > 120) {
    toast.error('Idade inválida. A idade deve ser um número entre 1 e 120.');
    }

    else{

        const cpfLimpo = inputCPF.current.value.replace(/\D/g, ''); 
        const telefoneLimpo = inputTelefone.current.value.replace(/\D/g, '');

        const userFromApi = await api.post('/user',{
            usuario: inputUser.current.value,
            senha: inputSenha.current.value,
            nome: inputNome.current.value,
            idade: inputIdade.current.value,
            cpf: cpfLimpo,
            telefone: telefoneLimpo,
            email: inputEmail.current.value
        })//Envia para api
  
        toast.success('Cadastro realizado com sucesso')

  
        if (inputUser.current) inputUser.current.value = '';
        if (inputSenha.current) inputSenha.current.value = '';
        if (inputSenhaConfirm.current) inputSenhaConfirm.current.value = '';
        if (inputNome.current) inputNome.current.value = '';
        if (inputIdade.current) inputIdade.current.value = '';
        if (inputCPF.current) inputCPF.current.value = '';
        if (inputTelefone.current) inputTelefone.current.value = '';
        if (inputEmail.current) inputEmail.current.value = '';
    }
    } catch (error) {
      if (error.response && error.response.status === 401 && error.response.data.message) {
                toast.error(error.response.data.message); 
            } else {
                toast.error('Erro ao cadastrar.');
            }
    }

    testApi() 
}



async function goToBack() {
    navigate(`/`);
  }

 async function iniciar() {
  const inputs = document.getElementsByClassName('numero'); 
  
//Para não permitir letras nos inputs de números
  for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i]; 
        input.addEventListener('keydown', function(event) {
            if (
                event.key === 'Backspace' ||
                event.key === 'Delete' ||
                event.key === 'Tab' ||
                event.key.includes('Arrow')
            ) {
                return; 
            }
            
            const regex = /[a-zA-Z]/;
            if (regex.test(event.key)) {
                event.preventDefault();
            }
        });
    }
    testApi()
}

  useEffect(()=>{
    iniciar()
  }, [])//executa a função quando carrega a tela


  return (
      <>
        <div className='container'>
  
            <form action="">
              <div className='containertitle'>
                <h1>Cadastrar</h1>
                <button onClick={goToBack}>
                   <img src={Imageback} className='img rodar' />
                </button>
              </div>
              
              <div className='containerSon'>
                <div className='inputContainer'>
                  <label>User</label>
                  <input placeholder='U_ser' name="User" type='text'ref={inputUser}/>
                </div>
                <div className='inputContainer'>
                  <label>Senha</label>
                  <div className='senhaContainer' >
                      <input placeholder='ex@1234' name="Senha" type='password'ref={inputSenha} id='senha'/>
                      <button type='button' onClick={eyesenha}>
                          <img src={ImageEyeClose} alt="olho da senha" className='imgeye' id='imgeye1'/>
                      </button>
                  </div>
                </div>
                <div className='inputContainer'>
                  <label>Confirmar Senha</label>
                  <div className='senhaContainer' >
                      <input placeholder='ex@1234' name="ConfirmaSenha" type='password'ref={inputSenhaConfirm} id='confirm'/>
                      <button type='button' onClick={eyeConfirm}>
                          <img src={ImageEyeClose} alt="olho da senha" className='imgeye' id='imgeye2'/>
                      </button>
                  </div>
                </div>
              </div>
                <div className='inputContainer'>
                  <label>Nome</label>
                  <input placeholder='Erick' name="Nome" type='text'ref={inputNome}/>
                </div>
              <div className='containerSon'>
                <div className='inputContainer'>
                  <label>Idade</label>
                  <input placeholder='18' name="Idade" type='text' ref={inputIdade} maxlength="2" className='numero'/>
                </div>
                <div className='inputContainer'>
                  <label>CPF</label>
                  <input placeholder='123.456.789-09' name="CPF" type='text' ref={inputCPF} maxLength="14" className='numero' onInput={maskCPF}/>
                </div>
                <div className='inputContainer'>
                  <label>Telefone</label>
                  <input placeholder='(85) 91234-5678' name="Telefone" ref={inputTelefone} maxlength="15" className='numero' onInput={maskTelefone}/>
                </div>
              </div>
                <div className='inputContainer'>
                  <label>E-mail</label>
                  <input placeholder='nome@exemplo.com' name="Email" type='email' ref={inputEmail}/>
                </div>
              <button type='button' onClick={postUsers}>Cadastrar</button>
              
            </form>

  
            
        </div>
        
      </>
    )
}


export default Cadastrar