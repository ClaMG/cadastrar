import express from 'express';
import fs from 'fs';
import https from 'https';
import cors from 'cors';
import dotenv from 'dotenv';

// Importa as funções de criação de tabela diretamente dos novos Modelos
import { createTable as createUsuarioTable } from './models/UsuarioModel.js';
import { createTableCode } from './models/CodeModel.js';

// Importa o arquivo de rotas (assumindo que você o nomeou como 'usuarioRoutes.js')
// e o exportou como default.
import usuarioRoutes from './routes/usuarioRoutes.js'; 


dotenv.config();

// 1. Cria as tabelas ao iniciar (funções vêm dos Models)
createUsuarioTable();
createTableCode();

const app = express();
app.use(express.json());
app.use(cors());

// 2. Associa as rotas de usuário (vindo de routes/usuarioRoutes.js)
// Assumindo que você quer o caminho base "/" para as rotas
app.use(usuarioRoutes); 
// Se você quisesse um prefixo, seria app.use('/api', usuarioRoutes);


// 3. Configurações de Servidor HTTP e HTTPS
app.listen(3000, () => console.log("Api Rodando em HTTP (Porta 3000)."));


https.createServer({
    cert: fs.readFileSync('src/SSL/code.crt'),
    key: fs.readFileSync('src/SSL/code.key')

}, app).listen(3001, () => console.log("Api Rodando em HTTPS (Porta 3001)."));