

var item = function(I){
  I.selected = false;
  I.img = new Image();
  I.img.src = I.imgSrc;
  I.update = function(){
    if(I.selected){
      I.x = inputData.mouse.x-I.width/2;
      I.y = inputData.mouse.y-I.height/4;
    }
  }
  I.draw = function(ctx){
    ctx.fillStyle = 'green'
    if(I.selected){
      ctx.globalAlpha = 0.7
    }
    ctx.drawImage(I.img,I.x,I.y,I.width,I.height);
    ctx.globalAlpha = 1;
  }

  return I;
}

var itemTypes = {
  'bottleL': function(){
    this.invWidth = 1;
    this.invHeight = 2;
    this.imgSrc = 'bottleL.png';
    this.value = 10;
  },
  'bottleH': function(){
    this.invWidth = 1;
    this.invHeight = 2;
    this.imgSrc = 'bottleH.png';
    this.value = 50;
  },
  'ringH': function(){
    this.invWidth = 1;
    this.invHeight = 1;
    this.imgSrc = 'ringH.png';
    this.value = 50;
  },
  'ringL': function(){
    this.invWidth = 1;
    this.invHeight = 1;
    this.imgSrc = 'ringL.png';
    this.value = 5;
  },
  'swordH': function(){
    this.invWidth = 2;
    this.invHeight = 2;
    this.imgSrc = 'swordH.png';
    this.value = 100;
  },
  'swordL': function(){
    this.invWidth = 2;
    this.invHeight = 2;
    this.imgSrc = 'swordL.png';
    this.value = 15;
  },
  'trash': function(){
    this.invWidth = 1;
    this.invHeight = 1;
    this.imgSrc = 'trash.png';
    this.value = 1;
  }

}
