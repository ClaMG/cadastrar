    // App.js
    import { BrowserRouter, Routes, Route } from 'react-router-dom';
    import Home from '../pages/completo/index';//Tudo em uma página só
    import UsersScreen from '../pages/usuarios/users';
    import UsersAdmScreen from '../pages/usuarios/usersAdm';
    import HomeScreen from '../pages/home/index';
    import RegisterScreen from '../pages/cadastro/cadastrar';
    import UpdateScreen from '../pages/atualizar/update';
    import LoginScreen from '../pages/login/login';

    function App() {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/users" element={<UsersScreen />} />
            <Route path="/usersAdm" element={<UsersAdmScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/atualizar" element={<UpdateScreen />} />
          </Routes>
        </BrowserRouter>
      );
    }

    export default App;