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


function importConfig(callback, configmenu) {
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
      normalSquares[i] = new Square(data.squares[i].name, data.squares[i].links,
                                    false, data.bool, data.style);
      if(data.bool.alwaysopen) {
        normalSquares[i].expand();
      }
    } else {
      // otherwise expect this to be a search square
      searchsquare = new Square(data.squares[i].name, data.squares[i].options,
                                true, data.bool, data.style);
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
  const popup = $("#popup");
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

