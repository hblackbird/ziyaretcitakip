import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Login from './Login';
import Ziyaretci from './Ziyaretci_ekle';
import ZiyaretciListele from './Ziyaretci_listele';
import Kullanici_ekle from "./Kullanici_ekle";
import { useState } from "react";
function App() {
    let [loggedIn, setLoggedIn] = useState(false);
    let [userRol, setUserRol] = useState();
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} userRol={userRol} setUserRol={setUserRol}/>}>
                        <Route index element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} userRol={userRol} setUserRol={setUserRol}/>} />
                        <Route path="anasayfa" element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} userRol={userRol} setUserRol={setUserRol} />} />
                    </Route>
                    <Route path='/ziyaretci_ekle' element={<Ziyaretci loggedIn={loggedIn} userRol={userRol} setUserRol={setUserRol} />} />
                    <Route path='/ziyaretci_listele' element={<ZiyaretciListele loggedIn={loggedIn} userRol={userRol} setUserRol={setUserRol} />} />
                    <Route path='/kullanici_ekle' element={<Kullanici_ekle loggedIn={loggedIn} userRol={userRol} setUserRol={setUserRol} />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}


export default App;
