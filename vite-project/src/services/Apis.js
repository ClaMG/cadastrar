import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/home/index'; // O seu componente atual
import Update from '../pages/update/update'; // O novo componente/página

function Apis() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/update/:id" element={<Update />} />
        </Routes>
    </BrowserRouter>
  );
}

export default Apis;
