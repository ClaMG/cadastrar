import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Imageback from "../../assets/back.svg"
import '../../css/global.css'
import api from '../../services/api'


function Cadastrar() {

  const inputUser = useRef()
  const inputSenha = useRef()
  const inputNome = useRef()
  const inputIdade = useRef()
  const inputCPF = useRef()
  const inputTelefone = useRef()
  const inputEmail = useRef() 
  const navigate = useNavigate();
  
  
  async function postUsers() {
      const paragrafo = document.getElementById('mensage');
      paragrafo.style.display = "block";

    if (!inputUser.current.value || !inputSenha.current.value || !inputNome.current.value || !inputIdade.current.value || !inputCPF.current.value || !inputTelefone.current.value || !inputEmail.current.value) {
        paragrafo.style.color = "#dc3545";
        paragrafo.textContent = 'Cadastro invalido - Preencha todos os campos';
    }else{
        const userFromApi = await api.post('/user',{
            usuario: inputUser.current.value,
            senha: inputSenha.current.value,
            nome: inputNome.current.value,
            idade: inputIdade.current.value,
            cpf: inputCPF.current.value,
            telefone: inputTelefone.current.value,
            email: inputEmail.current.value
        })//Envia para api
        
        paragrafo.style.color = "#198754";
        paragrafo.textContent = 'Cadastro realizado com sucesso';
        if (inputUser.current) inputUser.current.value = '';
        if (inputSenha.current) inputSenha.current.value = '';
        if (inputNome.current) inputNome.current.value = '';
        if (inputIdade.current) inputIdade.current.value = '';
        if (inputCPF.current) inputCPF.current.value = '';
        if (inputTelefone.current) inputTelefone.current.value = '';
        if (inputEmail.current) inputEmail.current.value = '';
    } 
}

async function goToBack() {
    navigate(`/`);
  }

 async function iniciar() {
  document.getElementById("mensage").style.display = "none";
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
              <input placeholder='User' name="User" type='text'ref={inputUser}/>
              <input placeholder='Senha' name="Senha" type='password'ref={inputSenha}/>
              <input placeholder='Nome' name="Nome" type='text'ref={inputNome}/>
              <input placeholder='Idade' name="Idade" type='text' ref={inputIdade} maxlength="2" className='numero'/>
              </div>
              <div className='containerSon'>
              <input placeholder='CPF' name="CPF" type='text' ref={inputCPF} maxlength="11" className='numero'/>
              <input placeholder='Telefone' name="Telefone" ref={inputTelefone} maxlength="11" className='numero'/>
              <input placeholder='E-mail' name="Email" type='email' ref={inputEmail}/>
              </div>
              <button type='button' onClick={postUsers}>Cadastrar</button>
              
            </form>

            <p id='mensage'>Resposta</p>
  
            
        </div>
        
      </>
    )
}


export default Cadastrar