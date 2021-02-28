
var p5 = require('p5');
var _ =require('lodash')

const run = async function(){
    console.log('lol')
    var app = new p5(sketch);
    console.log(app)
}



const sketch = (p) => {
    var trail = []
    let s;
    let t;
    let pulser;
	p.setup = () => {
		// Create the canvas
	    p.createCanvas(p.windowWidth, p.windowHeight);
        p.noStroke();
        pulser = new Pulser()
        s = new Spring2D(0.0, 100, 2, 0);
        // p.frameRate(3)
        // p.noLoop()

	};

	p.draw = () => {
        t = p.frameCount ; // update time
        p.background(0);
        pulser.update(p.mouseX, p.mouseY)
        pulser.display()
        // s.update(p.mouseX, p.mouseY);
        // s.display(p.mouseX, p.mouseY);
        // trail.forEach(t=>{
        //     // p.fill(255);
        //     t.s.update(p.mouseX, p.mouseY);
        //     t.s.display(t.x,t.y);
        //     // var r = _.random(100)
        //     // p.ellipse(t.x+_.random(-100,100), t.y+_.random(-100,100), r,r);
        // })
        // if(trail.length>100){
        //     trail.shift()
        // }
        // trail.push({
        //     s: new Spring2D(p.mouseX, p.mouseY, 2, 0),
        //     x: p.mouseX,
        //     y: p.mouseY,
        //     h:10,
        //     w:10,
        // })
	};

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	}

    function Pulser(){
        this.r = 10
        this.nodes = 1000;
        this.ns = []
        this.update = function(x,y) {
            var targetX = s.update(x,y).x
            var targetY = s.update(x,y).y
            // let forceX = (targetX - this.x) * this.stiffness;
 
            var center = {x:p.windowWidth/2,y:p.windowHeight/2}
            let a = p.atan2(targetY - center.y, targetX - center.x);
            var rotAngle = 0
            var radius =200
            for (let i = 0; i < this.nodes; i++){
                var circle = {
                    x: center.x + p.cos(p.radians(rotAngle)) * radius ,
                    y: center.y + p.sin(p.radians(rotAngle)) * radius 
                }
                this.ns[i] = circle
                rotAngle += 360.0 / this.nodes;
              }
            
            
            var dists =  this.ns.map(circle=>{
                return p.dist(targetX,targetY,circle.x,circle.y)
              })
            var dists = p.max(dists)
            
              
            this.ns =  this.ns.map(circle=>{
                var f = 0.75- p.dist(targetX,targetY,circle.x,circle.y)/(dists*2)
                var cx = circle.x +p.cos(a) * 100 * f*f*f*f 
                var cy = circle.y +p.sin(a) * 100 * f*f*f*f 
                // var sign = 3
                var sign = p.dist(targetX,targetY,circle.x,circle.y)/p.dist(targetX,targetY,cx,cy)
                // if(p.dist(targetX,targetY,cx,cy)<=p.dist(targetX,targetY,circle.x,circle.y)){
                //     sign = -3
                // }
                if(sign>2){
                    sign=2
                }
                if(sign<-2){
                    sign=-2
                }
                circle.x =circle.x +p.cos(a) * 100 * f*f*f*f * sign
                circle.y =circle.y +p.sin(a) * 100 * f*f*f*f * sign
                return circle
              })
        }
        this.display = function(){
            p.fill(255);
            p.curveTightness(1);
            p.beginShape();
            for (let i = 0; i < this.nodes; i++){
                p.curveVertex(this.ns[i].x, this.ns[i].y);
            }
            for (let i = 0; i < this.nodes-1; i++){
                p.curveVertex(this.ns[i].x, this.ns[i].y);
            }
            p.endShape(p.CLOSE);

        }
    }

    function Spring2D(xpos, ypos, m, g) {
        this.x = xpos;// The x- and y-coordinates
        this.y = ypos;
        this.vx = .001; // The x- and y-axis velocities
        this.vy = 0;
        this.mass = m;
        this.gravity = g;
        this.stiffness = .1;
        this.damping = .83;
      
        this.update = function(targetX, targetY) {
          let forceX = (targetX - this.x) * this.stiffness;
          let ax = forceX / this.mass;
          this.vx = this.damping * (this.vx + ax);
          this.x += this.vx;
          let forceY = (targetY - this.y) * this.stiffness;
          forceY += this.gravity;
          let ay = forceY / this.mass;
          this.vy = this.damping * (this.vy + ay);
          this.y += this.vy;
          return {x:this.x,y:this.y}
        }
      
        // this.display = function(nx, ny) {
        //   p.noStroke();
        //   p.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
        //   p.stroke(255);
        //   p.line(this.x, this.y, nx, ny);
        // }
      }
}

export {run}