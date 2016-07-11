function ConfigObject(items){
    for(var i in items){
        this[i] = {name: items[i]};
    }
}

var boolItems = {
    borders: "Borders",
    alwaysopen: "Keep all squares open",
    mascot: "Enable background image/mascot",
    allow_version_check: "Allow checking for new versions",
    use_json_file: "Use config.json instead of this menu"
};
var bool = new ConfigObject(boolItems);

var styleItems = {
    heading_font: "Heading Font",
    link_font: "Link Font",
    heading_font_size: "Heading Font Size",
    link_font_size: "Link Font Size",
    background: "Background",
    foreground: "Foreground",
    heading_color: "Heading Color",
    link_color: "Link Color",
    border_color: "Border Color",
    border_width_normal: "Border Width",
    border_width_hovered: "Border Width (Hovered)",
    focus_color: "Focus Color",
    focus_bg_color: "Focus Background Color",
    search_color: "Search Color",
    search_bg_color: "Search Background Color"
};
var style = new ConfigObject(styleItems);

var extItems = {
    images: "Images",
    bottom: "Bottom",
    right: "Right",
    height: "Height",
    width: "Width",
    opacity: "Opacity"
};
var ext = new ConfigObject(extItems);




function configmenuInit(callback){
    $.getJSON("config.json", function(data){
        if(data.bool.privateMode === true){
            loadConfig(data, callback);
        }else if(localStorage.use_json_file == "true" || localStorage.config === undefined){
            pipe(data, callback);
        }else{
            pipe(JSON.parse(localStorage.config), callback);
        }
    });
}

// separate function so it wont execute before jQuery.getJSON has finished
function pipe(data, callback){
    // create initial menu, config menu or load config on window load
    if(localStorage.config === undefined){
        initmenu = new Menu("Init-Menu", true, 550, 350);
        initmenu.appendTab("Choose an Option:");
        initmenu.makeTabActive(0);
        var initbuttons = initmenu.split(
                ["Use files.",
                 "Use configuration menu."],
                ["Use the config.json file located in the startpage's root directory.",
                 "Use a GUI to easily configure the startpage's style. Has import/export function."]);
        initbuttons[0].addEventListener("click", function(){
            loadConfig(data, callback);
            initmenu.kill();
        });
        initbuttons[1].addEventListener("click", function(){
            createMenu(data, callback);
            initmenu.kill();
        });
    }else if(callback === undefined){
        createMenu(data, callback);
    }else{
        loadConfig(data, callback);
    }
}

function createMenu(data, callback){
    configmenu = new Menu("Config-Menu", false, 110, 110);
    configmenu.appendTab("Squares");
    configmenu.appendTab("Style");
    configmenu.makeTabActive(0);

    configmenu.tabs[0].node.addEventListener("click", function(){
        configmenu.makeTabActive(0);
    });
    configmenu.tabs[1].node.addEventListener("click", function(){
        configmenu.makeTabActive(1);
    });

    // squares
    var normalcategory = configmenu.appendCategory("normal", undefined, 0);

    if(localStorage.squares){
        var squares = JSON.parse(localStorage.squares);

        for(var i=0; i < squares.length; i++){
            if(squares[i].options === undefined){
                var div = configmenu.tabs[0]
                                    .categories[0]
                                    .appendSquareDiv(squares[i].name);
                configmenu.tabs[0]
                          .categories[0]
                          .options[i]
                          .appendTextField("heading" + i, i, "squareHeading",
                                           squares[i].name, 1, i, normalcategory);
                for(var a=0; a < squares[i].links.length; a++){
                    var tf = configmenu.tabs[0]
                                    .categories[0]
                                    .options[i]
                                    .appendTextField("link" + i, [i, "url"], "squareURL",
                                                     [squares[i].links[a].name,
                                                      squares[i].links[a].url], 2, i, normalcategory);
                }
            }else{
                // search
                var div = configmenu.tabs[0]
                                    .categories[0]
                                    .appendSquareDiv(squares[i].name);
                configmenu.tabs[0]
                          .categories[0]
                          .options[i]
                          .appendTextField("heading" + i, [i, "prefix"], "squareHeading",
                                           [squares[i].name, squares[i].prefix], 2, i, normalcategory);
                for(var a=0; a < squares[i].options.length; a++){
                    var tf = configmenu.tabs[0]
                                .categories[0]
                                .options[i]
                                .appendTextField("option" + i, ["opt", "url", "space"], "squareOption",
                                                 [squares[i].options[a].opt,
                                                  squares[i].options[a].url,
                                                  squares[i].options[a].space], 3, i, normalcategory);
                }
            }
            if(squares[i].options === undefined){
                var add = configmenu.tabs[0]
                                    .categories[0]
                                    .options[i]
                                    .appendTextField("link" + i, undefined,
                                                     "squareURL", undefined, 0, i, normalcategory);
            }else{
                var add = configmenu.tabs[0]
                                    .categories[0]
                                    .options[i]
                                    .appendTextField("option" + i, undefined, "squareOption",
                                                     undefined, 0, i, normalcategory);
            }
        }
        var newDiv = normalcategory.appendSquareDiv();
        var opts = configmenu.tabs[0].categories[0].options;
        opts[opts.length-1].appendTextField(undefined, undefined, "squareHeading",
                                   undefined, 0, i, normalcategory);
        opts[opts.length-1].appendTextField(undefined, undefined, "squareHeading_addS",
                                   undefined, 0, i, normalcategory);
    }else{
        div = configmenu.tabs[0]
                        .categories[0]
                        .appendSquareDiv("default");
        configmenu.tabs[0].categories[0].options[0]
                          .appendTextField(undefined, undefined, "squareHeading",
                                           undefined, 0, undefined, normalcategory);
        configmenu.tabs[0].categories[0].options[0]
                          .appendTextField(undefined, undefined, "squareHeading_addS",
                                           undefined, 0, undefined, normalcategory);
    }


    // style
    var boolcategory = configmenu.appendCategory("bool", undefined, 1);
    var stylecategory = configmenu.appendCategory("style", "General", 1);
    var extcategory = configmenu.appendCategory("ext", "Mascot", 1);

    if(!data){
        var data = {bool:"",style:"",ext:""};
    }

    for(var key in bool){
        configmenu.tabs[1].categories[0].appendOption(bool[key].name, key, 0, data.bool[key], callback);
    }
    for(var key in style){
        configmenu.tabs[1].categories[1].appendOption(style[key].name, key, 1, data.style[key], callback);
    }
    for(var key in ext){
        configmenu.tabs[1].categories[2].appendOption(ext[key].name, key, 1, data.ext[key], callback);
    }

    var saveButton = configmenu.appendButton("save", "#99bb99");
    saveButton.addEventListener("click", function(){
        saveConfig(callback);
        configmenu.kill();
        configmenu = undefined;
    });
    var exportButton = configmenu.appendButton("export", "#9999bb");
    exportButton.addEventListener("click", function(){
        exportConfig();
    });
    var importButton = configmenu.appendButton("import", "#bb9999");
    importButton.addEventListener("click", function(){
        importConfig(callback);
    });
}


function importConfig(callback){
    var importinput = document.createElement("input");
    importinput.setAttribute("type", "file");
    importinput.setAttribute("name", "importinput");

    configmenu.menu.appendChild(importinput);

    importinput.addEventListener("change", function(e){
        var file = importinput.files[0];

        var reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function(e){
            loadConfig(JSON.parse(reader.result), callback);
            configmenu.kill();
        };
    });

    importinput.click();
}

function exportConfig(){
    saveConfig();
    window.open("data:application/octet-stream;base64," + btoa(localStorage.config));
}

function saveConfig(callback){
    json = {squares:[], bool:{}, style:{}, ext:{}};
    // squares
    var searchSquareCount = 0;
    var squares = configmenu.tabs[0].categories[0].options;
    for(var i=0; i < (squares.length - 1); i++){
        if(squares[i].urls[1].className == "squareOption"){
            searchSquareCount += 1;
        }
        try{
            if(searchSquareCount > 1) throw "Too many search squares.";
        }
        catch(err){
            alert(err);
            throw err;
        }

        var length;
        try{
            length = squares[i].urls[1].childNodes.length;
        }
        catch(err){
            alert(err + "\nA square is probably empty.");
            throw err;
        }

        try{
            if(squares[i].urls[1].className == "squareOption"){
                for(var a=2; a < squares[i].urls.length; a++){
                    // dont allow options longer than one character
                    if(squares[i].urls[a].childNodes[1].value.length > 1){
                        throw "\"" + squares[i].urls[a].childNodes[1].value + "\"(" + (i+1) + "," + a + ") is too long";
                    }
                }
            }
        }
        catch(err){
            alert(err + "\nOptions can be no longer than one character.");
            throw err;
        }

        if(squares[i].urls[1].className == "squareOption"){
            if(squares[i].urls[1].childNodes[1].value != "default"){
                alert("Warning:\n" +
                      "\"" + squares[i].urls[1].childNodes[1].value +
                      "\" will be used as default search option because it's the first one.");
            }
        }

        if(length !== 4){
            var sqr = {name:squares[i].urls[0].childNodes[1].value, links:[]};
            for(var a=1; a < squares[i].urls.length; a++){
                var url = {name:squares[i].urls[a].childNodes[1].value,
                           url:squares[i].urls[a].childNodes[2].value};
                sqr.links.push(url);
            }
        }else{
            var sqr = {name:squares[i].urls[0].childNodes[1].value, prefix:squares[i].urls[0].childNodes[2].value, options:[]};
            for(var a=1; a < squares[i].urls.length; a++){
                var opt = {opt:squares[i].urls[a].childNodes[1].value,
                           url:squares[i].urls[a].childNodes[2].value,
                           space:squares[i].urls[a].childNodes[3].value};
                sqr.options.push(opt);
            }
        }
        json.squares.push(sqr);
    }

    // style
    for(var key in bool){
        var elem = document.querySelector("input[name='" + key + "'");
        bool[key].value = elem.checked;
        json.bool[key] = elem.checked;
    }
    localStorage.use_json_file = document.querySelector("input[name='use_json_file'").checked;
    for(var key in style){
        var elem = document.querySelector(
                "#style input[name='" + key + "'");
        style[key].value = elem.value;
        json.style[key] = String(elem.value);
    }
    for(var key in ext){
        var elem = document.querySelector(
                "#ext input[name='" + key + "'");
        if(elem.getAttribute("name") == "images"){
            var val = elem.value.replace(/\s+/g, "").split(",");
            ext[key].value = val;
            json.ext[key] = val;
        }else{
            ext[key].value = elem.value;
            json.ext[key] = String(elem.value);
        }
    }

    loadConfig(json, callback);
}


var data;
// load and apply
function loadConfig(d, callback){
    data = d;
    localStorage.config = JSON.stringify(data, undefined, 4);
    localStorage.squares = JSON.stringify(data.squares, undefined, 4);

    // squares
    /* remove all existing squares, otherwise the old ones will still be
     * displayed (without a pabe reload)
     */
    var cell = document.getElementById("cell");
    while(cell.firstChild){
        cell.removeChild(cell.firstChild);
    }
    normalSquares = [];
    for(var i=0; i < data.squares.length; i++){
        if(data.squares[i].links){
            normalSquares[i] = new Square(data.squares[i].name, data.squares[i].links, false);
            if(data.bool.alwaysopen){
                normalSquares[i].expand();
            }
        }else{
            // otherwise expect this to be a search square
            searchsquare = new Square(data.squares[i].name, data.squares[i].options, true);
            searchsquare.prefix = data.squares[i].prefix;
            if(data.bool.alwaysopen){
                searchsquare.expand();
            }
        }
    }

    // style
    var span = $("span");
    var a = $("a");
    var popup = $("#popup");
    var sqr = $(".sqr");
    span.css("fontFamily", data.style.heading_font);
    a.css("fontFamily", data.style.link_font);
    popup.css("fontFamily", data.style.link_font);
    span.css("fontSize", data.style.heading_font_size);
    a.css("fontSize", data.style.link_font_size);
    popup.css("fontSize", data.style.link_font_size);
    $("body").css("backgroundColor", data.style.background);
    sqr.css("backgroundColor", data.style.foreground);
    popup.css("backgroundColor", data.style.foreground);
    span.css("color", data.style.heading_color);
    a.css("color", data.style.link_color);
    popup.css("color", data.style.link_color);
    sqr.css("borderColor", data.style.border_color);
    if(!data.bool.alwaysopen){
        sqr.css("borderWidth", data.style.border_width_normal);
    }
    popup.css("borderTop", data.style.border_width_normal + " solid " + data.style.border_color);
    var searchinput = $("#searchinput");
    if(searchinput.length){
        searchinput.css("color", data.style.search_color);
        searchinput.css("backgroundColor", data.style.search_bg_color);
    }
    var bgimg = $("#bgimg");
    if(data.bool.mascot){
        bgimg.css("backgroundImage", "url('" +
                  data.ext.images[Math.floor(Math.random()*data.ext.images.length)] + "')");
        console.log(data.ext.images);
        console.log(data.ext.images);
        console.log(data.ext.images[Math.floor(Math.random()*data.ext.images.length)]);
        console.log(Math.floor(Math.random()*data.ext.images.length));
        bgimg.css("bottom", data.ext.bottom);
        bgimg.css("right", data.ext.right);
        bgimg.css("height", data.ext.height);
        bgimg.css("width", data.ext.width);
        bgimg.css("opacity", data.ext.opacity);
    }else{
        bgimg.css("backgroundImage", "");
    }

    if(callback){
        callback();
    }
}

