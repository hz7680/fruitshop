<?php
use App\Http\Middleware;
Route::get('/', 'HomeController@index');
Route::get('/getBanner', 'HomeController@getBanner');
Route::get('/getProductsList', 'HomeController@getProductsList');
Route::get('/getProduct/{id}', 'HomeController@getProduct');
Route::get('/getComments/{id}', 'HomeController@getComments');
Route::get('/getCart', 'HomeController@getCart');
Route::post('/putIntoCart', 'HomeController@putIntoCart');
Route::post('/changeCartCount', 'HomeController@changeCartCount');
Route::post('/getCartInfo', 'HomeController@getCartInfo');
Route::post('/createOrder', 'HomeController@createOrder');
Route::get('/getOrderList', 'HomeController@getOrderList');
Route::get('/getOrder/{id}', 'HomeController@getOrder');
Route::post('/cancelOrder', 'HomeController@cancelOrder');
Route::post('/confirmReceived', 'HomeController@confirmReceived');
Route::post('/postComment', 'HomeController@postComment');
Route::post('/login', 'HomeController@login');
Route::get('/isLogin', 'HomeController@isLogin');
Route::post('/register', 'HomeController@register');
Route::get('/logout', 'HomeController@logout');
Route::post('/userInfo', 'HomeController@userInfo');
Route::post('/editPassword', 'HomeController@editPassword');
Route::get('/getAddrList', 'HomeController@getAddrList');
Route::post('/editAddress', 'HomeController@editAddress');
Route::get('/getAddress/{id}', 'HomeController@getAddress');
Route::get('/delAddress/{id}', 'HomeController@delAddress');

Route::get('/admin/kit/captcha/{tmp}', 'Admin\KitController@captcha');
Route::get('/admin/logout','Admin\AdminController@logout');
Route::group(['middleware' => 'adminUnlogin'], function () {
    Route::get('/admin', 'Admin\AdminController@login');
    Route::get('/admin/login', 'Admin\AdminController@login');
    Route::post('/admin/login', 'Admin\AdminController@postLogin');
});

Route::group(['middleware' => 'adminLogin','prefix'=>'admin'], function () {
    Route::post('upload', 'Admin\UploadController@upload');
    Route::resource('products','Admin\ProductsController');
    Route::get('products/{id}/getImgInfo','Admin\ProductsController@getImgInfo');
    Route::resource('users','Admin\UsersController');
    Route::resource('orders','Admin\OrdersController');
    Route::post('orders/deliver','Admin\OrdersController@deliver');
    Route::resource('banners', 'Admin\BannersController');
    Route::get('banners/{id}/getImgInfo','Admin\BannersController@getImgInfo');
    Route::get('password','Admin\AdminController@passwordEdit');
    Route::post('password','Admin\AdminController@postPasswordEdit');
});




