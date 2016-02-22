<!DOCTYPE html>
<html>
<head>
    <title>{{$webinfo['webtitle']}}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <link href="{{asset('resources/assets/lib/ionic/css/ionic.css')}}" rel="stylesheet">
    <link href="{{asset('resources/assets/css/style.css')}}" rel="stylesheet">
    <script src="{{asset('resources/assets/lib/ionic/js/ionic.bundle.js')}}"></script>
    <script src="{{asset('resources/assets/js/app.js')}}"></script>
    <script src="{{asset('resources/assets/js/controllers.js')}}"></script>
    <script src="{{asset('resources/assets/js/services.js')}}"></script>
    <script src="{{asset('resources/assets/js/filters.js')}}"></script>
    <script src="{{asset('resources/assets/lib/ionic/js/angular/angular-sanitize.min.js')}}"></script>
</head>
<body ng-app="starter">
    <ion-nav-view></ion-nav-view>
</body>
</html>
