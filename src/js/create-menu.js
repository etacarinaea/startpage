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
  let configmenu = new Menu("Config-Menu", 750, -100);
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
    importConfig(callback, configmenu);
  });
}
