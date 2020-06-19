function ConfigObject(items) {
  for(let i in items) {
    this[i] = { name: items[i] };
  }
}

const boolItems = {
  borders: "Borders",
  alwaysopen: "Keep all squares open",
  background_image: "Enable background image",
  hide_gear_button: "Make gear button invisible"
};
const bool = new ConfigObject(boolItems);

const styleItems = {
  square_size: "Square Size",
  square_spacing: "Square Spacing",
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
  border_radius: "Border Radius",
  square_shadow: "Square Shadow",
  focus_color: "Focus Color",
  focus_bg_color: "Focus Background Color",
  search_color: "Search Color",
  search_bg_color: "Search Background Color"
};
const style = new ConfigObject(styleItems);

const extItems = {
  images: "Images",
  size: "Size",
  filter: "Filter"
};
const ext = new ConfigObject(extItems);


function configmenuInit(callback) {
  browser.storage.local.get("config").then(
    (configData) => {
      // Check if configData is empty
      if(Object.keys(configData).length === 0
         && configData.constructor === Object) {
        $.loadJSON("config.json", (configJSON) => {
          initmenu = new Menu("Init-Menu", 550, 350);
          initmenu.appendTab("Choose an Option");
          initmenu.makeTabActive(0);
          const initbuttons = initmenu.split(
              ["Use defaults.",
               "Use configuration menu."],
              ["Use the example config. You can later open up the " +
               "configuration menu by clicking the gear icon in the " +
               "bottom-right corner of the screen.",
               "Use a GUI to easily configure the startpage's style. Has " +
               "import/export function."]);
          initbuttons[0].addEventListener("click", () => {
            browser.storage.local.set({config: configJSON});
            applyConfig(configJSON, callback);
            initmenu.kill();
          });
          initbuttons[1].addEventListener("click", () => {
            browser.storage.local.set({config: configJSON});
            applyConfig(configJSON, undefined);
            createMenu(configJSON, callback);
            initmenu.kill();
          });
        });
      } else if(typeof callback === "function") {
        applyConfig(configData.config, callback);
      } else {
        createMenu(configData.config, callback);
      }
    },
    (err) => {
      alert("An error occured while loading the config.")
      console.log(err);
    }
  );
}

function createMenu(data, callback) {
  configmenu = new Menu("Config-Menu", 750, -100);
  const squareTab = configmenu.appendTab("Squares");
  const styleTab = configmenu.appendTab("Style");
  configmenu.makeTabActive(0);

  squareTab.node.addEventListener("click", function() {
    configmenu.makeTabActive(0);
  });
  styleTab.node.addEventListener("click", function() {
    configmenu.makeTabActive(1);
  });

  // squares
  const normalcategory = squareTab.appendCategory("normal", undefined);

  if(data.squares) {
    let i = 0;
    while(i < data.squares.length) {
      if(data.squares[i].options === undefined) {
        let div = configmenu.tabs[0]
                            .categories[0]
                            .appendSquareDiv(data.squares[i].name);
        configmenu.tabs[0]
                  .categories[0]
                  .options[i]
                  .appendTextField("heading" + i, i, "squareHeading",
                                   data.squares[i].name, 1, i, normalcategory);
        for(let a = 0; a < data.squares[i].links.length; a++) {
          const tf = configmenu.tabs[0]
              .categories[0].options[i]
              .appendTextField("link" + i, [i, "url"], "squareURL",
                               [data.squares[i].links[a].name,
                                data.squares[i].links[a].url],
                               2, i, normalcategory);
        }
      } else {
        // search
        let div = configmenu.tabs[0]
                              .categories[0]
                              .appendSquareDiv(data.squares[i].name);
        configmenu.tabs[0]
              .categories[0]
              .options[i]
              .appendTextField("heading" + i, [i, "prefix"], "squareHeading",
                               [data.squares[i].name, data.squares[i].prefix],
                               2, i, normalcategory);
        for(let a=0; a < data.squares[i].options.length; a++) {
          const tf = configmenu.tabs[0]
              .categories[0]
              .options[i]
              .appendTextField("option" + i, ["opt", "url", "space"],
                               "squareOption",
                               [data.squares[i].options[a].opt,
                                data.squares[i].options[a].url,
                                data.squares[i].options[a].space],
                               3, i, normalcategory);
        }
      }
      if(data.squares[i].options === undefined) {
        const add = configmenu.tabs[0]
            .categories[0]
            .options[i]
            .appendTextField("link" + i, undefined,
                     "squareURL", undefined, 0, i, normalcategory);
      } else {
        const add = configmenu.tabs[0]
            .categories[0]
            .options[i]
            .appendTextField("option" + i, undefined, "squareOption",
                     undefined, 0, i, normalcategory);
      }
      i++;
    }
    // square/search add button
    const newDiv = normalcategory.appendSquareDiv();
    const opts = configmenu.tabs[0].categories[0].options;
    opts[opts.length-1].appendTextField(undefined, undefined, "squareHeading",
                                        undefined, 0, i, normalcategory);
    opts[opts.length-1].appendTextField(undefined, undefined,
                                        "squareHeading_addS",
                                        undefined, 0, i, normalcategory);
  } else {
    // empty squares
    let div = configmenu.tabs[0]
                        .categories[0]
                        .appendSquareDiv("default");
    configmenu.tabs[0]
              .categories[0]
              .options[0]
              .appendTextField(undefined, undefined, "squareHeading",
                               undefined, 0, undefined, normalcategory);
    configmenu.tabs[0]
              .categories[0]
              .options[0]
              .appendTextField(undefined, undefined, "squareHeading_addS",
                               undefined, 0, undefined, normalcategory);
  }


  // style
  const boolcategory = styleTab.appendCategory("bool", undefined);
  const stylecategory = styleTab.appendCategory("style", "General");
  const extcategory = styleTab.appendCategory("ext", "Background Image");

  if(!data) {
    const data = { bool:"",style:"",ext:"" };
  }

  for(let key in bool) {
    configmenu.tabs[1].categories[0].appendOption(bool[key].name, key, 0,
                                                  data.bool[key]);
  }
  for(let key in style) {
    configmenu.tabs[1].categories[1].appendOption(style[key].name, key, 1,
                                                  data.style[key]);
  }
  for(let key in ext) {
    configmenu.tabs[1].categories[2].appendOption(ext[key].name, key, 1,
                                                  data.ext[key]);
  }

  const saveButton = configmenu.appendButton("save");
  saveButton.addEventListener("click", function() {
    saveConfig(callback);
    configmenu.kill();
    configmenu = undefined;
  });
  const exportButton = configmenu.appendButton("export");
  exportButton.addEventListener("click", function() {
    exportConfig();
  });
  const importButton = configmenu.appendButton("import");
  importButton.addEventListener("click", function() {
    importConfig(callback);
  });
}


function importConfig(callback) {
  const importinput = document.createElement("input");
  importinput.setAttribute("type", "file");
  importinput.setAttribute("name", "importinput");

  configmenu.menu.appendChild(importinput);

  importinput.addEventListener("change", function(e) {
    const file = importinput.files[0];

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function(e) {
      updateConfig(JSON.parse(reader.result));
      applyConfig(JSON.parse(reader.result), callback);
      configmenu.kill();
    };
  });

  importinput.click();
}

function exportConfig() {
  saveConfig();
  browser.storage.local.get("config").then(
    (configData) => {
      window.open("data:application/octet-stream;base64,"
                  + window.btoa(JSON.stringify(configData.config, null, 2)));
    },
    (err) => {
      alert("An error occured while exporting config.")
    }
  );
}

function saveConfig(callback) {
  let json = {
    version: browser.runtime.getManifest().version,
    squares: [],
    bool: {},
    style: {},
    ext: {}
  };
  // squares
  let searchSquareCount = 0;
  const squares = configmenu.tabs[0].categories[0].options;
  for(let i = 0; i < (squares.length - 1); i++) {
    if(squares[i].urls[1].className == "squareOption") {
      searchSquareCount += 1;
    }
    if(searchSquareCount > 1) {
      alert("Too many search squares.");
      throw "Too many search squares.";
    }

    let length;
    try {
      length = squares[i].urls[1].childNodes.length;
    }
    catch(err) {
      alert(err + "\nA square is probably empty.");
      throw err;
    }

    try {
      if(squares[i].urls[1].className == "squareOption") {
        for(let a = 2; a < squares[i].urls.length; a++) {
          // dont allow options longer than one character
          if(squares[i].urls[a].childNodes[1].value.length > 1) {
            throw "\"" + squares[i].urls[a].childNodes[1].value + "\"(" + (i+1)
                  + "," + a + ") is too long";
          }
        }
      }
    }
    catch(err) {
      alert(err + "\nOptions can be no longer than one character.");
      throw err;
    }

    if(squares[i].urls[1].className == "squareOption") {
      if(squares[i].urls[1].childNodes[1].value != "default") {
        alert("Warning:\n" + "\"" + squares[i].urls[1].childNodes[1].value +
              "\" will be used as default search option because it's the first one.");
      }
    }

    let sqr;
    if(length !== 4) {
      sqr = { name: squares[i].urls[0].childNodes[1].value, links: [] };
      for(let a = 1; a < squares[i].urls.length; a++) {
        const url = { name: squares[i].urls[a].childNodes[1].value,
                      url: squares[i].urls[a].childNodes[2].value };
        sqr.links.push(url);
      }
    } else {
      sqr = { name: squares[i].urls[0].childNodes[1].value,
                    prefix: squares[i].urls[0].childNodes[2].value,
                    options: [] };
      for(let a = 1; a < squares[i].urls.length; a++) {
        const opt = { opt: squares[i].urls[a].childNodes[1].value,
                      url: squares[i].urls[a].childNodes[2].value,
                      space: squares[i].urls[a].childNodes[3].value};
        sqr.options.push(opt);
      }
    }
    json.squares.push(sqr);
  }

  // style
  for(let key in bool) {
    const elem = document.querySelector("input[name='" + key + "'");
    bool[key].value = elem.checked;
    json.bool[key] = elem.checked;
  }
  for(let key in style) {
    const elem = document.querySelector("#style input[name='" + key + "'");
    style[key].value = elem.value;
    json.style[key] = String(elem.value);
  }
  for(let key in ext) {
    const elem = document.querySelector("#ext input[name='" + key + "'");
    if(elem.getAttribute("name") == "images") {
      const val = elem.value.replace(/\s+/g, "").split(",");
      ext[key].value = val;
      json.ext[key] = val;
    } else {
      ext[key].value = elem.value;
      json.ext[key] = String(elem.value);
    }
  }

  browser.storage.local.set({config: json});
  applyConfig(json, callback);
}


function applyConfig(data, callback) {

  // squares
  /* remove all existing squares, otherwise the old ones will still be
   * displayed (without a page reload)
   */
  const container = document.getElementById("container");
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  }
  normalSquares = [];
  for(let i = 0; i < data.squares.length; i++) {
    if(data.squares[i].links) {
      normalSquares[i] = new Square(data.squares[i].name,
                                    {
                                      isSearch: false,
                                      links: data.squares[i].links
                                    },
                                    data.bool,
                                    data.style);
      if(data.bool.alwaysopen) {
        normalSquares[i].expand();
      }
    } else {
      // otherwise expect this to be a search square
      searchsquare = new Square(data.squares[i].name,
                                {
                                  isSearch: true,
                                  prefix: data.squares[i].prefix,
                                  options: data.squares[i].options,
                                },
                                data.bool, data.style);
      searchsquare.prefix = data.squares[i].prefix;
      if(data.bool.alwaysopen) {
        searchsquare.expand();
      }
    }
  }

  // Append px if just a number
  const px = (s) => isNaN(s) ? s : s + "px";
  // style
  const span = $("span");
  const a = $("a");
  // FIXME: Doesn't actually get the popup because it's created on-demand
  const popup = $(".popup");
  const gearPath = $("#gearPath");
  const sqr = $(".sqr");
  sqr.css("width", px(data.style.square_size))
  if(data.bool.alwaysopen) {
    let maxHeight = 0;
    for(let i = 0; i < normalSquares.length; ++i) {
      let iMaxHeight = normalSquares[i].maxHeight();
      if(iMaxHeight > maxHeight) {
        maxHeight = normalSquares[i].maxHeight();
      }
    }
    let sMaxHeight = searchsquare.maxHeight();
    if(searchsquare && sMaxHeight > maxHeight) {
      maxHeight = sMaxHeight;
    }
    sqr.css("height", px(maxHeight));
  } else {
    sqr.css("height", px(data.style.square_size))
  }
  sqr.css("margin", "0 " + px(parseInt(data.style.square_spacing, 10) / 2));
  span.css("lineHeight", px(data.style.square_size))
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
  const gear = $("#gear");
  const gearContainer = $("#gearContainer");
  if(data.bool.hide_gear_button) {
    gear.css("opacity", 0);
    gearContainer.elements[0].addEventListener("mouseout", (e) => {
      gear.css("opacity", 0);
    });
  } else {
    gear.css("opacity", 0.5);
    gearContainer.elements[0].addEventListener("mouseout", (e) => {
      gear.css("opacity", 0.5);
    });
  }
  gearContainer.elements[0].addEventListener("mouseover", (e) => {
    gear.css("opacity", 1);
  });
  gearPath.css("fill", data.style.foreground);
  sqr.css("borderColor", data.style.border_color);
  sqr.css("borderRadius", data.style.border_radius);
  sqr.css("boxShadow", data.style.square_shadow);
  if(!data.bool.alwaysopen) {
    sqr.css("borderWidth", data.style.border_width_normal);
  }
  popup.css("borderTop", data.style.border_width_normal + " solid "
            + data.style.border_color);
  const searchinput = $("#searchinput");
  if(searchinput !== null) {
    searchinput.css("color", data.style.search_color);
    searchinput.css("backgroundColor", data.style.search_bg_color);
    searchinput.css("width", px(data.style.square_size))
  }
  const bgimg = $("#bgimg");
  if(data.bool.background_image) {
    bgimg.css("backgroundImage", "url('" + data.ext.images[
      Math.floor(Math.random()*data.ext.images.length)] + "')");
    bgimg.css("backgroundSize", data.ext.size);
    bgimg.css("filter", data.ext.filter);
  } else {
    bgimg.css("backgroundImage", "");
  }

  if(typeof callback === "function") {
    callback();
  }
}

