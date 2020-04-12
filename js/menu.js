/*
 * Not sure if append* functions should automatically create a new object
 * or append an already existing object passed to it.
 */

// x>0: static width
// x<1: dynamic width, x is x-padding
// y>0: static height
// y<1: dynamic height, y is y-padding
function Menu(name, x, y) {
  this.name = name;
  this.tabs = [];
  this.buttons = [];

  // create DOM nodes
  this.container = document.createElement("div");
  this.menu = document.createElement("div");
  this.menuBar = document.createElement("div");
  this.tabBar = document.createElement("div");
  this.content = document.createElement("div");

  // set classes/ids
  this.container.setAttribute("class", "menuContainer");
  this.container.setAttribute("id", this.name.replaceChars(" ", ""));
  this.menu.setAttribute("class", "menu");
  this.menuBar.setAttribute("class", "menuBar");
  this.tabBar.setAttribute("class", "tabBar");
  this.content.setAttribute("class", "menuContent");

  this.width = x > 0 ? x + "px" : "100%";
  this.height = y > 0 ? y + "px" : "100%";
  if(x < 1 || y < 1) {
    this.container.style.padding =
    (y > 0 ? 0 : -y + "px") + " " + (x > 0 ? 0 : -x + "px")
  }
  this.menu.style.width = this.width;
  this.menu.style.height = this.height;

  // append nodes
  this.menuBar.appendChild(this.tabBar);
  this.menu.appendChild(this.menuBar);
  this.menu.appendChild(this.content);

  this.container.appendChild(this.menu);
  document.body.appendChild(this.container);
}


function Tab(name) {
  this.name = name;
  this.categories = [];

  this.node = document.createElement("div");
  this.node.setAttribute("class", "tab");
  this.node.appendChild(document.createTextNode(name));

  this.content = document.createElement("div");

  this.content.setAttribute("class", "tabContent");
}

Menu.prototype.appendTab = function(name) {
  const tab = new Tab(name);
  this.tabs.push(tab);

  this.tabBar.appendChild(tab.node);
  this.content.appendChild(tab.content);

  return tab;
};

Tab.prototype.show = function() {
  this.content.style.display = "initial";
};
Tab.prototype.hide = function() {
  this.content.style.display = "none";
};
Menu.prototype.makeTabActive = function(tabIndex) {
  for(let i = 0; i < this.tabs.length; i++) {
    if(i === tabIndex) {
      this.tabs[i].show();
      this.tabs[i].node.setAttribute("id", "activeTab");
    } else {
      this.tabs[i].hide();
      this.tabs[i].node.removeAttribute("id");
    }
  }
};


function Category(name, hasHeading, parentTab) {
  this.name = name;
  this.hasHeading = hasHeading;
  this.parentTab = parentTab;
  this.options = [];

  this.element = document.createElement("div");
  this.element.setAttribute("id", name.replaceChars(" ", ""));
  this.element.setAttribute("class", "category");

  if(this.hasHeading) {
    this.headingElem = document.createElement("div");
    this.headingElem.setAttribute("class", "categoryHeading");
    this.headingElem.appendChild(document.createTextNode(this.hasHeading));
    this.element.appendChild(this.headingElem);
  }
}

// type == 0: normal, else: toggle
// hasHeading: boolean
Tab.prototype.appendCategory = function(name, hasHeading) {
  const category = new Category(name, hasHeading, this);

  this.content.appendChild(category.element);
  this.categories.push(category);

  return category;
};



Menu.prototype.kill = function() {
  document.body.removeChild(this.container);
};

Menu.prototype.appendButton = function(name) {
  const button = document.createElement("div");
  this.buttons.push(button);
  button.setAttribute("class", "menu-button");
  button.setAttribute("id", name);
  button.setAttribute("title", name);

  this.menuBar.appendChild(button);

  this.tabBar.style.width = "calc(100% - " + 40 * this.buttons.length + "px";

  return button;
};

// arrays of button names and their descriptions
// returns array of button elements
Menu.prototype.split = function(name, description) {
  const buttondiv = [];
  const nametable = [];
  const namecell = [];
  const descriptiondiv = [];

  for(let i = 0; i < name.length; i++) {
    buttondiv[i] = document.createElement("div");
    buttondiv[i].setAttribute("class", "splitbutton");

    nametable[i] = document.createElement("div");
    nametable[i].setAttribute("class", "splitbutton_nametable");

    namecell[i] = document.createElement("div");
    namecell[i].setAttribute("class", "splitbutton_namecell");

    descriptiondiv[i] = document.createElement("div");
    descriptiondiv[i].setAttribute("class", "splitbutton_description");

    namecell[i].appendChild(document.createTextNode(name[i]));
    descriptiondiv[i].appendChild(document.createTextNode(description[i]));

    nametable[i].appendChild(namecell[i]);

    buttondiv[i].appendChild(nametable[i]);
    buttondiv[i].appendChild(descriptiondiv[i]);

    this.content.appendChild(buttondiv[i]);
  }

  return buttondiv;
};


// type == 0: checkbox, else: text
// value: HTML element value
Category.prototype.appendOption = function(name, key, type, value) {
  const option = document.createElement("div");
  const label = document.createElement("label");
  const text = document.createTextNode(name);
  const input = document.createElement("input");

  // add to category option list
  this.options.push(option);

  input.setAttribute("name", key);

  label.appendChild(text);
  if(type === 0) {
    option.setAttribute("class", "option radioOption");
    input.setAttribute("type", "checkbox");
    input.checked = value;
    option.appendChild(input);
    option.appendChild(label);
  } else {
    option.setAttribute("class", "option");
    input.setAttribute("type", "text");
    input.setAttribute("value", value);
    option.appendChild(label);
    option.appendChild(input);
  }
  this.element.appendChild(option);

  return option;
};


function ConfigSquareDiv(name, parentCategory) {
  this.name = name;
  this.parentCategory = parentCategory;
  this.urls = [];

  this.node = document.createElement("div");
}


Category.prototype.appendSquareDiv = function(name) {
  const div = new ConfigSquareDiv(name, this);

  this.element.appendChild(div.node);
  this.options.push(div);
  return div;
};

function TextField(name, key, cssClass, value, amount, parentObject, index) {
  this.name = name;
  this.key = key;
  this.cssClass = cssClass;
  this.value = value;
  this.amount = amount;
  this.parentObject = parentObject;
  this.index = index;

  this.node = document.createElement("div");
  this.node.setAttribute("class", cssClass);

  if(amount > 0) {
    this.removeNode = document.createElement("img");
    this.removeNode.setAttribute("src", "img/remove.png");
    this.node.appendChild(this.removeNode);
  } else if(cssClass == "squareHeading_addS") {
    this.addNode = document.createElement("img");
    this.addNode.setAttribute("src", "img/addS.png");
    this.node.appendChild(this.addNode);
  } else {
    this.addNode = document.createElement("img");
    this.addNode.setAttribute("src", "img/add.png");
    this.node.appendChild(this.addNode);
  }

  if(typeof key !== 'object') {
    key = [key];
  }
  if(typeof value !== 'object') {
    value = [value];
  }
  for(let i = 0; i < amount; i++) {
    const input = document.createElement("input");
    input.setAttribute("name", key[i]);
    input.setAttribute("value", value[i]);
    this.node.appendChild(input);
  }
}

TextField.prototype.addEvent = function() {
  this.addNode.addEventListener("click", () => {
    if(this.cssClass == "squareURL") {
      let parentElement = this.node.parentElement;
      parentElement.removeChild(this.node);
      this.parentObject.appendTextField("link" + this.index,
                                        [this.index, "url"], "squareURL",
                                        ["name", "url"], 2);
      parentElement.appendChild(this.node);
    } else if(this.cssClass == "squareOption") {
      let parentElement = this.node.parentElement;
      parentElement.removeChild(this.node);
      this.parentObject.appendTextField("option" + this.index,
                                        ["opt", "url", "space"],
                                        "squareOption",
                                        ["option", "url", "space"], 3,
                                        this.index);
      parentElement.appendChild(this.node);
    } else if(this.cssClass == "squareHeading") {
      // new square
      const addObject = this.parentObject.parentCategory.options.pop();
      this.parentObject.parentCategory.element.removeChild(addObject.node);
      // insert before search square if one exists
      let searchObject = this.parentObject.parentCategory.options[
          this.parentObject.parentCategory.options.length-1];
      if(searchObject.urls[1].className == "squareOption") {
        searchObject = this.parentObject.parentCategory.options.pop();
        this.parentObject.parentCategory.element
                                        .removeChild(searchObject.node);
      }
      const sqr = this.parentObject.parentCategory
                                   .appendSquareDiv("new square");
      sqr.appendTextField("heading" + this.index, this.index, "squareHeading",
                          "new square", 1, this.index,
                          this.parentObject.parentCategory);
      sqr.appendTextField("link" + this.index, [this.index, "url"],
                          "squareURL", ["name", "url"], 2);
      sqr.appendTextField("link" + this.index, undefined,"squareURL",
                          undefined, 0, this.index);
      if(searchObject.urls[1].className == "squareOption") {
        this.parentObject.parentCategory.element
                         .appendChild(searchObject.node);
        this.parentObject.parentCategory.options.push(searchObject);
      }
      this.parentObject.parentCategory.element.appendChild(addObject.node);
      this.parentObject.parentCategory.options.push(addObject);
    } else {
      // new search square
      let searchObject = this.parentObject.parentCategory.options[
          this.parentObject.parentCategory.options.length-2];
      if(searchObject.urls[1].className != "squareOption") {
        const addObject = this.parentObject.parentCategory.options.pop();
        this.parentObject.parentCategory.element.removeChild(addObject.node);
        const sqr = this.parentObject.parentCategory
                                     .appendSquareDiv("new search square");
        sqr.appendTextField("heading" + this.index, [this.index, "prefix"],
                            "squareHeading", ["new search square", "-"], 2,
                            this.index, this.parentObject.parentCategory);
        sqr.appendTextField("option" + this.index, ["opt", "url", "space"],
                            "squareOption", ["default", "url", "+"], 3);
        sqr.appendTextField("link" + this.index, undefined,"squareOption",
                            undefined, 0, this.index);
        this.parentObject.parentCategory.element
                                        .appendChild(this.parentObject.node);
        this.parentObject.parentCategory.options.push(addObject);
      } else {
        alert("A search square already exists!");
      }
    }
  });
};

TextField.prototype.removeEvent = function() {
  this.removeNode.addEventListener("click", () => {
    if(this.cssClass == "squareURL" || this.cssClass == "squareOption") {
      this.node.parentElement.removeChild(this.node);
      const index = this.parentObject.urls.indexOf(this.node);
      if(index > -1) {
        this.parentObject.urls.splice(index, 1);
      }
    } else {
      const index = this.parentObject.parentCategory.options
                        .indexOf(this.parentObject);
      if(index > -1) {
        this.parentObject.parentCategory.options.splice(index, 1);
      }
      this.node.parentElement.parentElement
          .removeChild(this.node.parentElement);
    }
  });
};

ConfigSquareDiv.prototype.appendTextField = function(name, key, cssClass, value,
                                                     amount, index) {
  const textfield = new TextField(name, key, cssClass, value, amount, this,
                                  index);

  this.node.appendChild(textfield.node);

  if(amount > 0) {
    textfield.removeEvent();
    this.urls.push(textfield.node);
  } else {
    textfield.addEvent();
  }

  return textfield;
};

