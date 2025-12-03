import{openDb}from'../configDB.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer'
import crypto from 'node:crypto'
const secretKey = process.env.JWT_SECRET || "gudUMKvWUayk9wWgVeB9/xvnd1zfvWxXfm07MurfmX1G15bPcTmc";
const saltRounds = 10;

//email
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true 465, false 587
    auth: {
        user: 'erickclarkemoura@gmail.com',
        pass: "pudv uvbn lirv vqwi"
    }
});

export async function createTable(){//corrigit para await
    try{
    openDb().then(db=>{
        db.exec('CREATE TABLE IF NOT EXISTS Usuarios (id INTEGER PRIMARY KEY, usuario TEXT, senha TEXT, nome TEXT, idade INTEGER, cpf CHAR(11), telefone CHAR(11), email TEXT)');
        });
    }catch(err){
        console.error("Erro ao criar tabela: " + err.message);
        res.status(500).json({ message: "Erro ao criar tabela" });
    }
}

//codigo
export async function createTableCode() {
    try{
        const db = await openDb();
        await db.exec('CREATE TABLE IF NOT EXISTS UsuariosCodes (id INTEGER PRIMARY KEY, idUser INTEGER, code CHAR(6), expiresAt INTEGER)');
    }catch(err){
        console.error("Erro ao criar tabela UsuariosCodes: " + err.message);
        res.status(500).json({ message: "Erro ao criar tabela UsuariosCodes" });
    }
}

//crud
export async function selectUsuarios(req, res){
    
    try{
        const db = await openDb();
         const users = await db.all('SELECT id, usuario, nome, idade, cpf, telefone, email FROM Usuarios');
        return res.json(users);
    }catch(err){
        console.log("Erro ao selecionar usuários: " + err.message);
        res.status(500).json({ message: "Erro interno do servidor ao buscar usuário." });
    }
}

export async function selectUsuario(req, res) {
    let id = req.params.id;

    try {
      
        const db = await openDb(); 
        const user = await db.get('SELECT usuario, nome, idade, cpf, telefone, email FROM Usuarios WHERE id = ?', [id]);
        if (user) {
            return res.json(user);
        } else {
            res.status(404).json({ message: "Usuário não encontrado." });
        }

    } catch (err) {
        console.error("Erro ao selecionar usuário:", err.message);
        
        res.status(500).json({ message: "Erro interno do servidor ao buscar usuário." });
    }
}

async function getUserByUsernameOrEmail(usuario, email) {
    try {
        const db = await openDb();
        const query = 'SELECT usuario, email FROM Usuarios WHERE usuario = ? OR email = ?';
        // Procura se já existe um usuário com o mesmo nome OU com o mesmo email
        const user = await db.get(query, [usuario, email]); 
        return user; // Retorna o objeto do usuário ou 'undefined' se não encontrar
    } catch (err) {
        console.error('Erro ao buscar usuário/email:', err);
        throw new Error('Erro ao verificar usuário ou email.');
    }
}

export async function insertUsuario(req, res){
    try{
        let user = req.body;

        const existingUser = await getUserByUsernameOrEmail(user.usuario, user.email);
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const verificarEmail = regex.test(user.email);

        if(!user || !user.usuario || !user.senha || !user.nome || !user.idade || !user.cpf || !user.telefone || !user.email){
            return res.status(400).json({ message: 'Preencha todos os campos' });
        }else if(user.cpf.length != 11){
            return res.status(400).json({ message: 'Campo cpf preenchido incorretamente' });
        }else if(user.telefone.length != 11){
            return res.status(400).json({ message: 'Campo telefone preenchido incorretamente' });
        }else if(user.idade == 0 || user.idade.length >2 || user.idade <1){
            return res.status(400).json({ message: 'Campo Idade preenchido incorretamente' });
        }else if(!verificarEmail){
            return res.status(400).json({ message: 'Campo email preenchido incorretamente' });
        }
        
        if (existingUser) { 
            if (existingUser.usuario === user.usuario) {
                return res.status(401).json({ message: 'Usuario ja existente' });
            }
            
            if (existingUser.email === user.email) {
                return res.status(401).json({ message: 'Email ja existente' });
            }
        }

        else{
            const hashedPassword = await bcrypt.hash(user.senha, saltRounds);
            const db = await openDb();
            await db.run('INSERT INTO Usuarios (usuario, senha, nome, idade, cpf, telefone, email) VALUES (?, ?, ?, ?, ?, ?, ?)', [user.usuario, hashedPassword, user.nome, user.idade, user.cpf, user.telefone, user.email]);
            return res.json({
                "statuscode": 200,
                message: 'Usuario cadastrado com sucesso'
            });
       }
    }catch(err){
        console.log("Erro ao inserir usuário: " + err.message);
        res.status(500).json({ message: "Erro ao inserir usuário" });
    }
     
}

export async function updateUsuario(req, res){
    try{
        let user = req.body;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const verificarEmail = regex.test(user.email);
        if(!user || !user.usuario || !user.senha || !user.nome || !user.idade || !user.cpf || !user.telefone || !user.email || !user.id){
            return res.status(400).json({ message: 'Preencha todos os campos' });
        } else if(user.cpf.length != 11){
            return res.status(400).json({ message: 'Campo cpf preenchido incorretamente' });
        }else if(user.telefone.length != 11){
            return res.status(400).json({ message: 'Campo telefone preenchido incorretamente' });
        }else if(user.idade.length <0 || user.idade.length >2){
            return res.status(400).json({ message: 'Campo Idade preenchido incorretamente' });
        }else if(!verificarEmail){
            return res.status(400).json({ message: 'Campo email preenchido incorretamente' });
        }
        else{

            const hashedPassword = await bcrypt.hash(user.senha, saltRounds);
            const db = await openDb();
        
        await db.run('UPDATE Usuarios SET usuario=?, senha=?, nome = ?, idade = ?, cpf=?, telefone=?, email=? WHERE id = ?', 
            [user.usuario, hashedPassword, user.nome, user.idade, user.cpf, user.telefone, user.email, user.id]);
        
        return res.json({ "message": "Usuário atualizado com sucesso", "statuscode": 200 });
        
        }
    }catch(err){
        console.log("Erro ao atualizar usuário: " + err.message);
        res.status(500).json({ message: "Erro ao atualizar usuário." });
    }  

}

export async function deleteUsuario(req, res){
    try{
        let id = req.params.id;

        if(id == 1){
           return res.status(403).json({message: 'Não é permitido deletar o usuário de ID 1'}); 
        }else if(!id){
             return res.status(403).json({message: 'Preencha o camp de id'});
        }
        else{
            const db = await openDb();
            await db.get('DELETE FROM Usuarios WHERE id = ?', [id])
            return res.json({
                "statuscode": 200,
                message: "Usuário deletado com sucesso"
            });     
        }
    }catch(err){
        console.log( "Erro ao selecionar usuários: " + err.message);
        res.status(500).json({ message: "Erro ao selecionar usuários" });
    }
}

//logar
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

//codigo//

function gerarcodigo(length) {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(charactersLength); 
    result += characters.charAt(randomIndex);
  }
  
  return result;
}

async function saveCode(userId, code, expiresAt) {
    if (!userId || !code) {
         console.error('UserId ou code faltando para salvar.');
        throw new Error('UserId ou code faltando.');
    }

    try {
        const db = await openDb();
        //deletar o antigo
        await db.run('DELETE FROM UsuariosCodes WHERE idUser = ?', [userId]);
        //adiciona novo
        await db.run('INSERT INTO UsuariosCodes (idUser, code, expiresAt) VALUES (?, ?, ?)', [userId, code, expiresAt]
        );
    } catch (err) {
        console.error("Erro ao salvar código:", err.message);
         console.log("Falha na persistência do código de segurança.");
    }
}

async function buscarCode(userId) {
    try {
        const db = await openDb();
        // Busca o código
        const codeRecord = await db.get('SELECT code, expiresAt FROM UsuariosCodes WHERE idUser = ?', [userId]);
        
        if (!codeRecord) {
            console.log(`Nenhum código encontrado para esse userId`);
            return null;
        }
       const currentTime = Date.now();
        

        // Verifica se o código expirou
        if (codeRecord.expiresAt < currentTime) {
            console.log(`Código para ${userId} expirado.`);
            await db.run('DELETE FROM UsuariosCodes WHERE idUser = ?', [userId]); 
            return null;
        }

        return codeRecord.code; // Retorna o código válido
        
    } catch (err) {
        console.error("Erro ao buscar código:", err.message);
         console.log("Falha ao buscar código de segurança.");
    }
}

async function deletCode(userId){
    if (!userId) {
         console.error('UserId faltando para exclusão.');
        return
    }
    try{
        const db = await openDb();
        await db.run('DELETE FROM UsuariosCodes WHERE idUser = ?', [userId]);
    }catch(err){
        console.error("Erro ao deletar código:", err.message);
        console.log("Falha ao deletar código.");
    }
}

export async function codigo(req, res) {
    const {usuario, email} = req.body;
    const time = 10 * 60 * 1000;//10min

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const verificarEmail = regex.test(email);

    if(!usuario || !email){
        return res.status(401).json({message: 'Preencha todos os campos'});
    }
    if(!verificarEmail){
        return res.status(401).json({message: 'Campo email preenchido incorretamente'});
    }


    const user = await getUserByUsername(usuario);
    
    
    const normalizedRequestEmail = email ? email.trim().toLowerCase() : '';
    const normalizedUserEmail = user && user.email ? user.email.trim().toLowerCase() : '';

    if (!user) {
         return res.status(401).json({message: 'Usuario ou email não existem'});
    }

    if (normalizedRequestEmail !== normalizedUserEmail) {
        return res.status(401).json({message: 'Usuario ou email não existem'});
    }
    
    const code = gerarcodigo(6); 
    const expiresAt = Date.now() + time;
    
    try {
        const userId = user.id
        await saveCode(user.id, code, expiresAt);
    } catch (e) {

        return res.status(500).json({
            "statuscode": 500,
            "message": "Erro no servidor: erro ao salvar o código de segurança."
        });
    }

    try{
        await transporter.sendMail({
            from: 'Site de CRUD',
            to: email,
            subject: 'Código para Redefinição de Senha - Ação Necessária',
            text: `Prezado(a) usuário(a), Você solicitou a redefinição de sua senha. O código necessário foi enviado para este endereço de e-mail e será valido por 10min .Insira o código na página de redefinição para continuar. ${code}`, 
            html: `Prezado(a) usuário(a),<br><br>Você solicitou a redefinição de sua senha. O código necessário foi <strong>enviado para este endereço de e-mail</strong> e será valido por 10min.<br><br>Insira o código na página de redefinição para continuar.<br><br><strong>${code}</strong>`
        })
       
        return res.json({
            "userId": user.id,
            "statuscode": 200,
            message: "Email enviado com sucesso"
        });

    }catch(err){
        
        return res.status(500).json({
            "statuscode": 500,
            "message": "Erro ao enviar email. Tente novamente mais tarde."
        });
    }

}

export async function confirmarCodigo(req, res) {
    try {
        const {userid, codeconfirm} = req.body

        if (!userid || !codeconfirm) {
            console.log(`ID do usuário ou código ausente.`);
            return res.status(400).json({
                "statuscode": 400,
                "message": "Preencha todos os campos"
            });
        }

        const savedCode = await buscarCode(userid);

        if (!savedCode) {
            console.log(`Código não encontrado ou expirado.`);
            return res.status(401).json({
                "statuscode": 401,
                "message": "Código inválido ou expirado. Gere um novo."
            });
        }

        if (codeconfirm === savedCode) {
            await deletCode(userid); 
            return res.json({
                "statuscode": 200,
                "message": "Código confirmado com sucesso."
            });
        } else {
            console.log(`Código incorreto.`);
            return res.status(401).json({
                "statuscode": 401,
                "message": "Código de confirmação incorreto."
            });
        }
        
    } catch (error) {
        console.error(" Erro interno:", error.message);
        return res.status(500).json({
                "statuscode": 500,
                "message": "Erro interno do servidor."
            });
    }
        
}