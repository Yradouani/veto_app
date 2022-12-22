<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \Illuminate\Support\Facades\Mail;
use Error;
use App\Mail\MailNotify;
use App\Mail\VaccineReminder;

class MailController extends Controller
{
    public function index(Request $request)
    {
        try {
            $request->headers->set('Accept', 'application/json');
            $request->validate([
                "author" => ["required", "email"],
                "firstnameclient" => ["required", "string"],
                "lastnameclient" => ["required", "string"],
                "firstnameveterinary" => ["required", "string"],
                "lastnameveterinary" => ["required", "string"],
                "nameAnimal" => ["required", "string"],
                "date" => ["required", "string"],
                "emailClient" => ["required", "email"],
            ]);

            Mail::to($request['emailClient'])->send(new VaccineReminder($request));

            return response($request, 201);
        } catch (Error $e) {
            echo '</br> <b> Exception Message: ' . $e->getMessage() . '</b>';
        }
    }
}
