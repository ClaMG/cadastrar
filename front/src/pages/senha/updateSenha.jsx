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

         const novaSenha = inputUpSenha.current?.value;
    const confirmaSenha = inputUpSenhaConfirm.current?.value;

    if (!novaSenha || !confirmaSenha) {
        toast.error('Preencha todos os campos');
        return;
    }
    if (novaSenha !== confirmaSenha) {
        toast.error('A nova senha e a confirmação não coincidem.');
        return;
    }

    const id = localStorage.getItem('idCode');
    if (!id) {
        toast.error('ID do usuário não encontrado. Faça login novamente.');
        return;
    }

    try {
        await api.put(`/password`, {
            id: id,
            senha: novaSenha,
        });

        toast.success('Atualização de senha realizada com sucesso');

        setTimeout(() => {
            navigate('/login');
        }, 1000);
        
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erro ao atualizar senha. Verifique o servidor.';
        toast.error(errorMessage);
    }
          
          testApi()
      }

    async function iniciar() {
    const token = localStorage.getItem('token');

    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
      }

    async function goToBack() {
      navigate(`/recuperar`);
  }

  useEffect(()=>{
    iniciar()
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