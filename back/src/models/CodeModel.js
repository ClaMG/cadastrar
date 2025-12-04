import { openDb } from '../configDB.js';
import crypto from 'node:crypto';

// Função para criar a tabela de códigos
export async function createTableCode() {
    const db = await openDb();
    await db.exec('CREATE TABLE IF NOT EXISTS UsuariosCodes (id INTEGER PRIMARY KEY, idUser INTEGER, code CHAR(6), expiresAt INTEGER)');
}

export function generateCode(length = 6) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(charactersLength); 
        result += characters.charAt(randomIndex);
    }
    return result;
}

export async function saveCode(userId, code, expiresAt) {
    const db = await openDb();
    // Deleta o antigo (se existir) e insere o novo
    await db.run('DELETE FROM UsuariosCodes WHERE idUser = ?', [userId]);
    await db.run('INSERT INTO UsuariosCodes (idUser, code, expiresAt) VALUES (?, ?, ?)', [userId, code, expiresAt]);
}

export async function getValidCode(userId) {
    const db = await openDb();
    const codeRecord = await db.get('SELECT code, expiresAt FROM UsuariosCodes WHERE idUser = ?', [userId]);
    
    if (!codeRecord) return null;
    
    const currentTime = Date.now();
    
    // Verifica se o código expirou
    if (codeRecord.expiresAt < currentTime) {
        await db.run('DELETE FROM UsuariosCodes WHERE idUser = ?', [userId]); 
        return null;
    }

    return codeRecord.code; // Retorna o código válido
}

export async function deleteCode(userId) {
    const db = await openDb();
    await db.run('DELETE FROM UsuariosCodes WHERE idUser = ?', [userId]);
}