const VERSION = "v1.8.2";


function splitUnit(str) {
  let size = isNaN(str) ? str.substr(0, str.length-2) : str;
  let sizeUnit = isNaN(str) ? str.substr(-2) : "";
  return [ size, sizeUnit ];
}

let popupVisibility = false;
function popup(obj) {
  const popuphandler = function() {
    popup(this);
  };
  // add event listener when it's going to be visible
  if(popupVisibility) {
    obj.addEventListener("click", popuphandler);
    obj.style.bottom = "-" + obj.offsetHeight + "px";
  } else {
    obj.removeEventListener("click", popuphandler);
    obj.style.bottom = "0px";
  }
  popupVisibility = !popupVisibility;
}


String.prototype.replaceChars = function(character, replacement) {
  let str = this;
  let a;
  let b;
  for(let i = 0; i < str.length; i++) {
    if(str.charAt(i) == character) {
      a = str.substr(0, i) + replacement;
      b = str.substr(i + 1);
      str = a + b;
      if(replacement === "") {
        i--;
      }
    }
  }
  return str;
};


function search(query) {
  const popupDiv = document.getElementById("popup");
  if(typeof searchsquare == 'undefined') {
    configmenuInit(undefined);
  } else if(query[0] == searchsquare.prefix) {
    if(query.substr(1) == "help") {
      popup(popupDiv);
    } else if(query.substr(1) == "config") {
      configmenuInit(undefined);
    } else {
      for(let i = 0; i < searchsquare.links.length; i++) {
        if(query[1] == searchsquare.links[i].opt) {
          query = query.substr(3);
          window.location = searchsquare.links[i].url +
              query.replaceChars(" ", searchsquare.links[i].space);
          break;
        }
      }
    }
  } else if(query === "") {
    popup(popupDiv);
  } else {
    window.location = searchsquare.links[0].url +
        query.replaceChars(" ", searchsquare.links[0].space);
  }
}


let focusedSquare = -1;
let focusedLink = 0;

function globalKeyListener(e) {
  if(typeof configmenu !== "undefined") {
    return;
  }
  if(typeof searchsquare !== "undefined") {
    if(searchsquare.searchinput === document.activeElement
       && !(searchsquare.searchinput.value === ""
       || searchsquare.searchinput.value === null)) {
      return;
    }
  }

  let n = 0;
  if(typeof searchsquare === "undefined") n = 1;

  let key = e.keyCode;
  if(key == 27) {
    // esc
    if(typeof searchsquare !== "undefined") {
      searchsquare.searchinput.blur();
      searchsquare.contract();
    }
    if(typeof normalSquares[focusedSquare] !== "undefined") {
      normalSquares[focusedSquare].unfocus(focusedLink);
      normalSquares[focusedSquare].contract();
    }
    focusedSquare = -1;
    focusedLink = 0;
  } else if(key == 9 && typeof searchsquare !== "undefined") {
    // tab
    if(typeof normalSquares[focusedSquare] !== "undefined") {
      normalSquares[focusedSquare].unfocus(focusedLink);
      normalSquares[focusedSquare].contract();
    }
    focusedSquare = normalSquares.length;
    searchsquare.expand();
    searchsquare.searchinput.focus();
  } else if(key == 37) {
    // left arrow
    if(focusedSquare > 0) {
      if(typeof searchsquare !== "undefined") {
        if(searchsquare.searchinput == document.activeElement
           && (searchsquare.searchinput.value == ""
           || searchsquare.searchinput.value == null)) {
          searchsquare.searchinput.blur();
          searchsquare.contract();
        } else if(focusedSquare < normalSquares.length) {
          normalSquares[focusedSquare].unfocus(focusedLink);
          normalSquares[focusedSquare].contract();
        }
      } else if(focusedSquare < normalSquares.length) {
        normalSquares[focusedSquare].unfocus(focusedLink);
        normalSquares[focusedSquare].contract();
      }
      focusedSquare--;
      focusedLink = 0;
      normalSquares[focusedSquare].expand();
      normalSquares[focusedSquare].focus(focusedLink);
    }
  } else if(key == 38 && focusedSquare >= 0) {
    // up arrow
    if(typeof searchsquare !== "undefined") {
      if(searchsquare.searchinput == document.activeElement) return;
    }
    if(focusedLink > 0) {
      normalSquares[focusedSquare].unfocus(focusedLink);
      focusedLink--;
      normalSquares[focusedSquare].focus(focusedLink);
    }
  } else if(key == 39) {
    // right arrow
    if(focusedSquare < normalSquares.length - 1) {
      if(focusedSquare >= 0) {
        normalSquares[focusedSquare].unfocus(focusedLink);
        normalSquares[focusedSquare].contract();
      }
      focusedSquare++;
      focusedLink = 0;
      normalSquares[focusedSquare].expand();
      normalSquares[focusedSquare].focus(focusedLink);
    } else if(focusedSquare < normalSquares.length - n) {
      if(typeof searchsquare !== "undefined") {
        if(searchsquare.searchinput == document.activeElement
           && (searchsquare.searchinput.value == ""
           || searchsquare.searchinput.value == null)) {
          searchsquare.searchinput.blur();
          searchsquare.contract();
        } else if(focusedSquare < normalSquares.length) {
          normalSquares[focusedSquare].unfocus(focusedLink);
          normalSquares[focusedSquare].contract();
        }
      } else {
        normalSquares[focusedSquare].unfocus(focusedLink);
        normalSquares[focusedSquare].contract();
      }
      focusedSquare++;
      if(typeof searchsquare !== "undefined") {
        searchsquare.expand();
        searchsquare.searchinput.focus();
      }
    }
  } else if(key == 40 && focusedSquare >= 0) {
    // down arrow
    if(typeof searchsquare !== "undefined") {
      if(searchsquare.searchinput == document.activeElement) return;
    }
    if(focusedLink < normalSquares[focusedSquare].links.length - 1) {
      normalSquares[focusedSquare].unfocus(focusedLink);
      focusedLink++;
      normalSquares[focusedSquare].focus(focusedLink);
    }
  } else if(key == 13) {
    // enter
    if(searchsquare.searchinput !== document.activeElement &&
       normalSquares[focusedSquare] !== undefined) {
      window.location = normalSquares[focusedSquare].links[focusedLink].url;
    }
  }

  if([9,37,38,39,40].indexOf(key) > -1) {
    e.preventDefault();
  }
}


function main() {
  const container = document.getElementById("container");
  const popupDiv = document.getElementById("popup");

  document.addEventListener("keydown", globalKeyListener);

  // generate helptext for static options
  const prefix = data.squares[data.squares.length - 1].prefix;
  const helpText = document.createElement("table");
  const tr = () => document.createElement("tr");
  const td = () => document.createElement("td");
  const txtNode = (s) => document.createTextNode(s);
  const append = (n, l) => {
    for(let i = 0; i < l.length; ++i) {
      n.appendChild(l[i]);
    }
    return n;
  };
  append(helpText, [
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
  let searchsquareOptions = data.squares[data.squares.length - 1].options;
  if(searchsquareOptions) {
    append(helpText, [document.createElement("br")]);
    for(let i = 0; i < searchsquareOptions.length; i++) {
      // remove scheme, path and everything after path from URL
      let url = searchsquareOptions[i].url.replace(/https?:\/\//, "")
                        .replace(/\/.*/, "");
      append(helpText, [
        append(tr(), [
          append(td(), [txtNode(prefix + searchsquareOptions[i].opt)]),
          append(td(), [txtNode(": " + url)])
        ])
      ])
    }
  }

  let versionNode = document.createElement("span");
  append(versionNode, [document.createTextNode("startpage " + VERSION)]);
  append(helpText, [document.createElement("br"), versionNode]);
  versionNode.className = "version";
  append(popupDiv, [helpText]);

  popupDiv.style.bottom = "-" + popupDiv.offsetHeight + "px";
}


document.addEventListener("DOMContentLoaded", function(event) {
  configmenuInit(main);
});
