import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import '../../css/global.css'
import ImageX from "../../assets/x.svg"
import ImageEyeOpen from "../../assets/eyeopen.svg"
import ImageEyeClose from "../../assets/eyeclose.svg"
import api from '../../services/api'

function Atualizar() {

  const inputUpUser = useRef()
  const inputUpSenha = useRef()
  const inputUpNome = useRef()
  const inputUpIdade = useRef()
  const inputUpCPF = useRef()
  const inputUpTelefone = useRef()
  const inputUpEmail = useRef() 
  const navigate = useNavigate()


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
  };

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

   async function eye() {
        const senhaInput = document.getElementById('senha');
        const eyeImg = document.querySelector('.imgeye');

        if (senhaInput.type === 'password') {
            senhaInput.type = 'text';
            eyeImg.src = ImageEyeOpen; 
        } else {
            senhaInput.type = 'password';
            eyeImg.src = ImageEyeClose; 
        }
    }

    async function testApi() {
    try {
        await fetch(api.defaults.baseURL);
    } catch (error) {
        toast.error('Erro: A API não está respondendo.')
        
    }
   }


  async function putUsers() {

    const email = inputUpEmail.current.value;
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const verificarEmail = regex.test(email);

    if (!inputUpUser.current.value || !inputUpSenha.current.value || !inputUpNome.current.value || !inputUpIdade.current.value || !inputUpCPF.current.value || !inputUpTelefone.current.value || !inputUpEmail.current.value) {
      toast.error('Preencha todos os campos')
    }else if(!verificarEmail){
       toast.error('E-mail inválido, adicione @ e .com')
    }
    else{
      try {
        const userFromApi = await api.put('/user',{
          usuario: inputUpUser.current.value,
          senha: inputUpSenha.current.value,
          nome: inputUpNome.current.value,
          idade: inputUpIdade.current.value,
          cpf: inputUpCPF.current.value,
          telefone: inputUpTelefone.current.value,
          email: inputUpEmail.current.value
        })//Envia para api

        toast.success('Atualização realizada com sucesso')

        setTimeout(() => {
           goToGet();
        }, 1000);
      } catch (error) {
        toast.error('Erro ao atualizar usuário')
      }
    } 
    testApi()
  }

  async function goToGet() {
    const pageUpdate = localStorage.getItem('pageUpdate');
     navigate(`/${pageUpdate}`);
  }
  
    async function completarInputs() {
        // Pega o id
        const id = localStorage.getItem('idToUpdate');

        const userFromApi = await api.get(`/user/${id}`)
        inputUpUser.current.value = userFromApi.data.usuario;
        //inputUpSenha.current.value = userFromApi.data.senha;
        inputUpNome.current.value = userFromApi.data.nome;
        inputUpIdade.current.value = userFromApi.data.idade;
        inputUpCPF.current.value = userFromApi.data.cpf;
        inputUpTelefone.current.value = userFromApi.data.telefone;
        inputUpEmail.current.value = userFromApi.data.email;
    }


  async function iniciar() {
    if(localStorage.getItem('token') == null){
          navigate('/login');
        }
    
    const inputs = document.getElementsByClassName('numero');

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
    completarInputs()
  }, [])//executa a função quando carrega a tela

  return (
      <>
        <div className='container'>
            <form action="" >
              <div className='containertitle'>
                <h1>Atualizar</h1>
                <button onClick={goToGet}>
                   <img src={ImageX} className='img'/>
                </button>
              </div>
              
              <div className='containerSon'>
                <div className='inputContainer'>
                  <label>User</label>
                  <input placeholder='U_ser' name="User" type='text'ref={inputUpUser}/>
                </div>
                <div className='inputContainer'>
                  <label>Senha</label>
                  <div className='senhaContainer'>
                    <input placeholder='ex@1234' name="Senha" type='password'ref={inputUpSenha} id='senha'/>
                    <button type='button' onClick={eye}>
                        <img src={ImageEyeClose} alt="olho da senha" className='imgeye'/>
                    </button>
                  </div>
                </div>
                <div className='inputContainer'>
                  <label>Nome</label>
                  <input placeholder='Erick' name="Nome" type='text'ref={inputUpNome}/>
                </div>
              </div>
              <div className='containerSon'>
                <div className='inputContainer'>
                  <label>Idade</label>
                  <input placeholder='18' name="Idade" type='text' ref={inputUpIdade} maxlength="2" className='numero'/>
                </div>
                <div className='inputContainer'>
                  <label>CPF</label>
                  <input placeholder='123.456.789-09' name="CPF" type='text' ref={inputUpCPF} maxLength="14" className='numero' onInput={maskCPF}/>
                </div>
                <div className='inputContainer'>
                  <label>Telefone</label>
                  <input placeholder='(85) 91234-5678' name="Telefone" ref={inputUpTelefone} maxlength="15" className='numero' onInput={maskTelefone}/>
                </div>
              </div>
                <div className='inputContainer'>
                  <label>E-mail</label>
                  <input placeholder='nome@exemplo.com' name="Email" type='email' ref={inputUpEmail}/>
                </div>
              <button type='button' onClick={putUsers}>Atualizar</button>
              
            </form>
            
        </div>
        
      </>
    )

}

export default Atualizar