import { findById, findAll, insert, update, remove, findByUsernameOrEmail, findDuplicateOnUpdate, updatePassword as modelUpdatePassword } from '../models/UsuarioModel.js';
import { generateCode, saveCode, getValidCode, deleteCode } from '../models/CodeModel.js';
import { bcrypt, jwt, secretKey } from '../config/auth.js';
import { transporter } from '../config/email.js';


// ------------------------------------------------------------------
// Lógica de Validação (Movida do corpo das funções)
// ------------------------------------------------------------------

function validateUserFields(user) {
    if(!user || !user.usuario || !user.senha || !user.nome || !user.idade || !user.cpf || !user.telefone || !user.email) {
        return 'Preencha todos os campos';
    }
    if(user.cpf.length !== 11) {
        return 'Campo cpf preenchido incorretamente';
    }
    if(user.telefone.length !== 11) {
        return 'Campo telefone preenchido incorretamente';
    }
    // Simplificando a validação de idade
    if(user.idade <= 0 || user.idade > 150) { 
        return 'Campo Idade preenchido incorretamente';
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regex.test(user.email)) {
        return 'Campo email preenchido incorretamente';
    }
    return null; // Nenhuma mensagem de erro
}

// ------------------------------------------------------------------
// Funções CRUD
// ------------------------------------------------------------------

export async function selectUsuarios(req, res) {
    try {
        const users = await findAll(); // Chama o Model
        return res.json(users);
    } catch (err) {
        console.error("Erro ao selecionar usuários:", err.message);
        return res.status(500).json({ message: "Erro interno do servidor ao buscar usuários." });
    }
}

export async function selectUsuario(req, res) {
    const id = req.params.id;
    try {
        const user = await findById(id); // Chama o Model
        if (user) {
            // Remove a senha antes de enviar a resposta
            delete user.senha; 
            return res.json(user);
        } else {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }
    } catch (err) {
        console.error("Erro ao selecionar usuário:", err.message);
        return res.status(500).json({ message: "Erro interno do servidor ao buscar usuário." });
    }
}

export async function insertUsuario(req, res) {
    const user = req.body;
    
    const validationError = validateUserFields(user);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const existingUser = await findByUsernameOrEmail(user.usuario, user.email); // Chama o Model
        if (existingUser) { 
            if (existingUser.usuario === user.usuario) {
                return res.status(401).json({ message: 'Usuario já existente' });
            }
            if (existingUser.email === user.email) {
                return res.status(401).json({ message: 'Email já existente' });
            }
        }

        await insert(user); // Chama o Model

        return res.json({ "statuscode": 200, message: 'Usuario cadastrado com sucesso' });

    } catch (err) {
        console.error("Erro ao inserir usuário:", err.message);
        return res.status(500).json({ message: "Erro ao inserir usuário" });
    }
}

export async function updateUsuario(req, res) {
    const user = req.body;
    
    // Validação de campos
    const validationError = validateUserFields(user);
    if (validationError || !user.id) {
        return res.status(400).json({ message: validationError || 'ID do usuário é obrigatório.' });
    }

    try {
        // Verifica se há duplicatas de outros usuários com mesmo nome/email
        const duplicateUser = await findDuplicateOnUpdate(user.id, user.usuario, user.email); // Chama o Model

        if (duplicateUser) {
            if (duplicateUser.usuario === user.usuario) {
                return res.status(401).json({ message: 'Nome de usuário já existe.' });
            }
            if (duplicateUser.email === user.email) {
                return res.status(401).json({ message: 'E-mail já existe.' });
            }
        }

        const result = await update(user); // Chama o Model

        if (result.changes === 0) {
            return res.status(404).json({ message: "Usuário não encontrado ou nenhum dado alterado." });
        }
        
        return res.json({ "message": "Usuário atualizado com sucesso", "statuscode": 200 });
        
    } catch (err) {
        console.error("Erro ao atualizar usuário:", err.message);
        return res.status(500).json({ message: "Erro ao atualizar usuário." });
    } 
}

export async function deleteUsuario(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: 'ID do usuário é obrigatório.' });
    }
    
    // Regra de Negócio: Não deletar o ID 1 (admin/teste)
    if (parseInt(id) === 1) { 
        return res.status(403).json({ message: 'Não é permitido deletar o usuário de ID 1' }); 
    }

    try {
        const result = await remove(id); // Chama o Model
        
        if (result.changes === 0) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        return res.json({ "statuscode": 200, message: "Usuário deletado com sucesso" }); 
        
    } catch (err) {
        console.error("Erro ao deletar usuário:", err.message);
        return res.status(500).json({ message: "Erro ao deletar usuário" });
    }
}

// ------------------------------------------------------------------
// Funções de Autenticação e Código de Segurança
// ------------------------------------------------------------------

export async function logar(req, res) {
    const { usuario, senha } = req.body;
    
    if (!usuario || !senha) {
        return res.status(400).json({ message: 'Preencha todos os campos.' });
    }

    try {
        const user = await findByUsernameOrEmail(usuario, null); // Busca o usuário pelo nome de usuário
        
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        
        const passwordMatch = await bcrypt.compare(senha, user.senha); 
        
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        
        if (!secretKey) {
            console.error('JWT_SECRET not defined in .env');
            return res.status(500).json({ message: 'Problema na secretKey' });
        }

        const payload = { id: user.id };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        
        return res.json({ token, payload });
        
    } catch (err) {
        console.error("Erro no login:", err.message);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

export async function codigo(req, res) {
    const { usuario, email } = req.body;
    const time = 10 * 60 * 1000; // 10 min
    
    if (!usuario || !email) {
        return res.status(400).json({ message: 'Preencha todos os campos' });
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regex.test(email)) {
        return res.status(400).json({ message: 'Campo email preenchido incorretamente' });
    }

    try {
        const user = await findByUsernameOrEmail(usuario, email); // Busca pelo usuário OU email
        
        const normalizedRequestEmail = email.trim().toLowerCase();
        const normalizedUserEmail = user?.email ? user.email.trim().toLowerCase() : '';

        if (!user || normalizedRequestEmail !== normalizedUserEmail) {
            // Resposta genérica para não dar dicas sobre qual campo está errado
            return res.status(401).json({ message: 'Usuario ou email não existem' });
        }
        
        const code = generateCode(6); // Chama o Model (função utilitária)
        const expiresAt = Date.now() + time;
        
        await saveCode(user.id, code, expiresAt); // Chama o Model
        
        // Envio de email
        await transporter.sendMail({
            from: 'Site de CRUD',
            to: email,
            subject: 'Código para Redefinição de Senha',
            html: `Prezado(a) usuário(a),<br><br>Seu código de redefinição é: <strong>${code}</strong>. Válido por 10min.`
        });
        
        const payload = { id: user.id };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token de sessão para redefinição

        return res.json({ "userId": user.id, "statuscode": 200, message: "Email enviado com sucesso", token: token });

    } catch (err) {
        console.error("Erro ao gerar/enviar código:", err.message);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

export async function confirmarCodigo(req, res) {
    const { userid, codeconfirm } = req.body;

    if (!userid || !codeconfirm) {
        return res.status(400).json({ "statuscode": 400, "message": "Preencha todos os campos" });
    }

    try {
        const savedCode = await getValidCode(userid); // Chama o Model
        
        if (!savedCode) {
            return res.status(401).json({ "statuscode": 401, "message": "Código inválido ou expirado. Gere um novo." });
        }

        if (codeconfirm === savedCode) {
            await deleteCode(userid); // Chama o Model
            return res.json({ "statuscode": 200, "message": "Código confirmado com sucesso." });
        } else {
            return res.status(401).json({ "statuscode": 401, "message": "Código de confirmação incorreto." });
        }
    } catch (error) {
        console.error("Erro interno:", error.message);
        return res.status(500).json({ "statuscode": 500, "message": "Erro interno do servidor." });
    }
}

export async function updatePassword(req, res) {
    const { id, senha } = req.body;
    
    if (!id || !senha) {
        return res.status(400).json({ message: 'ID do usuário e a nova senha são obrigatórios.' });
    }
    
    try {
        const result = await modelUpdatePassword(id, senha); // Chama o Model

        if (result.changes === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado ou não houve alteração.' });
        }

        return res.json({ "statuscode": 200, "message": "Senha atualizada com sucesso." });

    } catch (err) {
        console.error("Erro ao atualizar senha:", err.message);
        return res.status(500).json({ message: "Erro interno do servidor ao atualizar senha." });
    }
}