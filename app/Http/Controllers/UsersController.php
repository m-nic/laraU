<?php

namespace App\Http\Controllers;

use App\Skill;
use App\User;

use App\Exceptions\CustomException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UsersController extends Controller
{
    private static $RULES = [
        'name' => 'required|max:255',
        'email' => 'required|email|max:255',
        'role' => 'required|in:admin,user'
    ];

    /**
     * @return string
     * @throws CustomException
     */
    public function index()
    {
        try {
            return User::with('skills')
                ->orderBy('created_at')
                ->get(['id', 'name', 'email', 'role']);

        } catch (\Exception $e) {
            // @TODO: LOG A LESS NOISY ERR
            throw new CustomException('Could not load users due to some error');
        }
    }

    /**
     * @return \Illuminate\Database\Eloquent\Model|mixed|null|object|static
     * @throws CustomException
     */
    public function currentUser()
    {
        try {
            return User::with('skills')->find(Auth::user()->id);
        } catch (\Exception $e) {
            // @TODO: LOG A LESS NOISY ERR

            throw new CustomException('Could not load user data');
        }
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|string
     * @throws CustomException
     */
    public function create(Request $request)
    {
        $rules = array_merge(self::$RULES, ['password' => 'required|min:5|max:255']);
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 200);
        }

        try {
            $userData = $request->except(['skills']);

            $userData['password'] = Hash::make($userData['password']);
            $userModel = User::create($userData);
            $userModel->save();
            $this->manageSkills($request, $userModel);
        } catch (\Exception $e) {
            // @TODO: LOG A LESS NOISY ERR
            throw new CustomException('Could not create new user');
        }

        return 'success';
    }

    /**
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse|string
     * @throws CustomException
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), self::$RULES);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 200);
        }

        try {
            $userModel = User::with('skills')->find($id);
            $userData = $request->except(['skills']);

            foreach ($userData as $key => $value) {
                $userModel->{$key} = $value;
            }

            $userModel->save();
            $this->manageSkills($request, $userModel);

        } catch (\Exception $e) {
            // @TODO: LOG A LESS NOISY ERR
            throw new CustomException('Could not update the selected user');
        }

        return 'success';
    }

    /**
     * @param $id
     * @throws CustomException
     */
    public function delete($id)
    {
        try {
            User::find($id)->delete();
        } catch (\Exception $e) {
            // @TODO: LOG A LESS NOISY ERR
            throw new CustomException('Could not remove the selected user');
        }
    }

    private function manageSkills(Request $request, $userModel)
    {
        $skillsData = $request->input('skills');

        if (!empty($skillsData)) {
            $userModel = Skill::create([
                'user_id' => $userModel->id,
                'value' => $skillsData
            ]);

            $userModel->save();
        }
    }
}
