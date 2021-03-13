
var p5 = require('p5');
p5.disableFriendlyErrors = true;

var _ =require('lodash')

const run = async function(){
    var app = new p5(sketch);
}



const sketch = (p) => {
    let boxes = new Boxes(100);
    
	p.setup = () => {

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

	    p.createCanvas(p.windowWidth, p.windowHeight);
        p.noStroke();

	};

	p.draw = () => {
        
        // p.text(JSON.stringify(
        //     {rotationX: p.rotationX}
        //     ,null,2),500,100)
        // t = p.frameCount ; // update time
        // pulser.update(p.mouseX, p.mouseY)
        // pulser.display()
        // debug({r:},500)
        // p.rotate(p.radians(p.rotationX));
        
	};

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	}
    p.mouseDragged=()=> {
        boxes.add({
            x:p.mouseX,
            y:p.mouseY
        })
      }
    
    p.mouseClicked=()=> {
        boxes.add({
            x:p.mouseX,
            y:p.mouseY
        })
        console.log(boxes)
      }
    
    function Boxes(limit){
        this.limit = limit
        this.boxes = []
        this.add = function(props){
            
            var new_box = new Box(props)
            // if(_.contains(boxes,new_box))
            if(this.boxes.length > limit){
                var b = this.boxes.shift()
                b.erase()
            }else{
                this.boxes.push(new_box)
            }
            
            this.boxes.forEach(b=>{
                b.draw()
            })
        }


    }
    class Box {
        // let x = 0
        // this.y = 0
        size = 200;
        x;
        y;
        #fill = 'rgba(100%,0%,100%,0.5)';

        constructor(props){
            this.update(props)
            
        }

        update = function(props) {
            this.x = Math.floor(props.x/this.size)* this.size
            this.y = Math.floor(props.y/this.size)* this.size
        }

        draw = function(){
            p.fill(this.#fill);
            p.rect(this.x,this.y, this.size, this.size);
        }
        erase = function(){
            p.erase()
            p.fill(0);
            p.rect(this.x,this.y, this.size, this.size);
            p.noErase()
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