import React from 'react';
import Navbar from '../components/Navbar';
import axios from '../api/axios';
import { useState } from 'react';
import { useEffect } from 'react';
import Loader from '../components/Loader';
// import { Inject, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, EventSettingsModel } from '@syncfusion/ej2-react-schedule';

const Appointments = () => {
    const idClient = localStorage.getItem('userId');
    const idVeterinary = localStorage.getItem('veterinary_id');
    const [appointments, setAppointments] = useState([]);
    const [veterinaryInfo, setVeterinaryInfo] = useState();
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        getAllAppointments();
        getInfoVeterinary();
    }, []);

    // useEffect(() => {
    //     getAnimalName();
    // }, [])

    const dateFormateur = (date) => {
        let days = Math.floor((new Date() - new Date(date)) / (1000 * 3600 * 24))

        if (days === 0) {
            return "Aujourd'hui";
        } else if (days > 1) {
            return "Passé";
        } else {
            return "À venir"
        }

    }
    const getInfoVeterinary = () => {
        axios.get("/user/veterinary/" + idVeterinary)
            .then(function (response) {
                console.log(response.data);
                setVeterinaryInfo(response.data);
                // setIsLoading(false);
            }
            )
            .catch(err => console.log(err))
    }
    const getAllAppointments = () => {
        axios.get("/user/client/" + idClient + "/appointment")
            .then(async function (response) {
                const modifiedAppointments = await Promise.all(
                    response.data.map(async appointment => {
                            const animalName = await getAnimalName(appointment.animal_id);
                            return {...appointment, animalName };
                        })
                )
                console.log(response.data);
                setAppointments(modifiedAppointments);
                setIsLoading(false);

            }
            )
            .catch(err => console.log(err))
    }

    const getAnimalName = async (idAnimal) => {
        try {
            const response = await
            axios.get("/animal/" + idAnimal)
                // .then(function (response) {
                    console.log(response.data.name);
                    //         setAppointments(response.data);

                    return response.data.name;
                // })
                // .catch(err => console.log(err))
        } catch (err) {
            console.log(err)
        }
    }
    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className='appointments'>
            <img src="Untitled(1).png" alt="" className='background' />
            <Navbar />
            <h1>Mes rendez-vous</h1>
            {/* <ScheduleComponent className='schedule'>
                <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
            </ScheduleComponent> */}
            {appointments ? (
                <table>
                    <thead>
                        <tr>
                            <th>Date du rendez-vous</th>
                            <th>Motif</th>
                            <th>Vétérinaire</th>
                            <th>Nom de l'animal</th>
                            <th>État</th>
                        </tr>
                    </thead>
                    {appointments?.map(appointment => {
                        console.log(veterinaryInfo);
                        // const animalName = getAnimalName(appointment?.animal_id);
                       
                        return (
                            <tbody key={appointment.id}>
                                <tr>
                                    <td colspan="4" ><hr /></td>
                                </tr>
                                <tr>
                                    {/* {name = getAnimalName(appointment?.animal_id)}{console.log(name)} */}
                                    <td>{appointment.date_of_appointment.split('-').reverse().join('/')}</td>
                                    <td>{appointment.appointment_object}</td>
                                    <td>{veterinaryInfo ? veterinaryInfo[0]?.firstname : ""} {veterinaryInfo ? veterinaryInfo[0]?.lastname : ""}</td>
                                    <td>{appointment.animalName}</td>
                                    <td
                                        className={((dateFormateur(appointment.date_of_appointment) === "À venir") || (dateFormateur(appointment.date_of_appointment) === "Aujourd'hui")) ?
                                            "futur" : "past"}>
                                        {dateFormateur(appointment.date_of_appointment)}
                                    </td>
                                </tr>

                            </tbody>
                        )
                    })}
                </table>
            ) : (
                <div>
                    <h2>Vous n'avez pas encore de rendez-vous programmé</h2>
                </div>
            )}
            {veterinaryInfo ? (
                <div className='get_appointment'>
                    <a href={"mailto:" + veterinaryInfo[0]?.email}>
                        Vous souhaitez prendre rendez-vous avec votre vétérinaire ?
                    </a>
                </div>
            ) : ""}
        </div>
    );
};

export default Appointments;