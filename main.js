class Rect {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
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
		this.view.resizeGameCanvas(this.model.getGameCanvasDimensions());
		this.view.buffer.canvas.height = this.model.bufferHeight;
		this.view.buffer.canvas.width = this.model.bufferWidth;
	}
	
	start(){
		this.view.renderGame(this.model);
	}
}

class Model {
	constructor(){
		const self = this;
		self.numColumns = 16;
		self.numRows = 9;
		self.bufferWidth = self.numColumns * 20;
		self.bufferHeight = self.numRows * 20;
		self.bufferCellWidth = self.bufferWidth / self.numColumns;
		self.bufferCellHeight = self.bufferHeight / self.numRows;
		
		self.cellSize = self.getGameCanvasDimensions().width / self.numColumns;
		self.sprite = new Image();
		
		//	game config data - this should be preferences that the user is able to save locally.
		//	customize the game based off this config data.
		const config = {
			
		};
		
		self.gameScreenMap = [
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
		
		self.spriteRects = {
			"d": new Rect(87, 376, 50, 70),	// dirt,
			"s1": new Rect(87, 450, 40, 40), // sky 1
			"s2": new Rect(161, 450, 40, 40) // sky 2
		}
	}
	
	getGameCanvasDimensions(){
		const ratio = this.numRows / this.numColumns; // height / width
		return { width: window.innerWidth, height: window.innerWidth * ratio };
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
		for (var i=0;i<model.gameScreenMap.length;i++) {
			const rect = model.spriteRects[model.gameScreenMap[i]];
			this.buffer.drawImage(model.sprite, rect.x, rect.y, rect.width, rect.height, i * model.bufferCellWidth, (i % model.numColumns) * model.bufferCellHeight, model.bufferCellWidth, model.bufferCellHeight);			
		}

		this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.canvas.width, this.canvas.height);
	}
}


const controller = new Controller(new Model(), new View());