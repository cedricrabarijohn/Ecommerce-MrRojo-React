import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import './css/bootstrap.min.css'
import PageInventaires from './Pages/PageInventaires';
import Home from './Pages/Home'
import Login from './Pages/Login';
import Inscription from './Pages/Inscription';
import DetailsInventaire from './Pages/DetailsInventaire';
import PaniersUser from './Pages/PaniersUser';
import PaiementPanier from './Pages/PaiementPanier';
import GuestDetailsInventaire from './Pages/Guest/GuestDetailsInventaire'
import GuestPanier from './Pages/Guest/GuestPanier'
import { useEffect } from 'react';
import HomeAdmin from './Pages/Admin/HomeAdmin';
import ListeProduits from './Pages/Admin/ListeProduits';
function App() {
  useEffect(()=>{
    if(localStorage.getItem("panier")==null || localStorage.getItem("panier") === ""){
      fetch(`http://localhost:3001/utils`).then(res=>{
        return res.json()
      }).then(data=>{
        localStorage.setItem("panier",JSON.stringify({
          _id:data,
          nom:"Panier guest",
          quantite:0,
          total:0,
          inventaires:[]
        }))
      })
    }
  },[])
  return (
    <div className="App">
        <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/inscription' element={<Inscription />} />
          <Route path='/login' element={<Login />} />
          <Route path='/inventaires' element={<PageInventaires />} />
          <Route path='/detailsInventaire/:idInventaire' element={<DetailsInventaire />} />
          <Route path='/Paniers' element={<PaniersUser />} />
          <Route path='/PaiementPanier/:idPanier' element={<PaiementPanier />} />
          <Route path='/guest/detailsInventaire/:idInventaire' element={<GuestDetailsInventaire />} />
          <Route path='/guest/Paniers' element={<GuestPanier />} />
          <Route path='/admin' element={<HomeAdmin />} />
          <Route path='/admin/inventaires' element={<ListeProduits />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
