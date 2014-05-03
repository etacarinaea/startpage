document.addEventListener("DOMContentLoaded", function() {
    var sqr = document.querySelectorAll(".sqr");
	for (var i = 0; i < sqr.length; ++i) {
		sqr[i].addEventListener("mouseover", expand, false);
		sqr[i].addEventListener("mouseout", contract, false);
	}
}, false);

function expand(){
	var acount = this.getElementsByTagName('a').length;
	this.style.height=300+25*acount+"px";
	this.style.borderTop="2px solid #ad3636";
	this.style.borderBottom="2px solid #ad3636";
};
function contract(){
	this.style.height="150px";
	this.style.borderTop="0 solid #ad3636";
	this.style.borderBottom="0 solid #ad3636";
};
