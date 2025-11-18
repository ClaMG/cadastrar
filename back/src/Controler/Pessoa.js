import{openDb}from'../configDB.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import e from 'express';
dotenv.config();


export async function createTable(){
    try{
    openDb().then(db=>{
        db.exec('CREATE TABLE IF NOT EXISTS Usuarios (id INTEGER PRIMARY KEY, usuario TEXT, senha TEXT, nome TEXT, idade INTEGER, cpf CHAR(11), telefone CHAR(11), email TEXT)');
        });
    }catch(err){
        console.log(mensagem= "Erro ao criar tabela: " + err.message);
    }
}

export async function insertUsuario(req, res){
    try{
        let user = req.body;
        openDb().then(db=>{
            db.run('INSERT INTO Usuarios (usuario, senha, nome, idade, cpf, telefone, email) VALUES (?, ?, ?, ?, ?, ?, ?)', [user.usuario, user.senha, user.nome, user.idade, user.cpf, user.telefone, user.email]);
        });
        res.json({
            "statuscode": 200
        });
    }catch(err){
        console.log(mensagem= "Erro ao inserir usuário: " + err.message);
    }
     
}

export async function updateUsuario(req, res){
    try{
        let user = req.body;
        openDb().then(db=>{
            db.run('UPDATE Usuarios SET usuario=?, senha=?, nome = ?, idade = ?, cpf=?, telefone=?, email=? WHERE id = ?', [user.usuario, user.senha, user.nome, user.idade, user.cpf, user.telefone, user.email, user.id]);
        });
        res.json({
            "statuscode": 200
        }); 
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

export async function selectUsuario(req, res){
    try{
        let id = req.body.id;
            openDb().then(db=>{
            db.get('SELECT * FROM Usuarios WHERE id = ?', [id])
            .then(user=>res.json(user));
        });
    }catch(err){
        console.log(mensagem= "Erro ao selecionar usuários: " + err.message);
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


async function getUserByUsername(username) {

    try{
        const db = await openDb();
        
        const query = 'SELECT id, senha FROM Usuarios WHERE usuario = ?'; //Filtra pelo usuario na tabela
        const user = await db.get(query, [username]); //diz qual o usuario
        
        await db.close();//fecha a conexão com o banco de dados
        return user;//retorna o usuario encontrado
    } catch (err){
        console.error('Erro ao obter usuário:', err);
        return null;
    }
}

export async function logar(req, res){
    const secretKey = process.env.JWT_SECRET || 'secretayour_super_secret_key_here';
    const {username, password} = req.body;
    
    const user = await getUserByUsername(username); //usa a função e manda o usuario para verificação

    //verifica usuario

    if (!user) {
        return res.status(401).json({message: 'Credenciais inválidas'});
    }

    //verifica senha

    const passwordMatch = user.senha === password;
    
    if (!passwordMatch) {
        return res.status(401).json({message: 'Credenciais inválidas'});
    }
    
    if (!secretKey) {
        console.error('JWT_SECRET not defined in .env');
        return res.status(500).json({message: 'Erro interno do servidor' });
    }

    const payload = {id: user.id};

    const token = jwt.sign(payload, secretKey, {expiresIn: '1h'});//cria o token
    res.json({token});
}

export async function autorizarUser(req, res){
     res.json({message: 'Acesso concedido a rota protegida'}); 
}