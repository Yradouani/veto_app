import React from 'react';
import { useState } from 'react';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import { AiOutlineCopyrightCircle } from "react-icons/ai";

const Home = () => {
    const [signUp, setSignUp] = useState(true);
    const [success, setSuccess] = useState(false);


    return (
        <div className='home'>
            <div className='primary-part'>
                <div className='logo-container'>
                    <img src="logo.png" alt="logo" className='logo' />
                    <p>La première application de rappel de vaccin automatisé</p>
                </div>
                <img src="imc.png" alt="vétérianire" />
                <p className='copyright'>Copyright <AiOutlineCopyrightCircle /> 2022, Véto'app. All rights reserved</p>
            </div>
            <div className='second-part'>
                <div className='connect_modal'>
                    {success ?
                        (
                            <h2>Formulaire validé ! <br />
                                Veuillez maintenant vous connecter
                            </h2>
                        )
                        :
                        ""
                    }
                    <div className="header_btn">
                        <button style={{
                            background: signUp ? "white" : "#f8f8f8",
                            color: signUp ? "#63696e" : "#63696e",
                            display: success ? 'none' : 'bloc'
                        }}
                            onClick={() => setSignUp(true)}>S'inscrire</button>

                        <button style={{
                            background: signUp ? "#f8f8f8" : "white",
                            color: signUp ? "#63696e" : "#63696e"
                        }}
                            onClick={() => setSignUp(false)}>Se connecter</button>
                    </div>
                    {signUp ? <SignUp success={success} setSuccess={setSuccess} setSignUp={setSignUp} /> : <Login />}
                </div>
            </div>
        </div>
    );
};

export default Home;