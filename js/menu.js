// type==0: percentual size ; x: left/right padding; y: top/bottom padding
// type==1: static size     ; x: width; y: height
function Menu(name, type, x, y){
    this.type = type;
    this.name = name;
    this.categories = [];

    // create DOM nodes
    this.container = document.createElement("div");
    this.menu = document.createElement("div");
    this.heading = document.createElement("div");
    this.heading.appendChild(document.createTextNode(this.name));
    this.content = document.createElement("div");

    // set classes/ids
    this.container.setAttribute("class", "menuContainer");
    this.container.setAttribute("id", this.name.replaceChars(" ", ""));
    this.menu.setAttribute("class", "menu");
    this.heading.setAttribute("class", "menuHeading");
    this.content.setAttribute("class", "menuContent");

    // set styles for different types
    if(this.type==0){
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
    this.menu.appendChild(this.heading);
    this.menu.appendChild(this.content);
    
    this.container.appendChild(this.menu);
    document.body.appendChild(this.container);

}


function Category(name, type, heading){
    this.name = name;
    this.type = type;
    this.heading = heading;
    this.options = [];

    this.element = document.createElement("div");
    this.element.setAttribute("id", name.replaceChars(" ", ""));
    this.element.setAttribute("class", "category");

    if(this.heading){
        this.headingElem = document.createElement("div");
        this.headingElem.setAttribute("class", "categoryHeading");
        this.headingElem.appendChild(document.createTextNode(this.heading));
        this.element.appendChild(this.headingElem);
    }
}



Menu.prototype.appendButton = function(name, color){
    var button = document.createElement("div");
    button.setAttribute("class", "button");
    button.setAttribute("id", name);
    button.setAttribute("title", name);
    button.style.backgroundColor = color;

    this.heading.appendChild(button);
    
    return button;
}

// type == 0: normal, else: toggle
// hasHeading: boolean
Menu.prototype.appendCategory = function(name, type, hasHeading){
    var category = new Category(name, type, hasHeading);

    // add to menu category list
    this.categories.push(category);


    this.content.appendChild(category.element);

    return category;
}

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

    if(type == 0){
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
}

