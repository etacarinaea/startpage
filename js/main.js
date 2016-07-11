VERSION = "v1.5.0";


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
    };
    // add event listener when it's going to be visible
    if(!visibility){
        obj.addEventListener("click", popuphandler);
        obj.innerHTML = msg;
        obj.style.bottom = "-" + data.style.border_width_normal;
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
    if(data.bool.borders){
        this.style.borderWidth = data.style.border_width_hovered;
    }
}


function contract(){
    this.style.height = "150px";
    this.style.borderWidth = data.style.border_width_normal;
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
            if(replacement === ""){
                i--;
            }
        }
    }
    return str;
};


function search(query){
    if(typeof searchsquare == 'undefined'){
        configmenuInit(undefined);
    }else if(query[0] == searchsquare.prefix){
        if(query.substr(1) == "help"){
            popup(popupDiv, HelpText);
        }else if(query.substr(1) == "config"){
            configmenuInit(undefined);
        }else{
            for(var i=0; i < searchsquare.links.length; i++){
                if(query[1] == searchsquare.links[i].opt){
                    query = query.substr(3);
                    window.location = searchsquare.links[i].url +
                            query.replaceChars(" ", searchsquare.links[i].space);
                    break;
                }
            }
        }
    }else if(query === ""){
        popup(popupDiv, HelpText);
    }else{
        window.location = searchsquare.links[0].url +
                query.replaceChars(" ", searchsquare.links[0].space);
    }
}



window.onresize = function(){
    fixJitter(container);
};


var focusedSquare = -1;
var focusedLink = 0;

function globalKeyListener(e){
    if(typeof configmenu !== "undefined" ||
       searchsquare.searchinput == document.activeElement){
        return;
    }

    var key = e.keyCode;
    if(key == 9){
        // tab
        searchsquare.squareElement.style.height = "337px";
        searchsquare.squareElement.style.borderWidth = data.style.border_width_hovered;
        searchsquare.searchinput.focus();
    }else if(key == 37){
        // left arrow
        if(focusedSquare > 0){
            normalSquares[focusedSquare].unfocus(focusedLink);
            normalSquares[focusedSquare].contract();
            focusedSquare--;
            focusedLink = 0;
            normalSquares[focusedSquare].expand();
            normalSquares[focusedSquare].focus(focusedLink);
        }
    }else if(key == 38 && focusedSquare >= 0){
        // up arrow
        if(focusedLink > 0){
            normalSquares[focusedSquare].unfocus(focusedLink);
            focusedLink--;
            normalSquares[focusedSquare].focus(focusedLink);
        }
    }else if(key == 39){
        // right arrow
        if(focusedSquare < normalSquares.length - 1){
            if(focusedSquare >= 0){
                normalSquares[focusedSquare].unfocus(focusedLink);
                normalSquares[focusedSquare].contract();
            }
            focusedSquare++;
            focusedLink = 0;
            normalSquares[focusedSquare].expand();
            normalSquares[focusedSquare].focus(focusedLink);
        }
    }else if(key == 40 && focusedSquare >= 0){
        // down arrow
        if(focusedLink < normalSquares[focusedSquare].links.length - 1){
            normalSquares[focusedSquare].unfocus(focusedLink);
            focusedLink++;
            normalSquares[focusedSquare].focus(focusedLink);
        }
    }else if(key == 13){
        // enter
        window.location = normalSquares[focusedSquare].links[focusedLink].url;
    }

    if([9,37,38,39,40].indexOf(key) > -1){
        e.preventDefault();
    }
}



function main(){
    document.addEventListener("keypress", globalKeyListener);
    if(data.bool.allow_version_check){
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

    HelpText = "-help : Shows this help message<br>-config : Opens the config menu";
    visibility = false;
    container = document.getElementById("container");
    fixJitter(container);
    popupDiv = document.getElementById("popup");
}


configmenuInit(main);
