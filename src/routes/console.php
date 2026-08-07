<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('demo:reset-public-user')
    ->dailyAt('04:00')
    ->evenInMaintenanceMode();
