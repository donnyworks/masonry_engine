var resolution = [640,480];

masonry_init(resolution);

ctx_window.font = "32px Arial";
ctx_window.textBaseline = "top";

const urlParams = new URLSearchParams(window.location.search);

var boxSize = [resolution[0]/2,resolution[1]/2/2];

var q = null;

var username = "CONECONECONECONE";

if (urlParams.has('username')) {
	username = urlParams.get('username');
}

var points = 0;

var questions = [];

var q_idx = 0;

var elapsed = 0.0;

var q_elapsed = 0.0;

var lastTime = 0.0;

// Create idle screen while waiting for request to finish.
draw_rect([255,255,255],[0,0,640,480]);
draw_rect([255,0,255],[0,0,640,32]);
draw_text(username);
var siz = ctx_window.measureText("Waiting...");
draw_text("Waiting...",640 - siz.width,0,align="end");
// Class constructors & game fetch

var request_url = 'https://donnyworks.github.io/masonry_engine/examples/nookit_offline/questions.json';

if (urlParams.has('request_url')) {
	request_url = urlParams.get('request_url');
}

var datae = [];
fetch(request_url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Or response.text(), response.blob(), etc.
  })
  .then(data => {
    datae = data;
for (var i = 0; i < datae.length; i++) {
	console.log("Loading question number " + (i + 1));
	var question = datae[i];
	questions.push(new Question(question["question"],question["options"],question["correct"]));
}
q = questions[q_idx];
requestAnimationFrame(gameLoop);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });

class Question {
    constructor(question,answers,valid_answer,colors=[[[255,0,0],[0,255,0]],[[0,0,255],[255,255,0]]]){ // Valid answer is text
        this.q = question;
        this.a = answers;
        this.v = valid_answer;
        this.c = colors;
        this.active = true;
        this.result = null;
    }
    render() {
        //text = fontLarge.render(this.q,True,(0,0,0))
        var renderSize = fnt_size(this.q)
        draw_text(this.q,(resolution[0]/2)-renderSize[0]/2,(resolution[1]/2/2+16)-renderSize[1]/2,[0,0,0]);
        for (var x = 0; x < 2; x++) {
            for (var y = 0; y < 2; y++) {
                draw_rect(this.c[x][y],[(resolution[0]/2)*x,(resolution[1]/2) + ((resolution[1]/2/2)*y),boxSize[0],boxSize[1]]);
                var innerText = this.a[x + y*2];
                var renderSize = fnt_size(innerText);
                var colorX = [255,255,255];
		if (y == 1) {
			colorX = [127,127,127];
		}
                //text = fontLarge.render(innerText,True,colorX)
		//console.log(renderSize);
		//console.log(((resolution[1]/2)+(resolution[1]/2/2)*y)-renderSize[1]/2+boxSize[1]/2);
                draw_text(innerText,(resolution[0]/2)*x + boxSize[0]/2-renderSize[0]/2,((resolution[1]/2)+(resolution[1]/2/2)*y)-renderSize[1]/2+boxSize[1]/2,colorX);
	    }
	}
    }
    handleEvent(n,t){
	var pos = [n,t]; 
        for (var x = 0; x < 2; x++) {
            for (var y = 0; y < 2; y++) {
		//console.log(x + "," + y + "-------------");
		//console.log(pos);
		var rect = [(resolution[0]/2)*x,(resolution[1]/2) + ((resolution[1]/2/2)*y),boxSize[0],boxSize[1]];
		//console.log(rect);
                var xp = rect[0];
                var yp = rect[1];
                var xs = rect[0] + rect[2];
                var ys = rect[1] + rect[3];
		//c/onsole.log("Check 1: " + (pos[0] > xp - 1));
		//console.log("Check 2: " + (pos[0] < xs + 1));
		//console.log("Check 3: " + (pos[1] > yp - 1));
		//console.log("Check 4: " + (pos[1] < ys + 1));
		//console.log("End result: " + (pos[0] > xp - 1 && pos[0] < xs + 1 && pos[1] > yp - 1 && pos[1] < ys + 1));
                if (pos[0] > xp - 1 && pos[0] < xs + 1 && pos[1] > yp - 1 && pos[1] < ys + 1) {
                    this.result = this.a[x + y*2] == this.v;
                    this.active = false;
		}
	    }
	}
    }
}

function getClickPosition(event) {
        const rect = canvas.getBoundingClientRect(); // Get the size and position of the canvas
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
	if (q.active && container_running) { q.handleEvent(x,y); }
	if (!container_running && !state_finished) {
		var pos = [x,y];
		var new_rect = [resolution[0]/2 - boxSize[0]/2,resolution[1]/2 - boxSize[1]/2,boxSize[0],boxSize[1]];
		var xp = new_rect[0];
        var yp = new_rect[1];
        var xs = new_rect[0] + new_rect[2];
        var ys = new_rect[1] + new_rect[3];
        if (pos[0] > xp - 1 && pos[0] < xs + 1 && pos[1] > yp - 1 && pos[1] < ys + 1) {
        	console.log("%cWARNING!","color: red; font-size: 200%;");
        	console.log("The browser console is a developer tool not intended for use by [redacted] users.  FEEL FREE TO copy and paste any code in this window.  Look, we trust you not to hack our game. Pretty please, don't go poking around where you're not meant to. http://github.com/donnyworks/masonry_engine/tree/main/examples/nookit_offline");
            container_running = true;
		}
	}
        //console.log(`Click coordinates on canvas: x=${x}, y=${y}`);
        // You can now use these x, y coordinates for drawing or other logic
}

canvas.addEventListener('mousedown',getClickPosition);

var container_running = false;

var colormode = 255; // COLORMODE: Console variable

var state_finished = false;

function gameLoop(timestamp) {
	var deltarune = (timestamp - lastTime)/1000;
	if (container_running && !state_finished) {
		draw_rect([255,255,255],[0,0,resolution[0],resolution[1]]);
		draw_rect([255,0,255],[0,0,resolution[0],32]);
		draw_text(username);
		var siz = ctx_window.measureText("© " + points);
		draw_text("© " + points,640 - siz.width,0,align="end");
		if (q.active) {
			q.render();
			q_elapsed += deltarune;
		} else {
			//console.log(deltarune);
			if (elapsed < 2.0) {
				console.log("Waiting " + (2 - elapsed) + " seconds...");
				elapsed += deltarune;
				draw_rect([0,127,127],[0,32,resolution[0],resolution[1]-32]);
				//spin = fontLarge.render("Sly like a fox?",True,(255,255,255))
				var s = fnt_size("Sly like a fox?");
				var w = s[0];
				var h = s[1];
				//console.log([resolution[0]/2-w/2,resolution[1]/2-h/2]);
				draw_text("Sly like a fox?",resolution[0]/2-w/2,resolution[1]/2-h/2);
			} else {
				if (elapsed < 5.0) {
					elapsed += deltarune;
					if (q.result) {
						draw_rect([0,colormode,0],[0,32,resolution[0],resolution[1]-32]);
						//spin = fontLarge.render("Sly like a fox?",True,(255,255,255))
						var s = fnt_size("Speedy like a rabbit, and sly like a fox!");
						var w = s[0];
						var h = s[1];
						//console.log([resolution[0]/2-w/2,resolution[1]/2-h/2]);
						draw_text("Speedy like a rabbit, and sly like a fox!",resolution[0]/2-w/2,resolution[1]/2-h/2);
					} else {
						draw_rect([colormode,0,0],[0,32,resolution[0],resolution[1]-32]);
						//spin = fontLarge.render("Sly like a fox?",True,(255,255,255))
						var s = fnt_size("Speedy like a rabbit... but the tortoise won.");
						var w = s[0];
						var h = s[1];
						//console.log([resolution[0]/2-w/2,resolution[1]/2-h/2]);
						draw_text("Speedy like a rabbit... but the tortoise won.",resolution[0]/2-w/2,resolution[1]/2-h/2);	
					}
				} else {
					var result = Math.round(15 - (q_elapsed));
					if (result < 1) { result = 1; }
					if (q.result) { points += result; }
		                	q_elapsed = 0.0;
		                	elapsed = 0.0;
		                	if (q_idx < questions.length - 1) {
		                    		q_idx += 1;
		                    		q = questions[q_idx];
		                	} else {
						var s = fnt_size("You got " + points + " points");
						var w = s[0];
						var h = s[1];
						draw_text("You got " + points + " points",resolution[0]/2-w/2,resolution[1]/2-h/2);
						state_finished = true;
					}
				}
			}
		}
	} else {
		if (!state_finished) { draw_rect([127,127,127],[resolution[0]/2 - boxSize[0]/2,resolution[1]/2 - boxSize[1]/2,boxSize[0],boxSize[1]]); var s = fnt_size("Start Game"); var w = s[0]; var h = s[1]; draw_text("Start Game",resolution[0]/2-w/2,resolution[1]/2-h/2);}
		//else {
		//
		//}
	}
	lastTime = timestamp;
	requestAnimationFrame(gameLoop);
}

