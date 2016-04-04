VERSION = "v1.4.0";


function version(){
    var msg;
    var responseobj;
    var request = new XMLHttpRequest();

    request.onload = function(){
        responseobj = JSON.parse(this.responseText);
        if(responseobj.tag_name != VERSION && this.status == 200){
            msg = responseobj.tag_name;
        }
    };

    request.open("get",
            "http://api.github.com/repos/fuyuneko/startpage/releases/latest",
            false);
    request.send();

    return msg;
}



function fixJitter(container){
    container.style.height = window.innerHeight - 0.5 + "px";
}


function popup(obj, msg){
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


// expanding and contracting squares
function expand(){
    if(this.acount > 0){
        this.style.height = 300 + 25*this.acount + "px";
    }else{
        this.style.height = "337px";
    }
    if(cfg_bool[0]){
        this.style.borderWidth = cfg[10];
    }
}


function contract(){
    this.style.height = "150px";
    this.style.borderWidth = cfg[9];
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
            if(replacement == ""){
                i--;
            }
        }
    }
    return str;
}


function search(query){
    if(query[0] == searchsquare.prefix){
        if(query.substr(1) == "help"){
            popup(popupDiv, HelpText);
        }else if(query.substr(1) == "config"){
            configmenuInit(undefined);
        }else{
            for(var i=1; i < searchsquare.links.length; i++){
                if(query[1] == searchsquare.links[i].opt){
                    query = query.substr(3);
                    window.location = searchsquare.links[i].url +
                            query.replaceChars(" ", searchsquare.links[i].space);
                }
            }
        }
    }else{
        window.location = searchsquare.links[0].url +
                query.replaceChars(" ", searchsquare.links[0].space);
    }
}



window.onresize = function(){
    fixJitter(container);
}


function main(){
    if(cfg_bool[3]){
        var ver = version();
        if(ver){
            var versionDiv =  document.createElement("div");
            versionDiv.setAttribute("id", "version");
            
            var versionAnchor = document.createElement("a");
            versionAnchor.href = "https://github.com/fuyuneko/startpage/releases";
            versionAnchor.appendChild(document.createTextNode("A new version is available: " + ver));

            versionDiv.appendChild(versionAnchor);
            document.body.appendChild(versionDiv);
        }
    }

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
    /*
    var sqr = document.querySelectorAll(".sqr");
    if(!cfg_bool[1]){
        for(var i = 0; i < sqr.length; ++i){
            sqr[i].acount = sqr[i].getElementsByTagName("a").length;
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
    */
}


configmenuInit(main);
