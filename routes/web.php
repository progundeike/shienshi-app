<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/pdf/{filename}', function ($filename) {
    $path = storage_path('app/' . $filename);
    if (!Storage::exists($path)) {
        abort(404);
    }
    return response()->filename($path);
});

// apiプレフィックスを除く全てのルートに対して、indexビューを返す
Route::get('/{any?}', function () {
    return view('index');
})->where('any', '(?!api).+');
