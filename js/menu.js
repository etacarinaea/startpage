// percentual size ; x: left/right padding; y: top/bottom padding
// static size     ; x: width; y: height
function Menu(name, staticSize, x, y){
    this.staticSize = staticSize;
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

    // set styles for different types
if(!this.staticSize){
        this.width = "100%";
        this.height = "100%";
        this.container.style.padding = y + "px " + x + "px";
    }else{
        this.width = x + "px";
        this.height = y + "px";
        this.menu.style.position = "relative";
        this.menu.style.top = "50%";
        this.menu.style.transform = "translateY(-50%)";
        this.menu.style.margin = "auto";
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


function Tab(name){
    this.name = name;
    this.categories = [];

    this.node = document.createElement("div");
    this.node.setAttribute("class", "tab");
    this.node.appendChild(document.createTextNode(name));

    this.content = document.createElement("div");

    this.content.setAttribute("class", "tabContent");
}

Menu.prototype.appendTab = function(name){
    var tab = new Tab(name);
    this.tabs.push(tab);

    this.tabBar.appendChild(tab.node);
    this.content.appendChild(tab.content);
};

Tab.prototype.show = function(){
    this.content.style.display = "initial";
};
Tab.prototype.hide = function(){
    this.content.style.display = "none";
};
Menu.prototype.makeTabActive = function(tabIndex){
    for(var i=0; i < this.tabs.length; i++){
        if(i === tabIndex){
            this.tabs[i].show();
            this.tabs[i].node.setAttribute("id", "activeTab");
        }else{
            this.tabs[i].hide();
            this.tabs[i].node.removeAttribute("id");
        }
    }
};


function Category(name, hasHeading){
    this.name = name;
    this.hasHeading = hasHeading;
    this.options = [];

    this.element = document.createElement("div");
    this.element.setAttribute("id", name.replaceChars(" ", ""));
    this.element.setAttribute("class", "category");

    if(this.hasHeading){
        this.headingElem = document.createElement("div");
        this.headingElem.setAttribute("class", "categoryHeading");
        this.headingElem.appendChild(document.createTextNode(this.name));
        this.element.appendChild(this.headingElem);
    }
}



Menu.prototype.kill = function(){
    document.body.removeChild(this.container);
};
Menu.prototype.appendButton = function(name, color){
    var button = document.createElement("div");
    this.buttons.push(button);
    button.setAttribute("class", "button");
    button.setAttribute("id", name);
    button.setAttribute("title", name);
    button.style.backgroundColor = color;

    this.menuBar.appendChild(button);

    this.tabBar.style.width = "calc(100% - " + 40 * this.buttons.length + "px";

    return button;
};

// type == 0: normal, else: toggle
// hasHeading: boolean
Menu.prototype.appendCategory = function(name, hasHeading, tabIndex){
    var category = new Category(name, hasHeading);

    if(this.tabs.length < 1){
        this.tabs[0].content.appendChild(category.element);
        this.tabs[0].categories.push(category);
    }else{
        this.tabs[tabIndex].content.appendChild(category.element);
        this.tabs[tabIndex].categories.push(category);
    }

    return category;
};

// arrays of button names and their descriptions
// returns array of button elements
Menu.prototype.split = function(name, description){
    var buttondiv = [];
    var nametable = [];
    var namecell = [];
    var descriptiondiv = [];

    for(var i=0; i < name.length; i++){
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
Category.prototype.appendOption = function(name, key, type, callback, value){
    var option = document.createElement("div");
    var label = document.createElement("label");
    var text = document.createTextNode(name);
    var input = document.createElement("input");

    // add to category option list
    this.options.push(option);

    option.setAttribute("class", "option");
    input.setAttribute("name", key);

    if(type === 0){
        option.style.width = "50%";
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
    option.appendChild(label);
    this.element.appendChild(option);

    return option;
};

