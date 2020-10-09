<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/
// CORS implementation for preflight requests
Route::options('{any}', function () {
    return response('OK', \Illuminate\Http\Response::HTTP_NO_CONTENT)
          ->header('Access-Control-Allow-Origin', '*')
          ->header('Access-Control-Allow-Methods', '*')
          ->header('Access-Control-Allow-Headers', 'GET, POST, PUT, DELETE, OPTIONS');
});
$router->get('users', 'UsersController@getUsers');

// for development environment only, lambda function is used instead
$router->post('users/add', 'UsersController@createUser');
$router->post('users/delete', 'UsersController@deleteUser');
