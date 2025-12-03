import { Router } from "express";
import {insertUsuario, updateUsuario, selectUsuarios, selectUsuario, deleteUsuario, logar, codigo, confirmarCodigo, createTable} from './Controler/Usuarios.js';

import { authToken } from './authToken.js';

const router = Router();



router.get('/', (req, res) => {
    res.json({
        "statusCode": 200,
        "msg": "API Funcionando"
    })
});



router.get('/users', authToken, selectUsuarios);//Leitura de todas as pessoas
router.get('/user/:id',  authToken, selectUsuario);//Leitura de uma pessoa
router.put('/user', authToken, updateUsuario);//Atualização dos dados de uma pessoa
router.post('/user', insertUsuario);//Inserção de uma nova pessoa
router.delete('/user/:id',  authToken, deleteUsuario);//Deleção de uma pessoa
router.post('/login', logar);//Rota de login
router.post('/codigo', codigo);//Rota de login
router.post('/codigoconfirma', confirmarCodigo);//Rota de login

export default router;