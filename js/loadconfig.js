function ConfigObject(items){
    for(var i in items){
        this[i] = {name: items[i]};
    }
}

var boolItems = {
    borders: "Borders",
    alwaysopen: "keep all squares open",
    allow_version_check: "allow checking for new versions",
    use_json_file: "use config.json instead of this menu"
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
                                           squares[i].name, 1, i, cat);
                for(var a=0; a < squares[i].links.length; a++){
                    var tf = configmenu.tabs[0]
                                    .categories[0]
                                    .options[i]
                                    .appendTextField("link" + i, [i, "url"], "squareURL",
                                                     [squares[i].links[a].name,
                                                      squares[i].links[a].url], 2, i);
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
                                           [squares[i].name, squares[i].prefix], 2, i, cat);
                for(var a=0; a < squares[i].options.length; a++){
                    var tf = configmenu.tabs[0]
                                .categories[0]
                                .options[i]
                                .appendTextField("option" + i, ["opt", "url", "space"], "squareOption",
                                                 [squares[i].options[a].opt,
                                                  squares[i].options[a].url,
                                                  squares[i].options[a].space], 3, i);
                }
            }
            if(squares[i].options === undefined){
                var add = configmenu.tabs[0]
                                    .categories[0]
                                    .options[i]
                                    .appendTextField("link" + i, undefined,
                                                     "squareURL", undefined, 0, i);
            }else{
                var add = configmenu.tabs[0]
                                    .categories[0]
                                    .options[i]
                                    .appendTextField("option" + i, undefined, "squareOption",
                                                     undefined, 0, i);
            }
        }
        var cat = configmenu.tabs[0].categories[0];
        var newDiv = cat.appendSquareDiv();
        var opts = configmenu.tabs[0].categories[0].options;
        opts[opts.length-1].appendTextField("heading" + i, undefined, "squareHeading",
                                   undefined, 0, i, cat);
    }else{
        configmenu.tabs[0].categories[0]
                          .appendTextField("heading" + 0, 0, "squareHeading",
                                           "Heading 1");
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

    configmenu.heading.appendChild(importinput);

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
    var squares = configmenu.tabs[0].categories[0].options;
    for(var i=0; i < (squares.length - 1); i++){
        var length;
        try{
            length = squares[i].urls[1].childNodes.length;
        }
        catch(err){
            alert(err + "\nA square is probably empty.");
            throw err;
        }
        if(length !== 4){
            var sqr = {name:squares[i].name, links:[]};
            for(var a=1; a < squares[i].urls.length; a++){
                var url = {name:squares[i].urls[a].childNodes[1].value,
                           url:squares[i].urls[a].childNodes[2].value};
                sqr.links.push(url);
            }
        }else{
            var sqr = {name:squares[i].name, prefix:squares[i].urls[0].childNodes[2].value, options:[]};
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
        ext[key].value = elem.value;
        json.ext[key] = String(elem.value);
    }

    loadConfig(json, callback);
}


// load and aplly
function loadConfig(data, callback){
    // needs to be stringified because localStorage is limited to strings
    localStorage.config = JSON.stringify(data, undefined, 4);
    localStorage.squares = JSON.stringify(data.squares, undefined, 4);
    cfg = [
        data.style.heading_font,
        data.style.link_font,
        data.style.heading_font_size,
        data.style.link_font_size,
        data.style.background,
        data.style.foreground,
        data.style.heading_color,
        data.style.link_color,
        data.style.border_color,
        data.style.border_width_normal,
        data.style.border_width_hovered,
        data.style.search_color,
        data.style.search_bg_color,
        data.ext.images,
        data.ext.bottom,
        data.ext.right,
        data.ext.height,
        data.ext.width,
        data.ext.opacity
    ];
    cfg_bool = [
        data.bool.borders,
        data.bool.alwaysopen,
        data.bool.mascot,
        data.bool.allow_version_check
    ];
    localStorage.cfg = cfg;
    localStorage.cfg_bool = cfg_bool;

    // squares
    /* remove all existing squares, otherwise the old ones will still be
     * displayed (without a pabe reload)
     */
    var cell = document.getElementById("cell");
    while(cell.firstChild){
        cell.removeChild(cell.firstChild);
    }
    for(var i=0; i < data.squares.length; i++){
        if(data.squares[i].links){
            new Square(data.squares[i].name, data.squares[i].links, false);
        }else{
            // otherwise expect this to be a search square
            searchsquare = new Square(data.squares[i].name, data.squares[i].options, true);
            searchsquare.prefix = data.squares[i].prefix;
        }
    }

    // style
    var span = $("span");
    var a = $("a");
    var popup = $("#popup");
    var sqr = $(".sqr");
    span.css("fontFamily", cfg[0]);
    a.css("fontFamily", cfg[1]);
    popup.css("fontFamily", cfg[1]);
    span.css("fontSize", cfg[2]);
    a.css("fontSize", cfg[3]);
    popup.css("fontSize", cfg[3]);
    $("body").css("backgroundColor", cfg[4]);
    sqr.css("backgroundColor", cfg[5]);
    popup.css("backgroundColor", cfg[5]);
    span.css("color", cfg[6]);
    a.css("color", cfg[7]);
    popup.css("color", cfg[7]);
    sqr.css("borderColor", cfg[8]);
    sqr.css("borderWidth", cfg[9]);
    popup.css("borderTop", cfg[9] + " solid " + cfg[8]);
    var searchinput = $("#searchinput");
    if(searchinput.length){
        searchinput.css("color", cfg[11]);
        searchinput.css("backgroundColor", cfg[12]);
    }
    var bgimg = $("#bgimg");
    if(cfg_bool[2]){
        bgimg.css("backgroundImage", "url('" +
                cfg[13][Math.floor(Math.random()*cfg[13].length)] + "')");
        bgimg.css("bottom", cfg[14]);
        bgimg.css("right", cfg[15]);
        bgimg.css("height", cfg[16]);
        bgimg.css("width", cfg[17]);
        bgimg.css("opacity", cfg[18]);
    }else{
        bgimg.css("backgroundImage", "");
    }

    if(callback){
        callback();
    }
}

