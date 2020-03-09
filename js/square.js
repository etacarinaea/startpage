// string, array, bool
function Square(heading, links, isSearch, configBool, configStyle) {
  this.heading = heading;
  this.links = links;
  this.isSearch = isSearch;
  this.border_width_hovered = configStyle.border_width_hovered;
  this.border_width_normal = configStyle.border_width_normal;
  this.focus_color = configStyle.focus_color;
  this.focus_bg_color = configStyle.focus_bg_color;
  this.link_color = configStyle.link_color;
  this.isAlwaysopen = configBool.alwaysopen;
  this.hasBorders = configBool.borders;
  // Make sure size has a unit
  let size = configStyle.square_size;
  this.size = isNaN(size) ? size.substr(0, size.length-2) : size;
  this.sizeUnit = isNaN(size) ?  size.substr(-2) : "px";

  this.squareElement = document.createElement("div");
  this.squareElement.setAttribute("class", "sqr");

  this.headingElement = document.createElement("span");
  const headingTextnode = document.createTextNode(this.heading);
  this.headingElement.appendChild(headingTextnode);

  this.contentElement = document.createElement("div");
  this.contentElement.setAttribute("class", "content");

  if(!isSearch) {
    const linkElements = [];

    for (let i = 0; i < links.length; i++) {
      linkElements[i] = document.createElement("a");
      linkElements[i].tabIndex = "-1";
      linkElements[i].setAttribute("href", this.links[i].url);

      const textnode = document.createTextNode(this.links[i].name);
      linkElements[i].appendChild(textnode);
      this.contentElement.appendChild(linkElements[i]);
      this.contentElement.appendChild(document.createElement("br"));
     }

  } else {
    this.squareElement.setAttribute("id", "search_sqr");
    this.searchinput = document.createElement("input");
    this.searchinput.tabIndex = "-1";
    this.searchinput.setAttribute("id", "searchinput");
    this.searchinput.setAttribute("autocomplete", "off");

    this.contentElement.appendChild(this.searchinput);

    const enter = function(a) {
      const key = a.keyCode;
      if(key == 13) {
        const query = this.value;
        search(query);
      }
    };
    const searchFocused = (this.searchinput == document.activeElement);
    this.searchinput.addEventListener("keypress", enter);
  }


  this.squareElement.appendChild(this.headingElement);
  this.squareElement.appendChild(this.contentElement);
  document.getElementById("container").appendChild(this.squareElement);

  if(!this.isAlwaysopen) {
    const square = this;
    this.squareElement.addEventListener("mouseover", this.expand.bind(this),
                                        false);
    this.squareElement.addEventListener("mouseout", this.contract.bind(this),
                                        false);
  }
}


Square.prototype.maxHeight = function() {
  return this.size*2 + (this.isSearch ? 37 : 25*this.links.length);
}

Square.prototype.expand = function() {
  if(this.isAlwaysopen) return;
  this.squareElement.style.height = this.maxHeight() + this.sizeUnit;
  if(this.hasBorders) {
    this.squareElement.style.borderWidth = this.border_width_hovered;
  }
};

Square.prototype.contract = function() {
  if(this.isAlwaysopen) return;
  this.squareElement.style.height = this.size + this.sizeUnit;
  this.squareElement.style.borderWidth = this.border_width_normal;
};

Square.prototype.focus = function(index) {
  this.contentElement.childNodes[index*2].style.backgroundColor =
      this.focus_bg_color;
  this.contentElement.childNodes[index*2].style.color = this.focus_color;
};

Square.prototype.unfocus = function(index) {
  this.contentElement.childNodes[index*2].style.backgroundColor = "initial";
  this.contentElement.childNodes[index*2].style.color = this.link_color;
};
