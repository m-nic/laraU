<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers  {
        username as public userField;
        login as protected initialLogin;
    }

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }


    public function login(Request $request)
    {

        $field = $this->userField();

        $request->merge([
            $field => trim($request->input($field))
        ]);

        $loginRequest = $this->initialLogin($request);

        $authenticatedUser = Auth::user();

        // will get redirect if login is successful
        if ($loginRequest->getStatusCode() === 302) {
            $authenticatedUser->generateApiToken();
        }

        return $loginRequest;
    }

}
