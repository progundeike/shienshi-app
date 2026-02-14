<?php

use Illuminate\Support\Facades\Route;

// apiプレフィックスを除く全てのルートに対して、indexビューを返す
Route::get('/{any?}', function () {
    return view('index');
})->where('any', '(?!api).+');
