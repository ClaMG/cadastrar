import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

function authToken(req, res, next) {
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
        console.error("JWT_SECRET não está definido nas variáveis de ambiente!");
    
    }
    const authHeader = req.headers['authorization'];//Pega o token do cabeçalho da requisição
    const token =authHeader?.split(' ')[1] || localStorage.getItem('token');
    
    if (!token){ return res.status(401).json({ msg: 'Token não fornecido' });}
    
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