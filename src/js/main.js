$(document).ready(function() {
        $("form").submit(function(e) {
            e.preventDefault();
            var fullURL = $("#fullURL").val().toLowerCase();
            var shortenURL = $("#shortenURL").val();
            
            var service = $("#service").find(":selected").val();
            
            //clean
            $("#error").text("");
            $("#shortenURL").text("");
            $("#qrcode").text("");

            if (!isUrl(fullURL)) {
                //Error
                $("#form").removeClass("has-success").addClass("has-error");
                $(".glyphicon").removeClass("glyphicon-ok").addClass("glyphicon-remove");    
                $("#error").show();
                $("#error").text("URL format is not correct");
                $("#click-to-copy").hide();
        
            } else {
                //Success
                $("#form").removeClass("has-error").addClass("has-success");
                $(".glyphicon").removeClass("glyphicon-remove").addClass("glyphicon-ok");
                $("#error").hide();
                makeRequest();
                $("#click-to-copy").show();
            }
            

        });

        $("#clean").click(function() {
            $("#fullURL").val("");
            $("#error").hide();
            $("#error").text("");
            $("#click-to-copy").hide();
            $("#shortenURL").text("");
            $("#qrcode").text("");
            $("#form").removeClass("has-error").removeClass("has-success");
            $(".glyphicon").removeClass("glyphicon-remove").removeClass("glyphicon-ok");
        });



        var client = new ZeroClipboard( $("#click-to-copy"), {
              moviePath: "./flash/ZeroClipboard.swf",
              debug: false
        } );


        client.on( "load", function(client) {
                client.on( "complete", function(client, args) {
                    client.setText( args.text );                   
                } );
        } );

        $("#click-to-copy").tooltip();
       
});

function makeRequest() {
    var service = $("#service").find(":selected").val();
    switch (service) {
        case "g":
            getGoogle();
            break;
        case "b":
            getBitly();
            break;
        case "t":
            getTinyURL();
            break;
        case "i":
            getIsgd();
            break; 
        case "v":
            getVgd();
            break;         
        default:
            Google();
            break;
    }
}
function getGoogle() {
        var fullURL = $("#fullURL").val().toLowerCase();
        var request = gapi.client.urlshortener.url.insert({
          'resource': {
              'longUrl': fullURL
            }
        });

        request.execute(function(response) {
        
            if(response.id != null) {
                var s = response.id;
                $("#shortenURL").text(s);
                get_QRCode(s);
            }
            else {
                $("#error").show();
                $("#error").text("error: creating short url: goo.gl");
            }
        });
}

function getBitly() {
        var username = "o_4qkhbs5vl0";
        var key = "R_3773937f1ac64e88ae4fe130d6356681";
        var fullURL = $("#fullURL").val().toLowerCase();

        $.ajax({
            url:"http://api.bit.ly/v3/shorten",
            data:{longUrl:fullURL,apiKey:key,login:username},
            dataType:"jsonp",
            success:function(v) {
                var s =v.data.url;
                $("#shortenURL").text(s);
                get_QRCode(s);
            },
            error: function(){
                $("#error").show();
                $("#error").text("error: creating short url: bit.ly");
            }
        });

}

function getTinyURL() {
        var fullURL = $("#fullURL").val().toLowerCase();

        $.getJSON(
          "http://urltinyfy.appspot.com/tinyurl?url="+encodeURIComponent(fullURL)+"&callback=?",
          //{url: fullURL},
          function(data){
                var s =data.tinyurl;
                    $("#shortenURL").text(s);
                    get_QRCode(s);
          }
        );
}

function getIsgd() {
        var fullURL = $("#fullURL").val().toLowerCase();

        $.getJSON(
          "http://urltinyfy.appspot.com/isgd?url="+encodeURIComponent(fullURL)+"&callback=?",
          //{url: fullURL},
          function(data){
                var s =data.tinyurl;
                    $("#shortenURL").text(s);
                    get_QRCode(s);
          }
        );
}

function getVgd()  {
        var fullURL = $("#fullURL").val().toLowerCase();

        $.getJSON(
          "http://urltinyfy.appspot.com/vgd?url="+encodeURIComponent(fullURL)+"&callback=?",
          //{url: fullURL},
          function(data){
                var s =data.tinyurl;
                    $("#shortenURL").text(s);
                    get_QRCode(s);
          }
        );
}

function load() {
        $("#error").hide();
        $("#error").addClass("isa_error");        
        $("#click-to-copy").hide();

        gapi.client.setApiKey('AIzaSyAFPETEhOLJGMLUq9Ql_o3lyJtvJ5IUaqo');
        gapi.client.load('urlshortener', 'v1', function(){});
}
window.onload = load;
    
function get_QRCode(text) {
    
    //console.log("text= " + text);

    var size = 120;
            
    jQuery('#qrcode').qrcode({width: size ,height: size ,text: text});

}    

function isUrl(url) {
   var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
        + "[a-z]{2,6})" // first level domain- .com or .museum
        //+ "(:[0-9]{1,4})?" // 端口- :80
        + "((/?)|" // a slash isn't required if there is no file name
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
     var re=new RegExp(strRegex);
     return re.test(url);
}

