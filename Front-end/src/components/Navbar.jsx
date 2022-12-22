import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUsers, FaPowerOff } from "react-icons/fa";
import { AiFillDashboard, AiOutlineSearch } from "react-icons/ai";
import { MdDateRange } from "react-icons/md";
import { MdPets } from "react-icons/md";
import AuthContext from '../context/AuthProvider';
import { useState } from 'react';

const Navbar = () => {
    const { auth } = useContext(AuthContext);
    const [openModal, setOpenModal] = useState(false);

    const type = localStorage.getItem('type');
    const navigate = useNavigate();

    const deconnection = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className='navbar'>
            {openModal ? (
                <div className='open-modal'>
                    <span>Êtes-vous sûr de vouloir vous déconnecter ?</span>
                    <div className='btn-container'>
                        <button onClick={() => deconnection()}>Valider ma déconnexion</button>
                        <button onClick={() => setOpenModal(false)}>Annuler</button>
                    </div>
                </div>
            ) : ""}
            <img src="../../logo.png" alt="logo" className='logo' />
            {/* <div id="search_field">
                <AiOutlineSearch />
                <input type="text" name="search" id="search_field_input" placeholder="Rechercher" maxlength="20" />
            </div> */}
            <ul>
                <NavLink to="/page_accueil" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                    <li><AiFillDashboard /> Accueil</li>
                </NavLink>
                {type === "veterinary" ? (
                    <NavLink to="/clients" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                        <li><FaUsers /> Mes clients</li>
                    </NavLink>
                ) : ""}
                <NavLink to="/animaux" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                    <li><MdPets /> Mes animaux</li>
                </NavLink>
                {type === "client" ? (
                    <NavLink to="/rendez-vous" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                        <li><MdDateRange /> Mes rendez-vous</li>
                    </NavLink>
                ) : ""}
                <NavLink onClick={() => setOpenModal(true)}>
                    <li><FaPowerOff /></li>
                </NavLink>
            </ul>
        </div>
    );
};

export default Navbar;