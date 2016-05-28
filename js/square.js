// string, array, bool
function Square(heading, links, isSearch){
    this.heading = heading;
    this.links = links;
    this.search = isSearch;

    this.height = 150;

    this.squareElement = document.createElement("div");
    this.squareElement.setAttribute("class", "sqr");

    this.headingElement = document.createElement("span");
    var headingTextnode = document.createTextNode(this.heading);
    this.headingElement.appendChild(headingTextnode);

    this.contentElement = document.createElement("div");
    this.contentElement.setAttribute("class", "content");

    if(!isSearch){
        var linkElements = [];

        for (var i = 0; i < links.length; i++){
            linkElements[i] = document.createElement("a");
            linkElements[i].setAttribute("href", this.links[i].url);

            var textnode = document.createTextNode(this.links[i].name);
            linkElements[i].appendChild(textnode);
            this.contentElement.appendChild(linkElements[i]);
            this.contentElement.appendChild(document.createElement("br"));
         }

        this.squareElement.acount = this.links.length;
    }else{
        this.squareElement.setAttribute("id", "search_sqr");
        this.searchinput = document.createElement("input");
        this.searchinput.setAttribute("id", "searchinput");
        this.searchinput.setAttribute("autocomplete", "off");

        this.contentElement.appendChild(this.searchinput);
        this.squareElement.acount = 0;
    }


    this.squareElement.appendChild(this.headingElement);
    this.squareElement.appendChild(this.contentElement);
    document.getElementById("cell").appendChild(this.squareElement);

    if(!cfg_bool[1]){
        var square = this;
        this.squareElement.addEventListener("mouseover", this.expand, false);
        this.squareElement.addEventListener("mouseout", this.contract, false);
    }

    // search
    var enter = function(a){
        var key = a.keyCode;
        if(key == 13){
            var query = this.value;
            search(query);
        }
    };
    var squareElement = this.squareElement;
    var searchinput = this.searchinput;
    var tab = function(a){
        var key = a.keyCode;
        if(key == 9){
            squareElement.style.height = "337px";
            squareElement.style.borderWidth = cfg[10];
            searchinput.focus();
        }

        if([9].indexOf(key) > -1){
            a.preventDefault();
        }
    };
    if(isSearch){
        this.searchinput.addEventListener("keypress", enter);
        document.removeEventListener("keypress", tab);
        document.addEventListener("keypress", tab);
    }
}


// cant find a better solution to work with event listeners
Square.prototype.expand = function(){
    var obj;
    if(this.squareElement){
        obj = this.squareElement;
    }else{
        obj = this;
    }

    if(this.acount > 0){
        // replace hardcoeded div height (300) and line height (25)
        obj.style.height = 300 + 25 * this.acount + "px";
    }else{
        // replace hardcoded height
        obj.style.height = "337px";
    }
    if(cfg_bool[0]){
        obj.style.borderWidth = cfg[10];
    }
};

Square.prototype.contract = function(){
    var obj;
    if(this.squareElement){
        obj = this.squareElement;
    }else{
        obj = this;
    }

    // replace hardcoeded div height (300)
    obj.style.height = 150 + "px";
    obj.style.borderWidth = cfg[9];
};
