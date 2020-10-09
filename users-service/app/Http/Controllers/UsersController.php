<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function getUsers()
    {
        return response()->json(User::all(), 200);
    }

    public function createUser(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        if(!$user){
        $user = new User();
        $user->id = $request->id;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->{'bootstrap_color'} = $request->bootstrapColor;
        $user->address = $request->address;
        $user->save();
        }
        return response()->json($user, 200);
    }

        public function deleteUser(Request $request)
        {
            User::where('email', $request->email)->delete();
            return response()->json();
        }
}
