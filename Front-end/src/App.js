import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MainPage from './pages/MainPage';
import Customers from './pages/Customers';
import Animals from './pages/Animals';
import { useState } from 'react';
import CustomersProfile from './pages/CustomersProfile';
import AnimalProfil from './pages/AnimalProfil';
import Appointments from './pages/Appointments';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/page_accueil' exact element={<MainPage />} />
          <Route path='/clients' exact element={<Customers />} />
          <Route path='/profil_client/id=:id' exact element={<CustomersProfile />} />
          <Route path='/profil_animal/id=:id' exact element={<AnimalProfil />} />
          <Route path='/animaux' exact element={<Animals />} />
          <Route path='/rendez-vous' exact element={<Appointments />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
