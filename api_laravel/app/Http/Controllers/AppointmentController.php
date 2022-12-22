<?php

namespace App\Http\Controllers;

use App\Models\appointment;
use App\Http\Requests\StoreappointmentRequest;
use App\Http\Requests\UpdateappointmentRequest;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function getAppointmentOfOneClient()
    {
    }
    /**
     * Création d'un nouveau rendez-vous.
     *
     * @return \Illuminate\Http\Response
     */
    public function createAppointment(Request $request)
    {
        try {
            $request->headers->set('Accept', 'application/json');
            $appointmentData = $request->validate([
                "appointment_object" => ["required", "string"],
                "isVaccin" => ["required", "boolean"],
                "date_of_appointment" => ["required", "string"],
                "veterinary_id" => ["required"],
                "animal_id" => ["required"],
                "client_id" => ["required"]
            ]);

            $appointment = appointment::create([
                "appointment_object" => $appointmentData["appointment_object"],
                "isVaccin" => $appointmentData["isVaccin"],
                "date_of_appointment" => $appointmentData["date_of_appointment"],
                "veterinary_id" => $appointmentData["veterinary_id"],
                "animal_id" => $appointmentData["animal_id"],
                "client_id" => $appointmentData["client_id"]
            ]);
            return response($appointment, 201);
        } catch (Error $e) {
            echo '</br> <b> Exception Message: ' . $e->getMessage() . '</b>';
        }
    }

    //Obtenir le prochain rdv vaccinal
    public function getLastVaccineAppointment($id)
    {
        try {
            $lastVaccine = DB::table("appointments")
                ->select("appointments.*")
                ->where("isVaccin", "1")
                ->where("animal_id", $id)
                ->get();

            return $lastVaccine;
        } catch (Error $e) {
            echo '</br> <b> Exception Message: ' . $e->getMessage() . '</b>';
        }
    }

    //Obtenir tous les rendez-vous d'un client
    public function getAllAppointmentsOfOneClient($id)
    {
        try {
            $lastVaccine = DB::table("appointments")
                ->select("appointments.*")
                ->where("client_id", $id)
                ->get();

            return $lastVaccine;
        } catch (Error $e) {
            echo '</br> <b> Exception Message: ' . $e->getMessage() . '</b>';
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\appointment  $appointment
     * @return \Illuminate\Http\Response
     */
    public function edit(appointment $appointment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateappointmentRequest  $request
     * @param  \App\Models\appointment  $appointment
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateappointmentRequest $request, appointment $appointment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\appointment  $appointment
     * @return \Illuminate\Http\Response
     */
    public function destroy(appointment $appointment)
    {
        //
    }
}
