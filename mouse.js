window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame   ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

const
{ random, atan2, cos, sin, hypot } = Math
,max = 100
,canvas = document.createElement("canvas")
,$ = canvas.getContext('2d')
,body = document.body
,stars = [];

body.style.backgroundColor = "#f2f2f2";
body.style.overflow = "hidden";
body.appendChild(canvas);
// Disable normal cursor, we just want to show the blackhole.
canvas.style.cursor = 'none';

let
width = canvas.width = window.innerWidth
,height = canvas.height = window.innerHeight
,halfScreenX = width/2
,halfScreenY = height/2
,point = { x: halfScreenX, y: halfScreenY }
,cursor = { x: halfScreenX, y: halfScreenY }
,blackHolesize = 40
,hue = 0;

// Create our star object
function Star(){};

Star.prototype = {
  init(){
    this.hue = hue;
    this.alpha = 0;
    this.size = this.random(0, 4);
    this.x = this.random(0, width);
    this.y = this.random(0, height);
    this.speed = this.size * 0.05;
    this.updated = null;
    this.frame = 0;
    this.maxFrames = 50;
    return this;
  },
  draw(){
    // The Starfield
    $.strokeStyle = `hsla(${this.hue}, 50%, 85%, ${this.alpha})`;
    $.beginPath();
    $.lineWidth = 0.5;
    $.arc(this.x, this.y, this.size, 0, 2 * 3.142);
    $.stroke();
    $.closePath();

    // Our Cursor Circle
    $.beginPath();
    $.strokeStyle = `rgb(255,255,255,1)`;
    $.lineWidth = 1;
    var gradient = $.createRadialGradient(cursor.x, cursor.y, blackHolesize/5, cursor.x, cursor.y, 1);
    gradient.addColorStop(0, '#342F2F');
    gradient.addColorStop(0.5, '#342F2F');
    gradient.addColorStop(0.75, '#E6534C');
    $.fillStyle = gradient
    $.arc(cursor.x, cursor.y, blackHolesize/1, 0, Math.PI*2, false);
    $.stroke();
    $.fill();
    $.closePath();
    // Update the scene
    this.update();
  },
  update(){
    if(this.updated){
      this.alpha *= 0.12;
      this.size += 1;
      this.frame++;
      if(this.frame > this.maxFrames){
        this.reset();
      }
    } else if(this.distance(point.x, point.y) < (blackHolesize-1)){
      this.updated = true;
    } else {
      let dx = point.x - this.x;
      let dy = point.y - this.y;
      let angle = atan2(dy, dx);

      this.alpha += .01;
      this.x += this.speed * cos(angle);
      this.y += this.speed * sin(angle);
      this.speed += .5;
    }
  },
  reset(){
    this.init();
  },
  distance(x, y){
    return hypot(x - this.x, y - this.y);
  },
  random(min, max) {
    return random() * (max - min) + min;
  }
}

var grd = $.createLinearGradient(0, height, 0, 0);
grd.addColorStop(0, "black");
grd.addColorStop(1, "#342F2F");

function animate(){
  $.fillStyle = grd;
  $.fillRect(0, 0, width, height);
  stars.forEach((p) => {
    p.draw();
  });
  hue += 0;

  window.requestAnimationFrame(animate);
}

function collision(e){
  point.x = e.collision ? e.collision[0].clientX : e.clientX;
  point.y = e.collision ? e.collision[0].clientY : e.clientY;
  cursor.x = e.clientX;
  cursor.y = e.clientY;
}

function setup(){
  for(let i=0; i<max; i++){
    setTimeout(() => {
      let p = new Star().init();
      stars.push(p);
    }, i * 80);
  }

  canvas.addEventListener("mousemove", collision);

  canvas.addEventListener("touchmove", collision);

  canvas.addEventListener("mouseleave", () => {
    point = cursor = { x: halfScreenX, y: halfScreenY };
  });

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    point = { x: halfScreenX, y: halfScreenY };
  });

  animate();

}
// Fire it up.
setup();
