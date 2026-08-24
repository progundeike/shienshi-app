<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'index');
Route::view('/exams', 'index');
Route::view('/terms', 'index');
Route::view('/contact', 'index');
Route::view('/privacy', 'index');
Route::view('/login', 'index');
Route::view('/register', 'index');
Route::view('/two-factor-challenge', 'index');
Route::view('/my-page', 'index');
Route::view('/update-password', 'index');
Route::get('/not-found', function () {
    return response()->view('index', [], 404);
});

// 動的ページ
Route::view('/exams/{year}/{season}/{section}', 'index')
    ->where([
        'year' => '[0-9]{4}',
        'season' => 'haru|aki',
        'section' => '[1-5]',
    ]);

// 管理画面
Route::view('/admin/{any?}', 'index')
    ->where('any', '.*');

// apiプレフィックスを除外して404を返す
Route::get('/{any?}', function () {
    return response()->view('index', [], 404);
})->where('any', '(?!api).+');
