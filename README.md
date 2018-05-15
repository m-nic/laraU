# laraU

See Heroku [live example](http://larau.herokuapp.com).

Local deployment:

    git clone https://github.com/m-nic/laraU
    cd laraU

    # install dependencies
    composer install
    npm i

    # compile FE assets
    npm run prod

    cp .env.example .env

    # Add your mySQL db, user & password to the .env file

    # generate an app key and run db migrations
    php artisan key:generate
    php artisan migrate

    # add admin account & fake users
    php artisan db:seed
