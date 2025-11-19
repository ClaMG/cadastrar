import { useEffect, useState, useRef } from 'react'
import './style.css'
import Imagedelet from "../../assets/delete.svg"
import Imageupdate from "../../assets/edit.svg"
import Imagelupa from "../../assets/lupa.svg"
import api from '../../services/api'


function Home(){
    const [users, setUsers] = useState([])//adicionar automaticamente na tela
    const [filteredUsers, setFilteredUsers] = useState([])//para filtrar
    const inputPesquisarId = useRef()

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



  useEffect(()=>{
    getUsers()
  }, [])//executa a função quando carrega a tela

  return(
    <><div className='container'>
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
                <button>
                    <img src={Imageupdate} className='img'/>
                </button>
                </div>
            </div>
        ))}
    </div>
    </>
  )

}

export default Home