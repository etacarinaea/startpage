VERSION = "v1.6.0";


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


var focusedSquare = -1;
var focusedLink = 0;

function globalKeyListener(e){
    if(typeof configmenu !== "undefined") {
        return;
    }
    if(searchsquare.searchinput === document.activeElement && !(
       searchsquare.searchinput.value === "" ||
       searchsquare.searchinput.value === null)){
      return;
    }

    var key = e.keyCode;
    if(key == 27){
        searchsquare.searchinput.blur();
        searchsquare.contract();
        if(normalSquares[focusedSquare] !== undefined) {
            normalSquares[focusedSquare].unfocus(focusedLink);
            normalSquares[focusedSquare].contract();
        }
        focusedSquare = -1;
        focusedLink = 0;
    }else if(key == 9){
        // tab
        searchsquare.expand();
        searchsquare.searchinput.focus();
    }else if(key == 37){
        // left arrow
        if(focusedSquare > 0){
            if(searchsquare.searchinput == document.activeElement && (
               searchsquare.searchinput.value == "" ||
               searchsquare.searchinput.value == null)){
                searchsquare.searchinput.blur();
                searchsquare.contract();
            }else if(focusedSquare < normalSquares.length){
                normalSquares[focusedSquare].unfocus(focusedLink);
                normalSquares[focusedSquare].contract();
            }
            focusedSquare--;
            focusedLink = 0;
            normalSquares[focusedSquare].expand();
            normalSquares[focusedSquare].focus(focusedLink);
        }
    }else if(key == 38 && focusedSquare >= 0){
        // up arrow
        if(searchsquare.searchinput == document.activeElement) return;
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
        }else if(focusedSquare < normalSquares.length){
            if(searchsquare.searchinput == document.activeElement && (
                searchsquare.searchinput.value == "" ||
                searchsquare.searchinput.value == null)){
              searchsquare.searchinput.blur();
              searchsquare.contract();
            }else{
                normalSquares[focusedSquare].unfocus(focusedLink);
                normalSquares[focusedSquare].contract();
            }
            focusedSquare++;
            searchsquare.expand();
            searchsquare.searchinput.focus();
        }
    }else if(key == 40 && focusedSquare >= 0){
        // down arrow
        if(searchsquare.searchinput == document.activeElement) return;
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
    visibility = false;
    container = document.getElementById("container");
    popupDiv = document.getElementById("popup");

    document.addEventListener("keydown", globalKeyListener);
    if(data.bool.allowVersionCheck){
        var ver = version();
        if(ver){
            var verMsg = "<a href='https://github.com/fuyuneko/startpage/" +
                         "releases'>A new version is available: " + ver +
                         "</a>";

            popup(popupDiv, verMsg);
        }
    }

    // generate helptext for static options
    var prefix = data.squares[data.squares.length - 1].prefix;
    HelpText = "<table><tr><td>" + prefix +
               "help</td><td>: Shows this help message</td></tr><tr><td>" +
               prefix + "config</td><td>: Opens the config menu</td></tr></table>";

    // generate helptext for custom options
    var searchsquareOptions = data.squares[data.squares.length - 1].options;
    if(searchsquareOptions){
        HelpText += "<br><table>";
        for(var i=0; i < searchsquareOptions.length; i++){
            // remove scheme, path and everything after path from URL
            var url = searchsquareOptions[i].url.replace(/https?:\/\//, "")
                                                .replace(/\/.*/, "");
            HelpText += "<tr><td>" + prefix + searchsquareOptions[i].opt +
                        "</td><td>: " + url + "</td></tr>";
        }
        HelpText += "</table>";
    }
}


document.addEventListener("DOMContentLoaded", function(event){
    configmenuInit(main);
});
