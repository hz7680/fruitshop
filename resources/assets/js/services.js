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
    .factory('Products', function ($http, getProductsListUrl, getProductUrl, getCommentsUrl) {
        var pagenum = 1;
        var isEnd = false;
        return {
            getList: function () {
                if (isEnd) {
                    return false;
                } else {
                    return $http.get(getProductsListUrl + '?pagenum=' + pagenum).then(function (res) {
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
            }
        }
    })
    .constant('NOT_LOGIN', 'not login')
    .factory('Cart', function ($http, getCartUrl, NOT_LOGIN) {
        return {
            getCart: function () {
                $http.get(getCartUrl)
                    .success(function (data) {
                        if (data == NOT_LOGIN) {
                            console.log('未登录');
                        } else {
                            console.log('已登录');
                        }
                    })
            }
        }
    })
    .factory('Auth', function ($http) {
        return {
            login: function () {
                $http.post('login', {
                    username: 'hz7680'
                }).success(function (data) {
                    if (data == 'ok') {
                        return true;
                    } else {
                        return false;
                    }
                })
            },
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
    .factory('User',function($http,RegisterUrl){
        var _user=null;
        return {
            register:function(user){
                return $http.post(RegisterUrl,user)
                    .then(function(res){
                        if (res.status == 200) {
                            isGetBanner = true;
                            return res.data;
                        }
                    })
            },
            setUser:function(user){
                _user=user;
            },
            getUser:function(){
                return _user;
            },

        }
    })
