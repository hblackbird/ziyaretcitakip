const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'ziyarett'
})


app.post("/giris", async function (req, res) {
    let username = req.body.mail;
    let password = req.body.password;
    db.query('SELECT * FROM kullanici WHERE kullanici_adi=? ', [username], async function (error, results, fields) {
        if (!results[0]) {
            res.json({ auth: false })
        } else {
            dbsifre = results[0].sifre;
            deneme = await bcrypt.compare(password, dbsifre);
            if (username && deneme) {
                db.query('SELECT * FROM kullanici WHERE kullanici_adi=? AND sifre=?', [username, dbsifre], function (error, results, fields) {
                    if (error) console.log(error);
                    if (results.length > 0) {
                        req.session.username = username;
                        const id = results[0].idkullanici;
                        const kadi = results[0].kullanici_adi;
                        const rol = results[0].rol;
                        const token = jwt.sign({ id, rol }, "jwtsecret", {
                            expiresIn: 300,
                        })
                        res.json({ auth: true, token: token, result: results })
                    } else {
                        res.send('Yanlış kullanıcı adı veya şifre');
                    }
                });
            } else {
                res.send('Bir kullanıcı adı ve şifre giriniz.');
                res.end();
            }
        }
    })

});

app.post("/kullanici_ekle", async function (req, res) {
    let isim = req.body.isim;
    let password = req.body.password;
    let rol = req.body.rol;
    if (rol === "admin") {
        rol = 1;
    } else {
        rol = 0;
    }
    let hpassword = await bcrypt.hash(password, 10);
    if ((isim && password) === "") {
        res.send(false);
    } else {
        db.query(
            "INSERT INTO kullanici(kullanici_adi, sifre, rol) VALUES (?,?,?)",
            [isim, hpassword, rol], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(true);
                }
            });
    }
});

app.post("/kayit", (req, res) => {
    const isim = req.body.isim;
    const firma = req.body.firma;
    const telefon = req.body.telefon;
    const mail = req.body.mail;
    const giris_tarihi = req.body.baslangic;
    const bitis_tarihi = req.body.bitis;
    const ziyaret_edilen = req.body.ziyaret_edilen;
    const zaman = req.body.zaman;
    if ((isim && firma && telefon && mail && giris_tarihi && bitis_tarihi && ziyaret_edilen) === "") {
        res.send(false);
    } else {
        db.query(
            "INSERT INTO ziyaretci(isim, firma, telefon, mail, giris_tarihi, cikis_tarihi, ziyaret_ettigi_kisi) VALUES (?,?,?,?,?,?,?)",
            [isim, firma, telefon, mail, giris_tarihi, bitis_tarihi, ziyaret_edilen], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(true);
                }
            });
    }
});

app.post("/kullanici_guncelle", (req, res) => {
    const isim = req.body.isim
    let rol = req.body.rol
    if (rol === "admin") {
        rol = 1;
    } else {
        rol = 0;
    }
    let a;
    db.query("SELECT idkullanici FROM kullanici WHERE kullanici_adi=?", [isim], (err, res) => {
        if (err) {
            console.log(err);
        } else {
            setkid(res[0].idkullanici);
        }
    });
    function setkid(deger) {
        a = deger;
        const query = `UPDATE kullanici SET kullanici_adi="${isim}", rol=${rol} WHERE idkullanici=${a}`;
        db.query(query, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.send(true);
            }
        })
    }
});

app.post("/kullanici_sil", (req, res) => {
    const kadi = req.body.isim;
    const query = `DELETE FROM kullanici WHERE kullanici_adi="${kadi}"`;
    db.query(query, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(true);
        }
    }
    )
});


app.post("/kayitc", (req, res) => {
    const id = req.body.data.id;
    const isim = req.body.data.isim;
    const firma = req.body.data.firma;
    const telefon = req.body.data.telefon;
    const mail = req.body.data.mail;
    const kayit_tipi = req.body.ktipi;
    const kart_verildi = req.body.kverildi;
    const ziyaret_ettigi_kisi = req.body.data.ziyaret_ettigi_kisi;
    const zaman = req.body.zaman;
    let difftime = req.body.diffDays;
    if (kayit_tipi === "" && kart_verildi === "") {
    } else {
        if (difftime < 1) {
            db.query(
                'DELETE FROM ziyaretci WHERE id = ' + id,
                function (err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(res);
                    }
                }
            )
            db.query(
                "INSERT INTO ziyaretcic(idc, isim, firma, telefon, mail, kayit_tipi, kart_verildi, ziyaret_ettigi_kisi, tarih) VALUES (?,?,?,?,?,?,?,?,?)",
                [id, isim, firma, telefon, mail, kayit_tipi, kart_verildi, ziyaret_ettigi_kisi, zaman], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(true);
                    }
                });
            difftime = difftime - 1;
        } else {
            db.query(
                "INSERT INTO ziyaretcic(idc, isim, firma, telefon, mail, kayit_tipi, kart_verildi, ziyaret_ettigi_kisi, tarih) VALUES (?,?,?,?,?,?,?,?,?)",
                [id, isim, firma, telefon, mail, kayit_tipi, kart_verildi, ziyaret_ettigi_kisi, zaman], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(true);
                    }
                })
            difftime = difftime - 1;
        }
    }
})

app.post("/kayitt", (req, res) => {
    const tarih = req.body.tarih;
    const isim = req.body.veri;
    const query = `UPDATE ziyaretcic SET cikis_tarihi="${tarih}" WHERE isim='${isim}'`
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(true);
        }
    })
})


app.post('/kullanici_listele', function (req, res) {
    db.query("SELECT * FROM kullanici", function (err, sonuc) {
        res.send(sonuc);
    });
})

app.post('/listelet', (req, res) => {
    const isim = req.body.veri;
    const query = `SELECT cikis_tarihi FROM ziyaretcic WHERE isim='${isim}'`
    db.query(query, (err, result) => {
        if (err) {
            throw err;
        } else {
            res.send(result);
        }
    })

})


app.post('/listele', function (req, res) {
    db.query("SELECT * FROM ziyaretci", function (err, sonuc) {
        res.send(sonuc);
    });
})

app.post('/listelec', function (req, res) {
    db.query("SELECT * FROM ziyaretcic", function (err, cikis) {
        res.send(cikis);
    })
})

app.listen(3001, () => {
    console.log("Calışıyor.");
});