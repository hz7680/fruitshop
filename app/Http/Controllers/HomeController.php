<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class HomeController extends Controller{
    const NOT_LOGIN = 'not login';
    const IS_LOGIN = 'is login';
    const SALT='lkjfwnl';
    /*
     * 首页
     * webinfo=网站配置
     */
    var $products = [
        ['id' => 1, 'imgpath' => 'product.png', 'imgs' => 'product.png|product.png|product.png', 'imglist' => ['product.png', 'product.png', 'product.png'], 'title' => '测试产品测试产品测试产品测试产品测试产品测试产品测试产品测试产品测试产品', 'description' => '产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介产品简介', 'price' => 49.8, 'body' => '<p>产品内容产品内容产品内容产品内容产品内容产品内容产品内容产品内容</p><img src="upload/product.png"/><img src="upload/product.png"/><img src="upload/product.png"/><img src="upload/product.png"/>'],
        ['id' => 2, 'imgpath' => 'product.png', 'imgs' => 'product.png|product.png|product.png', 'imglist' => ['product.png', 'product.png', 'product.png'], 'title' => '测试产品测试产品测试产品', 'description' => '产品简介产品简介产品简介产品简介产品简介产品简介', 'price' => 49.8, 'body' => '<p>产品内容产品内容产品内容产品内容产品内容产品内容产品内容产品内容</p>'],
        ['id' => 3, 'imgpath' => 'product.png', 'imgs' => 'product.png|product.png|product.png', 'imglist' => ['product.png', 'product.png', 'product.png'], 'title' => '测试产品测试产品测试产品', 'description' => '产品简介产品简介产品简介产品简介产品简介产品简介', 'price' => 49.8, 'body' => '<p>产品内容产品内容产品内容产品内容产品内容产品内容产品内容产品内容</p>'],
        ['id' => 4, 'imgpath' => 'product.png', 'imgs' => 'product.png|product.png|product.png', 'imglist' => ['product.png', 'product.png', 'product.png'], 'title' => '测试产品测试产品测试产品', 'description' => '产品简介产品简介产品简介产品简介产品简介产品简介', 'price' => 49.8, 'body' => '<p>产品内容产品内容产品内容产品内容产品内容产品内容产品内容产品内容</p>'],
        ['id' => 5, 'imgpath' => 'product.png', 'imgs' => 'product.png|product.png|product.png', 'imglist' => ['product.png', 'product.png', 'product.png'], 'title' => '测试产品测试产品测试产品', 'description' => '产品简介产品简介产品简介产品简介产品简介产品简介', 'price' => 49.8, 'body' => '<p>产品内容产品内容产品内容产品内容产品内容产品内容产品内容产品内容</p>'],
        ['id' => 6, 'imgpath' => 'product.png', 'imgs' => 'product.png|product.png|product.png', 'imglist' => ['product.png', 'product.png', 'product.png'], 'title' => '测试产品测试产品测试产品', 'description' => '产品简介产品简介产品简介产品简介产品简介产品简介', 'price' => 49.8, 'body' => '<p>产品内容产品内容产品内容产品内容产品内容产品内容产品内容产品内容</p>'],
    ];

    var $comment = [
        ['username' => 'hz7680', 'comment' => '太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦'],
        ['username' => 'hz7680', 'comment' => '太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦'],
        ['username' => 'hz7680', 'comment' => '太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦'],
        ['username' => 'hz7680', 'comment' => '太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦太好吃啦'],
    ];

    //首页
    public function index(){
        $webinfo = [
            'webtitle' => '水果商店'
        ];
        return view('home.index', compact('webinfo'));
    }

    //获取banner
    public function getBanner(){
        $banner = [
            ['id' => '1', 'url' => '1', 'imgpath' => 'banners.jpg'],
            ['id' => '2', 'url' => '2', 'imgpath' => 'banners.jpg'],
            ['id' => '3', 'url' => '3', 'imgpath' => 'banners.jpg'],
        ];
        echo json_encode($banner);
    }

    //获取产品列表
    public function getProductsList(Request $request){
        if ($request->input('pagenum') > 4) {
            echo json_encode([]);
        } else {
            $products = [
                ['id' => ($request->input('pagenum') - 1) * 6 + 1, 'imgpath' => 'product.png', 'imgs' => 'product.png|product.png|product.png', 'imglist' => ['product.png', 'product.png', 'product.png'], 'title' => '测试产品测试产品测试产品' . (($request->input('pagenum') - 1) * 6 + 1), 'description' => '产品简介产品简介产品简介产品简介产品简介产品简介', 'price' => 49.8, 'body' => '<p>产品内容产品内容产品内容产品内容产品内容产品内容产品内容产品内容</p>'],
                ['id' => ($request->input('pagenum') - 1) * 6 + 2, 'imgpath' => 'product.png', 'imgs' => 'product.png|product.png|product.png', 'imglist' => ['product.png', 'product.png', 'product.png'], 'title' => '测试产品测试产品测试产品' . (($request->input('pagenum') - 1) * 6 + 2), 'description' => '产品简介产品简介产品简介产品简介产品简介产品简介', 'price' => 49.8, 'body' => '<p>产品内容产品内容产品内容产品内容产品内容产品内容产品内容产品内容</p>'],
                ['id' => ($request->input('pagenum') - 1) * 6 + 3, 'imgpath' => 'product.png', 'imgs' => 'product.png|product.png|product.png', 'imglist' => ['product.png', 'product.png', 'product.png'], 'title' => '测试产品测试产品测试产品' . (($request->input('pagenum') - 1) * 6 + 3), 'description' => '产品简介产品简介产品简介产品简介产品简介产品简介', 'price' => 49.8, 'body' => '<p>产品内容产品内容产品内容产品内容产品内容产品内容产品内容产品内容</p>'],
                ['id' => ($request->input('pagenum') - 1) * 6 + 4, 'imgpath' => 'product.png', 'imgs' => 'product.png|product.png|product.png', 'imglist' => ['product.png', 'product.png', 'product.png'], 'title' => '测试产品测试产品测试产品' . (($request->input('pagenum') - 1) * 6 + 4), 'description' => '产品简介产品简介产品简介产品简介产品简介产品简介', 'price' => 49.8, 'body' => '<p>产品内容产品内容产品内容产品内容产品内容产品内容产品内容产品内容</p>'],
                ['id' => ($request->input('pagenum') - 1) * 6 + 5, 'imgpath' => 'product.png', 'imgs' => 'product.png|product.png|product.png', 'imglist' => ['product.png', 'product.png', 'product.png'], 'title' => '测试产品测试产品测试产品' . (($request->input('pagenum') - 1) * 6 + 5), 'description' => '产品简介产品简介产品简介产品简介产品简介产品简介', 'price' => 49.8, 'body' => '<p>产品内容产品内容产品内容产品内容产品内容产品内容产品内容产品内容</p>'],
                ['id' => ($request->input('pagenum') - 1) * 6 + 6, 'imgpath' => 'product.png', 'imgs' => 'product.png|product.png|product.png', 'imglist' => ['product.png', 'product.png', 'product.png'], 'title' => '测试产品测试产品测试产品' . (($request->input('pagenum') - 1) * 6 + 6), 'description' => '产品简介产品简介产品简介产品简介产品简介产品简介', 'price' => 49.8, 'body' => '<p>产品内容产品内容产品内容产品内容产品内容产品内容产品内容产品内容</p>'],
            ];
            echo json_encode($products);
        }
    }

    //获取产品详情
    public function getProduct($id){
        for ($i = 0; $i < count($this->products); $i++) {
            if ($this->products[$i]['id'] == $id) {
                echo json_encode($this->products[$i]);
                break;
            }
        }
    }

    //获取产品评论
    public function getComments($id){
        echo json_encode($this->comment);
    }

    //获取购物车内容
    public function getCart(){
        if (session()->get('userid')) {
            echo self::IS_LOGIN;
        } else {
            echo self::NOT_LOGIN;
        }
    }

    //登录
    public function login(){
        $postData = json_decode(file_get_contents('php://input', true));
        session()->put('userid', 1);
    }

    //判断是否登录
    public function isLogin(){
        $res=['flag'=>false,'user'=>null];
        if (session()->has('user_id')) {
            $user=User::find(session()->get('user_id'));
            $res['flag']=true;
            $res['user']=['username'=>$user->username,'tel'=>$user->tel,'email'=>$user->email];
            echo json_encode($res);
        } else {
            echo json_encode($res);
        }
    }

    public function register(){
        $res = ['flag' => false, 'errmsg' => ''];
        $postData = json_decode(file_get_contents('php://input'));
        $user = User::where('username', '=', $postData->username)->first();
        if ($user) {
            $res['errmsg'] = '用户名已存在';
            echo json_encode($res);
            exit();
        }
        $user = User::where('tel', '=', $postData->tel)->first();
        if ($user) {
            $res['errmsg'] = '手机号已被注册';
            echo json_encode($res);
            exit();
        }
        $user = User::create(['username' => $postData->username, 'tel' => $postData->tel, 'password' => md5($postData->password.self::SALT)]);
        session()->put('user_id', $user->id);
        $res['flag'] = true;
        $res['errmsg']=$user->id;
        echo json_encode($res);
    }

    public function test(){
        $id = User::create(['username' => 'test', 'tel' => '13013331111', 'password' => '123456']);
        echo $id;
    }

}
