import { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import '../../css/global.css'
import { useNavigate } from 'react-router-dom'
import Imageback from "../../assets/back.svg"
import api from '../../services/api'

function InserirCodigo() { 
    const inputCodigo = useRef()
    const navigate = useNavigate();

    async function testApi() {
        try {
            await fetch(api.defaults.baseURL);
        } catch (error) {
            toast.error('Erro: A API não está respondendo.')
            
        }
   }

    async function recebercodigo() {
        if (!inputCodigo.current.value) {
            toast.error('Preencha o campos')
        }else{
            const userid = localStorage.getItem('idCode');
            if(!userid){
                toast.error('Erro no sistema: não conseguimos indentificar seu usuario')
            }

            try{
                const userFromApi = await api.post('/codigoconfirma',{
                        userid: userid,
                        codeconfirm: inputCodigo.current.value,
                    })//Envia para api
                toast.success('Codigo enviado com sucesso')

                setTimeout(() => {
                    navigate('/updateSenha');
                }, 1000);
            }catch(error){
                toast.error('Codigo expirado ou incorreto ')
            }
        }
        testApi()
    }

    

async function goToBack() {
    navigate(`/recuperar`);
}

async function iniciar() {
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
    testApi()
    iniciar()
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

            
            <input placeholder='Codigo' name="Codigo" type='text' ref={inputCodigo} maxlength="6"/>
            
            <button type='button' onClick={recebercodigo}>Confirmar Codigo</button>
        </form>
    </div>
    
    </>
)

}

export default InserirCodigo