import { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import '../../css/global.css'
import { useNavigate } from 'react-router-dom'
import Imageback from "../../assets/back.svg"
import api from '../../services/api'

function EnviarEmail() { 
    const inputUser = useRef()
    const inputEmail = useRef()
    const navigate = useNavigate();

    async function testApi() {
        try {
            await fetch(api.defaults.baseURL);
        } catch (error) {
            toast.error('Erro: A API não está respondendo.')
            
        }
   }

    async function enviarcodigo() {
        if (!inputUser.current.value || !inputEmail.current.value) {
            toast.error('Preencha todos os campos')
        }else{
            
            try{
                const userFromApi = await api.post('/codigo',{
                    usuario: inputUser.current.value,
                    email: inputEmail.current.value,
                })//Envia para api

                localStorage.setItem('idCode', userFromApi.data.id);
                toast.success('Codigo enviado com sucesso, confira seu email')

                if (inputEmail.current) inputEmail.current.value = '';
                if (inputUser.current) inputUser.current.value = '';

                setTimeout(() => {
                    navigate('/codigo');
                }, 1000);
            }catch(error){
                toast.error('Usuario ou Email incorretos')
            }
        }
        testApi()
    }

    

async function goToBack() {
    navigate(`/login`);
}



useEffect(()=>{
    testApi()
  }, [])//executa a função quando carrega a tela

return(
    <>
    <div className='container'>
        <form action="" className='menor'>
            <div className='containertitle'>
                <h1>Recuperar Senha</h1>
                <button onClick={goToBack}>
                    <img src={Imageback} className='img rodar' />
                </button>
            </div>

            
            <input placeholder='User' name="User" type='text'ref={inputUser}/>
            <input placeholder='Email' name="Email" type='text' ref={inputEmail}/>
            
            <button type='button' onClick={enviarcodigo}>Enviar Codigo</button>
        </form>
    </div>
    
    </>
)

}

export default EnviarEmail