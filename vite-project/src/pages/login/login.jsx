    import { useEffect, useState, useRef } from 'react'
    import '../../css/global.css'
    import { useNavigate } from 'react-router-dom'
    import Imageback from "../../assets/back.svg"
    import api from '../../services/api'

    function Login() { 
    const inputUser = useRef()
    const inputSenha = useRef()
    const navigate = useNavigate();

    

        async function loginUser() {

            const paragrafo = document.getElementById('mensage');
            paragrafo.style.display = "block";
            
            if (!inputUser.current.value || !inputSenha.current.value) {
                paragrafo.style.color = "#dc3545";
                paragrafo.textContent = 'Login invalido - Preencha todos os campos';
            }else{
                try{
                    const userFromApi = await api.post('/login',{
                        usuario: inputUser.current.value,
                        senha: inputSenha.current.value,
                    })//Envia para api


                    if(userFromApi.data.token){
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
                    paragrafo.style.color = "#dc3545";
                    paragrafo.textContent = 'Login falhou - Usuario ou senha incorretos';
                }
            }
        }

    async function goToBack() {
        navigate(`/`);
    }




    return(
        <>
        <div className='container'>
            <form action="">
                <div className='containertitle'>
                    <h1>Login</h1>
                    <button onClick={goToBack}>
                        <img src={Imageback} className='img rodar' />
                    </button>
                </div>

                
                <input placeholder='User' name="User" type='text'ref={inputUser}/>
                <input placeholder='Senha' name="Senha" type='password'ref={inputSenha}/>
                
                <button type='button' onClick={loginUser}>Login</button>
            </form>

            <p id='mensage'>Resposta...</p>
        </div>
        
        </>
    )

    }

    export default Login