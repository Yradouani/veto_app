import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useState } from 'react';
import { AiFillPlusCircle, AiOutlineSearch } from "react-icons/ai";

const Animals = () => {
    const [animals, setAnimals] = useState([]);
    const navigate = useNavigate();
    const id = localStorage.getItem('userId');
    const type = localStorage.getItem('type');
    const [data, setData] = useState();
    const [emailVeterinary, setEmailVeterinary] = useState("");
    const [clientId, setClientId] = useState("");
    const [veterinaryId, setVeterinaryId] = useState("");
    const [search, setSearch] = useState("");

    const GET_ANIMALS = "/user/veterinary/";

    useEffect(() => {
        getAnimals();
        getClientInfo();
        getVeterinaryInfo();
        getInfosClientIfVeterinary();
    }, [])

    useEffect(() => {
        getInfosClientIfVeterinary();
    }, [animals]);

    const getAnimals = () => {
        if (type === "veterinary") {
            axios.get(GET_ANIMALS + id + '/animals')
                .then(function (response) {
                    console.log(response.data);
                    setAnimals(response.data);
                    console.log(animals);
                    setClientId(response.data[0].client_id);
                }
                )
                .catch(err => console.log(err))
        } else if (type === "client") {
            axios.get("user/client/" + id + "/animals")
                .then(function (response) {
                    console.log(response.data);
                    setAnimals(response.data);
                    console.log(animals);
                }
                )
                .catch(err => console.log(err))
        }
    };

    const getClientInfo = () => {
        if (type === "client") {
            console.log("coucou")
            axios.get("/user/client/" + id)
                .then(function (response) {
                    const infos = response.data;
                    console.log(response.data.veterinary_id);
                    setData(infos);
                    setVeterinaryId(infos.veterinary_id);
                })
                .catch(err => console.log(err))
        }
    }

    const getInfosClientIfVeterinary = () => {
        if (type === "veterinary") {
            console.log("coucou")
            if (clientId) {
                axios.get("/user/client/" + clientId)
                    .then(function (response) {
                        const clientinfos = response.data;
                        console.log(response.data)
                        setData(clientinfos);
                    })
                    .catch(err => console.log(err))
            }
        }
    }
    console.log(data);

    const getVeterinaryInfo = () => {
        if (type === "client") {
            console.log(data)
            axios.get("/user/veterinary/" + veterinaryId)
                .then(function (response) {
                    console.log(response.data);
                    const infos = response.data;
                    console.log(infos[0].email)
                    setEmailVeterinary(infos[0].email);
                })
                .catch(err => console.log(err))
            console.log(emailVeterinary);
        }
    }

    const deleteAnimal = (id_animal) => {
        let animalSelected = animals.filter(i => i.id !== id_animal);
        setAnimals(animalSelected);

        axios.delete("/animal/" + id_animal)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(err => console.log(err))
        console.log(animals);
    };

    const redirectToAnimalProfil = (id) => {
        navigate(`/profil_animal/id=${id}`);
    };

    return (
        <div className='animals'>
            <img src="Untitled(1).png" alt="" className='background' />
            <Navbar />
            <h1>Mes animaux</h1>
            <div id="search_field">
                <AiOutlineSearch />
                <input
                    type="text"
                    name="search"
                    id="search_field_input"
                    placeholder="Rechercher"
                    maxlength="20"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {(animals.length !== 0) ? (
                <div className='global_cards_container'>
                    {
                        animals?.filter((item) => {
                            return search.toLocaleLowerCase() === '' ?
                                item : item.name.toLocaleLowerCase().includes(search);
                        }).map(animal => {
                            return (
                                <div className='card_content' key={animal.id}>
                                    <div className='card_content_container'>
                                        <h2>{animal.name}</h2>
                                        <div className='card_infos'>
                                            <div><span>Propriétaire : </span>{data?.firstname} {data?.lastname}</div>
                                            <div><span>Type : </span>{animal.type}</div>
                                            <div><span>Sexe : </span>{animal.sexe}</div>
                                            <div><span>Date de naissance : </span>{animal?.date_of_birth?.split('-').reverse().join('/')}</div>
                                            <div className='btn_container'>
                                                {(type === "veterinary") ? (
                                                    <div>
                                                        <button onClick={() => redirectToAnimalProfil(animal.id)}>Modifier</button>
                                                        <button onClick={() => deleteAnimal(animal.id)}>Supprimer</button>
                                                    </div>
                                                ) :
                                                    <button onClick={() => redirectToAnimalProfil(animal.id)}>Accéder au carnet de santé</button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            ) : (
                <div className='noanimal-content'>
                    <p>Vous n'avez aucun animal dans votre espace</p>
                    <div className='add_new_animal'>
                        {(type === "veterinary") ? (
                            <div className='add_new_client_content'>
                                <div ><AiFillPlusCircle /></div >
                                <div>Ajouter un nouvel animal</div >
                            </div>
                        ) : (
                            <div>
                                <a href={"mailto:" + emailVeterinary}>
                                    Demandez à votre vétérinaire d'ajouter un animal ?
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Animals;