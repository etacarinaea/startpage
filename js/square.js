// string, array, bool
function Square(heading, links, search){
    this.heading = heading;
    this.links = links;
    this.search = search;

    this.height = 150;

    this.squareElement = document.createElement("div");
    this.squareElement.setAttribute("class", "sqr");

    this.headingElement = document.createElement("span");
    var textnode = document.createTextNode(this.heading);
    this.headingElement.appendChild(textnode);

    this.contentElement = document.createElement("div");
    this.contentElement.setAttribute("class", "content");

    if(!search){
        var linkElements = [];

        for (var i = 0; i < links.length; i++){
            linkElements[i] = document.createElement("a");
            linkElements[i].setAttribute("href", this.links[i].url);

            var textnode = document.createTextNode(this.links[i].name)
            linkElements[i].appendChild(textnode);
            this.contentElement.appendChild(linkElements[i]);
            this.contentElement.appendChild(document.createElement("br"));
         }

        this.squareElement.acount = this.links.length;
    }else{
        this.squareElement.setAttribute("id", "search_sqr");
        var searchinput = document.createElement("input");
        searchinput.setAttribute("id", "searchinput");
        searchinput.setAttribute("autocomplete", "off");

        this.contentElement.appendChild(searchinput);
        this.squareElement.acount = 0;
    }


    this.squareElement.appendChild(this.headingElement);
    this.squareElement.appendChild(this.contentElement);
    document.getElementById("cell").appendChild(this.squareElement);

    if(!cfg_bool[1]){
        this.squareElement.addEventListener("mouseover", this.expand, false);
        this.squareElement.addEventListener("mouseout", this.contract, false);
    }
}



Square.prototype.expand = function(){
    if(this.acount > 0){
        // replace hardcoeded div height (300) and line height (25)
        this.style.height = 300 + 25 * this.acount + "px";
    }else{
        // replace hardcoded height
        this.style.height = "337px";
    }
    if(cfg_bool[0]){
        this.style.borderWidth = cfg[10];
    }
}

Square.prototype.contract = function(){
    // replace hardcoeded div height (300)
    this.style.height = 150 + "px";
    this.style.borderWidth = cfg[9];
}
