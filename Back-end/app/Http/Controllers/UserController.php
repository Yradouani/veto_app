<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\User;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    //Inscription
    public function signin(Request $request)
    {
        $request->headers->set('Accept', 'application/json');
        $userData = $request->validate([
            "siret" => ["required", "string", "regex:/\b\d{14}\b/"],
            "firstname" => ["required", "string", "min:3", "max:23"],
            "lastname" => ["required", "string", "min:3", "max:23"],
            "email" => ["required", "email", "unique:veterinaire,email"],
            "pwd" => ["required", "string", "min:8"],
            "matchPwd" => ["required", "string", "min:8", "same:pwd"]
        ]);

        $user = User::create([
            "siret" => $userData["siret"],
            "firstname" => $userData["firstname"],
            "lastname" => $userData["lastname"],
            "email" => $userData["email"],
            "pwd" => bcrypt($userData["pwd"]),
        ]);

        return response($user, 201);
    }

    //Connexion
    public function login(Request $request)
    {
        $request->headers->set('Accept', 'application/json');
        $userData = $request->validate([
            "email" => ["required", "email"],
            "pwd" => ["required", "string", "min:8"]
        ]);

        $user = User::where("email", $userData["email"])->first();
        if (!$user) {
            try {
                $request->headers->set('Accept', 'application/json');
                $clientData = $request->validate([
                    "email" => ["required", "email"],
                    "pwd" => ["required", "string", "min:8"]
                ]);

                $client = Client::where("email", $clientData["email"])->first();
                if (!$client) return response(["message" => "aucun client de trouver avec l'email suivant $clientData[email]"], 401);
                if (!Hash::check($clientData["pwd"], $client->pwd)) {
                    return response(["message" => "le mot de passe ne correspond pas"], 401);
                }

                //Création d'un token d'authentification
                $token = $client->createToken("SECRET_KEY")->plainTextToken;

                return response([
                    "user" => $client,
                    "token" => $token
                ], 200);
            } catch (Error $e) {
                echo '</br> <b> Exception Message: ' . $e->getMessage() . '</b>';
            }
        }

        if (!Hash::check($userData["pwd"], $user->pwd)) {
            return response(["message" => "le mot de passe ne correspond pas"], 401);
        }

        //Création d'un token d'authentification
        $token = $user->createToken("SECRET_KEY")->plainTextToken;

        return response([
            "user" => $user,
            "token" => $token
        ], 200);
    }

    //Récupérer les informations du vétérinaire connecté
    public function getOneVeterinary(User $id)
    {
        // $request->headers->set('Accept', 'application/json');

        return User::find($id);
    }

    //Récupérer les informations de tous les vétérinaires
    public function getAllVeterinary()
    {
        $veterinary = User::all();
        if (count($veterinary) <= 0) {
            return response(["message" => "aucun vétérinaire inscrit"], 200);
        }
        return response($veterinary, 200);
    }

    //Modifier les informations d'un vétérinaire
    public function updateVeterinary(Request $request, $id)
    {
        try {
            $request->headers->set('Accept', 'application/json');
            $veterinaryValidation = $request->validate([
                "firstname" => ["string", "min:3", "max:23"],
                "lastname" => ["string", "min:3", "max:23"],
                "email" => ["email"],
                "siret" => ["string"],
                "veterinary_id" => ["required"]
            ]);

            $veterinary = User::find($id);
            if (!$veterinary) {
                return response(["message" => "aucun vétérinaire de trouvé avec cet id $id"], 404);
            }
            // elseif ($client->veterinary_id !== $clientValidation["veterinary_id"]) {
            //     return response(["message" => "action interdite"], 403);
            // }

            $veterinary->update($veterinaryValidation);
            return response($veterinary, 201);
        } catch (Error $e) {
            echo '</br> <b> Exception Message: ' . $e->getMessage() . '</b>';
        }
    }
}
