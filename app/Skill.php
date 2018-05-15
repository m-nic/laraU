<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $table = 'skills';

    protected $hidden = [
        'id', 'user_id', 'updated_at'
    ];

    public $incrementing = false;

    // add created add to allow faker to set it
    protected $fillable = [
        'user_id', 'value', 'created_at'
    ];

    protected $casts = [
        'value' => 'array',
    ];
}
