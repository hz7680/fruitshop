// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.filters'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {

        //$httpProvider.defaults.withCredentials=true;

        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('left');

        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');

        $stateProvider
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'resources/views/templates/tabs.html'
            })
            .state('tab.index', {
                url: '/index',
                views: {
                    'tab-index': {
                        templateUrl: 'resources/views/templates/tab-index.html',
                        controller: 'IndexController'
                    }
                }
            })
            .state('tab.product',{
                url:'/product/:Productid',
                views:{
                    'tab-index':{
                        templateUrl:'resources/views/templates/tab-product.html',
                        controller:'ProductController'
                    }
                }
            })
            .state('tab.product.info',{
                views:{
                    'content':{
                        templateUrl:'resources/views/templates/product-info.html'
                    }
                }
            })
            .state('tab.product.comment',{
                views:{
                    'content':{
                        templateUrl:'resources/views/templates/product-comment.html'
                    }
                }
            })
            .state('tab.cart',{
                url:'/cart',
                views:{
                    'tab-cart':{
                        templateUrl:'resources/views/templates/tab-cart.html',
                        controller:'CartController'
                    }
                }
            })
            .state('tab.confirmOrder',{
                url:'/confirmOrder',
                views:{
                    'tab-cart':{
                        templateUrl:'resources/views/templates/cart-confirmOrder.html',
                        controller:'ConfirmOrderController'
                    }
                }
            })
            .state('tab.user',{
                url:'/user',
                views:{
                    'tab-user':{
                        templateUrl:'resources/views/templates/tab-user.html',
                        controller:'UserController'
                    }
                }
            })
            .state('tab.login',{
                url:'/login',
                views:{
                    'tab-user':{
                        templateUrl:'resources/views/templates/user-login.html',
                        controller:'LoginController'
                    }
                }
            })
            .state('tab.register',{
                url:'/register',
                views:{
                    'tab-user':{
                        templateUrl:'resources/views/templates/user-register.html',
                        controller:'RegisterController'
                    }
                }
            })
            .state('tab.orderList',{
                url:'/orderList',
                views:{
                    'tab-user':{
                        templateUrl:'resources/views/templates/user-orderList.html',
                        controller:'OrderListController'
                    }
                }
            })
            .state('tab.order',{
                url:'/order/:OrderId',
                views:{
                    'tab-user':{
                        templateUrl:'resources/views/templates/user-order.html',
                        controller:'OrderController'
                    }
                }
            })
            .state('tab.comment',{
                url:'/comment/:OrderItemId/:ProductId',
                views:{
                    'tab-user':{
                        templateUrl:'resources/views/templates/user-comment.html',
                        controller:'CommentController'
                    }
                }
            })
            .state('tab.addrList',{
                url:'/addrList',
                views:{
                    'tab-user':{
                        templateUrl:'resources/views/templates/user-addrList.html',
                        controller:'AddrListController'
                    }
                }
            })
            .state('tab.address',{
                url:'/address/:Addressid',
                views:{
                    'tab-user':{
                        templateUrl:'resources/views/templates/user-address.html',
                        controller:'AddressController'
                    }
                }
            })
            .state('tab.userinfo',{
                url:'/userinfo',
                views:{
                    'tab-user':{
                        templateUrl:'resources/views/templates/user-userinfo.html',
                        controller:'UserInfoController'
                    }
                }
            })
            .state('tab.password',{
                url:'/password',
                views:{
                    'tab-user':{
                        templateUrl:'resources/views/templates/user-password.html',
                        controller:'PasswordController'
                    }
                }
            })


        $urlRouterProvider.otherwise('/tab/index');

    });