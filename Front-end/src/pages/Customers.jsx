import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import { AiFillPlusCircle } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { CgDanger } from "react-icons/cg";
import { BsPencilSquare } from "react-icons/bs";
import { BsCheckLg } from "react-icons/bs";
import { useNavigate } from 'react-router-dom'
// import AuthContext from '../context/AuthProvider';

const Customers = () => {
    const navigate = useNavigate();
    const errRef = useRef();
    const [charge, setCharge] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [clients, setClients] = useState([]);
    const [errMsg, setErrMsg] = useState("");

    // const { auth } = useContext(AuthContext);
    // console.log(auth.id);
    const id = localStorage.getItem('userId');

    const ADD_CLIENT_URL = '/user/client';
    const GET_CLIENTS = 'user/veterinary/';

    //REGEX
    const USER_REGEX = /^[a-zA-Z][a-zA-Z-éÉèÈàÀùÙâÂêÊîÎôÔûÛïÏëËüÜçÇ]{2,24}$/;
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%£§&]).{8,24}$/;
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const ADDRESS_REGEX = /^[a-zA-Z-éÉèÈàÀùÙâÂêÊîÎôÔûÛïÏëËüÜçÇ\s\d\/]*\d[a-zA-Z-éÉèÈàÀùÙâÂêÊîÎôÔûÛïÏëËüÜçÇ\s\d\/]*$/;
    const PHONE_REGEX = /^[0-9]{10}$/;


    const [firstname, setFirstname] = useState('');
    const [validFirstname, setValidFirstname] = useState(false);
    const [firstnameFocus, setFirstnameFocus] = useState(false);

    const [lastname, setLastname] = useState('');
    const [validLastname, setValidLastname] = useState(false);
    const [lastnameFocus, setLastnameFocus] = useState(false);

    const [address, setAddress] = useState('');
    const [validAddress, setValidAddress] = useState(false);
    const [addressFocus, setAddressFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [phone, setPhone] = useState('');
    const [validPhone, setValidPhone] = useState(false);
    const [phoneFocus, setPhoneFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    useEffect(() => {
        const result = USER_REGEX.test(firstname);
        setValidFirstname(result);
        //eslint-disable-next-line
    }, [firstname])

    useEffect(() => {
        const result = USER_REGEX.test(lastname);
        setValidLastname(result);
        //eslint-disable-next-line
    }, [lastname])

    useEffect(() => {
        const result = ADDRESS_REGEX.test(address);
        setValidAddress(result);
        //eslint-disable-next-line
    }, [address])

    useEffect(() => {
        const result = PHONE_REGEX.test(phone);
        console.log(result);
        console.log(phone);
        setValidPhone(result);
        //eslint-disable-next-line
    }, [phone])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        console.log(result);
        console.log(email);
        setValidEmail(result);
        //eslint-disable-next-line
    }, [email])

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        //eslint-disable-next-line
    }, [pwd])

    useEffect(() => {
        chargeClients();
    }, [openModal])

    const chargeClients = () => {

        axios.get(GET_CLIENTS + id + '/clients')
            .then(function (response) {
                console.log(response.data);
                setClients(response.data);
                console.log(clients);
                setCharge(true);
            }
            )
            .catch(err => console.log(err))
    }

    const deleteClient = (idClient) => {
        let clientSelected = clients.filter(i => i.id !== idClient);
        console.log(clientSelected)
        setClients(clientSelected);

        try {
            axios.delete("/client/" + idClient)
                .then(function (response) {
                    console.log(response.data);
                    console.log(clients);
                }
                )
                .catch(err => console.log(err))
        } catch (err) {

        }

    }

    const showCustomerProfile = (id) => {
        navigate(`/profil_client/id=${id}`);
    }

    const resetInfosClient = () => {
        setFirstname("");
        setLastname("");
        setAddress("");
        setEmail("");
        setPhone("");
        setPwd("");
        document.querySelector('#firstname').value = "";
        document.querySelector('#lastname').value = "";
        document.querySelector('#address').value = "";
        document.querySelector('#email').value = "";
        document.querySelector('#phone').value = "";
        document.querySelector('#pwd').value = "";
    }
    const addNewClient = async (e) => {
        e.preventDefault();

        if (validFirstname && validLastname && validEmail && validPwd && validAddress && validPhone) {
            try {
                const response = await axios.post(
                    ADD_CLIENT_URL,
                    JSON.stringify({ firstname, lastname, address, email, phone, pwd, veterinary_id: id }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        // withCredentials: true
                    }
                );
                console.log(response.data);
                console.log(JSON.stringify(response));

                setOpenModal(false);
                resetInfosClient();
            } catch (err) {
                console.log(err);
                if (err.response?.status === 422) {
                    setErrMsg('Email déjà utilisé');
                    setValidEmail(false);
                } else {
                    setErrMsg('Formulaire invalide');
                }

            }
        } else {
            console.log("Formulaire invalide");
            return;
        }

    }

    return (
        <div className='customer'>
            <img src="Untitled(1).png" alt="" className='background' />
            <Navbar />
            <div className='page_content'>
                <div className={openModal ? 'open_modal' : 'close_modal'}>
                    <div className='modal_header'>
                        <h2>Ajouter un nouveau client</h2>
                        <ImCross onClick={() => {
                            setOpenModal(false);
                            setErrMsg("");
                            resetInfosClient();
                        }} />
                    </div>
                    <form onSubmit={(e) => addNewClient(e)}>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                            {errMsg}
                        </p>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <label htmlFor="firstname">Prénom * :
                                            <span className={validFirstname ? "valid" : "hide"}>
                                                <BsCheckLg />
                                            </span>
                                            <span className={validFirstname || !firstname ? "hide" : "invalid"}>
                                                <ImCross />
                                            </span>
                                        </label>

                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            id="firstname"
                                            required
                                            autoComplete='off'
                                            aria-invalid={validFirstname ? "false" : "true"}
                                            aria-describedby="firstnamenote"
                                            onChange={(e) => setFirstname(e.target.value)}
                                            onFocus={() => setFirstnameFocus(true)}
                                            onBlur={() => setFirstnameFocus(false)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" id="firstnamenote" className={firstnameFocus && firstname && !validFirstname ? "instructions" : "offscreen"}>
                                        <CgDanger className='danger' />
                                        Entre 3 et 23 lettres
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label htmlFor="lastname">Nom * :
                                            <span className={validLastname ? "valid" : "hide"}>
                                                <BsCheckLg />
                                            </span>
                                            <span className={validLastname || !lastname ? "hide" : "invalid"}>
                                                <ImCross />
                                            </span>
                                        </label>

                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            id="lastname"
                                            required
                                            autoComplete='off'
                                            aria-invalid={validLastname ? "false" : "true"}
                                            aria-describedby="lastnamenote"
                                            onChange={(e) => setLastname(e.target.value)}
                                            onFocus={() => setLastnameFocus(true)}
                                            onBlur={() => setLastnameFocus(false)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" id="lastnamenote" className={lastnameFocus && lastname && !validLastname ? "instructions" : "offscreen"}>
                                        <CgDanger className='danger' />
                                        Entre 3 et 23 lettres
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label htmlFor="address">Adresse * :
                                            <span className={validAddress ? "valid" : "hide"}>
                                                <BsCheckLg />
                                            </span>
                                            <span className={validAddress || !address ? "hide" : "invalid"}>
                                                <ImCross />
                                            </span></label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            id="address"
                                            required
                                            autoComplete='off'
                                            aria-invalid={validAddress ? "false" : "true"}
                                            aria-describedby="addressnote"
                                            onChange={(e) => setAddress(e.target.value)}
                                            onFocus={() => setAddressFocus(true)}
                                            onBlur={() => setAddressFocus(false)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" id="addressnote" className={addressFocus && address && !validAddress ? "instructions" : "offscreen"}>
                                        <CgDanger className='danger' />
                                        Veuillez saisir une adresse correcte
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label htmlFor="email">Email * :
                                            <span className={validEmail ? "valid" : "hide"}>
                                                <BsCheckLg />
                                            </span>
                                            <span className={validEmail || !email ? "hide" : "invalid"}>
                                                <ImCross />
                                            </span>
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            autoComplete='off'
                                            aria-invalid={validEmail ? "false" : "true"}
                                            aria-describedby="emailnote"
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => setEmailFocus(true)}
                                            onBlur={() => setEmailFocus(false)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                        <CgDanger className='danger' />
                                        Veuillez saisir un email correct
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <label htmlFor="phone">Numéro de téléphone * :
                                            <span className={validPhone ? "valid" : "hide"}>
                                                <BsCheckLg />
                                            </span>
                                            <span className={validPhone || !phone ? "hide" : "invalid"}>
                                                <ImCross />
                                            </span>
                                        </label>

                                    </td>
                                    <td>
                                        <input
                                            type="tel"
                                            id="phone"
                                            required
                                            autoComplete='off'
                                            aria-invalid={validPhone ? "false" : "true"}
                                            aria-describedby="phonenote"
                                            onChange={(e) => setPhone(e.target.value)}
                                            onFocus={() => setPhoneFocus(true)}
                                            onBlur={() => setPhoneFocus(false)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" id="phonenote" className={phoneFocus && phone && !validPhone ? "instructions" : "offscreen"}>
                                        <CgDanger className='danger' />
                                        Veuillez saisir un numéro de téléphone de 10 chiffres
                                    </td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="pwd">Mot de passe * :
                                        <span className={validPwd ? "valid" : "hide"}>
                                            <BsCheckLg />
                                        </span>
                                        <span className={validPwd || !pwd ? "hide" : "invalid"}>
                                            <ImCross />
                                        </span>
                                    </label></td>
                                    <td><input
                                        type="password"
                                        id="pwd"
                                        required
                                        aria-invalid={validPwd ? "false" : "true"}
                                        aria-describedby="passwordnote"
                                        onChange={(e) => setPwd(e.target.value)}
                                        onFocus={() => setPwdFocus(true)}
                                        onBlur={() => setPwdFocus(false)}
                                    /></td>
                                </tr>
                                <tr >
                                    <td colspan="2" id="passwordnote" className={pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"}>
                                        <CgDanger className='danger' />
                                        8 caractères min, dont 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <input type="submit" value="Ajouter" />
                    </form>
                </div>

                <header>
                    <h1>Gérez vos clients</h1>
                    {(clients.length !== 0) ? (
                        <div className='add_new_client'>
                            <div className='add_new_client_content' onClick={() => setOpenModal(true)}>
                                <AiFillPlusCircle />
                                <span>Ajouter un nouveau client</span>
                            </div>
                        </div>
                    ) : ""}
                </header>

                {(clients.length !== 0) ? (
                    <div className='orders_content'>
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th scope="col">Prénom</th>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Adresse e-mail</th>
                                    <th scope="col">Date d'inscription</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map(client => {
                                    return (
                                        <tr key={client.id}>
                                            <td><button onClick={() => showCustomerProfile(client.id)}>Voir la fiche</button></td>
                                            <td>{client.firstname}</td>
                                            <td>{client.lastname}</td>
                                            <td>{client.email}</td>
                                            <td>{client.created_at}</td>
                                            {/* <td className='update_btn'><BsPencilSquare /></td> */}
                                            <td onClick={() => deleteClient(client.id)} className='delete_btn'><FaTrashAlt /></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className='noclient-content'>
                        <p>Vous n'avez aucun clients dans votre espace</p>
                        <div className='add_new_client'>
                            <div className={openModal ? "none" : "add_new_client_content"} onClick={() => setOpenModal(true)}>
                                <AiFillPlusCircle />
                                <span>Ajouter un nouveau client</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Customers;