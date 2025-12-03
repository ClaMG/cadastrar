import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import '../../css/global.css'
import Imagedelet from "../../assets/delete.svg"
import Imageupdate from "../../assets/edit.svg"
import Imagelupa from "../../assets/search.svg"
import Imageback from "../../assets/out.svg"
import api from '../../services/api'


function HomeAdm(){
    const [users, setUsers] = useState([])//adicionar automaticamente na tela
    const [filteredUsers, setFilteredUsers] = useState([])//para filtrar
    const inputPesquisarId = useRef()
    const navigate = useNavigate();

    async function testApi() {

    try {
        await fetch(api.defaults.baseURL);
    } catch (error) {
      toast.error('Erro: A API não está respondendo.')
        
    }
   }

  async function getUsers(){

    const userFromApi = await api.get('/users')//puxa da api
    setUsers(userFromApi.data)//adicionar automaticamente na tela
    setFilteredUsers(userFromApi.data)
    testApi()
  }

  async function deletUsers(id) {
    

    try {
      await api.delete(`/user/${id}`)
      toast.success('Usuário deletado com sucesso')
    }catch (error) {
      toast.error('Erro ao deletar usuário')
    }
    getUsers()
    
    if (inputPesquisarId.current) inputPesquisarId.current.value = '';

    testApi()
  }

  //barra de pesquisa
  async function getIdUser(input) {

    const userFromApiGet = await api.get('/users')//puxa da api
    const foundUser = userFromApiGet.data.filter(user => 
        user.id == input ||
        user.usuario == input ||
        user.nome == input ||
        user.idade == input ||
        user.cpf == input ||
        user.telefone == input ||
        user.email == input
    );
    
    if(input == "" || input == null ){
      getUsers() 
    }else if(foundUser.length > 0){
      setFilteredUsers(foundUser)
    }else{
      toast.error('Usuário não encontrado')
      getUsers()
    }
    testApi()
  }
    
  async function iniciar() {
      if(localStorage.getItem('token') == null || localStorage.getItem('isAdmin') === 'false'){
        navigate('/login');
      }
      
       localStorage.setItem('pageUpdate', 'usersAdm');
    testApi()
    
}

  async function goToUpdate(id) {
   localStorage.setItem('idToUpdate', id);
    navigate(`/atualizar/`);
  }

   async function goToBack() {
    navigate(`/`);
  }
  
  useEffect(()=>{
    iniciar()
    getUsers()
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
            <input placeholder='Pesquisar' name="id_pesquisa" type='search' ref={inputPesquisarId} className='numero'/>
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