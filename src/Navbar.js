import React, { useEffect } from 'react';
import './App.css';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUserPlus, faUser, faRightFromBracket, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Navbar({ loggedIn, setLoggedIn }) {
    const navigate = useNavigate();
    const kullanici = localStorage.getItem("kullanici");
    const cikisyap = () => {
        localStorage.removeItem("token");
        setLoggedIn(false);
        console.log("geldi")
        setTimeout(() => {
            navigate("/anasayfa");
        }, 3000)
    }
    useEffect(()=>{
    },[])
    return (
        <SideNav>
            <SideNav.Toggle />
            <SideNav.Nav defaultSelected="home">
                <NavItem>
                    <NavText style={{paddingLeft: "10%"}}>{kullanici}</NavText>
                </NavItem>
                <NavItem onSelect={() => navigate("/anasayfa")}>
                    <NavIcon><FontAwesomeIcon icon={faHome}></FontAwesomeIcon></NavIcon>
                    <NavText>Anasayfa</NavText>
                </NavItem>
                <NavItem onSelect={() => navigate("/kullanici_ekle")}>
                    <NavIcon><FontAwesomeIcon icon={faUsers}></FontAwesomeIcon></NavIcon>
                    <NavText>Kullanıcı Ekle</NavText>
                </NavItem>
                <NavItem onSelect={() => navigate("/ziyaretci_ekle")}>
                    <NavIcon><FontAwesomeIcon icon={faUserPlus} /></NavIcon>
                    <NavText>Ziyaretçi Ekle</NavText>
                </NavItem>
                <NavItem onSelect={() => navigate("/ziyaretci_listele")}>
                    <NavIcon><FontAwesomeIcon icon={faUser} /></NavIcon>
                    <NavText>Ziyaretçi Listele</NavText>
                </NavItem>
                <NavItem onSelect={cikisyap}>
                    <NavIcon><FontAwesomeIcon icon={faRightFromBracket} /></NavIcon>
                    <NavText>Çıkış Yap</NavText>
                </NavItem>
            </SideNav.Nav>
        </SideNav>
    );
}

export default Navbar;