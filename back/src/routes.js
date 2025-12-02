import { Router } from "express";
import {insertUsuario, updateUsuario, selectUsuarios, selectUsuario, deleteUsuario, autorizarUser, logar, codigo, confirmarCodigo, createTable} from './Controler/Pessoa.js';

import { authToken } from './authToken.js';

const router = Router();



router.get('/', (req, res) => {
    res.json({
        "statusCode": 200,
        "msg": "API Funcionando"
    })
});



router.get('/users', selectUsuarios);//Leitura de todas as pessoas
router.get('/user/:id', selectUsuario);//Leitura de uma pessoa
router.put('/user', updateUsuario);//Atualização dos dados de uma pessoa
router.post('/user', insertUsuario);//Inserção de uma nova pessoa
router.delete('/user/:id', deleteUsuario);//Deleção de uma pessoa
router.get('/protected',authToken, autorizarUser);//Rota protegida
router.post('/login', logar);//Rota de login
router.post('/codigo', codigo);//Rota de login
router.post('/codigoconfirma', confirmarCodigo);//Rota de login

export default router;