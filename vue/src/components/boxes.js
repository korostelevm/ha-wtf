import { stat } from 'fs';

var p5 = require('p5');

var utils = require('./utils')
p5.disableFriendlyErrors = true;

var _ =require('lodash')
var zlib = require('zlib')
const run = async function(){
    var app = new p5(sketch);
}



const sketch = (p) => {
    let dd = []
	p.setup = () => {
	    p.createCanvas(p.windowHeight, p.windowHeight);
        p.noStroke();

	};
    var t = 0
    function Box(ox, oy, x,y){
        
        this.tx = Math.ceil((x-50)/100)*100
        this.ty = Math.ceil((y-50)/100)*100
        this.ts = 100
        this.s = new Spring2D(ox, oy, 2, 0);
        this.ss = new Spring2D(0, 0, 2, 0);
        this.update=(ts)=>{
            this.ts = ts
        }
        this.draw = function(){
            t+=0.1
            // p.fill(255)
            p.noFill()
            p.stroke(255, 204, 0);
            p.strokeWeight(4);
            this.s.update(this.tx,this.ty)
            this.ss.update(this.ts,100)
            // p.rect(this.tx-this.ss.x/2, this.ty-this.ss.x/2, this.ss.x)
            p.ellipse(this.tx, this.ty, this.ss.x)
            // p.ellipse(this.tx-this.ss.x-50, this.ty-this.ss.x-50, this.ss.x)
            // p.rect(this.s.x - 50,this.s.y-50, 100)
            // p.rect(x,y,10)
            // p.line(ox,oy,this.s.x,0)
        }
    }
	p.draw = () => {
        p.background(0)
        _.range(0,1).forEach(n=>{
            // p.beginShape();
            var ddd = _.clone(dd)
            ddd.forEach(d=>{
                // d.update(p.noise(d.tx+t+n*2)*100 + 100)
                d.draw()
                // p.curveVertex(d.s.x-100+d.ss.x,
                    // d.s.y);
                // p.curveVertex(d.s.x+d.ss.x,d.s.y);
            })
            // p.endShape(p.CLOSE);
        })
	};

	p.windowResized = () => {
		p.resizeCanvas(p.windowHeight, p.windowHeight);
	}
    p.mouseClicked=()=> {
        console.log(p.noise(p.mouseX))
        var ox = 0, oy = 0
        if(dd.length){
            var prev_box = _.last(dd)
            ox = prev_box.tx
            oy = prev_box.ty
        }
        if(dd.length>10){
            dd.shift()            
        }
        dd.push(new Box(ox,oy,p.mouseX, p.mouseY))
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
      }

    function debug(o,y){
        p.fill(0)
        p.rect(10,y, 200,200);
        p.fill('white')
        p.text(JSON.stringify(o,null,2),20,y+10,190,190)
    }
}

export {run}