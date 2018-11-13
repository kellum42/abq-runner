'use strict';

class Rect {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}

class GameLogic {
	constructor(){
		// store max score in local storage
		this.frameRate = 1000/60
		this.score = 0;
		this.speed = 3;
		this.gameTime = window.performance.now();
	}
	
	getMaxScore(){
		
	}
	
	update(){
		//	don't quite understand offset yet?
		
		this.score += this.speed;
		
	}	
}

class Screen {
	constructor(){
		const self = this;
		self.columns = 16;
		self.rows = 9;
		self.width = self.columns * 20;
		self.height = self.rows * 20;
		self.cell = {
			width: self.width / self.columns,
			height: self.height / self.rows
		}
		self.ratio = self.rows / self.columns;
		self.map = [
		  "s1","s2","s1","s1","s2","s2","s2","s1","s2","s2","s1","s1","s2","s2","s2","s1",
		  "s1","s1","s2","s1","s2","s2","s1","s1","s1","s2","s1","s2","s1","s1","s1","s1",
		  "s2","s1","s1","s1","s2","s1","s1","s1","s2","s1","s2","s1","s1","s2","s2","s1",
		  "s2","s1","s1","s2","s1","s2","s1","s2","s2","s2","s1","s2","s1","s1","s1","s1",
		  "s1","s1","s1","s1","s2","s1","s1","s2","s2","s2","s1","s1","s2","s1","s1","s1",
		  "s1","s1","s1","s2","s1","s1","s2","s2","s2","s1","s2","s1","s1","s1","s1","s2",
		  "s1","s2","s2","s2","s1","s1","s2","s1","s1","s1","s2","s2","s2","s1","s1","s2",
		  "s1","s1","s2","s1","s1","s1","s1","s2","s2","s1","s2","s1","s1","s2","s1","s1",
		  "d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"
		];
	}
	
	getActualDimensions(){
		return { width: window.innerWidth, height: window.innerWidth * this.ratio };
	}
	
	scroll() {
		for (let index = this.map.length - this.columns * 2 ; index > -1; index -= this.columns) {
            this.map.splice(index, 1);
            const item = Math.random() > 0.5 ? "s1" : "s2";
            this.map.splice(index + this.columns - 1, 0, item);
       }
	}
}

class Controller {
	constructor(model, view){
		const self = this;
		self.model = model;
		self.view = view;
		
		this.init();
		
		model.sprite.src = "imgs/sprite-v2.png";
		model.sprite.addEventListener("load", function(){
			self.start();
		})
	}
	
	init(){
		this.view.resizeGameCanvas(this.model.screen.getActualDimensions());
		this.view.buffer.canvas.height = this.model.screen.height;
		this.view.buffer.canvas.width = this.model.screen.width;
	}
	
	start(){
		window.requestAnimationFrame(this.loop);
	}
	
	loop(timeStamp) {
		console.log("here");
		const self = window.controller;
		var totalGameTime = self.model.logic.gameTime;
		const frameRate = self.model.logic.frameRate;
		
		if (timeStamp >= totalGameTime + frameRate) {
			if (timeStamp - totalGameTime >= frameRate * 4) {
				self.model.logic.gameTime = totalGameTime = timeStamp;
			}
		
			while (self.model.logic.gameTime < timeStamp) {
				self.model.logic.gameTime += frameRate;
				self.model.logic.update();
				self.model.screen.scroll();
			}
			self.view.renderGame(self.model);
		}
		window.requestAnimationFrame(self.loop);
	}
}

class Model {
	constructor(){
		const self = this;
		
		
		//self.cellSize = self.getGameCanvasDimensions().width / self.numColumns;
		self.sprite = new Image();
		
		//	game config data - this should be preferences that the user is able to save locally.
		//	customize the game based off this config data.
		const config = {
			
		};
		
		self.logic = new GameLogic();
		self.screen = new Screen();
		
		self.spriteRects = {
			"d": new Rect(87, 376, 50, 70),	// dirt,
			"s1": new Rect(87, 450, 40, 40), // sky 1
			"s2": new Rect(161, 450, 40, 40) // sky 2
		}
	}
}

class View {
	constructor(){
		this.context = document.getElementById("canvas").getContext("2d"); 
		this.canvas = this.context.canvas;
		this.buffer = document.createElement("canvas").getContext("2d");
	}
	
	resizeGameCanvas(obj){
		this.canvas.height = obj.height;
		this.canvas.width = obj.width;
	}
	
	runSplashScreen(){
		
	}
	
	renderGame(model){
		
		//	draw background (sky & dirt)
		for (var i=0;i<model.screen.map.length;i++) {
			const rect = model.spriteRects[model.screen.map[i]];
			this.buffer.drawImage(model.sprite, rect.x, rect.y, rect.width, rect.height, (i % model.screen.columns) * model.screen.cell.width, Math.floor(i / model.screen.columns) * model.screen.cell.height, model.screen.cell.width, model.screen.cell.height);
		}
		
		// draw score
	    this.buffer.font = "20px Arial";
	    this.buffer.fillStyle = "#000000";
	    this.buffer.fillText("0/1350", 5, 20);

		//	draw objects
		
		this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.canvas.width, this.canvas.height);
	}
}


var controller = new Controller(new Model(), new View());