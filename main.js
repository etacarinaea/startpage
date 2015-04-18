$.getJSON("config.json", function(data){
    window.cfg = [
        data.style.heading_font,
        data.style.link_font,
        data.style.heading_font_size,
        data.style.link_font_size,
        data.style.background,
        data.style.foreground,
        data.style.heading_color,
        data.style.link_color,
        data.style.border_color,
        data.style.border_width,
        data.style.search_color,
        data.style.search_bg_color,
        data.ext.ref,
        data.ext.bottom,
        data.ext.right,
        data.ext.height,
        data.ext.width,
        data.ext.opacity
    ];
    window.cfg_bool = [
        data.bool.borders,
        data.bool.simplesearch,
        data.bool.alwaysopen,
        data.bool.mascot
    ];
    $("span").css("fontFamily", cfg[0]);
    $("a").css("fontFamily", cfg[1]);
    $("span").css("fontSize", cfg[2]);
    $("a").css("fontSize", cfg[3]);
    $("body").css("backgroundColor", cfg[4]);
    $(".sqr").css("backgroundColor", cfg[5]);
    $("span").css("color", cfg[6]);
    $("a").css("color", cfg[7]);
    $(".sqr").css("borderTop", "0 solid " + cfg[8]);
    $(".sqr").css("borderBottom", "0 solid " + cfg[8]);
    $("#searchinput").css("color", cfg[10]);
    $("#searchinput").css("backgroundColor", cfg[11]);
    if(cfg_bool[3]){
        $("#bgimg").css("backgroundImage", "url('" +  cfg[12] + "')");
        $("#bgimg").css("bottom", cfg[13]);
        $("#bgimg").css("right", cfg[14]);
        $("#bgimg").css("height", cfg[15]);
        $("#bgimg").css("width", cfg[16]);
        $("#bgimg").css("opacity", cfg[17]);
    }else{
        $("#bgimg").css("backgroundImage", "");
    }
});

function evenContainerHeight(){
	if(window.innerHeight % 2 ==0){
		document.getElementById("container").style.height = window.innerHeight;
	}else{
		document.getElementById("container").style.height = window.innerHeight - 1;
	}
}

window.onresize = function(){
	evenContainerHeight();
}

window.onload = function(){
	evenContainerHeight();
    document.getElementById("searchinput").addEventListener("keypress", function search(a){
        var key = a.keyCode;
        if(key == 13){
            var query = this.value;
            if(!cfg_bool[1]){
                switch(query.substr(0,3)){
                    case "-g ":
                        query = query.substr(3);
                        window.location="https://www.google.com/#q=" + query.replaceChars(" ", "+");
                        break;
                    case "-a ":
                        query = query.substr(3);
                        window.location="https://duckduckgo.com/?q=" + query.replaceChars(" ", "+");
                        break;
                    case "-d ":
                        query = query.substr(3);
                        window.location="http://www.donmai.us/posts?tags=" + query.replaceChars(" ", "+");
                        break;
                    case "-y ":
                        query = query.substr(3);
                        window.location="https://www.youtube.com/results?search_query=" + query.replaceChars(" ", "+");
                        break;
                    case "-n ":
                        query = query.substr(3);
                        window.location="http://www.nicovideo.jp/search/" + query.replaceChars(" ", "%20");
                        break;
                    case "-p ":
                        query = query.substr(3);
                        window.location="http://www.pixiv.net/search.php?s_mode=s_tag&word=" + query.replaceChars(" ", "%20");
                        break;
                }
            }else{
                window.location="https://www.google.com/#q=" + query.replaceChars(" ", "+");
            }
        }
    });
    
    document.addEventListener("keypress", function search(a){
        var key = a.keyCode;
        if(key == 9){
            var search_sqr = document.getElementById("search_sqr")
            search_sqr.style.height=300+37+"px";
            search_sqr.style.borderTop= cfg[9] + " solid " + cfg[8];
            search_sqr.style.borderBottom= cfg[9] + " solid " + cfg[8];
            document.getElementById("searchinput").focus();
        }
    
        if([9].indexOf(key) > -1) {
            a.preventDefault();
        }
    });

    var sqr = document.querySelectorAll(".sqr");
    if(!cfg_bool[2]){
        for(var i = 0; i < sqr.length; ++i) {
            sqr[i].addEventListener("mouseover", expand, false);
            sqr[i].addEventListener("mouseout", contract, false);
        }
    }else{
        for(var i = 0; i < sqr.length; ++i){
            var a = 0;
            for(var x = 0; x < sqr.length; ++x){
                if(a<sqr[x].getElementsByTagName("a").length){
                    a = sqr[x].getElementsByTagName("a").length;
                }
            }
            sqr[i].style.height=225+25*a+"px";
            if(cfg_bool[0]){
                sqr[i].style.borderTop= cfg[9] + " solid " + cfg[8];
                sqr[i].style.borderBottom= cfg[9] + " solid " + cfg[8];
            }
        }
    }
}

function expand(){
	var acount = this.getElementsByTagName("a").length;
    var icount = this.getElementsByTagName("input").length;
    if(icount >= 1){
        this.style.height=300+37*icount+"px";
    }else{
        this.style.height=300+25*acount+"px";
    }
    if(cfg_bool[0]){
        this.style.borderTop= cfg[9] + " solid " + cfg[8];
        this.style.borderBottom= cfg[9] + " solid " + cfg[8];
    }
}
function contract(){
	this.style.height="150px";
	this.style.borderTop="0 solid" + cfg[8];
	this.style.borderBottom="0 solid" + cfg[8];
}

String.prototype.replaceChars = function(character, replacement){
    var str = this;
    var a;
    var b;
    for(var i=0; i < str.length; i++){
        if(str.charAt(i) == character){
            a = str.substr(0, i) + replacement;
            b = str.substr(i + 1);
            str = a + b;
        }
    }
    return str;
}

window.onunload = function(){
    delete window.cfg;
    delete window.cfg_bool;
}
