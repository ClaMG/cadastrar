    // App.js
    import { BrowserRouter, Routes, Route } from 'react-router-dom';
    import Home from '../pages/completo/index';//Tudo em uma página só
    import UsersScreen from '../pages/usuarios/users';
    import HomeScreen from '../pages/home/index';
    import RegisterScreen from '../pages/cadastro/cadastrar';
    import UpdateScreen from '../pages/atualizar/update';

    function App() {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/users" element={<UsersScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/atualizar/:id" element={<UpdateScreen />} />
          </Routes>
        </BrowserRouter>
      );
    }

    export default App;