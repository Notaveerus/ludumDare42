var npc = function(I){
  I.timer = (Math.random()*2000)+1000;
  I.angle = Math.random()*2*Math.PI;
  I.hunt = false;
  I.defHunt = I.huntTimer;
  I.baseSpeed = I.speed;
  I.img = new Image();
  I.img.src = I.imgSrc;
  I.update = function(td,player,parent){
    I.collide();
    if(!I.hunt){
      if(I.timer <= 0){
        I.angle = Math.random()*2*Math.PI;
        I.timer = (Math.random()*1000)+500;
      }

      var dist = Math.sqrt((I.x-player.x)+(I.y-player.y));
      if(dist > gameHeight/1.5){
        I.angle = Math.atan2(I.x-player.x,I.y-player.y);
      }
      I.timer-= td;
    }
    else{

      if(I.huntTimer >0){
        I.angle = Math.atan2((player.y-I.y),(player.x-I.x));
        I.speed = I.baseSpeed;
        I.huntTimer-=td;
      }
      else{
        I.hunt = false;
        I.huntTimer = I.defHunt;
        I.speed = I.baseSpeed;
        I.angle = Math.random()*2*Math.PI;
        parent.huntCount--;
      }
    }
    I.x += I.speed * Math.cos(I.angle)*td;
    I.y += I.speed * Math.sin(I.angle)*td;
    if(I.x>CANVAS_WIDTH+50 ||I.x<-50 || I.y>CANVAS_HEIGHT+50 || I.y<-50){
      I.angle = I.angle-Math.PI
    }

    I.draw();
  },

  I.draw = function(){
    ctx.fillStyle = I.colour;
    ctx.save();
    ctx.translate(I.x,I.y);
    ctx.rotate(-I.angle);
    ctx.drawImage(I.img,-I.width/2,-I.height/2,I.width,I.height);
    ctx.restore();
  }
  I.collide = function(){
    if(I.hunt){
      var hitBox = new B(new V(I.x,I.y),I.width,I.height).toPolygon();
      response.clear();
      var collision = SAT.testPolygonPolygon(hitBox,player.hitBox);
      if(!I.steal){
        if(collision){
          I.angle = Math.random()*2*Math.PI;
          I.hunt = false;
          I.speed == I.baseSpeed;
          var itemIndex = Math.floor(Math.random()*(I.itemArray.length-1));
          var newItem = new item(new itemTypes[I.itemArray[itemIndex]]);
          inventory.addItem(newItem)
        }
      }
      else{
        if(collision){
          I.angle = Math.random()*2*Math.PI;
          I.hunt = false;
          I.speed == I.baseSpeed;
          if(inventory.objects.length>0){
            var max = inventory.objects.reduce(function(prev,current){
              return (prev.value>current.value) ? prev:current
            })
            inventory.removeObj(max);
          }
          inventory.addItem(new item(new itemTypes[I.itemArray[0]]))
          console.log(inventory.objects.indexOf(max))
        }
      }
    }

  }
  return I;
}
var npcType = {
  'commoner': function(){
    this.width=32
    this.height=32
    this.speed=0.2
    this.colour='blue'
    this.huntTimer = 4000;
    this.itemArray = Object.keys(itemTypes);
    this.imgSrc = 'thief.png';
  },
  'noble': function(){
    this.width=32
    this.height=32
    this.speed= 0.2
    this.colour= 'green'
    this.huntTimer = 4000;
    this.itemArray = Object.keys(itemTypes);
    this.imgSrc = 'noble.png';
  },
  'thief': function(){
    this.width=32;
    this.height=32;
    this.speed=0.25;
    this.imgSrc = 'thief.png';
    this.huntTimer = 4000;
    this.steal = true;
    this.itemArray = ['trash'];
  }
}
