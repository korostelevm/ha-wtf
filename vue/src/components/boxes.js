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
    let boxes = new Boxes(21);
    let grid = new Grid(64)
    let s;
	p.setup = () => {
        s = new Spring2D(0.0, 100, 2, 0);
        if (typeof DeviceMotionEvent.requestPermission === 'function' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
        ) {
            DeviceMotionEvent.requestPermission()
            .then(response => {
            if (response === 'granted') {
                window.addEventListener('devicemotion', deviceMotionHandler, true);
            }
            });

            DeviceOrientationEvent.requestPermission()
            .then(response => {
            if (response === 'granted') {
            window.addEventListener('deviceorientation', deviceTurnedHandler, true)
            }
        })
        .catch(console.error)
        }

	    p.createCanvas(p.windowHeight, p.windowHeight);
        p.noStroke();

        var pos_hash = window.location.hash.slice(1)
        if(pos_hash.length%2){
            pos_hash+='0'
        }
        // pos_hash = decodeURIComponent(pos_hash)
        // pos_hash = atob(pos_hash)
        pos_hash = _.chunk(pos_hash,2)
        pos_hash = pos_hash.map(p=>{
            return {
                x: utils.convertBase(p[0],grid.size,10),
                y: utils.convertBase(p[1],grid.size,10),
            }
        })
        pos_hash.forEach(b=>{
            boxes.add(b)
        })
        console.log(pos_hash)


	};

	p.draw = () => {
        p.background(0)
        boxes.draw()
	};

	p.windowResized = () => {
		p.resizeCanvas(p.windowHeight, p.windowHeight);
	}
    p.mouseMoved=()=> {
        boxes.add(grid.cell({
            x:p.mouseX,
            y:p.mouseY
        }))
      }
    
    p.mouseClicked=()=> {
        var base = grid.size
        var pos = grid.cell({
            x:p.mouseX,
            y:p.mouseY
        })
        boxes.add(pos)
        var state = boxes.boxes.map(b=>{
            var x =  utils.convertBase(b.x.toString(),10,base)
            var y =  utils.convertBase(b.y.toString(),10,base)
            return `${x}${y}`
        }).join('')
        parent.location.hash = state
      }

    function Boxes(limit){
        this.limit = limit
        this.boxes = []
        this.add = function(props){
            if(props.x <0 || props.y<0 || props.x >=grid.size || props.y>=grid.size){
                return false
            }
            var new_box = new Box(props)
            if(this.boxes.filter(b=>{
                return _.isEqual(b.obj(), new_box.obj())
            }).length){
                return false
            }

            if(this.boxes.length > limit){
                this.boxes.shift()
            }
            
            this.boxes.push(new_box)
            // p.background(0)
            // p.beginShape();
            // p.endShape(p.CLOSE)
            ;
        }
        this.draw = function(){
            p.stroke(255);
            this.boxes.forEach(b=>{
                var b = grid.px(b)
                p.strokeWeight(5);
                p.point(b.x, b.y);
            })

            p.noFill();
            p.beginShape();
            p.strokeWeight(1);
            var b = grid.px(this.boxes[0])
            p.curveVertex(b.x, b.y);
            this.boxes.forEach(b=>{
                var b = grid.px(b)
                p.curveVertex(b.x, b.y);
                // p.fill(255)
                // p.rect(b.x,b.y, grid.cell_size)
                // p.line(s.update(b.x,b.y).x,b.y, 400,400);
                // p.vertex(pos.x,pos.y)
            })
            var b = grid.px(this.boxes.slice(-1)[0])
            p.curveVertex(b.x, b.y);
            p.endShape();
        }


    }
    class Box {
        x;
        y;
        constructor(pos){
            this.x = pos.x
            this.y = pos.y
        }
        obj = function(){
            return {x:this.x,y:this.y}
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

    function Grid(height){
        this.cell_size = Math.floor(p.windowHeight/height)
        this.size = height

        this.px = function(props){
            return {
                x : Math.floor(props.x*this.cell_size),
                y : Math.floor(props.y*this.cell_size),
            }
        }
        this.cell = function(props){
            return {
                x : Math.floor(props.x/this.cell_size),
                y : Math.floor(props.y/this.cell_size),
            }
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