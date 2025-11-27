import { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import '../../css/global.css'
import { useNavigate } from 'react-router-dom'
import Imageback from "../../assets/back.svg"
import ImageEyeOpen from "../../assets/eyeopen.svg"
import ImageEyeClose from "../../assets/eyeclose.svg"
import api from '../../services/api'

function Login() { 
    const inputUser = useRef()
    const inputSenha = useRef()
    const navigate = useNavigate();

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

    async function loginUser() {
        if (!inputUser.current.value || !inputSenha.current.value) {
            toast.error('Preencha todos os campos')
        }else{
            
            try{
                const userFromApi = await api.post('/login',{
                    usuario: inputUser.current.value,
                    senha: inputSenha.current.value,
                })//Envia para api


                if(userFromApi.data.token){
                    toast.success('Login realizado com sucesso')

                    localStorage.setItem('token', userFromApi.data.token);//Salva o token no local storage

                    if(inputUser.current.value === 'admin'){
                        localStorage.setItem('isAdmin', 'true');
                        setTimeout(() => {
                            navigate('/usersAdm');
                        }, 1000);
                    }else{
                        localStorage.setItem('isAdmin', 'false');
                        localStorage.setItem('id', userFromApi.data.payload.id);   
                        setTimeout(() => {
                            navigate('/users');
                        }, 1000);
                    }

                    
                }


            }catch(error){
                toast.error('Usuario ou senha incorretos')
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
            <input placeholder='Senha' name="Senha" type='password'ref={inputSenha} id='senha'/>
            
            <button type='button' onClick={loginUser}>Enviar Codigo</button>
        </form>
    </div>
    
    </>
)

}

export default Login