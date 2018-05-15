<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'role'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function generateApiToken()
    {
        $this->api_token = str_random(60);
        $this->save();
    }

    public function skills() {
        return $this->hasMany('App\Skill');
    }

    public function hasRole($role) {
        return $this->role === $role;
    }
}
