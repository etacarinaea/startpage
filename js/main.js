VERSION = "v1.7.3";


function popup(obj, node){
    var popuphandler = function(){
        popup(this, node);
    };
    // add event listener when it's going to be visible
    if(!visibility){
        obj.addEventListener("click", popuphandler);
        obj.appendChild(node);
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
    if(typeof searchsquare !== "undefined"){
        if(searchsquare.searchinput === document.activeElement && !(
             searchsquare.searchinput.value === "" ||
             searchsquare.searchinput.value === null)){
            return;
        }
    }

    var n = 0;
    if(typeof searchsquare === "undefined") n = 1;

    var key = e.keyCode;
    if(key == 27){
        // esc
        if(typeof searchsquare !== "undefined"){
            searchsquare.searchinput.blur();
            searchsquare.contract();
        }
        if(typeof normalSquares[focusedSquare] !== "undefined") {
            normalSquares[focusedSquare].unfocus(focusedLink);
            normalSquares[focusedSquare].contract();
        }
        focusedSquare = -1;
        focusedLink = 0;
    }else if(key == 9 && typeof searchsquare !== "undefined"){
        // tab
        if(typeof normalSquares[focusedSquare] !== "undefined") {
            normalSquares[focusedSquare].unfocus(focusedLink);
            normalSquares[focusedSquare].contract();
        }
        focusedSquare = normalSquares.length;
        searchsquare.expand();
        searchsquare.searchinput.focus();
    }else if(key == 37){
        // left arrow
        if(focusedSquare > 0){
            if(typeof searchsquare !== "undefined"){
                if(searchsquare.searchinput == document.activeElement && (
                     searchsquare.searchinput.value == "" ||
                     searchsquare.searchinput.value == null)){
                    searchsquare.searchinput.blur();
                    searchsquare.contract();
                }else if(focusedSquare < normalSquares.length){
                    normalSquares[focusedSquare].unfocus(focusedLink);
                    normalSquares[focusedSquare].contract();
                }
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
        if(typeof searchsquare !== "undefined"){
            if(searchsquare.searchinput == document.activeElement) return;
        }
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
        }else if(focusedSquare < normalSquares.length - n){
            if(typeof searchsquare !== "undefined"){
                if(searchsquare.searchinput == document.activeElement && (
                     searchsquare.searchinput.value == "" ||
                     searchsquare.searchinput.value == null)){
                    searchsquare.searchinput.blur();
                    searchsquare.contract();
                }else if(focusedSquare < normalSquares.length){
                    normalSquares[focusedSquare].unfocus(focusedLink);
                    normalSquares[focusedSquare].contract();
                }
            }else{
                normalSquares[focusedSquare].unfocus(focusedLink);
                normalSquares[focusedSquare].contract();
            }
            focusedSquare++;
            if(typeof searchsquare !== "undefined"){
                searchsquare.expand();
                searchsquare.searchinput.focus();
            }
        }
    }else if(key == 40 && focusedSquare >= 0){
        // down arrow
        if(typeof searchsquare !== "undefined"){
            if(searchsquare.searchinput == document.activeElement) return;
        }
        if(focusedLink < normalSquares[focusedSquare].links.length - 1){
            normalSquares[focusedSquare].unfocus(focusedLink);
            focusedLink++;
            normalSquares[focusedSquare].focus(focusedLink);
        }
    }else if(key == 13){
        // enter
        if(searchsquare.searchinput !== document.activeElement &&
             normalSquares[focusedSquare] !== undefined) {
            window.location = normalSquares[focusedSquare].links[focusedLink].url;
        }
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

    // generate helptext for static options
    var prefix = data.squares[data.squares.length - 1].prefix;
    HelpText = document.createElement("table");
    let tr = () => document.createElement("tr");
    let td = () => document.createElement("td");
    let txtNode = (s) => document.createTextNode(s);
    let append = (n, l) => {
        for(let i = 0; i < l.length; ++i) {
            n.appendChild(l[i]);
        }
        return n;
    };
    append(HelpText, [
        append(tr(), [
            append(td(), [txtNode(prefix + "help")]),
            append(td(), [txtNode(": Shows this help message")])
        ]),
        append(tr(), [
            append(td(), [txtNode(prefix + "config")]),
            append(td(), [txtNode(": Opens the config menu")])
        ])
    ]);

    // generate helptext for custom options
    var searchsquareOptions = data.squares[data.squares.length - 1].options;
    if(searchsquareOptions){
        append(HelpText, [document.createElement("br")]);
        for(var i=0; i < searchsquareOptions.length; i++){
            // remove scheme, path and everything after path from URL
            var url = searchsquareOptions[i].url.replace(/https?:\/\//, "")
                                                .replace(/\/.*/, "");
            append(HelpText, [
                append(tr(), [
                    append(td(), [txtNode(prefix + searchsquareOptions[i].opt)]),
                    append(td(), [txtNode(": " + url)])
                ])
            ])
        }
    }

    let versionNode = document.createElement("span");
    append(versionNode, [document.createTextNode("startpage " + VERSION)]);
    append(HelpText, [document.createElement("br"), versionNode]);
    versionNode.className = "version";
}


document.addEventListener("DOMContentLoaded", function(event){
    if(localStorage.config === undefined){
        $.loadJSON("config.json", function(data){
            loadConfig(data, main);
        });
    }else{
        loadConfig(JSON.parse(localStorage.config), main);
    }
});
