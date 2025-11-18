import { useEffect, useState, useRef } from 'react'
import '../home/style.css'
import api from '../../services/api'


function Update(){
    const [users, setUsers] = useState([])//adicionar automaticamente na tela

  const inputId = useRef()
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

  }

  async function putUsers() {
    const userFromApi = await api.put('/user',{
      id: inputId.current.value,
      usuario: inputUser.current.value,
      senha: inputSenha.current.value,
      nome: inputNome.current.value,
      idade: inputIdade.current.value,
      cpf: inputCPF.current.value,
      telefone: inputTelefone.current.value,
      email: inputEmail.current.value
    })//Envia para api

    getUsers()
    
  }


  useEffect(()=>{
    getUsers()
  }, [])//executa a função quando carrega a tela


  return (
    <>
      <div className='container'>
          <form action="">
            <h1>Atualizar</h1>
            <div className='containerSon'>
            <input placeholder='Id' name="Id" type='number'ref={inputId}/>
            <input placeholder='User' name="User" type='text'ref={inputUser}/>
            <input placeholder='Senha' name="Senha" type='password'ref={inputSenha}/>
            <input placeholder='Nome' name="Nome" type='text'ref={inputNome}/>
            </div>
            <div className='containerSon'>
            <input placeholder='Idade' name="Idade" type='number' ref={inputIdade}/>
            <input placeholder='CPF' name="CPF" type='text' ref={inputCPF}/>
            <input placeholder='Telefone' name="Telefone" type='text' ref={inputTelefone}/>
            <input placeholder='E-mail' name="Email" type='email' ref={inputEmail}/>
            </div>
            <button type='button' onClick={putUsers}>Atualizar</button>
          </form>

          { users.map((user) => (
          <><div key={user.id} className='card'>
                <p>Id: <span>{user.id}</span></p>
                <p>User: <span>{user.usuario}</span></p>
                <p>Senha: <span>{user.senha}</span></p>
                <p>Nome: <span>{user.nome}</span></p>
                <p>Idade: <span>{user.idade}</span></p>
                <p>CPF: <span>{user.cpf}</span></p>
                <p>Telefone: <span>{user.telefone}</span></p>
                <p>E-mail: <span>{user.email}</span></p>
            </div>
              </>
          ))}
          
      </div>
      
    </>
  )
}

export default Update