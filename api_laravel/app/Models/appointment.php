<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class appointment extends Model
{
    use HasFactory;

    protected $table = 'appointments';

    protected $fillable = [
        'appointment_object',
        'isVaccin',
        'date_of_appointment',
        'veterinary_id',
        'animal_id',
        'client_id'
    ];
}
