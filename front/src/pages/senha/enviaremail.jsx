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
            const toastId = toast.loading('Carregando')
            try{
                const userFromApi = await api.post('/codigo',{
                    usuario: inputUser.current.value,
                    email: inputEmail.current.value,
                })//Envia para api

                const idUser = userFromApi.data.userId;

                localStorage.setItem('idCode', idUser);
                
                if (inputEmail.current) inputEmail.current.value = '';
                if (inputUser.current) inputUser.current.value = '';
                
                
                toast.update(toastId, { 
                    render: "Codigo enviado com sucesso, confira seu email", 
                    type: "success",                           
                    isLoading: false,                          
                    autoClose: 1000                           
                });
                setTimeout(() => {
                    navigate('/codigo');
                }, 1000);
            }catch(error){
                toast.update(toastId, { 
                    render: "Usuario ou Email incorretos", 
                    type: "error",                          
                    isLoading: false,                         
                    autoClose: 5000                        
                });
                
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