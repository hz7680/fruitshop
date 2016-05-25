angular.module('starter.services', [])
    .constant('getBannerUrl', 'getBanner')
    .constant('getProductsListUrl', 'getProductsList')
    .constant('getProductUrl', 'getProduct')
    .constant('getCommentsUrl', 'getComments')
    .constant('getCartUrl', 'getCart')
    .factory('Banners', function ($http, $q, getBannerUrl) {
        var banners = {};
        var isGetBanner = false;
        return {
            all: function () {
                if (isGetBanner) {
                    return $q.when(banners);
                } else {
                    return $http.get(getBannerUrl).then(function (res) {
                        if (res.status == 200) {
                            isGetBanner = true;
                            banners = res.data;
                            return banners;
                        }
                    })
                }
            }
        };
    })
    .constant('FreshFruit',1)
    .constant('Snacks',2)
    .constant('Meat',3)
    .factory('Products', function ($http, getProductsListUrl, getProductUrl, getCommentsUrl) {
        var pagenum = 1;
        var isEnd = false;
        var isnew='';
        var type='';
        return {
            getList: function () {
                if (isEnd) {
                    return false;
                } else {
                    return $http.get(getProductsListUrl + '?pagenum=' + pagenum+'&isnew='+isnew+'&type='+type).then(function (res) {
                        if (res.status == 200) {
                            pagenum++;
                            if (res.data.length <= 0) {
                                isEnd = true;
                                return false;
                            }else{
                                return res.data;
                            }
                        }
                    });
                }
            },
            getProduct: function (id) {
                return $http.get(getProductUrl + '/' + id).then(function (res) {
                    if (res.status == 200) {
                        return res.data;
                    }
                })
            },
            getComments: function (id) {
                return $http.get(getCommentsUrl + '/' + id).then(function (res) {
                    if (res.status == 200) {
                        return res.data;
                    }
                })
            },
            setIsnew:function(_isnew){
                console.log(_isnew);
                console.log(type);
                console.log(isnew);
                if(isnew==_isnew){
                    return false;
                }
                isnew=_isnew;
                type='';
                pagenum=1;
                return true;
            },
            setType:function(_type){
                if(type==_type){
                    return false;
                }
                type=_type;
                isnew='';
                pagenum=1;
                return true;
            }
        }
    })
    .constant('NOT_LOGIN', 'not login')
    .constant('PutIntoCartUrl','putIntoCart')
    .constant('ChangeCartCountUrl','changeCartCount')
    .constant('GetCartInfoUrl','getCartInfo')
    .constant('CreateOrderUrl','createOrder')
    .factory('Cart', function ($http, getCartUrl, NOT_LOGIN,PutIntoCartUrl,ChangeCartCountUrl,GetCartInfoUrl,CreateOrderUrl) {
        _cart=[];
        _productId=-1;
        _count=0;
        return {
            getCart: function () {
                return $http.get(getCartUrl)
                    .then(function(res){
                        if(res.status==200){
                            return res.data;
                        }
                    })
            },
            putIntoCart:function(cart){
                return $http.post(PutIntoCartUrl,cart)
                    .then(function(res){
                        if(res.status==200){
                            return res.data;
                        }
                    })
            },
            changeCount:function(cart){
                $http.post(ChangeCartCountUrl,cart);
            },
            setCart:function(idArr){
                _cart=idArr;
            },
            getCartIds:function(){
                return _cart;
            },
            setProductId:function(id){
                _productId=id;
            },
            getProductId:function(){
                return _productId;
            },
            setCount:function(count){
                _count=count;
            },
            getCount:function(){
                return _count;
            },
            getConfirmCart:function(){
                return $http.post(GetCartInfoUrl,{
                    id:_cart.toString()
                }).then(function(res){
                    if(res.status==200){
                        return res.data;
                    }
                })
            },
            createOrder:function(obj){
                return $http.post(CreateOrderUrl,obj)
                    .then(function(res){
                        if(res.status==200){
                            return res.data;
                        }
                    })
            }
        }
    })
    .factory('Auth', function ($http) {
        return {
            isLogin: function () {
                return $http.get('isLogin').then(function(res){
                    if(res.status==200){
                        return res.data;
                    }
                })
            }
        }
    })
    .factory('Verify',function(){
        return {
            isUserName:function(username){
                if(username){
                    var reg=/^[\u4e00-\u9fa5a-zA-Z0-9_]{3,20}$/;
                    return reg.test(username);
                }
                return false;
            },
            isTel:function(tel){
                if(tel){
                    var reg=/^1[3,5,7,8]\d{9}$/
                    return reg.test(tel);
                }
                return false;
            },
            isPassword:function(password){
                if(password){
                    var reg=/^\w{6,15}$/;
                    return reg.test(password);
                }
                return false;
            },
            isRepassword:function(password,repassword){
                return password==repassword;
            },
            isEmail:function(email){
                if(email){
                    var reg=/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
                    return reg.test(email);
                }
                return false;
            }
        }
    })
    .constant('RegisterUrl','register')
    .constant('LoginUrl','login')
    .constant('LogoutUrl','logout')
    .constant('UserInfoUrl','userInfo')
    .constant('EditPasswordUrl','editPassword')
    .factory('User',function($http,RegisterUrl,LoginUrl,LogoutUrl,UserInfoUrl,EditPasswordUrl){
        var _user={};
        return {
            register:function(user){
                return $http.post(RegisterUrl,user)
                    .then(function(res){
                        if (res.status == 200) {
                            return res.data;
                        }
                    })
            },
            login:function(user){
                return $http.post(LoginUrl,user)
                    .then(function(res){
                        if(res.status==200){
                            return res.data;
                        }
                    })
            },
            logout:function(){
                return $http.get(LogoutUrl)
                    .then(function(res){
                        if(res.status==200){
                            _user={};
                            return res.data;
                        }
                    })
            },
            edit:function(user){
                return $http.post(UserInfoUrl,user)
                    .then(function(res){
                        if(res.status==200){
                            return res.data;
                        }
                    })
            },
            editPassword:function(password){
                return $http.post(EditPasswordUrl,password)
                    .then(function(res){
                        if(res.status==200){
                            return res.data;
                        }
                    })
            },
            setUser:function(user){
                _user=user;
            },
            getUser:function(){
                return _user;
            }

        }
    })
    .constant('GetAddrListUrl','getAddrList')
    .constant('GetAddressUrl','getAddress')
    .constant('EditAddressUrl','editAddress')
    .constant('DelAddressUrl','delAddress')
    .factory('Address',function($http,GetAddrListUrl,GetAddressUrl,EditAddressUrl,DelAddressUrl){
        return {
            getAddrList:function(){
                return $http.get(GetAddrListUrl)
                    .then(function(res){
                        if(res.status==200){
                            return res.data;
                        }
                    })
            },
            saveAddress:function(address){
                return $http.post(EditAddressUrl,address)
                    .then(function(res){
                        if(res.status==200){
                            return res.data;
                        }
                    })
            },
            getAddress:function(id){
                return $http.get(GetAddressUrl+'/'+id)
                    .then(function(res){
                        if(res.status==200){
                            return res.data;
                        }
                    })
            },
            delAddress:function(id){
                console.log(id);
                return $http.get(DelAddressUrl+'/'+id)
                    .then(function(res){
                        if(res.status==200){
                            return res.data;
                        }
                    })
            }
        }
    })
    .constant('GetOrderListUrl','getOrderList')
    .constant('GetOrderUrl','getOrder')
    .constant('ConfirmReceivedUrl','confirmReceived')
    .constant('PostCommentUrl','postComment')
    .constant('CancelOrderUrl','cancelOrder')
    .factory('Order',function($http,GetOrderListUrl,GetOrderUrl,ConfirmReceivedUrl,PostCommentUrl,CancelOrderUrl){
        return {
            getOrderList:function(){
                return $http.get(GetOrderListUrl)
                    .then(function(res) {
                        if (res.status == 200) {
                            return res.data;
                        }
                    })
            },
            getOrder:function(id){
                return $http.get(GetOrderUrl+'/'+id)
                    .then(function(res){
                        if(res.status==200){
                            return res.data;
                        }
                    })
            },
            cancelOrder:function(id){
                return $http.post(CancelOrderUrl,{id:id})
                    .then(function(res){
                        if(res.status==200){
                            return res.data;
                        }
                    })
            },
            confirmReceived:function(id){
                return $http.post(ConfirmReceivedUrl,{id:id})
                    .then(function(res){
                        if(res.status==200){
                            return res.data;
                        }
                    })
            },
            postComment:function(comment){
                return $http.post(PostCommentUrl,comment)
                    .then(function(res){
                        if(res.status==200){
                            return res.data;
                        }
                    })
            }
        }
    })
