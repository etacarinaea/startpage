squareConfObj = [
    { name: "4chan", links: [
        { name: "/a/", url: "http://www.4chan.org/a/"},
        { name: "/g/", url: "http://www.4chan.org/g/"},
        { name: "/w/", url: "http://www.4chan.org/w/"}
    ]},
    { name: "images", links: [
        { name: "danbooru", url: "http://danbooru.donmai.us"}
    ]}
];

// string, array, int
function Square(heading, links, type){
    this.heading = heading;
    this.links = links;
    this.type = type;

    this.height = 150;

    this.squareElement = document.createElement("div");
    this.squareElement.setAttribute("class", "sqr");

    this.headingElement = document.createElement("span");
    var textnode = document.createTextNode(this.heading);
    this.headingElement.appendChild(textnode);


    // links
    this.contentElement = document.createElement("div");
    this.contentElement.setAttribute("class", "content");

    var linkElements = [];

    for (var i = 0; i < links.length; i++){
        linkElements[i] = document.createElement("a");
        linkElements[i].setAttribute("href", this.links[i].url);

        var textnode = document.createTextNode(this.links[i].name)
        linkElements[i].appendChild(textnode);
        this.contentElement.appendChild(linkElements[i]);
        this.contentElement.appendChild(document.createElement("br"));
     }


    this.squareElement.appendChild(this.headingElement);
    this.squareElement.appendChild(this.contentElement);
    document.getElementById("cell").appendChild(this.squareElement);

    this.squareElement.acount = this.links.length;
    if(!cfg_bool[1]){
        this.squareElement.addEventListener("mouseover", this.expand, false);
        this.squareElement.addEventListener("mouseout", this.contract, false);
    }
}



Square.prototype.expand = function(){
    if(this.acount > 0){
        // replace hardcoeded div height (300) and line height (25)
        this.style.height = 150 * 2 + 25 * this.acount + "px";
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
