    // App.js
    import { BrowserRouter, Routes, Route } from 'react-router-dom';
    import UsersScreen from '../pages/usuarios/users';
    import UsersAdmScreen from '../pages/usuarios/usersAdm';
    import HomeScreen from '../pages/home/index';
    import RegisterScreen from '../pages/cadastro/cadastrar';
    import UpdateScreen from '../pages/atualizar/update';
    import LoginScreen from '../pages/login/login';
    import SenhaEmailScreen from '../pages/senha/enviaremail';
    import SenhaCodigoScreen from '../pages/senha/inserircodigo';
    import { ToastContainer } from "react-toastify";
    import "react-toastify/dist/ReactToastify.css";


    function App() {
      return (<>
        <div>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/users" element={<UsersScreen />} />
            <Route path="/usersAdm" element={<UsersAdmScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/atualizar" element={<UpdateScreen />} />
            <Route path="/recuperar" element={<SenhaEmailScreen />} />
            <Route path="/codigo" element={<SenhaCodigoScreen />} />
          </Routes>
        </BrowserRouter>
         </div>
         </>
      );
    }

    export default App;