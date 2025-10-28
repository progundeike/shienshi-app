<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/pdf/{filename}', function ($filename) {
    $relativePath = 'public/pdf/' . $filename;
    $absolutePath = storage_path('app/' . $relativePath);

    return response()->file($absolutePath);
});

// apiプレフィックスを除く全てのルートに対して、indexビューを返す
Route::get('/{any?}', function () {
    return view('index');
})->where('any', '(?!api).+');
