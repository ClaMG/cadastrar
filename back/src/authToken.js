import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.JWT_SECRET || "secretayour_super_secret_key_here";


function authToken(req, res, next) {
    //const authHeader = req.headers['authorization'];//Pega o token do cabeçalho da requisição
    //const token =authHeader?.split(' ')[1];

    const token = localStorage.getItem('token');//Pega o token do local storage
    
    if (token == null) return res.sendStatus(401).msg = 'Token não fornecido';
    
    jwt.verify(token, secretKey, (err, user) => {//Verifica o token
        if (err){
            return res.sendStatus(401).msg = 'Token inválido ou expirado';   
        } else{
            req.user = user;//Adiciona as informações do usuário à requisição
            next();
        }

    });
}
export { authToken };