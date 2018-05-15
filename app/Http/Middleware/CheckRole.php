<?php

namespace App\Http\Middleware;

use Closure;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $role)
    {
        if (! $request->user()->hasRole($role)) {
            if ($request->ajax()) {
                return response('Unauthorized.', 401);
            } else {
                return abort('404');
            }
        }

        return $next($request);
    }
}
