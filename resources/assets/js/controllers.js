angular.module('starter.controllers', [])
    .controller('IndexController', function ($scope, $state, $ionicSlideBoxDelegate, $location, $timeout, Banners, Products, Auth, User, Cart) {
        $scope.showSuccess = false;
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

        $scope.getListByRequirement = function (isnew, type) {
            if (isnew) {
                $scope.type = '';
                $scope.isnew = true;
                if (Products.setIsnew(isnew)) {
                    $scope.products = [];
                    $scope.loadMore();
                }
            }
            if (type) {
                $scope.isnew = '';
                $scope.type = type;
                if (Products.setType(type)) {
                    $scope.products = [];
                    $scope.loadMore();
                }
            }
        };

        $scope.putIntoCart = function (id) {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                } else {
                    $scope.user = data.user;
                    User.setUser(data.user);
                    var cart = {
                        count: 1,
                        product_id: id
                    };
                    Cart.putIntoCart(cart).then(function (data) {
                        if (data == 'ok') {
                            $scope.showSuccess = true;
                            $timeout(function () {
                                $scope.showSuccess = false;
                            }, 2000);
                        }
                    })
                }
            });
        };
        $scope.showBuy = false;
        $scope.showBuyNow = function (id) {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                } else {
                    User.setUser(data.user);
                    $scope.showBuy = true;
                    Products.getProduct(id).then(function (data) {
                        $scope.buyProduct = data;
                        $scope.buyProduct.count = 1;
                    });
                }
            });

        };
        $scope.closeBuyNow = function () {
            $scope.showBuy = false;
        };
        $scope.changeCount = function (op) {
            if (op == '+') {
                $scope.buyProduct.count++;
            } else {
                if ($scope.buyProduct.count > 1) {
                    $scope.buyProduct.count--;
                }
            }
        };
        $scope.buyNow = function () {
            Cart.setProductId($scope.buyProduct.id);
            Cart.setCount($scope.buyProduct.count);
            $scope.showBuy = false;
            $state.go('tab.confirmOrder');
        }
    })
    .controller('ProductController', function ($scope, $state, $sce, $timeout, $ionicSlideBoxDelegate, Products, Auth, User, Cart) {
        $scope.cart = {
            count: 1,
            product_id: $state.params.productid
        };
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
                $scope.cart.count++;
            } else {
                if ($scope.cart.count > 1) {
                    $scope.cart.count--;
                }

            }
        };

        $scope.putIntoCart = function (id) {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                } else {
                    $scope.user = data.user;
                    User.setUser(data.user);
                    var cart = {
                        count: $scope.cart.count,
                        product_id: id
                    };
                    Cart.putIntoCart(cart).then(function (data) {
                        if (data == 'ok') {
                            $scope.showSuccess = true;
                            $scope.isShowPutIntoCart = false;
                            $timeout(function () {
                                $scope.showSuccess = false;
                            }, 2000);
                        }
                    })
                }
            });
        };

    })
    .controller('CartController', function ($scope, $state, $location, Cart, Auth, User) {
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                } else {
                    User.setUser(data.user);
                    Cart.getCart().then(function (data) {
                        $scope.carts = data;
                    });
                    $scope.lastIndex = -1;
                    $scope.selectedCart = [];
                    $scope.totalPrice = (0).toFixed(2);
                }
            });

        });
        $scope.$on('$ionicView.beforeLeave', function () {
            if ($scope.lastIndex >= 0) {
                Cart.changeCount({id: $scope.carts[$scope.lastIndex].id, count: $scope.carts[$scope.lastIndex].count});
            }
        });


        $scope.changeCount = function (index, op) {
            if ($scope.lastIndex >= 0) {
                if ($scope.lastIndex != index) {
                    Cart.changeCount({
                        id: $scope.carts[$scope.lastIndex].id,
                        count: $scope.carts[$scope.lastIndex].count
                    });
                    $scope.lastIndex = index
                }
            } else {
                $scope.lastIndex = index;
            }
            if (op == "+") {
                $scope.carts[index].count++;
            } else {
                if ($scope.carts[index].count > 1) {
                    $scope.carts[index].count--;
                }
            }
            $scope.totalPrice = totalprice();
        };

        $scope.select = function (index) {
            if ($scope.selectedCart.indexOf(index) >= 0) {
                $scope.selectedCart.splice($scope.selectedCart.indexOf(index), 1);
            } else {
                $scope.selectedCart.push(index);
            }
            $scope.totalPrice = totalprice();
        };

        var totalprice = function () {
            _totalprice = 0;
            for (var i = 0; i < $scope.selectedCart.length; i++) {
                _totalprice += $scope.carts[$scope.selectedCart[i]].price * $scope.carts[$scope.selectedCart[i]].count;
            }
            return _totalprice.toFixed(2);
        };

        $scope.checkout = function () {
            var idArr = [];
            for (var i = 0; i < $scope.selectedCart.length; i++) {
                idArr.push($scope.carts[$scope.selectedCart[i]].id)
            }
            Cart.setCart(idArr);
            $state.go('tab.confirmOrder')
        }

    })
    .controller('ConfirmOrderController', function ($scope, $state, $location, $ionicModal, Auth, User, Address, Cart, Products) {
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                } else {
                    $scope.user = data.user;
                    User.setUser(data.user);
                    if (Cart.getCartIds().length <= 0 && Cart.getProductId() < 0) {
                        $state.go('tab.cart');
                    } else {
                        if (Cart.getProductId() >= 0) {
                            Products.getProduct(Cart.getProductId()).then(function (data) {
                                $scope.carts = [];
                                $scope.carts[0] = {
                                    product: data,
                                    count: Cart.getCount()
                                };
                                $scope.totalPrice = data.price * Cart.getCount();
                            })
                        } else {
                            Cart.getConfirmCart().then(function (data) {
                                $scope.carts = data;
                                $scope.totalPrice = 0;
                                for (var i = 0; i < $scope.carts.length; i++) {
                                    $scope.totalPrice += $scope.carts[i].count * $scope.carts[i].product.price;
                                }
                            })
                        }
                    }
                }
            })
        });
        $scope.$on('$ionicView.beforeLeave', function () {
            Cart.setCart([]);
            Cart.setProductId(-1);
        });
        $ionicModal.fromTemplateUrl('resources/views/templates/cart-confirmOrder-chooseAddress.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.chooseAddress = function () {
            $scope.modal.show();
        };
        $scope.choose = function (index) {
            $scope.selectedAddressIndex = index;
            $scope.modal.hide();
        };
        Address.getAddrList().then(function (data) {
            $scope.addrList = data;
            $scope.selectedAddressIndex = -1;
            for (var i = 0; i < $scope.addrList.length; i++) {
                if ($scope.addrList[i].isdefault == 1) {
                    $scope.selectedAddressIndex = i;
                    break;
                }
            }
            $scope.selectedAddressIndex < 0 ? 0 : $scope.selectedAddressIndex;
        });
        $scope.checkout = function () {
            var obj = {
                address: $scope.addrList[$scope.selectedAddressIndex],
                carts: $scope.carts
            };

            Cart.createOrder(obj).then(function (data) {
                if (data) {
                    $location.url('tab/order/'+data);
                }
            })
        };

    })
    .controller('UserController', function ($scope, $state, Auth, User) {
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                } else {
                    $scope.user = data.user;
                    User.setUser(data.user);
                }
            })
        });

        $scope.logout = function () {
            User.logout().then(function (data) {
                if (data == 'ok') {
                    $state.go('tab.login');
                }
            })
        }
    })
    .controller('LoginController', function ($scope, $state, Auth, User) {
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (data.flag) {
                    User.setUser(data.user);
                    $state.go('tab.user');
                } else {
                    $scope.user = {
                        username: '',
                        password: ''
                    };
                    $scope.errmsg = '';
                }
            })
        });

        $scope.login = function () {
            if ($scope.user.username == '') {
                $scope.errmsg = '请输入用户名';
                return false;
            }
            if ($scope.user.password == '') {
                $scope.errmsg = '请输入密码';
                return false;
            }
            User.login($scope.user).then(function (data) {
                if (data.flag) {
                    $state.go('tab.user');
                } else {
                    $scope.errmsg = '用户名或密码错误';
                }
            })
        };

        $scope.goReg = function () {
            $state.go('tab.register');
        };
    })
    .controller('RegisterController', function ($scope, $state, Auth, Verify, User) {
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (data.flag) {
                    User.setUser(data.user);
                    $state.go('tab.user');
                }
                $scope.user = {
                    username: '',
                    tel: '',
                    password: '',
                    confirmpassword: ''
                };
            })
        });
        $scope.canClick = true;
        $scope.regtext = '注册';
        $scope.errmsg = '';
        $scope.register = function () {
            if (!Verify.isUserName($scope.user.username)) {
                $scope.errmsg = '用户名只能由数字字母下划线及汉字组成,长度在3到20之间';
                return false;
            }
            if (!Verify.isTel($scope.user.tel)) {
                $scope.errmsg = '请输入正确的手机号';
                return false;
            }
            if (!Verify.isPassword($scope.user.password)) {
                console.log($scope.user.password);
                $scope.errmsg = '密码只能由数字字母组成,长度在6到15之间';
                return false;
            }
            if (!Verify.isRepassword($scope.user.password, $scope.user.confirmpassword)) {
                $scope.errmsg = '两次输入的密码不一致';
                return false;
            }
            $scope.errmsg = '';
            $scope.canClick = false;
            $scope.regtext = '正在注册...';
            User.register($scope.user).then(function (data) {
                if (data.flag) {
                    User.setUser($scope.user);
                    $state.go('tab.user');
                } else {
                    $scope.errmsg = data.errmsg;
                    $scope.canClick = true;
                    $scope.regtext = '注册';
                }
            })
        };

        $scope.goLogin = function () {
            $state.go('tab.login');
        };
    })
    .controller('OrderListController', function ($scope, $state, $ionicPopup, Auth, User, Order) {
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                } else {
                    User.setUser(data.user);
                    Order.getOrderList().then(function (data) {
                        $scope.allOrder = data;
                        $scope.orderList = data;
                    });
                    $scope.orderType = 0;
                }
            })
        });
        $scope.select = function (type) {
            if (type != $scope.orderType) {
                $scope.orderType = type;
                $scope.orderList = [];
                if (type == 0) {
                    $scope.orderList = $scope.allOrder;
                }
                if (type == 1) {
                    for (var i = 0; i < $scope.allOrder.length; i++) {
                        if ($scope.allOrder[i].iscanceled == 0 && $scope.allOrder[i].ispayed == 0) {
                            $scope.orderList.push($scope.allOrder[i]);
                        }
                    }
                }
                if (type == 2) {
                    for (var i = 0; i < $scope.allOrder.length; i++) {
                        if ($scope.allOrder[i].iscanceled == 0 && $scope.allOrder[i].ispayed == 1 && $scope.allOrder[i].isreceived == 0) {
                            $scope.orderList.push($scope.allOrder[i]);
                        }
                    }
                }
            }
        };
        $scope.cancelOrder=function(id){
            Order.cancelOrder(id).then(function(data){
                if(data=='ok'){
                    for(var i=0;i<$scope.orderList.length;i++){
                        if($scope.orderList[i].id==id){
                            $scope.orderList[i].iscanceled=1;
                            break;
                        }
                    }
                }
            });
        };
        $scope.confirmReceived = function (id) {
            var confirmPopup = $ionicPopup.confirm({
                title: '确认收货',
                template: '请确认您已经收到货物后再点击确认收货',
                buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
                    text: '确认收货',
                    type: 'button-assertive button-small',
                    onTap: function(e) {
                        // 当点击时，e.preventDefault() 会阻止弹窗关闭。
                        return true;
                    }
                }, {
                    text: '取消',
                    type: 'button-light button-small',
                    onTap: function(e) {
                        // 返回的值会导致处理给定的值。
                        return false;
                    }
                }]
            });
            confirmPopup.then(function (res) {
                if (res) {
                    Order.confirmReceived(id).then(function(data){
                        if(data=='ok'){
                            for(var i=0;i<$scope.orderList.length;i++){
                                if($scope.orderList[i].id==id){
                                    $scope.orderList[i].isreceived=1;
                                    break;
                                }
                            }
                        }
                    })
                }
            });
        }
    })
    .controller('OrderController',function($scope, $state, $ionicPopup, Auth, User, Products, Order){
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                } else {
                    User.setUser(data.user);
                    Order.getOrder($state.params.OrderId).then(function(data){
                        if(data){
                            $scope.order=data;
                        }
                    })
                }
            })
        });
        $scope.confirmReceived = function (id) {
            var confirmPopup = $ionicPopup.confirm({
                title: '确认收货',
                template: '请确认您已经收到货物后再点击确认收货',
                buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
                    text: '确认收货',
                    type: 'button-assertive button-small',
                    onTap: function(e) {
                        // 当点击时，e.preventDefault() 会阻止弹窗关闭。
                        return true;
                    }
                }, {
                    text: '取消',
                    type: 'button-light button-small',
                    onTap: function(e) {
                        // 返回的值会导致处理给定的值。
                        return false;
                    }
                }]
            });
            confirmPopup.then(function (res) {
                if (res) {
                    Order.confirmReceived(id).then(function(data){
                        if(data=='ok'){
                            $scope.order.isreceived=1;
                        }
                    })
                }
            });
        };
        $scope.checkout=function(id){
            console.log('付款');
        }
    })
    .controller('CommentController',function($scope, $state, $ionicPopup, Auth, User, Products, Order){
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                } else {
                    User.setUser(data.user);
                    Products.getProduct($state.params.ProductId).then(function(data){
                        $scope.product=data;
                    })
                }
            })
        });
        $scope.postComment=function(){
            if($scope.comment){
                $scope.errmsg='';
                Order.postComment({id:$state.params.OrderItemId,comment:$scope.comment}).then(function(data){
                    if(data=='ok'){
                        $state.go('tab.orderList');
                    }
                })
            }else{
                $scope.errmsg='请输入评论';
            }
        }
    })
    .controller('AddrListController', function ($scope, $state, Auth, User, Address) {
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                } else {
                    User.setUser(data.user);
                    Address.getAddrList().then(function (data) {
                        $scope.addrList = data;
                    })
                }
            })
        });

        $scope.del = function (id) {
            if (confirm('确定要删除该地址吗')) {
                Address.delAddress(id).then(function (data) {
                    if (data == 'ok') {
                        for (var i = 0; i < $scope.addrList.length; i++) {
                            if ($scope.addrList[i].id == id) {
                                $scope.addrList.splice(i, 1);
                                break;
                            }
                        }
                    }
                })
            }
        }
    })
    .controller('AddressController', function ($scope, $state, Auth, User, Address) {
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                } else {
                    User.setUser(data.user);
                }
                if ($state.params.Addressid == 0) {
                    $scope.address = {
                        id: $state.params.Addressid,
                        name: '',
                        tel: '',
                        province: '',
                        city: '',
                        area: '',
                        address: '',
                        isdefault: 0
                    };
                } else {
                    Address.getAddress($state.params.Addressid).then(function (data) {
                        $scope.address = data;
                    });
                }

                $scope.errmsg = '';
            })
        });
        $scope.canDel = true;
        if ($state.params.Addressid == 0) {
            $scope.canDel = false;
        }

        $scope.save = function () {
            if ($scope.address.name == '') {
                $scope.errmsg = '请输入收件人姓名';
                return false;
            }
            if ($scope.address.tel == '') {
                $scope.errmsg = '请输入收件人联系电话';
                return false;
            }
            if ($scope.address.province == '') {
                $scope.errmsg = '请输入所在省份';
                return false;
            }
            if ($scope.address.city == '') {
                $scope.errmsg = '请输入所在城市';
                return false;
            }
            if ($scope.address.area == '') {
                $scope.errmsg = '请输入所在区域';
                return false;
            }
            if ($scope.address.address == '') {
                $scope.errmsg = '请输入详细地址';
                return false;
            }
            Address.saveAddress($scope.address).then(function (data) {
                if (data == 'ok') {
                    $state.go('tab.addrList')
                }
            })
        };
        $scope.del = function (id) {
            console.log(id);
            if (confirm('确定要删除该地址吗')) {
                Address.delAddress(id).then(function (data) {
                    if (data == 'ok') {
                        $state.go('tab.addrList');
                    }
                })
            }
        }
    })
    .controller('UserInfoController', function ($scope, $state, Auth, User, Verify) {
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                } else {
                    User.setUser(data.user);
                    $scope.user = User.getUser();
                    $scope.errmsg = '';
                }
            })
        });

        $scope.saveEdit = function () {
            if ($scope.user.tel == '' || !Verify.isTel($scope.user.tel)) {
                $scope.errmsg = '请输入正确的手机号';
                return false;
            }
            if ($scope.user.email) {
                if (!Verify.isEmail($scope.user.email)) {
                    $scope.errmsg = '请输入正确的email';
                    return false;
                }
            }
            User.edit($scope.user).then(function (data) {
                if (data == 'ok') {
                    $state.go('tab.user');
                }
            })
        }

    })
    .controller('PasswordController', function ($scope, $state, Auth, User, Verify) {
        $scope.$on('$ionicView.beforeEnter', function () {
            Auth.isLogin().then(function (data) {
                if (!data.flag) {
                    $state.go('tab.login');
                } else {
                    User.setUser(data.user);
                    $scope.password = {};
                    $scope.errmsg = '';
                }
            })
        });

        $scope.edit = function () {
            if (!$scope.password.old) {
                $scope.errmsg = '请输入原始密码';
                return false;
            }
            if (!$scope.password.new || !Verify.isPassword($scope.password.new)) {
                $scope.errmsg = '密码只能由数字字母组成,长度在6到15之间';
                return false;
            }
            if (!Verify.isRepassword($scope.password.new, $scope.password.confirm)) {
                $scope.errmsg = '两次密码输入不一致';
                return false;
            }
            User.editPassword($scope.password).then(function (data) {
                if (data.flag) {
                    $state.go('tab.user');
                } else {
                    $scope.errmsg = data.errmsg;
                }
            })
        }
    })