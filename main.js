VERSION = "v2.2.0";


function version(msg){
    var responseobj;
    var request = new XMLHttpRequest();

    request.onload = function(){
        responseobj = JSON.parse(this.responseText);
        if(responseobj.tag_name != VERSION){
            msg = "<u><a href='https://github.com/yukisuki/\
                        startpage/releases'>" + responseobj.tag_name +
                        " is available!</a></u><br>" + msg;
        }
    };

    request.open("get", "http://api.github.com/repos/yukisuki/startpage/releases/latest", false);
    request.send();

    return msg;
}



function fixJitter(container){
    container.style.height = window.innerHeight - 0.5 + "px";
}


function popup(obj, msg){
    if(cfg_bool[3]){
        msg = version(msg);
    }

    var popuphandler = function(){
        popup(this, msg);
    }
    // add event listener when it's going to be visible
    if(!visibility){
        obj.addEventListener("click", popuphandler);
        obj.innerHTML = msg;
        obj.style.bottom = "-" + cfg[9];
    }else{
        obj.removeEventListener("click", popuphandler);
        obj.style.bottom = "-200px";
    }
    visibility = !visibility;
}


Object.prototype.anchorCount = function(){
    return this.getElementsByTagName("a").length;
}



// expanding and contracting squares
function expand(){
    if(this.acount > 0){
        this.style.height = 300 + 25*this.acount + "px";
    }else{
        this.style.height = "337px";
    }
    if(cfg_bool[0]){
        this.style.borderTop = cfg[9] + " solid " + cfg[8];
        this.style.borderBottom = cfg[9] + " solid " + cfg[8];
    }
}


function contract(){
    this.style.height = "150px";
    this.style.borderTop = "0 solid" + cfg[8];
    this.style.borderBottom = "0 solid" + cfg[8];
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


function searchCase(url, query, replacement){
    query = query.substr(3);
    window.location = url + query.replaceChars(" ", replacement);
}

function search(query){
    switch(query.substr(0, 2)){
        case "-h":
            popup(popupDiv, HelpText);
            break;
        case "-c":
            configmenuInit(undefined);
            break;
        case "-g":
            searchCase("https://www.google.com/#q=", query, "+");
            break;
        case "-w":
            searchCase("https://en.wikipedia.org/w/index.php?search=", query, "+");
            break;
        case "-a":
            searchCase("https://wiki.archlinux.org/index.php?search=", query, "+");
            break;
        case "-d":
            searchCase("http://danbooru.donmai.us/posts?tags=", query, "+");
            break;
        case "-y":
            searchCase("https://www.youtube.com/results?search_query=", query, "+");
            break;
        case "-n":
            searchCase("http://www.nicovideo.jp/search/", query, "%20");
            break;
        case "-p":
            searchCase("http://www.pixiv.net/search.php?s_mode=s_tag&word=", query, "%20");
            break;
        default:
            window.location = "https://www.google.com/#q=" + query.replaceChars(" ", "+");
    }
}



window.onresize = function(){
    fixJitter(container);
}


window.onload = function(){
    HelpText = "-h Shows this list<br>-g Google (default)<br>-w Wikipedia<br>\
                -a ArchWiki<br>-d Danbooru<br>-y YouTube<br>-n niconico<br>\
                -p pixiv";
    visibility = false;
    container = document.getElementById("container");
    fixJitter(container);
    popupDiv = document.getElementById("popup");
    // search
    var searchinput = document.getElementById("searchinput");
    if(!!searchinput){
        searchinput.addEventListener("keypress", function(a){
            var key = a.keyCode;
            if(key == 13){
                var query = this.value;
                search(query);
            }
        });
    }

    // jump to search when tab is pressed
    var search_sqr = document.getElementById("search_sqr");
    document.addEventListener("keypress", function(a){
        var key = a.keyCode;
        if(key == 9){
            search_sqr.style.height = "337px";
            search_sqr.style.borderTop = cfg[9] + " solid " + cfg[8];
            search_sqr.style.borderBottom = cfg[9] + " solid " + cfg[8];
            document.getElementById("searchinput").focus();
        }
    
        if([9].indexOf(key) > -1){
            a.preventDefault();
        }
    });

    // adding event listeners to squares or expanding them onload
    var sqr = document.querySelectorAll(".sqr");
    if(!cfg_bool[1]){
        for(var i = 0; i < sqr.length; ++i){
            sqr[i].acount = sqr[i].anchorCount();
            sqr[i].addEventListener("mouseover", expand, false);
            sqr[i].addEventListener("mouseout", contract, false);
        }
    }else{
        for(var i = 0; i < sqr.length; ++i){
            var a = 0;
            for(var x = 0; x < sqr.length; ++x){
                if(a < sqr[x].getElementsByTagName("a").length){
                    a = sqr[x].getElementsByTagName("a").length;
                }
            }
            sqr[i].style.height = 225 + 25*a + "px";
            if(cfg_bool[0]){
                sqr[i].style.borderTop = cfg[9] + " solid " + cfg[8];
                sqr[i].style.borderBottom = cfg[9] + " solid " + cfg[8];
            }
        }
    }
}


configmenuInit(main);

