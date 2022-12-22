<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\Client as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Client extends Model
{
    use HasFactory, HasApiTokens, Notifiable;

    public function veterinary()
    {
        return $this->belongsTo('App\Models\User', 'veterinary_id');
    }
    protected $table = 'clients';

    protected $fillable = [
        'firstname',
        'lastname',
        'address',
        'email',
        'phone',
        'pwd',
        'veterinary_id'
    ];

    protected $hidden = [
        'pwd',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
