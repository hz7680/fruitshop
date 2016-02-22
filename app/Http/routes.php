<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'HomeController@index');
Route::get('/getBanner','HomeController@getBanner');
Route::get('/getProductsList','HomeController@getProductsList');
Route::get('/getProduct/{id}','HomeController@getProduct');
Route::get('/getComments/{id}','HomeController@getComments');
Route::get('/getCart','HomeController@getCart');
Route::post('/login','HomeController@login');
Route::get('/isLogin','HomeController@isLogin');
Route::post('/register','HomeController@register');

Route::get('/test','HomeController@test');