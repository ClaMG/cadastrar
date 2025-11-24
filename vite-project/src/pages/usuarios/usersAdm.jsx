import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import '../../css/global.css'
import Imagedelet from "../../assets/delete.svg"
import Imageupdate from "../../assets/edit.svg"
import Imagelupa from "../../assets/lupa.svg"
import Imageback from "../../assets/back.svg"
import api from '../../services/api'


function HomeAdm(){
    const [users, setUsers] = useState([])//adicionar automaticamente na tela
    const [filteredUsers, setFilteredUsers] = useState([])//para filtrar
    const inputPesquisarId = useRef()
    const navigate = useNavigate();

  async function getUsers(){
    const userFromApi = await api.get('/users')//puxa da api
    setUsers(userFromApi.data)//adicionar automaticamente na tela
    setFilteredUsers(userFromApi.data)
  }

  async function deletUsers(id) {
    await api.delete(`/user/${id}`)

    getUsers()
    if (inputPesquisarId.current) inputPesquisarId.current.value = '';
  }

  async function getIdUser(id) {
    if(id == 0 || id == null ){
      getUsers() 
    } else {
      const userFromApi = await api.get(`/user/${id}`) 
      setFilteredUsers([userFromApi.data]) 
    }
  }
    
  async function iniciar() {
      if(localStorage.getItem('token') == null || localStorage.getItem('isAdmin') === 'false'){
        navigate('/login');
      }

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
    
}

  async function goToUpdate(id) {
    navigate(`/atualizar/${id}`);
  }

   async function goToBack() {
    navigate(`/`);
  }


  useEffect(()=>{
    getUsers()
    iniciar()
  }, [])//executa a função quando carrega a tela

  return(
    <><div className='container'>
        <div className='containertitle' id='userstitle'>
            <h1>Usuarios</h1>
            <button onClick={goToBack}>
                <img src={Imageback} className='img rodar' />
            </button>
        </div>

        <form action=""  className='containerpesquisa' onSubmit={(e) => e.preventDefault()}>
            <input placeholder='Id de pesquisa' name="id_pesquisa" type='search' ref={inputPesquisarId} className='numero'/>
            <div className='containerbtnPesquisa'>
                <button onClick={() => {getIdUser(inputPesquisarId.current.value);}}>
                        <img src={Imagelupa} className='img'/>
                </button>
            </div>
        </form>

        { filteredUsers.map((user) => ( 
            <div key={user.id} className='card' id='todos'>
                <div>
                <p>Id: <span>{user.id}</span></p>
                <p>Idade: <span>{user.idade}</span></p>
                <p>User: <span>{user.usuario}</span></p>
                <p>CPF: <span>{user.cpf}</span></p>
                <p>Senha: <span>{user.senha}</span></p>
                <p>Telefone: <span>{user.telefone}</span></p>
                <p>Nome: <span>{user.nome}</span></p>
                <p>E-mail: <span>{user.email}</span></p>
                </div>
                <div className='containerbtn'>
                  <button onClick={() => deletUsers(user.id)}>
                      <img src={Imagedelet} className='img'/>
                  </button>
                  <button onClick={() => goToUpdate(user.id)}>
                      <img src={Imageupdate} className='img'/>
                  </button>
                </div>
            </div>
        ))}
    </div>
    </>
  )

}

export default HomeAdm