function expand(x){
	var acount = x.getElementsByTagName('a').length;
	x.style.height=300+25*acount+"px";
	x.style.borderTop="2px solid #ad3636";
	x.style.borderBottom="2px solid #ad3636";
}
function contract(x){
	x.style.height="150px";
	x.style.borderTop="0 solid #ad3636";
	x.style.borderBottom="0 solid #ad3636";
}