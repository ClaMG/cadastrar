import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react'
import '../../css/home.css'

function Home(){
    const navigate = useNavigate();

    async function goToPush() {
        navigate('/register');
    }
     async function goToLogin() {
        navigate('/login');
    }

    async function iniciar() {
         localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('id');
        localStorage.removeItem('idCode');
    }

    useEffect(()=>{
        iniciar()
      }, [])//executa a função quando carrega a tela

    return (
        <div className='home-container'> 
            <h1>Bem-vindo!</h1>
            <p>Selecione uma opção.</p>
            <div className='home-buttons'>
                <button onClick={goToPush} className='home-btn primary'>Cadastrar</button>
                <button onClick={goToLogin} className='home-btn'>Logar</button>
            </div>
        </div>
    );
}

export default Home;