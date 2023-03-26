import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser,faEyeSlash,faEye} from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login( {loggedIn, setLoggedIn, userRol, setUserRol}){
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [yanlis, setYanlis] = useState(true);
  const [passwordInput, setPassowordInput] = useState('password');
  const [eye, setEye] = useState(faEyeSlash);
  const navigate = useNavigate();
  //girilen inputları nodejs tarafına post etme
  const girisyap = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/giris",{
      mail: mail,
      password: password
    }).then((res) => {
      if(!res.data.auth){
        setYanlis(false);
        setLoggedIn(false)
      }else{
        localStorage.setItem("kullanici",res.data.result[0].kullanici_adi);
        localStorage.setItem("rol",res.data.result[0].rol);
        localStorage.setItem("token", res.data.token);
        setLoggedIn(true)
        setYanlis(true);
        navigate("/ziyaretci_listele");
      }
    });
  }
  //password icon şifre gör ve göre değiştirme
  const degistir = () => {
    if(passwordInput === "password"){
      setPassowordInput("text");
      setEye(faEye)
      return;
    }else{
      setPassowordInput("password");
      setEye(faEyeSlash)
    }
    return;
  }
  if(localStorage.getItem("token") === null){
    return(
        <>
        <div className="login">
        <form action="#">
          <label className='baslik'>Proje X'e hoşgeldiniz.</label>
          <label className='altbaslik'>Giriş yapmak için kullanici adi ve şifre girin.</label>
          {!yanlis ? <h1 className='login_yanlis'>Yanlış Kullanıcı adı veya Şifre!</h1>: null}
          <div className="username">
            <label className='userbaslik'>Kullanici Adi</label>
            <FontAwesomeIcon icon={faUser} id='user-icon'  />
            <input onChange={(e)=>{
              setMail(e.target.value);
            }} type="text" id='userinput'/>
          </div>
          <div className="password">
            <label className='passwordbaslik' >Şifre</label>
            <FontAwesomeIcon icon={eye} id='password-icon' onClick={degistir} />
            <input onChange={(e)=>{
              setPassword(e.target.value);
            }} type={passwordInput} id='passwordinput'/>
          </div>
          <div className="login-btn">
            <button onClick={girisyap} className='btn btn-info' id='pwd-btn' >Giriş Yap</button>
          </div>
        </form>
        </div>
        </>
    )}else{
       return (
        <>
        <h1>Zaten giriş yapıldı.</h1>
        {setTimeout(() => {
          navigate("/ziyaretci_listele");
        }, 3000)}
       </>
       )
    }
}
export default Login;