import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { json, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import moment from "moment";
function Ziyaretci_listele({ loggedIn }) {
    const [data, setData] = useState(null);
    const [datac, setDatac] = useState(null);
    const [giris, setGiris] = useState();
    const [deneme, setDeneme] = useState("");
    const [giris_tarihi, setGirisTarihi] = useState("2023-03-07T");
    const [cikis_tarihi, setCikisTarihi] = useState("2023-03-07T");
    const [tarih, setTarih] = useState();
    const [ctarih, setCtarih] = useState();
    const [ktipi, setKtipi] = useState();
    const [kverildi, setKverildi] = useState();
    const navigate = useNavigate();
    const ziyaretci_listele = () => {
        axios.post("http://localhost:3001/listele", {
            data: data,
        }).then((res) => {
            setData(res.data);
        });
    };
    const ziyaretci_listelec = () => {
        axios.post("http://localhost:3001/listelec", {
            data: datac,
        }).then((res) => {
            setDatac(res.data)
        });
    };
    const yazdir = (veri) => {
        setGirisTarihi(veri.giris_tarihi);
        setCikisTarihi(veri.cikis_tarihi);
        const date1 = new Date(veri.giris_tarihi.split("T")[0])
        const date2 = new Date(veri.cikis_tarihi.split("T")[0])
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        axios.post("http://localhost:3001/kayitc", {
            data: veri,
            ktipi: ktipi,
            kverildi: kverildi,
            zaman: tarih,
            diffDays: diffDays,
        }).then((res) => {
            if (res) {
                setTarih(moment().format("hh:mm:ss DD-MM-YYYY "));
                console.log(diffDays);
                ziyaretci_listelec();
                ziyaretci_listele();
                setKtipi("");
                setKverildi("");
            } else {
                console.log("olmadı");
            }
        })
    }
    const cikisyap = (veri) => {
        setTarih(moment().format("hh:mm:ss DD-MM-YYYY "));
        t(veri);
        setDeneme(veri)
        axios.post("http://localhost:3001/kayitt", {
            veri:veri,
            tarih: tarih,
        }).then((res) => {
            if (res) {
            } else {
                console.log("olmadı");
            }
        })
    }
    const t = (veri) => {
        axios.post("http://localhost:3001/listelet", {
            veri: veri,
        }).then((res) => {
            if (res) {
                setCtarih(res.data[0].cikis_tarihi)
            } else {
                console.log("olmadı");
            }
        })
    }
    useEffect(() => {
        setTarih(moment().format("hh:mm:ss DD-MM-YYYY "));
        ziyaretci_listele();
        ziyaretci_listelec();
        setGiris(loggedIn);
    }, [])
    if (loggedIn || localStorage.getItem("token") !== null) {
        return (
            <>
                <Navbar loggedIn={giris} setLoggedIn={setGiris} />
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <h5 className='mt-2'>Giriş</h5>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>Ad,Soyad</th>
                                        <th>Telefon</th>
                                        <th>Mail</th>
                                        <th>Firma</th>
                                        <th>Kayıt Tipi</th>
                                        <th>Kart Verildi</th>
                                        <th>Ziyaret Ettiği Kişi</th>
                                        <th>Tarih Aralığı</th>
                                        <th>Çıkış</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data === null ? null : data.map((veri, key) => (
                                        <tr key={key}>
                                            <td>{veri.isim}</td>
                                            <td>{veri.telefon}</td>
                                            <td>{veri.mail}</td>
                                            <td>{veri.firma}</td>
                                            <td><input onChange={(e) => { setKtipi(e.target.value) }} type="text" style={{ width: "100px" }} /></td>
                                            <td><input onChange={(e) => { setKverildi(e.target.value) }} type="text" style={{ width: "100px" }} /></td>
                                            <td>{veri.ziyaret_ettigi_kisi}</td>
                                            <td>{veri.giris_tarihi}/{veri.cikis_tarihi}</td>
                                            <td><button onClick={() => yazdir(veri)}>Giriş Yap</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-12'>
                            <h5 className='mt-2'>Çıkış</h5>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>Ad,Soyad</th>
                                        <th>Telefon</th>
                                        <th>Mail</th>
                                        <th>Firma</th>
                                        <th>Kayıt Tipi</th>
                                        <th>Kart Verildi</th>
                                        <th>Ziyaret Ettiği Kişi</th>
                                        <th>Giriş Tarihi</th>
                                        <th>Çıkış Tarihi</th>
                                        <th>Çıkış</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datac === null ? null : datac.map((veri, key) => (
                                        <tr key={key}>
                                            <td>{veri.isim}</td>
                                            <td>{veri.telefon}</td>
                                            <td>{veri.mail}</td>
                                            <td>{veri.firma}</td>
                                            <td>{veri.kayit_tipi}</td>
                                            <td>{veri.kart_verildi}</td>
                                            <td>{veri.ziyaret_ettigi_kisi}</td>
                                            <td>{veri.tarih}</td>
                                            <td>{deneme === veri.isim ? ctarih:null}</td>
                                            <td><button onClick={() => cikisyap(veri.isim)}>Çıkış</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </>
        );
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

export default Ziyaretci_listele;