import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import { AiOutlineArrowLeft } from "react-icons/ai";

const AnimalProfil = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const type = localStorage.getItem('type');
    const veterinary_id = localStorage.getItem('userId');
    const [animalInfos, setAnimalInfos] = useState([]);
    const [proprioInfos, setProprioInfos] = useState([]);
    const GET_ANIMAL = '/animal/';
    const [clientId, setClientId] = useState();
    const [veterinaryData, setVeterinaryData] = useState();
    const [modal, setModal] = useState(false);
    const [vaccineDate, setVaccineDate] = useState();
    const [vaccineAppointment, setVaccineAppointment] = useState([]);

    const [edit, setEdit] = useState();
    const [editName, setEditName] = useState();
    const [editSexe, setEditSexe] = useState();
    const [editWeight, setEditWeight] = useState();
    const [editSize, setEditSize] = useState();

    useEffect(() => {
        getDataAnimal();
        veterinaryInfo();
        getLastDateOfVaccine();
    }, []);

    useEffect(() => {
        getLastDateOfVaccine();
    }, [vaccineDate])

    useEffect(() => {
        if (clientId) {
            console.log(clientId);
            axios.get("/user/client/" + clientId)
                .then(function (response) {
                    console.log(response.data);
                    setProprioInfos(response.data)
                }
                )
                .catch(err => console.log(err))
        }
    }, [clientId])

    const getDataAnimal = () => {

        axios.get(GET_ANIMAL + id)
            .then(function (response) {
                console.log(response.data);
                setAnimalInfos(response.data);
                setClientId(response.data.client_id);
                console.log(clientId);
            }
            )
            .catch(err => console.log(err))
    }

    const getProprioAnimal = (id_client) => {
        // if (id_client) {
        //     console.log(id_client);
        //     axios.get("/user/client/" + id_client)
        //         .then(function (response) {
        //             console.log(response.data);
        //             setProprioInfos(response.data)
        //         }
        //         )
        //         .catch(err => console.log(err))
        // }
    }

    const updateInfosAnimal = async () => {
        try {
            console.log(editName, editSexe, editWeight, editSize);
            console.log(animalInfos?.name, animalInfos?.sexe, animalInfos?.weight, animalInfos?.size, animalInfos?.veterinary_id, animalInfos?.client_id);
            const response = await axios.put(
                "/animal/" + animalInfos?.id,
                JSON.stringify({
                    name: (editName ? editName : animalInfos?.name),
                    sexe: (editSexe ? editSexe : animalInfos?.sexe),
                    weight: (editWeight ? editWeight : animalInfos?.weight),
                    size: (editSize ? editSize : animalInfos?.size),
                    veterinary_id: animalInfos?.veterinary_id,
                    client_id: animalInfos?.client_id
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    // withCredentials: true
                }
            );
            console.log(response.data);
            setAnimalInfos(response.data);
            setEdit(false);
        } catch (err) {
            console.log(err)
        }
    }
    const veterinaryInfo = () => {
        axios.get('/user/veterinary/' + veterinary_id)
            .then(function (response) {
                setVeterinaryData(response.data);
                console.log(response.data);
            })
            .catch(err => console.log(err))
    }
    const sendEmail = async () => {
        console.log(veterinaryData[0]?.email,
            proprioInfos?.firstname,
            proprioInfos?.lastname,
            veterinaryData[0]?.firstname,
            veterinaryData[0]?.lastname,
            animalInfos?.name,
            vaccineDate.split('-').reverse().join('/'),
            proprioInfos?.email)
        try {
            const response = await axios.post(
                "/send",
                JSON.stringify({
                    author: veterinaryData[0]?.email,
                    firstnameclient: proprioInfos?.firstname,
                    lastnameclient: proprioInfos?.lastname,
                    firstnameveterinary: veterinaryData[0]?.firstname,
                    lastnameveterinary: veterinaryData[0]?.lastname,
                    nameAnimal: animalInfos?.name,
                    date: vaccineDate.split('-').reverse().join('/'),
                    emailClient: proprioInfos?.email
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    // withCredentials: true
                }
            );
            console.log(response.data);
            setModal(false);
            console.log(vaccineDate)
            createNewAppointment();
        } catch (err) {
            console.log(err)
        }
    }

    const createNewAppointment = async () => {
        try {
            console.log(vaccineDate, veterinary_id, id)
            if (vaccineDate) {
                const response = await axios.post(
                    "/appointments",
                    JSON.stringify({
                        appointment_object: (vaccineDate ? "Vaccination" : ""),
                        isVaccin: (vaccineDate ? true : false),
                        date_of_appointment: vaccineDate,
                        veterinary_id: veterinary_id,
                        animal_id: id,
                        client_id: clientId
                    }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        // withCredentials: true
                    }
                );
                console.log(response.data);
                getLastDateOfVaccine();
            }
        } catch (err) {
            console.log(err)
        }
    }
    const getLastDateOfVaccine = () => {
        axios.get("/animal/" + id + "/appointment/vaccine")
            .then(function (response) {
                console.log(response.data);
                setVaccineAppointment(response.data);
                console.log(vaccineAppointment);
            }
            )
            .catch(err => console.log(err))
    }

    const returnToClientProfil = () => {
        navigate(`/page_accueil`);
    }

    return (
        <div className='animal_profil'>
            <img src="../../Untitled(1).png" alt="" className='background' />
            <Navbar />
            <h1>Carnet de santé de {animalInfos.name}</h1>

            <div className='profil_content'>
                <div className='profil_infos'>
                    <div><span>Propriétaire : </span>{proprioInfos.firstname} {proprioInfos.lastname}</div>
                    <div><span>Nom : </span>{edit ? (
                        <input
                            type="text"
                            defaultValue={editName ? editName : animalInfos?.name}
                            onChange={(e) => setEditName(e.target.value)}
                        />
                    ) : (animalInfos.name)}</div>
                    <div><span>Type : </span>{animalInfos.type}</div>
                    <div><span>Date de naissance : </span>{animalInfos?.date_of_birth?.split('-').reverse().join('/')}</div>
                    <div><span>Sexe : </span>{edit ? (
                        <input
                            type="text"
                            defaultValue={editSexe ? editSexe : animalInfos?.sexe}
                            onChange={(e) => setEditSexe(e.target.value)}
                        />
                    ) : (animalInfos.sexe)}</div>

                    <div><span>Poids : </span>{edit ? (
                        <input
                            type="text"
                            defaultValue={editWeight ? editWeight : animalInfos?.weight}
                            onChange={(e) => setEditWeight(e.target.value)}
                        />
                    ) : (animalInfos.weight)} g</div>

                    <div><span>Taille : </span>{edit ? (
                        <input
                            type="text"
                            defaultValue={editSize ? editSize : animalInfos?.size}
                            onChange={(e) => setEditSize(e.target.value)}
                        />
                    ) : (animalInfos.size)} cm</div>
                    <div><span>Antécédents médicaux : </span>RAS</div>
                    <div><span>Date du prochain vaccin : </span>
                        <span className={vaccineAppointment.length > 0 ? 'vaccine_date' : 'no_vaccine_date'}>
                            {vaccineAppointment.length > 0 ?
                                vaccineAppointment[0].date_of_appointment.split('-').reverse().join('/')
                                : "Pas de date prévue"}
                        </span>
                    </div>
                    {(type === "veterinary") ?
                        (<div className='btn_container'>
                            {edit ?
                                (<div className='btn_update'>
                                    <button onClick={() => updateInfosAnimal()}>Valider</button>
                                    <button onClick={() => setEdit(false)}>Annuler</button>
                                </div>)
                                : <button onClick={() => setEdit(true)}>Modifier le carnet</button>
                            }
                            <button onClick={() => setModal(true)}>Envoyer un rappel Vaccinal</button>
                        </div>
                        ) : ""}
                </div>
            </div>

            <div className='return' onClick={() => returnToClientProfil()}>
                <AiOutlineArrowLeft />
                <span>Retourner à la fiche client</span>
            </div>
            {modal ? (
                <div className='modal'>
                    <h3>Choissisez la date du rappel vaccinal</h3>
                    <input
                        type="date"
                        name=""
                        id=""
                        onChange={(e) => setVaccineDate(e.target.value)}
                    />
                    <div className='btn-container'>
                        <button onClick={() => sendEmail()}>Valider</button>
                        <button onClick={() => setModal(false)}>Annuler</button>
                    </div>
                </div>
            ) : ""}
        </div>
    );
};

export default AnimalProfil;