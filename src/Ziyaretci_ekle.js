import React, { useEffect, useState } from 'react'
import './App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import moment from "moment";
import DatePicker from "react-datetime-picker";
export default function Ziyaretci_ekle({ loggedIn, setLoggedIn }) {
  const [giris, setGiris] = useState();
  const [isim, setIsim] = useState('');
  const [firma, setFirma] = useState('');
  const [telefon, setTelefon] = useState('');
  const [mail, setMail] = useState('');
  const [ktipi, setKtipi] = useState('');
  const [kartverildi, setKartverildi] = useState('');
  const [ziyaretedilen, setZiyaretedilen] = useState('');
  const [rol, setRol] = useState(localStorage.getItem("rol"));
  const [tarih, setTarih] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const navigate = useNavigate();
  const ziyaretci_ekle = () => {
    axios.post("http://localhost:3001/kayit", {
      isim: isim,
      firma: firma,
      telefon: telefon,
      mail: mail,
      baslangic:startDate,
      bitis:endDate,
      ziyaret_edilen: ziyaretedilen,
    }).then((res) => {
      if (res.data === false) {
        console.log("Boşlukları doldur.");
      } else {
        console.log("Başarılı.");
        setFirma("");
        setIsim("");
        setKartverildi("");
        setKtipi("");
        setMail("");
        setTelefon("");
        setZiyaretedilen("");
      }
    });
  };
  useEffect(() => {
    setTarih(moment().format("hh:mm:ss DD-MM-YYYY "));
  }, [ziyaretedilen]);
  if (rol == 1) {
    if (loggedIn || localStorage.getItem("token") !== null) {
      return (
        <>
          <Navbar loggedIn={giris} setLoggedIn={setGiris} />
          <div className='ziyaretci_ekle'>
            <div className='ziyaretci_ekle_input'>
              <label >Ad, Soyad: </label>
              <input value={isim} type="text" onChange={(e) => {
                setIsim(e.target.value);
              }} />
              <label >Firma: </label>
              <input value={firma} type="text" onChange={(e) => {
                setFirma(e.target.value);
              }} />
              <label >Telefon: </label>
              <input value={telefon} type="tel" onChange={(e) => {
                setTelefon(e.target.value);
              }} />
              <label >Mail: </label>
              <input value={mail} type="mail" onChange={(e) => {
                setMail(e.target.value);
              }} />
              <label >Ziyaret Tarih Aralığı: </label>Başlangıç:
              <input type="datetime-local" onChange={(e)=>{setStartDate(e.target.value)}} />Bitiş: 
              <input type="datetime-local" onChange={(e)=>{setEndDate(e.target.value)}} />
              <label >Ziyaret Ettiği Kişi: </label>
              <input value={ziyaretedilen} type="text" onChange={(e) => {
                setZiyaretedilen(e.target.value);
              }} />
              <button onClick={()=>{ziyaretci_ekle()}} >Kayıt Et</button>
            </div>
          </div>
        </>)
    } else if (!loggedIn) {
      return (
        <>
          <h1>Bu sayfayı görmek için yetkiniz yok!</h1>
          {setTimeout(() => {
            navigate("/anasayfa");
          }, 3000)}
        </>
      )
    }
  } else {
      return(
        <>
          <h1>Bu sayfayı görmek için yetkiniz yok!</h1>
          {
            setTimeout(() => {
              navigate("/ziyaretci_listele");
            }, 3000)
          }
        </>
      )

  }
  return (
    <>
      <Navbar loggedIn={giris} setLoggedIn={setGiris} />
    </>
  )
}

