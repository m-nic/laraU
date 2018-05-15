<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:api', 'role:admin'])->group(function () {

    Route::get('/users', 'UsersController@index');

    Route::post('/user/', 'UsersController@create');

    Route::put('/user/{id}', 'UsersController@update');

    Route::delete('/user/{id}', 'UsersController@delete');
});

Route::middleware(['auth:api'])->group(function () {
    Route::get('/user/current', 'UsersController@currentUser');
});
