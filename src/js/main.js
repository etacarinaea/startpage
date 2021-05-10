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

function globalKeyListener(squares, e) {
  if(typeof squares.search !== "undefined") {
    if(squares.search.searchinput === document.activeElement
       && !(squares.search.searchinput.value === ""
       || squares.search.searchinput.value === null)) {
      return;
    }
  }

  let n = 0;
  if(typeof squares.search === "undefined") n = 1;

  let key = e.keyCode;
  if(key == 27) {
    // esc
    if(typeof squares.search !== "undefined") {
      squares.search.searchinput.blur();
      squares.search.contract();
    }
    if(typeof squares.normal[focusedSquare] !== "undefined") {
      squares.normal[focusedSquare].unfocus(focusedLink);
      squares.normal[focusedSquare].contract();
    }
    focusedSquare = -1;
    focusedLink = 0;
  } else if(key == 9 && typeof squares.search !== "undefined") {
    // tab
    if(typeof squares.normal[focusedSquare] !== "undefined") {
      squares.normal[focusedSquare].unfocus(focusedLink);
      squares.normal[focusedSquare].contract();
    }
    focusedSquare = squares.normal.length;
    squares.search.expand();
    squares.search.searchinput.focus();
  } else if(key == 37) {
    // left arrow
    if(focusedSquare > 0) {
      if(typeof squares.search !== "undefined") {
        if(squares.search.searchinput == document.activeElement
           && (squares.search.searchinput.value == ""
           || squares.search.searchinput.value == null)) {
          squares.search.searchinput.blur();
          squares.search.contract();
        } else if(focusedSquare < squares.normal.length) {
          squares.normal[focusedSquare].unfocus(focusedLink);
          squares.normal[focusedSquare].contract();
        }
      } else if(focusedSquare < squares.normal.length) {
        squares.normal[focusedSquare].unfocus(focusedLink);
        squares.normal[focusedSquare].contract();
      }
      focusedSquare--;
      focusedLink = 0;
      squares.normal[focusedSquare].expand();
      squares.normal[focusedSquare].focus(focusedLink);
    }
  } else if(key == 38 && focusedSquare >= 0) {
    // up arrow
    if(typeof squares.search !== "undefined") {
      if(squares.search.searchinput == document.activeElement) return;
    }
    if(focusedLink > 0) {
      squares.normal[focusedSquare].unfocus(focusedLink);
      focusedLink--;
      squares.normal[focusedSquare].focus(focusedLink);
    }
  } else if(key == 39) {
    // right arrow
    if(focusedSquare < squares.normal.length - 1) {
      if(focusedSquare >= 0) {
        squares.normal[focusedSquare].unfocus(focusedLink);
        squares.normal[focusedSquare].contract();
      }
      focusedSquare++;
      focusedLink = 0;
      squares.normal[focusedSquare].expand();
      squares.normal[focusedSquare].focus(focusedLink);
    } else if(focusedSquare < squares.normal.length - n) {
      if(typeof squares.search !== "undefined") {
        if(squares.search.searchinput == document.activeElement
           && (squares.search.searchinput.value == ""
           || squares.search.searchinput.value == null)) {
          squares.search.searchinput.blur();
          squares.search.contract();
        } else if(focusedSquare < squares.normal.length) {
          squares.normal[focusedSquare].unfocus(focusedLink);
          squares.normal[focusedSquare].contract();
        }
      } else {
        squares.normal[focusedSquare].unfocus(focusedLink);
        squares.normal[focusedSquare].contract();
      }
      focusedSquare++;
      if(typeof squares.search !== "undefined") {
        squares.search.expand();
        squares.search.searchinput.focus();
      }
    }
  } else if(key == 40 && focusedSquare >= 0) {
    // down arrow
    if(typeof squares.search !== "undefined") {
      if(squares.search.searchinput == document.activeElement) return;
    }
    if(focusedLink < squares.normal[focusedSquare].props.links.length - 1) {
      squares.normal[focusedSquare].unfocus(focusedLink);
      focusedLink++;
      squares.normal[focusedSquare].focus(focusedLink);
    }
  } else if(key == 13) {
    // enter
    if(squares.search.searchinput !== document.activeElement &&
       squares.normal[focusedSquare] !== undefined) {
      window.location = squares.normal[focusedSquare].props.links[focusedLink].url;
    }
  }

  if([9,37,38,39,40].indexOf(key) > -1) {
    e.preventDefault();
  }
}


function main(squares) {
  const container = document.getElementById("container");
  const gearContainer = document.getElementById("gearContainer");

  gearContainer.addEventListener("click", configmenuInit);
  document.addEventListener("keydown", globalKeyListener.bind(undefined, squares));
}


document.addEventListener("DOMContentLoaded", function(event) {
  configmenuInit(main);
});
