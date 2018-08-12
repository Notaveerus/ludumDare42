Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
var Player = function(sPoint){
  this.x = sPoint.x;
  this.y = sPoint.y;
  this.width = 32;
  this.height = 32;
  this.rotation = 0;
  this.speed = 0.5;
  this.corners = [new V(this.x,this.y),new V(this.width+this.x,this.y),new V(this.width+this.x,this.height+this.y),new V(this.x,this.height+this.y)];
  this.hitBox = new P(new V(0,0),this.corners);

  this.midpoint = function(){
    return {
      x:this.x+(this.width/2),
      y:this.y+(this.height/2)
    }
  };
  this.update = function(td){
    this.handleKeys(td);
    this.corners = [new V(this.x,this.y),new V(this.width+this.x,this.y),new V(this.width+this.x,this.height+this.y),new V(this.x,this.height+this.y)];
    this.hitBox = new P(new V(0,0),this.corners);
    this.lookAtMouse();
    this.x = this.x.clamp(0,CANVAS_WIDTH-this.width);
    this.y = this.y.clamp(0,gameHeight-this.height);
  }
  this.lookAtMouse = function(){
    this.rotation = Math.atan2(inputData.mouse.x-this.midpoint().x,inputData.mouse.y-this.midpoint().y);
  }
  this.handleKeys = function(td){
    var direction = new V(0,0);
    if(inputData.left){
      direction.x -=1;
    }
    if(inputData.right){
      direction.x +=1;
    }
    if(inputData.up){
      direction.y -=1;
    }
    if(inputData.down){
      direction.y +=1;
    }
    direction.normalize();
    this.x += direction.x * this.speed*td;
    this.y += direction.y * this.speed*td;

  }
  this.draw = function(ctx){
    ctx.fillStyle = 'red'
    var img =new Image();
    img.src = 'player.png';
    ctx.save()
    ctx.translate(this.x,this.y);
    ctx.rotate(-this.rotation);
    ctx.drawImage(img,-this.width/2,-this.height/2,this.width,this.height);
    ctx.restore();
  }
}
