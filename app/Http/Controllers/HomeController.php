<?php

namespace App\Http\Controllers;

use App\Address;
use App\Banner;
use App\Cart;
use App\Comment;
use App\Order;
use App\OrderItem;
use App\Product;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class HomeController extends Controller{
    const NOT_LOGIN = 'not login';
    const IS_LOGIN = 'is login';
    const PASSWORD_SALT='lkjfwnl';
    const PAGESIZE=6;

    //首页
    public function index(){
        $webinfo = [
            'webtitle' => '水果商店'
        ];

        return view('home.index', compact('webinfo'));
    }

    //获取banner
    public function getBanner(){
        $banner=Banner::orderBy('ordernum')->get()->toArray();
        echo json_encode($banner);
    }

    //获取产品列表
    public function getProductsList(Request $request){
        $type=$request->input('type');
        $isnew=$request->input('isnew');
        $pagenum=$request->input('pagenum');
        $promise=Product::forPage($pagenum,self::PAGESIZE)->latest();
        if($isnew){
            $promise=$promise->where('isnew','=',$isnew);
        }
        if($type){
            $promise=$promise->where('type','=',$type);
        }
        $list=$promise->get()->toArray();
        echo json_encode($list);
    }

    //获取产品详情
    public function getProduct($id){
        $product=Product::find($id)->toArray();
        echo json_encode($product);
    }

    //获取产品评论
    public function getComments($id){
        $product=Product::find($id);
        $res=[];
        foreach($product->comments as $item){
            array_push($res,['username'=>$item->user->username,'comment'=>$item->comments]);
        }
        echo json_encode($res);
    }

    //获取购物车内容
    public function getCart(){
        $carts=Cart::where('user_id','=',session()->get('user_id'))->get();
        $res=[];
        foreach($carts as $cart){
            $product=$cart->product->toArray();
            unset($product['id']);
            array_push($res,array_merge($cart->toArray(),$product));
        }
        echo json_encode($res);
    }

    //放入购物车
    public function putIntoCart(){
        $postData = json_decode(file_get_contents('php://input', true));
        $cart=Cart::where('user_id','=',session()->get('user_id'))->where('product_id','=',$postData->product_id)->first();
        if($cart){
            $cart->count=$cart->count+$postData->count;
            $cart->save();
        }else{
            Cart::create(['product_id'=>$postData->product_id,'user_id'=>session()->get('user_id'),'count'=>$postData->count]);
        }
        echo 'ok';
    }

    //修改购物车产品数量
    public function changeCartCount(){
        $postData = json_decode(file_get_contents('php://input', true));
        $id=$postData->id;
        $cart=Cart::find($id);
        if($cart){
            if($cart->user_id==session()->get('user_id')){
                $cart->count=$postData->count;
                $cart->save();
            }
        }
    }

    //按id获取
    public function getCartInfo(Request $request){
        $postData = json_decode(file_get_contents('php://input', true));
        $id=$postData->id;
        $carts=Cart::whereRaw('id in ('.$id.') and user_id='.session()->get('user_id'))->get();
        $res=[];
        foreach($carts as $cart){
            $product=$cart->product->toArray();
            array_push($res,$cart->toArray());
//            unset($product['id']);
//            array_push($res,array_merge($cart->toArray(),$product));
        }
        echo json_encode($res);
    }

    //生成订单
    public function createOrder(){
        $postData = json_decode(file_get_contents('php://input', true));
        $addrId=$postData->address->id;
        $carts=$postData->carts;
        if(count($carts)>0){
            $address=Address::find($addrId);
            $totalprice=0;
            for($i=0;$i<count($carts);$i++){
                $totalprice+=$carts[$i]->count*$carts[$i]->product->price;
            }
            $order=Order::create(['user_id'=>session()->get('user_id'),'ordernumber'=>Carbon::now(),'totalprice'=>$totalprice,'name'=>$address->name,'tel'=>$address->tel,'province'=>$address->province,'city'=>$address->city,'area'=>$address->area,'address'=>$address->address]);
            foreach($carts as $cart){
                Orderitem::create(['order_id'=>$order->id,'product_id'=>$cart->product->id,'price'=>$cart->product->price,'count'=>$cart->count,'iscommented']);
            }
            if(isset($carts[0]->id)){
                foreach($carts as $cart){
                    $item=Cart::where('user_id','=',session()->get('user_id'))->where('id','=',$cart->id)->first();
                    $item->delete();
                }
            }
            echo $order->id;
        }
    }

    //订单列表
    public function getOrderList(){
        $orderList=Order::latest()->where('user_id','=',session()->get('user_id'))->get();
        foreach($orderList as $order){
            foreach($order->items as $item){
                $item->product;
            }
        }
        return $orderList;
    }

    //订单详情
    public function getOrder($id){
        $order=Order::find($id);
        if($order->user_id==session()->get('user_id')){
            for($i=0;$i<count($order->items);$i++){
                $order->items[$i]->product;
            }
            return $order;
        }else{
            return null;
        }
    }

    //取消订单
    public function cancelOrder(){
        $postData = json_decode(file_get_contents('php://input', true));
        $id=$postData->id;
        $order=Order::find($id);
        if($order->user_id==session()->get('user_id')&&$order->ispayed==0){
            $order->iscanceled=1;
            $order->save();
            echo 'ok';
        }
    }

    //确认收货
    public function confirmReceived(Request $request){
        $postData = json_decode(file_get_contents('php://input', true));
        $id=$postData->id;
        $order=Order::find($id);
        if($order->user_id==session()->get('user_id')){
            $order->isreceived=1;
            $order->save();
            echo 'ok';
        }
    }

    //评价
    public function postComment(){
        $postData = json_decode(file_get_contents('php://input', true));
        $orderItem=OrderItem::find($postData->id);
        $order=Order::find($orderItem->order_id);
        if($order->user_id==session()->get('user_id')&&$order->isreceived==1){
            if($orderItem->iscommented==0){
                Comment::create(['user_id'=>session()->get('user_id'),'product_id'=>$orderItem->product_id,'comments'=>$postData->comment]);
                $orderItem->iscommented=1;
                $orderItem->save();
                echo 'ok';
            }
        }
    }

    //登录
    public function login(){
        $postData = json_decode(file_get_contents('php://input', true));
        $username=$postData->username;
        $password=$postData->password;
        $user=User::where('username','=',$username)->where('password','=',md5($password.User::PASSWORD_SALT))->first();
        $res=['flag'=>false,'user'=>null];
        if($user){
            session()->put('user_id',$user->id);
            $res['flag']=true;
            $res['user']=['username'=>$user->username,'tel'=>$user->tel,'email'=>$user->email];
            echo json_encode($res);
        }else{
            echo json_encode($res);
        }
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
        $user = User::create(['username' => $postData->username, 'tel' => $postData->tel, 'password' => md5($postData->password.User::PASSWORD_SALT)]);
        session()->put('user_id', $user->id);
        $res['flag'] = true;
        $res['errmsg']=$user->id;
        echo json_encode($res);
    }

    public function logout(){
        session()->forget('user_id');
        session()->flush();
        echo 'ok';
    }

    public function userInfo(){
        $res=['flag'=>false,'errmsg'=>''];
        $postData = json_decode(file_get_contents('php://input'));
        $user=User::where('id','!=',session()->get('user_id'))->where('tel','=',$postData->tel)->first();
        if($user){
            $res['errmsg']='手机号码已存在';
            echo json_encode($res);
            exit();
        }
        if($postData->email){
            $user=User::where('id','!=',session()->get('user_id'))->where('tel','=',$postData->email)->first();
            if($user){
                $res['errmsg']='Email已存在';
                echo json_encode($res);
                exit();
            }
        }
        $user=User::where('id','=',session()->get('user_id'))->first();
        $user->tel=$postData->tel;
        $user->email=$postData->email;
        $user->save();
        echo 'ok';
    }

    public function editPassword(){
        $postData = json_decode(file_get_contents('php://input'));
        $res=['flag'=>false,'errmsg'=>''];
        $user=User::where('id','=',session()->get('user_id'))->first();
        if($user->password==md5($postData->old.User::PASSWORD_SALT)){
            if($postData->new!=$postData->confirm){
                $res['errmsg']='两次输入密码不一致';
                echo json_encode($res);
            }else{
                $user->password=md5($postData->new.User::PASSWORD_SALT);
                $user->save();
                $res['flag']=true;
                echo json_encode($res);
            }
        }else{
            $res['errmsg']='原始密码输入错误';
            echo json_encode($res);
        }
    }

    public function getAddrList(){
        if(session()->has('user_id')){
            $addrList=Address::where('user_id','=',session()->get('user_id'))->get();
            echo json_encode($addrList->toArray());
        }
    }

    public function editAddress(){
        $postData = json_decode(file_get_contents('php://input'));
        if($postData->id==0){
            $isdefault=$postData->isdefault?1:0;
            $address=Address::create(['name'=>$postData->name,'tel'=>$postData->tel,'user_id'=>session()->get('user_id'),'province'=>$postData->province,'city'=>$postData->city,'area'=>$postData->area,'address'=>$postData->address,'isdefault'=>$isdefault]);
            if($postData->isdefault){
                $temp=Address::where('id','!=',$address->id)->where('isdefault','=','1')->where('user_id','=',session()->get('user_id'))->first();
                if($temp){
                    $temp->isdefault=0;
                    $temp->save();
                }
            }
        }else{
            $address=Address::where('id','=',$postData->id)->where('user_id','=',session()->get('user_id'))->first();
            if($address){
                $address->name=$postData->name;
                $address->tel=$postData->tel;
                $address->province=$postData->province;
                $address->city=$postData->city;
                $address->area=$postData->area;
                $address->address=$postData->address;
                if($postData->isdefault){
                    $address->isdefault=1;
                    $address->save();
                    $temp=Address::where('id','!=',$postData->id)->where('isdefault','=','1')->where('user_id','=',session()->get('user_id'))->first();
                    if($temp){
                        $temp->isdefault=0;
                        $temp->save();
                    }
                }else{
                    $address->isdefault=0;
                    $address->save();
                }
            }
        }
        echo 'ok';
    }

    public function getAddress($id){
        $address=Address::where('id','=',$id)->where('user_id','=',session()->get('user_id'))->first();
        if($address){
            echo json_encode($address->toArray());
        }
    }

    public function delAddress($id){
        $address=Address::find($id);
        if($address){
            if($address->user_id==session()->get('user_id')){
                $address->delete();
                echo 'ok';
            }
        }
    }


}
