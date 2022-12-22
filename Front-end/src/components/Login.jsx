import React from 'react';
import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "../context/AuthProvider";
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom'

const Login = () => {
    // const { auth, setAuth } = useContext(AuthContext);
    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();

    //Connection constant
    const LOGIN_URL = '/user/login';

    //Focus sur le premier élément au chargement de la page
    useEffect(() => {
        emailRef.current.focus();
    }, [])


    //Enlever le msg d'erreur si l'utilisateur entre des données
    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({ email, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    // withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.token;
            const userId = response?.data?.user.id;
            const isClient = response?.data?.user.isClient;
            console.log(isClient);
            let type;

            if (isClient) {
                type = 'client';
            } else {
                type = 'veterinary';
            }
            // const firstname = response?.data?.user.firstname;
            console.log(accessToken, type);

            // const redirection = await setAuth({ email, accessToken, isClient, userId, firstname });
            // console.log(redirection);

            // console.log(auth.isClient);
            // console.log(auth.userId);
            console.log(type);
            localStorage.setItem('userId', userId);
            localStorage.setItem('type', type);
            localStorage.setItem('accessToken', accessToken);
            navigate('/page_accueil');

        } catch (err) {
            console.log(err);
            if (!err?.response) {
                setErrMsg('Pas de réponse du serveur');
            } else if (err.response?.status === 400) {
                setErrMsg("Veuillez entrer votre email ET votre mot de passe");
            } else if (err.response?.status === 401) {
                setErrMsg("Email et/ou mot de passe incorrect");
            } else {
                setErrMsg('Connexion échouée')
            }
            errRef.current.focus();
        }

    }

    return (
        <div className='login'>
            <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
            >
                {errMsg}
            </p>
            <form onSubmit={e => handleRegister(e)}>
                <table>
                    <tbody>
                        <tr>
                            <td><label htmlFor="email">Email * : </label></td>
                            <td><input
                                type="email"
                                id="email"
                                required
                                ref={emailRef}
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="password">Mot de passe * : </label></td>
                            <td><input
                                type="password"
                                id="password"
                                required
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                            /></td>
                        </tr>
                    </tbody>
                </table>
                <div className='signup_submit'>
                    <input type="submit" value="Se connecter" />
                </div>
            </form>
        </div>
    );
};

export default Login;