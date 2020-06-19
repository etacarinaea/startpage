function splitUnit(str) {
  let size = isNaN(str) ? str.substr(0, str.length-2) : str;
  let sizeUnit = isNaN(str) ? str.substr(-2) : "";
  return [ size, sizeUnit ];
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


/**
 * @param {string} query The search query
 */
function search(query, popup) {
}


let focusedSquare = -1;
let focusedLink = 0;

function globalKeyListener(e) {
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
  const gearContainer = document.getElementById("gearContainer");

  gearContainer.addEventListener("click", configmenuInit);
  document.addEventListener("keydown", globalKeyListener);
}


document.addEventListener("DOMContentLoaded", function(event) {
  configmenuInit(main);
});
