import { useEffect, useState, useRef } from 'react'
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
        const paragrafo = document.getElementById('mensage');
        try {
            await fetch(api.defaults.baseURL);
        } catch (error) {
            paragrafo.style.display = "block";
            paragrafo.style.color = "#dc3545";
            paragrafo.textContent = 'Erro: A API não está respondendo.';
            
        }
   }

    async function loginUser() {

        const paragrafo = document.getElementById('mensage');
        paragrafo.style.display = "none";
        
        if (!inputUser.current.value || !inputSenha.current.value) {
            paragrafo.style.display = "block"; 
            paragrafo.style.color = "#dc3545";
            paragrafo.textContent = 'Login invalido - Preencha todos os campos';
        }else{
            
            try{
                const userFromApi = await api.post('/login',{
                    usuario: inputUser.current.value,
                    senha: inputSenha.current.value,
                })//Envia para api


                if(userFromApi.data.token){
                    paragrafo.style.display = "block"; 
                    paragrafo.style.color = "#198754";
                    paragrafo.textContent = 'Login realizado com sucesso';

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
                paragrafo.style.display = "block";
                paragrafo.style.color = "#dc3545";
                paragrafo.textContent = 'Login falhou - Usuario ou senha incorretos';
            }
        }
        testApi()
    }

    

async function goToBack() {
    navigate(`/`);
}

useEffect(()=>{
    testApi()
  }, [])//executa a função quando carrega a tela

return(
    <>
    <div className='container'>
        <form action="" id='login'>
            <div className='containertitle'>
                <h1>Login</h1>
                <button onClick={goToBack}>
                    <img src={Imageback} className='img rodar' />
                </button>
            </div>

            
            <input placeholder='User' name="User" type='text'ref={inputUser}/>
            <div className='senhaContainer'>
            <input placeholder='Senha' name="Senha" type='password'ref={inputSenha} id='senha'/>
                <button type='button' onClick={eye}>
                    <img src={ImageEyeClose} alt="olho da senha" className='imgeye'/>
                </button>
            </div>
            
            <button type='button' onClick={loginUser}>Login</button>
        </form>

        <p id='mensage'>Carregando...</p>
    </div>
    
    </>
)

}

export default Login