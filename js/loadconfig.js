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
}
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
        if(data.bool.privateMode == true){
            loadConfig(data, callback);
        }else if(localStorage.use_json_file == "true" || localStorage.config == undefined){
            pipe(data, callback);
        }else{
            pipe(JSON.parse(localStorage.config), callback);
        }
    });
}

// separate function so it wont execute before jQuery.getJSON has finished
function pipe(data, callback){
    // create initial menu, config menu or load config on window load
    if(localStorage.config == undefined){
        initmenu = new Menu("Init-Menu", 1, 550, 350);
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
    }else if(callback == undefined){
        createMenu(data, callback);
    }else{
        loadConfig(data, callback);
    }
}

function createMenu(data, callback){
    // create menu and categories
    configmenu = new Menu("Config-Menu", 0, 110, 110);
    var boolcategory = configmenu.appendCategory("bool", 0, undefined);
    var stylecategory = configmenu.appendCategory("style", 0, "General");
    var extcategory = configmenu.appendCategory("ext", 1, "Mascot");

    if(!data){
        var data = {bool:"",style:"",ext:""};
    }

    // append options to categories
    for(var key in bool){
        configmenu.categories[0].appendOption(bool[key].name, key, 0, callback, data.bool[key]);
    }
    for(var key in style){
        configmenu.categories[1].appendOption(style[key].name, key, 1, callback, data.style[key]);
    }
    for(var key in ext){
        configmenu.categories[2].appendOption(ext[key].name, key, 1, callback, data.ext[key]);
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
        }
    });

    importinput.click();
}

function exportConfig(){
    saveConfig();
    window.open("data:application/octet-stream;base64," + btoa(localStorage.config));
}

function saveConfig(callback){
    json = {bool:{}, style:{}, ext:{}};
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
    localStorage.config = JSON.stringify(data, undefined, 4);
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
    localStorage.cfg = cfg, localStorage.cfg_bool = cfg_bool;

    // squares
    for(var i=0; i<data.squares.length; i++){
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

