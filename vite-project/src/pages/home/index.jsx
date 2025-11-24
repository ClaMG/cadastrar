import { useNavigate } from 'react-router-dom';
import '../../css/home.css'

function Home(){
    const navigate = useNavigate();

    async function goToGet() {
        navigate('/users');
    }

    async function goToPush() {
        navigate('/register');
    }
     async function goToLogin() {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        navigate('/login');
    }

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