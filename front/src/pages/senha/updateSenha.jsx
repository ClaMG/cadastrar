import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import '../../css/global.css'
import ImageX from "../../assets/x.svg"
import ImageEyeOpen from "../../assets/eyeopen.svg"
import ImageEyeClose from "../../assets/eyeclose.svg"
import api from '../../services/api'

function AtualizarSenha() {

  const inputUpSenha = useRef()
  const inputUpSenhaConfirm = useRef()
  const navigate = useNavigate()

    async function testApi() {
    try {
        await fetch(api.defaults.baseURL);
    } catch (error) {
        toast.error('Erro: A API não está respondendo.')
        
    }
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

  async function putSenha() {

    if (!inputUpSenha.current.value || !inputUpSenhaConfirm.current.value) {
      toast.error('Preencha todos os campos')
    }else if(inputUpSenha.current.value !== inputUpSenhaConfirm.current.value){
       toast.error('Senha não foi confirmada corretamente')
    }
    else{
        const id = localStorage.getItem('idCode');
        const userFromApiGet = await api.get(`/user/${id}`) 
      try {
        const userFromApi = await api.put('/user',{
          id: id,
          usuario: userFromApiGet.data.usuario,
          senha: inputUpSenha.current.value,
          nome: userFromApiGet.data.nome,
          idade: userFromApiGet.data.idade,
          cpf: userFromApiGet.data.cpf,
          telefone: userFromApiGet.data.telefone,
          email: userFromApiGet.data.email
        })//Envia para api

        toast.success('Atualização de sanha realizada com sucesso')

        setTimeout(() => {
           navigate('/login')
        }, 1000);
      } catch (error) {
        toast.error('Erro ao atualizar senha')
      }
    } 
    testApi()
  }

  async function goToBack() {
    navigate(`/recuperar`);
}

useEffect(()=>{
      testApi()
  }, [])//executa a função quando carrega a tela

  return (
      <>
        <div className='container'>
            <form action="" className='menor'>
              <div className='containertitle'>
                <h1>Atualizar Senha</h1>
                <button onClick={goToBack}>
                   <img src={ImageX} className='img'/>
                </button>
              </div>
                <div className='inputContainer'>
                  <label>Senha</label>
                  <div className='senhaContainer' >
                      <input placeholder='ex@1234' name="Senha" type='password'ref={inputUpSenha} id='senha'/>
                      <button type='button' onClick={eyesenha}>
                          <img src={ImageEyeClose} alt="olho da senha" className='imgeye' id='imgeye1'/>
                      </button>
                  </div>
                </div>
                <div className='inputContainer'>
                  <label>Confirmar Senha</label>
                  <div className='senhaContainer' >
                      <input placeholder='ex@1234' name="ConfirmaSenha" type='password'ref={inputUpSenhaConfirm} id='confirm'/>
                      <button type='button' onClick={eyeConfirm}>
                          <img src={ImageEyeClose} alt="olho da senha" className='imgeye' id='imgeye2'/>
                      </button>
                  </div>
                </div>
              <button type='button' onClick={putSenha}>Atualizar Senha</button>
              
            </form>
            
        </div>
        
      </>
    )

}

export default AtualizarSenha