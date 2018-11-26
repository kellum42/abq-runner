'use strict';

class Player {
	constructor(screen){ 
		this.frames = [new Rect(190, 165, 50, 60), new Rect(315, 165, 50, 60), new Rect(440, 165, 50, 60), new Rect(440, 165, 50, 60), new Rect(440, 165, 50, 60), new Rect(315, 165, 50, 60)];
		this.frameIndex = 0;
		this.isJumping = false;
		
		this.width = this.x = screen.cell.width * 2;
		
		const frame = this.frames[0];
		const height = this.width * (frame.height/frame.width);
		
		this.y = this.defaultY = screen.cell.height * (screen.rows - 1) - height;
		this.y_velocity = 0;
		
		
	}	
	
	frame(){
		return this.frames[this.frameIndex];
	}
	
	height(){
		const f = this.frame();
		return this.width * (f.height/f.width);
	}
	
	moveToNextFrame(){
		this.frameIndex = this.frameIndex === this.frames.length - 1 ? 0 : this.frameIndex + 1;
	}
}

class Rect {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}

class GameLogic {
	constructor(player){
		// store max score in local storage
		this.frameRate = 50; // in milliseconds
		this.score = 0;
		this.speed = 3;
		this.gameTime = window.performance.now();
		this.player = player;
		this.newJump = false;
	}
	
	getMaxScore(){
		
	}
	
	update(){
		//	don't quite understand offset yet?
		
		this.speed += 0.001
		this.score = this.speed;
		
		if (this.newJump && !this.player.isJumping) {
			this.newJump = false;
			this.player.isJumping = true;
			this.player.y_velocity = -15;
		} 
		
		if (this.player.isJumping) {
			this.player.y_velocity += 2;
			this.player.y += this.player.y_velocity;
			
			if (this.player.y >= this.player.defaultY) {
				this.player.y = this.player.defaultY;
				this.player.isJumping = false;
			}
			
		} else {
			
			this.player.moveToNextFrame();	
		}
		
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
		
		self.frames = {
			"d": new Rect(87, 376, 50, 70),	// dirt,50-70
			"s1": new Rect(87, 450, 40, 40), // sky 1
			"s2": new Rect(161, 450, 40, 40), // sky 2
		}
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
		
		this.init(model);
		
		model.sprite.addEventListener("load", function(){
			model.spriteReady = true;
			if (model.spriteReady && model.playerSpriteReady) {
				self.start();	
			}
		});
		
		model.playerSprite.addEventListener("load", function(){
			model.playerSpriteReady = true;
			if (model.spriteReady && model.playerSpriteReady) {
				self.start();	
			}
		});
	}
	
	init(model){
		const self = this;
		
		model.sprite.src = "imgs/sprite-v2.png";
		model.playerSprite.src = "imgs/ninja-sprite-v2.png";
		
		const dimensions = self.model.screen.getActualDimensions();
		self.view.resizeGameCanvas(dimensions);
		self.view.buffer.canvas.height = self.model.screen.height;
		self.view.buffer.canvas.width = self.model.screen.width;
		
		//	add user interaction callbacks
		window.document.addEventListener("touchstart", self.handleUserAcitivty);
		window.document.addEventListener("touchend", self.handleUserAcitivty);
		window.document.addEventListener("mousedown", self.handleUserAcitivty);
		window.document.addEventListener("mouseup", self.handleUserAcitivty);
	}
	
	start(){
		window.requestAnimationFrame(this.loop);
	}
	
	loop(timeStamp) {
		//	window.performance.now() is always just a little greater than timestamp
		const self = window.controller;
		const frameRate = self.model.logic.frameRate;
		
		if (timeStamp >= self.model.logic.gameTime + frameRate) {
			if (timeStamp - self.model.logic.gameTime >= frameRate * 4) {
				self.model.logic.gameTime = timeStamp;
			}
		
			while (self.model.logic.gameTime < timeStamp) {
				self.model.logic.gameTime += frameRate;
 				self.model.logic.update(); // updates game score
				self.model.screen.scroll();
			}
			self.view.drawGame(self.model);
		}
		window.requestAnimationFrame(self.loop);
	}
	
	handleUserAcitivty(e){
		controller.model.logic.newJump = e.type === "mousedown" || e.type === "touchstart";
	}
}

class Model {
	constructor(){
		const self = this;
		
		self.sprite = new Image();
		self.playerSprite = new Image();
		
		var spriteReady = false;
		var playerSpriteReady = false;
		
		//	game config data - this should be preferences that the user is able to save locally.
		//	customize the game based off this config data.
		const config = {
			
		};
		
		self.screen = new Screen(); // drawing screen - smaller version of view
		self.player = new Player(self.screen);
		self.logic = new GameLogic(self.player);	
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
	
	drawGame(model){
		
		//	draw background (sky & dirt)
		for (var i=0;i<model.screen.map.length;i++) {
			const rect = model.screen.frames[model.screen.map[i]];
			this.buffer.drawImage(model.sprite, rect.x, rect.y, rect.width, rect.height, (i % model.screen.columns) * model.screen.cell.width, Math.floor(i / model.screen.columns) * model.screen.cell.height, model.screen.cell.width, model.screen.cell.height);
		}
		
		// draw score
	    this.buffer.font = "20px Arial";
	    this.buffer.fillStyle = "#000000";
	    this.buffer.fillText("0/1350", 5, 20);

		//	draw player
		const player = model.player;
		const pf = player.frame();
		
		const playerWidth = model.screen.cell.width * 2;
		const playerHeight = playerWidth * (pf.height/pf.width);
		//this.buffer.drawImage(model.playerSprite, pf.x, pf.y, pf.width, pf.height, playerWidth, model.screen.cell.height * (model.screen.rows - 1) - playerHeight, playerWidth, playerHeight);
		
		this.buffer.drawImage(model.playerSprite, pf.x, pf.y, pf.width, pf.height, player.x, player.y, player.width, player.height());
		
		//	draw objects
		
		this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.canvas.width, this.canvas.height);
	}
}


var controller = new Controller(new Model(), new View());