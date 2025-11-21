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

    return (
        <div className='home-container'> 
            <h1>Bem-vindo!</h1>
            <p>Selecione uma opção.</p>
            <div className='home-buttons'>
                <button onClick={goToGet} className='home-btn'>Visualizar Usuários</button>
                <button onClick={goToPush} className='home-btn primary'>Cadastrar Novo Usuario</button>
            </div>
        </div>
    );
}

export default Home;