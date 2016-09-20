function $(query){
    var dom = function(query){
        this.elements = [];
        switch(query[0]){
            case "#":
                this.elements[0] = document.getElementById(query.substr(1));
                break;
            case ".":
                this.elements = document.getElementsByClassName(query.substr(1));
                break;
            default:
                this.elements = document.getElementsByTagName(query);
        }
        this.length = this.elements.length;
    };

    dom.prototype.css = function(key, value){
        for(var i = 0; i < this.elements.length; i++){
            this.elements[i].style[key] = value;
        }
    };

    return new dom(query);
}

$.loadJSON = function(url, callback){
    var request = new XMLHttpRequest();
    request.overrideMimeType("application/json");

    request.onload = function(){
        if(request.status == "200"){
            callback(JSON.parse(request.responseText));
        }
    };

    request.open("GET", url, false);
    request.send();
};

