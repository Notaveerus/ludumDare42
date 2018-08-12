var CANVAS_WIDTH = window.innerWidth;
var CANVAS_HEIGHT = window.innerHeight;
var V = SAT.Vector;
var P = SAT.Polygon;
var B = SAT.Box;
var response = new SAT.Response();

var inputData = {
  mouse: {x:0,y:0},
  lmb: false,
  rmb: false,
  selected: null,
  up: false,
  down: false,
  left: false,
  right: false
}

var invHeight = CANVAS_HEIGHT*0.4;
var gameHeight = CANVAS_HEIGHT*0.6;


var gameCanvas = document.getElementById('game');
gameCanvas.width = CANVAS_WIDTH;
gameCanvas.height = CANVAS_HEIGHT;

var ctx = gameCanvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

var active = true;
var gameOver = function(value){
  active = false;
  alert("Inventory Full! \nScore: "+value);
  document.location.reload();
}
var inventory = {
  gridNum: 40,
  origin: {x:35,y:25},
  grid: {},
  padding: 2,
  objects: [],
  boxWidth: 0,
  value: 0,
  generateGrid: function(){
    var height = invHeight - (2*this.origin.y);
    this.boxWidth = Math.round(height/4);
    this.rows = Math.round((height/this.boxWidth));
    this.columns = this.gridNum/this.rows;
    var pos = {};
    pos.x = CANVAS_WIDTH/2-(this.columns*(this.boxWidth+this.padding))/2;
    pos.y = this.origin.y+gameHeight;
    for(var i=0;i<this.rows;i++){
      for(var j=0;j<this.columns;j++){
        this.grid[i+','+j] = {
          x:pos.x,
          y:pos.y,
          id: [i,j],
          isEmpty: true,
          hitBox: new B(new V(pos.x,pos.y),this.boxWidth,this.boxWidth)
        }

        pos.x+=this.boxWidth+this.padding;
      }
      pos.y+=this.boxWidth+this.padding;
      pos.x = CANVAS_WIDTH/2-(this.columns*(this.boxWidth+this.padding))/2;
    }
    this.origin.x +=CANVAS_WIDTH-250;
  },
  drawGrid: function(){
    for(var id in this.grid){
      var box = this.grid[id];
      if(box.isEmpty)
        ctx.fillStyle = 'grey'
      else{ctx.fillStyle = 'red'}
      ctx.fillRect(box.x,box.y,box.hitBox.w,box.hitBox.w)
    }
    ctx.font = "30px Monaco";
    ctx.fillStyle = 'white'
    ctx.fillText('Value: '+this.value,CANVAS_WIDTH-this.boxWidth*2-250,gameHeight+this.boxWidth)


  },
  update: function(){
    this.moveItem();
    for(var i=0;i<this.objects.length;i++){
      this.objects[i].update();
    }
  },
  getEmptySpace: function(width,height){
    for(var id in this.grid){
      var box = this.grid[id];
      if(box.isEmpty){
        var row = parseInt(id.split(',')[0]);
        var column = parseInt(id.split(',')[1]);
        var allEmpty = true;
        var boxList = [];
        for(var i=0;i<width;i++){
          for(var j=0;j<height;j++){
            var testBox = this.grid[(row+j)+','+(column+i)];
            if(!testBox || !testBox.isEmpty )
              allEmpty = false;
            else{
              boxList.push((row+j)+','+(column+i))
            }
          }
        }
        if(allEmpty)
          return boxList;



      }
    }
  },
  addItem: function(item){
    var id = this.getEmptySpace(item.invWidth,item.invHeight);
    if(id){
      var box = this.grid[id[0]];
      item.x = box.x;
      item.y = box.y;
      item.width = (this.boxWidth+this.padding) * item.invWidth;
      item.height = (this.boxWidth+this.padding) * item.invHeight;
      item.bounds = new B(new V(item.x,item.y),item.width,item.height);
      item.defaultPos = {x:box.x,y:box.y};
      item.usedGrid = id;
      this.objects.push(item);
      this.value += item.value;
      for(var i=0;i<id.length;i++){
        var box = this.grid[id[i]];
        box.isEmpty = false;
      }
    }
    else{
      gameOver(this.value)
    }
  },
  moveItem: function(){
    if(inputData.selected!==null){
      var obj = this.objects[inputData.selected];
      if(!inputData.lmb){
        var clickedBox = false;
        for(var id in this.grid){
          var box = this.grid[id];
          clickedBox = SAT.pointInPolygon(inputData.mouse,box.hitBox.toPolygon());
          if(clickedBox){
            if(box.isEmpty){
              var row = parseInt(id.split(',')[0]);
              var column = parseInt(id.split(',')[1]);
              var allEmpty = true;
              var boxList = [];
              for(var i=0;i<obj.invWidth;i++){
                for(var j=0;j<obj.invHeight;j++){
                  var testBox = this.grid[(row+j)+','+(column+i)];
                  if(!testBox || !testBox.isEmpty )
                    allEmpty = false;
                  else{
                    boxList.push((row+j)+','+(column+i))
                  }
                }
              }
              console.log(boxList)              
              if(allEmpty){
                obj.x = box.x;
                obj.y = box.y;
                obj.bounds = new B(new V(obj.x,obj.y),obj.width,obj.height);
                obj.defaultPos = {x:box.x,y:box.y};
                for(var j=0;j<obj.usedGrid.length;j++){
                  this.grid[obj.usedGrid[j]].isEmpty = true;
                }
                obj.usedGrid = boxList;
                for(var j=0;j<obj.usedGrid.length;j++){
                  this.grid[obj.usedGrid[j]].isEmpty = false;
                }
                obj.selected = false;
                inputData.selected = null;
                console.log('drop')
                return;
              }
              else{
                obj.x = obj.defaultPos.x;
                obj.y = obj.defaultPos.y;
                obj.selected = false;
                inputData.selected = null;
                return;
              }
            }
            else{
              obj.x = obj.defaultPos.x;
              obj.y = obj.defaultPos.y;
              obj.selected = false;
              inputData.selected = null;
              return;
          }
        }
        }
        if(!clickedBox){
          this.removeObj(obj,inputData.selected);
          inputData.selected = null;
        }
      }
    }
    else if(inputData.lmb){
      for(var i=0;i<this.objects.length;i++){
        var obj = this.objects[i];
        response.clear();
        var clickedObj = SAT.pointInPolygon(inputData.mouse,obj.bounds.toPolygon());
        if(clickedObj){
          obj.selected = true;
          inputData.selected = i;
          break;
        }
      }
    }
  },
  removeObj: function(obj){
    var index = this.objects.indexOf(obj);
    if(this.objects[index]==obj){
      this.value -= obj.value;
      console.log(this.value)
      for(var j=0;j<obj.usedGrid.length;j++){
        this.grid[obj.usedGrid[j]].isEmpty = true;
      }
      this.objects.splice(index,1);
    }

  },
  draw: function(){
    this.drawGrid();
    for(var i=0;i<this.objects.length;i++){
      var object = this.objects[i];
      object.draw(ctx);
    }
  }
};
var npcGen = {
  count: 15,
  dist: 300,
  npcList: [],
  huntCount: 0,
  huntMax: 3,
  huntTimer: 2000,
  getSpawn: function(){
    var angle = Math.random()*Math.PI*2;
    var dist = (this.dist*Math.random()*2)+this.dist
    var x = ((CANVAS_WIDTH/2)+Math.cos(angle)*dist).clamp(0,CANVAS_WIDTH);
    var y = ((gameHeight/2)+Math.sin(angle)*dist).clamp(0,gameHeight);
    return {
      x:x,
      y:y
    }
  },
  generateNPC: function(){
    for(var i=0;i<this.count-1;i++){
      var spawn = this.getSpawn();
      var npcTypes = Object.keys(npcType);
      var npcName = npcTypes[Math.floor(Math.random()*(npcTypes.length-1))];
      npcName = new npcType[npcName];
      npcName.x = spawn.x
      npcName.y = spawn.y
      var newNPC = new npc(npcName);
      this.npcList.push(newNPC);
    }
    var thief = new npcType['thief'];
    var spawn =this.getSpawn();
    thief.x = spawn.x;
    thief.y = spawn.y;
    var newThief = new npc(thief);
    this.npcList.push(thief)
    this.thiefIndex = this.npcList.length-1;

  },
  update: function(td){
    var huntCount = 0;
    for(var i=0;i<this.npcList.length;i++){
      if(this.npcList[i].hunt) huntCount++;
      this.npcList[i].update(td,player,this);
    }
    this.huntCount = huntCount;
    if(this.huntTimer <=0 && this.huntCount == 0){
      this.startHunt();
      this.huntTimer = Math.random()*2000+1000;
    }
    this.huntTimer-=td;


  },
  startHunt: function(){
    for(var i=0;i<this.huntMax;i++){
      var checkThief = Math.random()*100
      if(checkThief>90){
        this.npcList[this.thiefIndex].hunt = true;
        this.huntCount++;
        continue;
      }
      var rand = Math.floor(Math.random()*(this.npcList.length-1))
      this.npcList[rand].hunt = true;
      this.huntCount++;
    }
  }

}
var player;
var init= function(){
  inventory.generateGrid();
  npcGen.generateNPC();
  player = new Player({x:CANVAS_WIDTH/2,y:gameHeight/2});
  active = true;
}
init();

var lastUpdateTime = (new Date()).getTime();
setInterval(function(){
  if(active){
    var td = new Date().getTime()-lastUpdateTime;
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
    npcGen.update(td);
    player.update(td);
    player.draw(ctx);

    lastUpdateTime = (new Date()).getTime();
  }
  inventory.update();
  inventory.draw();
}, 1000/60);
