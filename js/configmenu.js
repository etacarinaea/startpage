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
    border_width: "Border Width",
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
        if(localStorage.use_json_file == "true" || localStorage.config == undefined){
            pipe(data, callback);
        }else{
            pipe(JSON.parse(localStorage.config), callback);
        }
    });
}

// separate function so it wont execute before jQuery.getJSON has finished
function pipe(data, callback){
    var configmenuContainer = document.getElementById("configmenu_container");

    // create the menu or load config on window load
    if(localStorage.config == undefined || callback == undefined){
        configmenuContainer.style.display = "block";
        createMenu(data, callback);
    }else{
        loadConfig(data, callback);
    }
}

function createMenu(data, callback){
    var configmenuContainer = document.getElementById("configmenu_container");
    var boolwrapper = document.getElementById("boolwrapper");
    var stylewrapper = document.getElementById("stylewrapper");
    var extwrapper = document.getElementById("extwrapper");

    if(!data){
        var data = {bool:"",style:"",ext:""};
    }

    for(var key in bool){
        appendOption(boolwrapper, bool[key], key, 0, callback, data.bool[key]);
    }
    for(var key in style){
        appendOption(stylewrapper, style[key], key, 1, callback, data.style[key]);
    }
    for(var key in ext){
        appendOption(extwrapper, ext[key], key, 1, callback, data.ext[key]);
    }

    mascotCheckbox = document.getElementById("mcb");
    checkboxHandler();
    mascotCheckbox.addEventListener("click", checkboxHandler);

    var importButton = document.getElementById("import");
    importButton.addEventListener("click", function(){
        importConfig(callback);
    });
    var exportButton = document.getElementById("export");
    exportButton.addEventListener("click", function(){
        exportConfig();
    });
    var doneButton = document.getElementById("done");
    doneButton.addEventListener("click", function(){
        saveConfig(callback);
    });
}


// type == 0: checkbox, else: text
// value: HTML element value
function appendOption(parentElement, obj, key, type, callback, value){
    var div = document.createElement("div");
    var label = document.createElement("label");
    var text = document.createTextNode(obj.name);
    var input = document.createElement("input");

    div.setAttribute("class", "option");
    input.setAttribute("name", key);

    if(type == 0){
        input.setAttribute("type", "checkbox");
        if(!callback){
            input.checked = value;
        }
    }else{
        input.setAttribute("type", "text");
        if(!callback){
            input.setAttribute("value", value);
        }
    }

    label.appendChild(text);
    label.appendChild(input);
    div.appendChild(label);
    parentElement.appendChild(div);
}


function checkboxHandler(){
    if(mascotCheckbox.checked == true){
        var visibility = "block";
    }else{
        var visibility = "none";
    }
    var options = document.querySelectorAll("#extwrapper .option");
    for(var i=0; i < options.length; i++){
        options[i].style.display = visibility;
    }
}


function importConfig(callback){
    var importinput = document.getElementById("importinput");

    importinput.addEventListener("change", function(e){
        var file = importinput.files[0];
        console.log(file);

        var reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function(e){
            console.log(reader.result);
            localStorage.config = reader.result;
            location.reload();
        }
    });

    importinput.click();
}

function exportConfig(){
    window.open("data:application/octet-stream;base64," + btoa(localStorage.config));
}

function saveConfig(callback){
    json = {bool:{}, style:{}, ext:{}};
    // because mascot is not an attribute of boolItems, create a local obj w/ mascot:
    var bool = new ConfigObject(boolItems);
    bool.mascot = {};
    for(var key in bool){
        var elem = document.querySelector("input[name='" + key + "'");
        bool[key].value = elem.checked;
        json.bool[key] = elem.checked;
    }
    localStorage.use_json_file = document.querySelector("input[name='use_json_file'").checked;
    for(var key in style){
        var elem = document.querySelector(
                "#stylewrapper input[name='" + key + "'");
        style[key].value = elem.value;
        json.style[key] = String(elem.value);
    }
    for(var key in ext){
        var elem = document.querySelector(
                "#extwrapper input[name='" + key + "'");
        ext[key].value = elem.value;
        json.ext[key] = String(elem.value);
    }

    // to json for import/export + backwards compatibility
    json = JSON.stringify(json, undefined, 4);

    localStorage.config = json;
    loadConfig(JSON.parse(json), callback);
    location.reload();
}


function loadConfig(data, callback){
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
        data.style.border_width,
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
    sqr.css("borderTop", "0 solid " + cfg[8]);
    sqr.css("borderBottom", "0 solid " + cfg[8]);
    popup.css("borderTop", cfg[9] + " solid " + cfg[8]);
    var searchinput = $("#searchinput");
    if(searchinput.length){
        searchinput.css("color", cfg[10]);
        searchinput.css("backgroundColor", cfg[11]);
    }
    var bgimg = $("#bgimg");
    if(cfg_bool[2]){
        bgimg.css("backgroundImage", "url('" +
                cfg[12][Math.floor(Math.random()*cfg[12].length)] + "')");
        bgimg.css("bottom", cfg[13]);
        bgimg.css("right", cfg[14]);
        bgimg.css("height", cfg[15]);
        bgimg.css("width", cfg[16]);
        bgimg.css("opacity", cfg[17]);
    }else{
        bgimg.css("backgroundImage", "");
    }

    if(callback){
        callback();
    }
}

