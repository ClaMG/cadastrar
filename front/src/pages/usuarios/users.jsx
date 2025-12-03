import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import '../../css/global.css'
import '../../css/user.css'
import Imageback from "../../assets/out.svg"
import Imageupdate from "../../assets/edit.svg"
import Imagedelet from "../../assets/delete.svg"
import api from '../../services/api'


function Home(){
    const [filteredUsers, setFilteredUsers] = useState([])//para filtrar
    const navigate = useNavigate();

    async function testApi() {
    try {
        await fetch(api.defaults.baseURL);
    } catch (error) {
        toast.error('Erro: A API não está respondendo.')
        
    }
   }

  async function getIdUser(id) {
            
            try {
                const userFromApi = await api.get(`/user/${id}`) 
                setFilteredUsers([userFromApi.data]) 
            } catch (error) {
                toast.error('Erro ao buscar usuário')
        }
        testApi()
    }
    
    
    async function deletUsers(id) {
        
        await api.delete(`/user/${id}`)
        
        toast.success('Usuario deletado com sucesso')
        setTimeout(() => {
            navigate('/login');
        }, 1000);
        testApi()
        
    }
    
    async function goToUpdate(id) {
        localStorage.setItem('idToUpdate', id);
        navigate(`/atualizar/`);
    }
    
    async function goToBack() {
        navigate(`/`);
    }
    
    async function iniciar() {
        
        if(localStorage.getItem('token') == null){
            navigate('/login');
          }
  
          localStorage.setItem('pageUpdate', 'users');
  
          const id = localStorage.getItem('id');
          getIdUser(id)
  
      //Para não permitir letras nos inputs de números
      const inputs = document.getElementsByClassName('numero');
      inputs.addEventListener('keydown', function(event) {
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
      testApi()
      
  }

  useEffect(()=>{   
    iniciar()
  }, [])//executa a função quando carrega a tela

  return(
    <><div className='container'>
        <div className='containertitle' id='userstitle'>
            <h1>Usuario</h1>
            <button onClick={goToBack}>
                <img src={Imageback} className='img rodar' />
            </button>
        </div>

        { filteredUsers.map((user) => ( 
            <div key={user.id} className='carduser' id='todos'>
                <div>
                <p>Idade: <span>{user.idade}</span></p>
                <p>User: <span>{user.usuario}</span></p>
                <p>CPF: <span>{user.cpf}</span></p>
                <p>Telefone: <span>{user.telefone}</span></p>
                <p>Nome: <span>{user.nome}</span></p>
                <p>E-mail: <span>{user.email}</span></p>
                </div>
                <div className='containerbtnuser'>
                    <button onClick={() => goToUpdate(user.id)}>
                        <img src={Imageupdate} className='img'/>
                    </button>
                    <button onClick={() => deletUsers(user.id)}>
                        <img src={Imagedelet} className='img'/>
                    </button>
                </div>
            </div>
        ))}
    </div>
    </>
  )

}

export default Home