import { Router } from 'express';
import { 
    selectUsuarios, 
    selectUsuario, 
    insertUsuario, 
    updateUsuario, 
    deleteUsuario, 
    logar, 
    codigo, 
    confirmarCodigo, 
    updatePassword 
} from '../Controler/UsuarioController.js';



const router = Router();

router.get('/users', selectUsuarios);
router.get('/user/:id', selectUsuario);
router.post('/user', insertUsuario);
router.put('/user', updateUsuario);
router.delete('/user/:id', deleteUsuario);

router.post('/login', logar);
router.post('/codigo', codigo); 
router.post('/confirmarCodigo', confirmarCodigo); 
router.put('/password', updatePassword);

export default router;