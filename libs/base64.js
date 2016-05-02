var base64EncoderChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function addZero(number, length) {
    return Array(length-number.length+1).join("0")+number;
}

function appendZero(number, length){
    return number+Array(length-number.length+1).join("x");
}

function base64Encode (str) {
    var sum = '';
    for(var i=0,length = str.length;i<str.length;i++) {
        var num2 = addZero(str[i].charCodeAt(0).toString(2), 8);
        sum += num2;
    }
    // need append zero
    sum = appendZero(sum, 8*Math.ceil(sum.length/6));
    var result = '';
    for(i=0,length=sum.length;i<length;i+=6) {
        var substring = sum.substr(i,6);
        var encode;
        if(substring == 'xxxxxx') {
            encode ='=';
        } else {
            var code  = parseInt(substring.replace(/x/g,'0'),2);
            encode = base64EncoderChars[code];
        }
       result+=encode;
    }
    return result;
}

function base64Decode (str) {
    var sum = '';
    for(var i=0;i<str.length;i++) {
        if( str[i] != '=' ){
            var num10 = base64EncoderChars.indexOf(str[i]);
            var num2 = addZero(num10.toString(2),6);
            sum += num2;
        }
    }
    var result = '';
    for(i=0;i<sum.length;i+=8) {
        var substring = sum.substr(i,8);
         var decode = String.fromCharCode(parseInt(substring,2));
         result += decode;
    }
    return result;
}

// Testing

var str = 'a:aa';
var strEncoded = base64Encode(str);
console.log("'"+str+"' has been encoded as:"+strEncoded);

var strDecoded = base64Decode(strEncoded);
console.log("'"+strEncoded+"' has been decoded as:"+strDecoded+'.');

