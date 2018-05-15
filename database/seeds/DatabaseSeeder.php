<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $limit = 50;
        $faker = Faker\Factory::create();


        $user = App\User::create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'role' => 'admin',
            'password' => Hash::make('admin')
        ]);

        $this->makeSills($user->id, $faker);

        for ($i = 0; $i < $limit; $i++) {
            $user = App\User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->email,
                'role' => random_int(0, 100) % 2 ? 'admin' : 'user',
                'password' => Hash::make('test')
            ]);

            $this->makeSills($user->id, $faker);
        }
    }

    private function makeSills($id, $faker)
    {
        $availableSkills = ['PHP', 'UNIX', 'C/C++', 'English', 'French'];

        $currentSkills = $faker->randomElements($availableSkills, 3);

        $timelineLength = random_int(3, 6);

        for ($i = 0; $i < $timelineLength; $i++) {
            App\Skill::create([
                'created_at' => $faker->dateTimeThisYear(),
                'user_id' => $id,
                'value' => array_collapse(

                    array_map(function ($skill) use ($faker) {
                        return [$skill => $faker->numberBetween(0, 5)];
                    }, $currentSkills)
                ),
            ]);
        }

    }

}
