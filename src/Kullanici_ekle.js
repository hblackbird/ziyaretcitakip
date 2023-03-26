import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
export default function Kullanici_ekle({ loggedIn, setLoggedIn }) {
    const [isim, setIsim] = useState('');
    const [rol, setRol] = useState();
    const [kontrol, setKontrol] = useState(false);
    const [kullanici, setKullanici] = useState(null);
    const [giris, setGiris] = useState(loggedIn);
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const navigate = useNavigate();
    const kullanici_ekle = () => {
        axios.post("http://localhost:3001/kullanici_ekle", {
            isim: isim,
            password: password,
            rol:rol,
        }).then((res) => {
            if (res.data === false) {
                console.log("Boşlukları doldur.");
            } else {
                if (password === rePassword) {
                    console.log("Başarılı.");
                    setIsim("");
                    setPassword("");
                    setRePassword("");
                    listele();
                } else {
                    console.log("Şifreler Uyuşmuyor.");
                }
            }
        });
    };
    const guncelle = () => {
        axios.post("http://localhost:3001/kullanici_guncelle", {
            isim: isim,
            rol: rol,
        }).then((res)=>{
            console.log("Başarılı.")
            listele();
        })
    }
    const ksil = () => {
        axios.post("http://localhost:3001/kullanici_sil", {
            isim: isim,
        }).then((res)=>{
            console.log("Başarılı.")
            listele();
        })
    }
    const listele = () => {
        axios.post("http://localhost:3001/kullanici_listele", {
            data: kullanici,
        }).then((res) => {
            setKullanici(res.data);
        });
    }
    const roldegis = (e) => {
        setRol(e.target.value);
    }
    
    const duzenle = (veri) => {
        setIsim(veri.kullanici_adi);
        setKontrol(true);
    }
    useEffect(() => {
        listele();
    }, []);
    if (localStorage.getItem("token") !== null || loggedIn) {
        return (
            <>
                <Navbar loggedIn={giris} setLoggedIn={setGiris} />
                <div className='ziyaretci_ekle'>
                    <div className='ziyaretci_ekle_input'>
                        <label >Kullanıcı Adı: </label>
                        <input value={isim} type="text" onChange={(e) => {
                            setIsim(e.target.value);
                        }} />
                        <label >Şifre: </label>
                        <input value={password} type="password" onChange={(e) => {
                            setPassword(e.target.value);
                        }} />
                        <label >Şifre Tekrar: </label>
                        <input value={rePassword} type="password" onChange={(e) => {
                            setRePassword(e.target.value);
                        }} />
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label" style={{fontWeight:"bold",color:"black"}}>Rol</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="kullanici"
                                name="radio-buttons-group"
                                onChange={roldegis}
                            >
                                <FormControlLabel value="kullanici" control={<Radio />} label="Kullanıcı" />
                                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                            </RadioGroup>
                        </FormControl>
                        <button onClick={kullanici_ekle} >Kayıt Et</button>
                        <button  onClick={guncelle} style={{backgroundColor:"#4b92c9"}} >Güncelle</button>
                    </div>
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <h5 className='mt-2'>Çıkış</h5>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>Kullanıcı</th>
                                        <th>Rolü</th>
                                        <th>Düzenle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kullanici === null ? null : kullanici.map((veri, key) => (
                                        <tr key={key}>
                                            <td>{veri.kullanici_adi}</td>
                                            {veri.rol == 1 ? <td>Admin</td> : <td>Kullanıcı</td>}
                                            <td><button onClick={()=>{duzenle(veri)}}>Düzenle</button><button disabled={!kontrol} onClick={()=>{ksil(veri)}}>Sil</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
                <h1>Bu sayfayı görmek için önce giriş yapın!</h1>
                {setTimeout(() => {
                    navigate("/anasayfa");
                }, 3000)}
            </>
        )
    }
}
