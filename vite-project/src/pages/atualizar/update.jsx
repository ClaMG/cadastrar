import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import '../../css/global.css'
import ImageX from "../../assets/x.svg"
import api from '../../services/api'

function Atualizar() {

  const inputUpId = useRef()
  const inputUpUser = useRef()
  const inputUpSenha = useRef()
  const inputUpNome = useRef()
  const inputUpIdade = useRef()
  const inputUpCPF = useRef()
  const inputUpTelefone = useRef()
  const inputUpEmail = useRef() 
  const navigate = useNavigate()

  async function goToGet() {
    const pageUpdate = localStorage.getItem('pageUpdate');
     navigate(`/${pageUpdate}`);
  }

  async function putUsers() {
    const paragrafo = document.getElementById('mensage');
    paragrafo.style.display = "block";

    if (!inputUpId.current.value || !inputUpUser.current.value || !inputUpSenha.current.value || !inputUpNome.current.value || !inputUpIdade.current.value || !inputUpCPF.current.value || !inputUpTelefone.current.value || !inputUpEmail.current.value) {
        paragrafo.style.color = "#dc3545";
        paragrafo.textContent = 'Atualização invalida - Preencha todos os campos';
    }else{
        if(inputUpId.current.value <= 0){
            paragrafo.style.color = "#dc3545";
            paragrafo.textContent = 'Atualização invalida - Id deve ser maior que 0';
        }else{
            const userFromApi = await api.put('/user',{
              id: inputUpId.current.value,
              usuario: inputUpUser.current.value,
              senha: inputUpSenha.current.value,
              nome: inputUpNome.current.value,
              idade: inputUpIdade.current.value,
              cpf: inputUpCPF.current.value,
              telefone: inputUpTelefone.current.value,
              email: inputUpEmail.current.value
            })//Envia para api
    
           paragrafo.style.color = "#198754";
           paragrafo.textContent = 'Atualização realizada com sucesso';
        }
    }

    
  }

  
    async function completarInputs() {
        // Pega o id
        const id = localStorage.getItem('idToUpdate');
        // Coloca o id no input
        inputUpId.current.value = id;
        if(id && id != 0){
            const inputId = document.getElementById("inputId");
            inputId.disabled = true;
        }

        const userFromApi = await api.get(`/user/${id}`)
        inputUpUser.current.value = userFromApi.data.usuario;
        inputUpSenha.current.value = userFromApi.data.senha;
        inputUpNome.current.value = userFromApi.data.nome;
        inputUpIdade.current.value = userFromApi.data.idade;
        inputUpCPF.current.value = userFromApi.data.cpf;
        inputUpTelefone.current.value = userFromApi.data.telefone;
        inputUpEmail.current.value = userFromApi.data.email;
    }

  async function iniciar() {
    
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
              <input placeholder='Id' name="Id" type='text'ref={inputUpId} className='numero' id='inputId'/>
              <input placeholder='User' name="User" type='text'ref={inputUpUser}/>
              <input placeholder='Senha' name="Senha" type='password'ref={inputUpSenha}/>
              <input placeholder='Nome' name="Nome" type='text'ref={inputUpNome}/>
              </div>
              <div className='containerSon'>
              <input placeholder='Idade' name="Idade" type='text' ref={inputUpIdade} maxlength="2" className='numero'/>
              <input placeholder='CPF' name="CPF" type='text' ref={inputUpCPF} maxlength="11"className='numero'/>
              <input placeholder='Telefone' name="Telefone" type='text' ref={inputUpTelefone} maxlength="11" className='numero'/>
              <input placeholder='E-mail' name="Email" type='email' ref={inputUpEmail}/>
              </div>
              <button type='button' onClick={putUsers}>Atualizar</button>
              
            </form>

            <p id='mensage'>Resposta</p>
            
        </div>
        
      </>
    )

}

export default Atualizar