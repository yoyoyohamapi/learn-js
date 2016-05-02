var a = [];
for(var i=0;i<10;i++) {
    (function(j){
        a[i] = function(){
            console.log(j);
        }
    })(i);
}

console.log(a[6]());