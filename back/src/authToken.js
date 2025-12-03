import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

function authToken(req, res, next) {
     const secretKey = process.env.JWT_SECRET || "gudUMKvWUayk9wWgVeB9/xvnd1zfvWxXfm07MurfmX1G15bPcTmc";

    if (!secretKey) {
        console.error("JWT_SECRET não está definido nas variáveis de ambiente!");
        return res.status(500).json({ msg: 'Erro interno do servidor: Chave de segurança ausente.' });
    }
    const authHeader = req.headers['authorization'];//Pega o token do cabeçalho da requisição
    const token = authHeader?.split(' ')[1]; 

    if (!token){ return res.status(401).json({ msg: 'Token não fornecido' });}
    
    jwt.verify(token, secretKey, (err, user) => {//Verifica o token
        if (err){
            console.error("Erro de Autenticação JWT:", err); 
            return res.status(401).json({ msg: 'Token inválido ou expirado' });  
        } else{
            req.user = user;//Adiciona as informações do usuário à requisição
            next();
        }

    });
}
export { authToken };