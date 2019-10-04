// string, array, bool
function Square(heading, links, isSearch, size) {
  this.heading = heading;
  this.links = links;
  this.search = isSearch;

  // Make sure size has a unit
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

    this.squareElement.acount = this.links.length;
  } else {
    this.squareElement.setAttribute("id", "search_sqr");
    this.searchinput = document.createElement("input");
    this.searchinput.tabIndex = "-1";
    this.searchinput.setAttribute("id", "searchinput");
    this.searchinput.setAttribute("autocomplete", "off");

    this.contentElement.appendChild(this.searchinput);
    this.squareElement.acount = 0;

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

  if(!data.bool.alwaysopen) {
    const square = this;
    this.squareElement.addEventListener("mouseover", this.expand.bind(this),
                                        false);
    this.squareElement.addEventListener("mouseout", this.contract.bind(this),
                                        false);
  }

  const squareElement = this.squareElement;
  const searchinput = this.searchinput;
}


Square.prototype.expand = function() {
  let obj;
  if(this.squareElement) {
    obj = this.squareElement;
  } else {
    obj = this;
  }

  if(obj.acount > 0) {
    obj.style.height = (this.size*2 + 25 * obj.acount) + this.sizeUnit;
  } else {
    obj.style.height = (this.size*2 + 37) + this.sizeUnit;
  }
  if(data.bool.borders) {
    obj.style.borderWidth = data.style.border_width_hovered;
  }
};

Square.prototype.contract = function() {
  let obj;
  if(this.squareElement) {
    obj = this.squareElement;
  } else {
    obj = this;
  }

  obj.style.height = this.size + this.sizeUnit;
  obj.style.borderWidth = data.style.border_width_normal;
};

Square.prototype.focus = function(index) {
  this.contentElement.childNodes[index*2].style.backgroundColor =
      data.style.focus_bg_color;
  this.contentElement.childNodes[index*2].style.color = data.style.focus_color;
};

Square.prototype.unfocus = function(index) {
  this.contentElement.childNodes[index*2].style.backgroundColor = "initial";
  this.contentElement.childNodes[index*2].style.color = data.style.link_color;
};
