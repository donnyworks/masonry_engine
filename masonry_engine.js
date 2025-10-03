var canvas = document.getElementById("game");

canvas.width = 640;
canvas.height = 480;

var ctx_window = canvas.getContext("2d");

document.getElementById("title").innerHTML = "A Masonry Engine Game";

function set_title(text) {
	document.getElementById("title").innerHTML = text;
}

function masonry_init(resolution) {
	canvas.width = resolution[0];
	canvas.height = resolution[1];
}

function draw_rect(color, rect) { // window, (255,0,0), (0,0,640,480)
	ctx_window.fillStyle = "rgb(" + String(color[0]) + "," + String(color[1]) + "," + String(color[2]) + ")";
	//console.log(rect);
	ctx_window.fillRect(rect[0],rect[1],rect[2],rect[3]);
}

var _MASONRY_VERBOSE = false;

function draw_text(text,x=0,y=0,color=[255,255,255],align="left") {
	if (_MASONRY_VERBOSE) { console.log("Drawing " + text + " with color " + color + " and alignment " + align + " at " + x + ", " + y); }
	ctx_window.fillStyle = "rgb(" + String(color[0]) + "," + String(color[1]) + "," + String(color[2]) + ")";
	ctx_window.textAlign = align;
	ctx_window.fillText(text, x, y);
}
function fnt_size(text) {
	return [
		ctx_window.measureText(text).width,
		Math.abs(ctx_window.measureText(text).actualBoundingBoxAscent) + Math.abs(ctx_window.measureText(text).actualBoundingBoxDescent)];
}
