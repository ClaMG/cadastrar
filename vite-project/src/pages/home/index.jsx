import { useEffect, useState, useRef } from 'react'
import './style.css'
import Imagedelet from "../../assets/delete.svg"
import Imageupdate from "../../assets/edit.svg"
import Imagelupa from "../../assets/lupa.svg"
import ImageX from "../../assets/lupa.svg"
import api from '../../services/api'




function Home() {
  const [users, setUsers] = useState([])//adicionar automaticamente na tela
  const [filteredUsers, setFilteredUsers] = useState([])//para filtrar
  
  const inputPesquisarId = useRef()
  const inputUpId = useRef()
  const inputUpUser = useRef()
  const inputUpSenha = useRef()
  const inputUpNome = useRef()
  const inputUpIdade = useRef()
  const inputUpCPF = useRef()
  const inputUpTelefone = useRef()
  const inputUpEmail = useRef()
  const inputUser = useRef()
  const inputSenha = useRef()
  const inputNome = useRef()
  const inputIdade = useRef()
  const inputCPF = useRef()
  const inputTelefone = useRef()
  const inputEmail = useRef()
  
  async function getUsers(){
    const userFromApi = await api.get('/users')//puxa da api
    setUsers(userFromApi.data)//adicionar automaticamente na tela
    setFilteredUsers(userFromApi.data)

  }

  async function postUsers() {
    const userFromApi = await api.post('/user',{
      usuario: inputUser.current.value,
      senha: inputSenha.current.value,
      nome: inputNome.current.value,
      idade: inputIdade.current.value,
      cpf: inputCPF.current.value,
      telefone: inputTelefone.current.value,
      email: inputEmail.current.value
    })//Envia para api

    
    getUsers()

    if (inputUser.current) inputUser.current.value = '';
    if (inputSenha.current) inputSenha.current.value = '';
    if (inputNome.current) inputNome.current.value = '';
    if (inputIdade.current) inputIdade.current.value = '';
    if (inputCPF.current) inputCPF.current.value = '';
    if (inputTelefone.current) inputTelefone.current.value = '';
    if (inputEmail.current) inputEmail.current.value = '';


    
  }

  async function deletUsers(id) {
    await api.delete(`/user/${id}`)

    getUsers()
  }

  async function putUsers() {
    const userFromApi = await api.put('/user',{
      id: inputUpId.current.value,
      usuario: inputUpUser.current.value,
      senha: inputUpSenha.current.value,
      nome: inputUpNome.current.value,
      idade: inputUpIdade.current.value,
      cpf: inputUpCPF.current.value,
      telefone: inputUpTelefone.current.value,
      email: inputUpEmail.current.value
    })//Envia para api

    getUsers()

    if (inputUpId.current) inputUpId.current.value = '';
    if (inputUpUser.current) inputUpUser.current.value = '';
    if (inputUpSenha.current) inputUpSenha.current.value = '';
    if (inputUpNome.current) inputUpNome.current.value = '';
    if (inputUpIdade.current) inputUpIdade.current.value = '';
    if (inputUpCPF.current) inputUpCPF.current.value = '';
    if (inputUpTelefone.current) inputUpTelefone.current.value = '';
    if (inputUpEmail.current) inputUpEmail.current.value = '';

    document.getElementById("update").style.display = "none";
    
  }

  async function enviarId(id) {
     inputUpId.current.value = id;
      document.getElementById("update").style.display = "flex";

    
  }

  async function getIdUser(id) {
    
  }

  useEffect(()=>{
    getUsers()
  }, [])//executa a função quando carrega a tela


  return (
    <>
      <div className='container'>

          <form action="">
            <h1>Cadastro</h1>
            
            <div className='containerSon'>
            <input placeholder='User' name="User" type='text'ref={inputUser}/>
            <input placeholder='Senha' name="Senha" type='password'ref={inputSenha}/>
            <input placeholder='Nome' name="Nome" type='text'ref={inputNome}/>
            <input placeholder='Idade' name="Idade" type='number' ref={inputIdade}/>
            </div>
            <div className='containerSon'>
            <input placeholder='CPF' name="CPF" type='text' ref={inputCPF}/>
            <input placeholder='Telefone' name="Telefone" type='text' ref={inputTelefone}/>
            <input placeholder='E-mail' name="Email" type='email' ref={inputEmail}/>
            </div>
            <button type='button' onClick={postUsers}>Cadastrar</button>
            
          </form>

          <form action=""  className='containerpesquisa'>
            <input placeholder='Id de pesquisa' name="id" type='number'ref={inputPesquisarId}/>
            <div className='containerbtn'>
              <button onClick={()=> getIdUser(inputPesquisarId)}>
                      <img src={Imagelupa} className='img'/>
              </button>
              <button onClick={getUsers}>
                      <img src={ImageX} className='img'/>
              </button>
            </div>
          </form>

          

          { users.map((user) => (
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
                <button onClick={() => enviarId(user.id)}>
                    <img src={Imageupdate} className='img'/>
                </button>
              </div>
          </div>
          ))}
          

          <form action="" id='update'>
            <h1>Atualizar</h1>
            
            <div className='containerSon'>
            <input placeholder='Id' name="Id" type='number'ref={inputUpId}/>
            <input placeholder='User' name="User" type='text'ref={inputUpUser}/>
            <input placeholder='Senha' name="Senha" type='password'ref={inputUpSenha}/>
            <input placeholder='Nome' name="Nome" type='text'ref={inputUpNome}/>
            </div>
            <div className='containerSon'>
            <input placeholder='Idade' name="Idade" type='number' ref={inputUpIdade}/>
            <input placeholder='CPF' name="CPF" type='text' ref={inputUpCPF}/>
            <input placeholder='Telefone' name="Telefone" type='text' ref={inputUpTelefone}/>
            <input placeholder='E-mail' name="Email" type='email' ref={inputUpEmail}/>
            </div>
            <button type='button' onClick={putUsers}>Atualizar</button>
            
          </form>
          
      </div>
      
    </>
  )
}

export default Home
