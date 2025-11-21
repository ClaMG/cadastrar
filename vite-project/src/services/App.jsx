    // App.js
    import { BrowserRouter, Routes, Route } from 'react-router-dom';
    import Home from '../pages/home/index';
    import HomeScreen from '../pages/get/home';
    import RegisterScreen from '../pages/cadastrar/cadastrar';
    import MyComponent from '../services/MyComponent'; // Assuming MyComponent is in MyComponent.js

    function App() {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MyComponent />} />
            <Route path="/home" element={<Home />} />
            <Route path="/users" element={<HomeScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
          </Routes>
        </BrowserRouter>
      );
    }

    export default App;