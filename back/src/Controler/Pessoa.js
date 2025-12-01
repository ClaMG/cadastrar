import{openDb}from'../configDB.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { response } from 'express';
import nodemailer from 'nodemailer'
dotenv.config();

const saltRounds = 10;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true 465, false 587
    auth: {
        user: 'erickclarkemoura@gmail.com',
        pass: "pudv uvbn lirv vqwi"
    }
});

export async function createTable(){
    try{
    openDb().then(db=>{
        db.exec('CREATE TABLE IF NOT EXISTS Usuarios (id INTEGER PRIMARY KEY, usuario TEXT, senha TEXT, nome TEXT, idade INTEGER, cpf CHAR(11), telefone CHAR(11), email TEXT)');
        });
    }catch(err){
        console.error("Erro ao criar tabela: " + err.message);
    }
}

export async function insertUsuario(req, res){
    try{
        let user = req.body;
        if(!user.usuario || !user.senha || !user.nome || !user.idade || !user.cpf || !user.telefone || !user.email){
            return res.status(400).json({ message: 'Preencha todos os campos obrigatórios' });
        } else{
            const hashedPassword = await bcrypt.hash(user.senha, saltRounds);
            openDb().then(db=>{
                db.run('INSERT INTO Usuarios (usuario, senha, nome, idade, cpf, telefone, email) VALUES (?, ?, ?, ?, ?, ?, ?)', [user.usuario, hashedPassword, user.nome, user.idade, user.cpf, user.telefone, user.email]);
            });
            res.json({
                "statuscode": 200
            });
       }
    }catch(err){
        console.log(mensagem= "Erro ao inserir usuário: " + err.message);
    }
     
}

export async function updateUsuario(req, res){
    

    try{
        
        let user = req.body;
        if(!user.usuario || !user.senha || !user.nome || !user.idade || !user.cpf || !user.telefone || !user.email || !user.id){
            return res.status(400).json({ message: 'Preencha todos os campos obrigatórios' });
        } else{

            const hashedPassword = await bcrypt.hash(user.senha, saltRounds);
             openDb().then(db=>{
                db.run('UPDATE Usuarios SET usuario=?, senha=?, nome = ?, idade = ?, cpf=?, telefone=?, email=? WHERE id = ?', [user.usuario, hashedPassword, user.nome, user.idade, user.cpf, user.telefone, user.email, user.id]);
            });
            res.json({
                "statuscode": 200
            });
        }
    }catch(err){
        console.log(mensagem= "Erro ao atualizar usuário: " + err.message);
    }  

}

export async function selectUsuarios(req, res){
    try{
        openDb().then(db=>{
            db.all('SELECT * FROM Usuarios')
            .then(users=>res.json(users))
        });
    }catch(err){
        console.log(mensagem= "Erro ao selecionar usuários: " + err.message);
    }
}

export async function selectUsuario(req, res) {
    let id = req.params.id;

    try {
      
        const db = await openDb(); 

        const user = await db.get('SELECT * FROM Usuarios WHERE id = ?', [id]);
        
        
        if (user) {
            
            res.json(user);
        } else {
        
            res.status(404).json({ message: "Usuário não encontrado." });
        }

    } catch (err) {
        console.error("Erro ao selecionar usuário:", err.message);
        
        res.status(500).json({ message: "Erro interno do servidor ao buscar usuário." });
    }
}

export async function deleteUsuario(req, res){
    try{
        let id = req.params.id;

        if(id == 1){
            return res.status(403).json({message: 'Não é permitido deletar o esse usuario'});
        }else{
            openDb().then(db=>{
                db.get('DELETE FROM Usuarios WHERE id = ?', [id])
                .then(user=>res.json(user));
            });
            res.json({
                "statuscode": 200
            });     
        }
    }catch(err){
        console.log(mensagem= "Erro ao selecionar usuários: " + err.message);
    }
}


async function getUserByUsername(usuario) {

    try{
        const db = await openDb();
        
        const query = 'SELECT id, senha, email FROM Usuarios WHERE usuario = ?'; //Filtra pelo usuario na tabela
        const user = await db.get(query, [usuario]); //diz qual o usuario
        
        await db.close();//fecha a conexão com o banco de dados
        return user;//retorna o usuario encontrado
    } catch (err){
        console.error('Erro ao obter usuário:', err);
        return null;
    }
}

export async function logar(req, res){
    const secretKey = process.env.JWT_SECRET;
    const {usuario, senha} = req.body;
    
    const user = await getUserByUsername(usuario);
    const passwordMatch = await bcrypt.compare(senha, user.senha); 
    
    if (!user || !passwordMatch) {
        return res.status(401).json({message: 'Credenciais inválidas'});
    }

    if (!secretKey) {
        console.error('JWT_SECRET not defined in .env');
        return res.status(500).json({message: 'Erro interno do servidor' });
    }

    const payload = {id: user.id};

    const token = jwt.sign(payload, secretKey, {expiresIn: '1h'});//cria o token
    res.json({token, payload});
    
}
export async function codigo(req, res) {
    const {usuario, email} = req.body;

    const user = await getUserByUsername(usuario);

    if(!user || email != user.email){
         return res.status(401).json({message: 'Credenciais inválidas'});
    }

    const tesemail= "clarisse.moura.galdino@gmail.com";
    const codigo= "1234"
    try{

        transporter.sendMail({
            from: 'Site de CRUD',
            to: tesemail,
            subject: 'Código para Redefinição de Senha - Ação Necessária',
            text: 'Prezado(a) usuário(a), Você solicitou a redefinição de sua senha. O código necessário foi enviado para este endereço de e-mail.Insira o código na página de redefinição para continuar.', codigo, 
            html: `Prezado(a) usuário(a),<br><br>Você solicitou a redefinição de sua senha. O código necessário foi <strong>enviado para este endereço de e-mail</strong>.<br><br>Insira o código na página de redefinição para continuar.<br><br><strong>${codigo}</strong>`
        })
        console.log('Email enviado');

        

        res.json({
            "statuscode": 200
        });

    }catch(err){
        console.log('Email não enviado');
        
        return res.status(500).json({
            "statuscode": 500,
            "message": "Erro ao enviar email. Tente novamente mais tarde."
        });
    }

}

export async function autorizarUser(req, res){
     res.json({message: 'Acesso concedido a rota protegida'}); 
}