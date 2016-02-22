angular.module('starter.filters',[])
    .filter('explode',function(){
        return function(data,delimiter){
            if(angular.isString(data)&&angular.isString(delimiter)){
                return data.split(delimiter);
            }else{
                return data;
            }
        }
    });
