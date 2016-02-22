angular.module('starter.controllers', [])
    .controller('IndexController', function ($scope, $ionicSlideBoxDelegate, Banners, Products) {
        $scope.refresh = function () {
            location.reload(true);
        };
        Banners.all().then(function (data) {
            $scope.banners = data;
            $ionicSlideBoxDelegate.update();
        });
        $ionicSlideBoxDelegate.update();
        $scope.products = [];
        $scope.loadMsg = '正在加载';
        $scope.canLoad = false;
        Products.getList().then(function (data) {
            $scope.products = data;
            $scope.loadMsg = '点击加载更多';
            $scope.canLoad = true;
        });

        $scope.loadMore = function () {
            if ($scope.canLoad) {
                var promise = Products.getList();
                $scope.canLoad = false;
                $scope.loadMsg = '正在加载';
                if (promise) {
                    promise.then(function (data) {
                        for (var i = 0; i < data.length; i++) {
                            $scope.products.push(data[i]);
                        }
                        $scope.loadMsg = '点击加载更多';
                        $scope.canLoad = true;
                    });
                } else {
                    $scope.loadMsg = '全部加载完成';
                    $scope.canLoad = false;
                }
            }
        };
    })
    .controller('ProductController', function ($scope, $state, $sce, $ionicSlideBoxDelegate, Products) {

        $scope.count = 1;
        Products.getProduct($state.params.Productid).then(function (data) {
            $scope.product = data;
            $sce.trustAsHtml($scope.product.body);
            $ionicSlideBoxDelegate.update();
        });
        $scope.isShowPutIntoCart = false;

        $scope.isInfo = true;
        $scope.isComment = false;
        $state.go('tab.product.info');

        $scope.showPartial = function (tag) {
            if (tag == 'info') {
                $scope.isInfo = true;
                $scope.isComment = false;
                $state.go('tab.product.info');
            } else {
                $scope.isInfo = false;
                $scope.isComment = true;
                Products.getComments($state.params.Productid).then(function (data) {
                    $scope.comments = data;
                });
                $state.go('tab.product.comment');
            }
        };

        $scope.showPutIntoCart = function () {
            $scope.isShowPutIntoCart = true;
        };

        $scope.changeCount = function (op) {
            if (op == "+") {
                $scope.count++;
            } else {
                if ($scope.count > 1) {
                    $scope.count--;
                }

            }
        }
    })
    .controller('CartController', function ($scope, $state, $location, Cart, Auth, User) {
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                }else{
                    User.setUser(data.user);
                }
            })
        });

    })
    .controller('UserController', function ($scope, $state, Auth, User) {
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                }else{
                    $scope.user=data.user;
                    User.setUser(data.user);
                }
            })
        });

        $scope.logout=function(){
            console.log('logout');
        }
    })
    .controller('LoginController', function ($scope, $state, Auth, User) {
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (data.flag) {
                    User.setUser(data.user);
                    $state.go('tab.user');
                }
            })
        });

        $scope.goReg = function () {
            $state.go('tab.register');
        }
    })
    .controller('RegisterController', function ($scope, $state, Auth, Verify, User) {
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (data.flag) {
                    User.setUser(data.user);
                    $state.go('tab.user');
                }
            })
        });
        $scope.canClick=true;
        $scope.regtext='注册';
        $scope.errmsg='';
        $scope.register=function(){
            if(!Verify.isUserName($scope.user.username)){
                $scope.errmsg='用户名只能由数字字母下划线及汉字组成,长度在3到20之间';
                return false;
            }
            if(!Verify.isTel($scope.user.tel)){
                $scope.errmsg='请输入正确的手机号';
                return false;
            }
            if(!Verify.isPassword($scope.user.password)){
                console.log($scope.user.password);
                $scope.errmsg='密码只能有数字字母组成,长度在6到15之间';
                return false;
            }
            if(!Verify.isRepassword($scope.user.password,$scope.user.confirmpassword)){
                $scope.errmsg='两次输入的密码不一致';
                return false;
            }
            $scope.errmsg='';
            $scope.canClick=false;
            $scope.regtext='正在注册...';
            User.register($scope.user).then(function(data){
                if(data.flag){
                    User.setUser($scope.user);
                    $state.go('tab.user');
                }else{
                    $scope.errmsg=data.errmsg;
                    $scope.canClick=true;
                    $scope.regtext='注册';
                }
            })
        };

        $scope.goLogin = function () {
            $state.go('tab.login');
        };
    })
    .controller('OrderListController', function ($scope, $state, Auth, User) {
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                }else{
                    User.setUser(data.user);
                }
            })
        });
        $scope.orderType = 0;
    })
    .controller('AddrListController', function ($scope, $state, Auth, User) {
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                }else{
                    User.setUser(data.user);
                }
            })
        });
    })
    .controller('AddressController',function($scope,$state,Auth,User){
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                }else{
                    User.setUser(data.user);
                }
            })
        });
        $scope.canDel=true;
        if($state.params.Addressid==0){
            $scope.canDel=false;
        }
    })
    .controller('UserInfoController',function($scope,$state,Auth,User){
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                }else{
                    User.setUser(data.user);
                }
            })
        });
    })
    .controller('PasswordController',function($scope,$state,Auth,User){
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                }else{
                    User.setUser(data.user);
                }
            })
        });
    })