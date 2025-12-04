import { openDb } from '../configDB.js';
import { bcrypt, saltRounds } from '../config/auth.js';

// Função para criar a tabela de Usuários
export async function createTable() {
    const db = await openDb();
    await db.exec('CREATE TABLE IF NOT EXISTS Usuarios (id INTEGER PRIMARY KEY, usuario TEXT, senha TEXT, nome TEXT, idade INTEGER, cpf CHAR(11), telefone CHAR(11), email TEXT)');
}

// Funções CRUD do banco de dados (DB)
export async function findAll() {
    const db = await openDb();
    return db.all('SELECT id, usuario, nome, idade, cpf, telefone, email FROM Usuarios');
}

export async function findById(id) {
    const db = await openDb();
    return db.get('SELECT id, usuario, nome, idade, cpf, telefone, email FROM Usuarios WHERE id = ?', [id]);
}

export async function findByUsernameOrEmail(usuario, email) {
    const db = await openDb();
    const query = 'SELECT id, usuario, email, senha FROM Usuarios WHERE usuario = ? OR email = ?';
    return db.get(query, [usuario, email]);
}

export async function findDuplicateOnUpdate(id, novoUsuario, novoEmail) {
    const db = await openDb();
    const query = 'SELECT usuario, email FROM Usuarios WHERE (usuario = ? OR email = ?) AND id != ?';
    return db.get(query, [novoUsuario, novoEmail, id]);
}

export async function insert(user) {
    const hashedPassword = await bcrypt.hash(user.senha, saltRounds);
    const db = await openDb();
    const result = await db.run('INSERT INTO Usuarios (usuario, senha, nome, idade, cpf, telefone, email) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [user.usuario, hashedPassword, user.nome, user.idade, user.cpf, user.telefone, user.email]);
    return result;
}

export async function update(user) {
    const hashedPassword = await bcrypt.hash(user.senha, saltRounds);
    const db = await openDb();
    const result = await db.run('UPDATE Usuarios SET usuario=?, senha=?, nome=?, idade=?, cpf=?, telefone=?, email=? WHERE id = ?', 
        [user.usuario, hashedPassword, user.nome, user.idade, user.cpf, user.telefone, user.email, user.id]);
    return result;
}

export async function updatePassword(id, novaSenha) {
    const hashedPassword = await bcrypt.hash(novaSenha, saltRounds);
    const db = await openDb();
    const result = await db.run('UPDATE Usuarios SET senha = ? WHERE id = ?', [hashedPassword, id]);
    return result;
}

export async function remove(id) {
    const db = await openDb();
    const result = await db.run('DELETE FROM Usuarios WHERE id = ?', [id]);
    return result;
}