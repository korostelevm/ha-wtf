const run =  ()=> {
    var w = c.width = window.innerWidth,
        h = c.height = window.innerHeight,
        ctx = c.getContext('2d'),

        opts = {

            len:20,
            count: 10,
            baseTime: 100,
            addedTime: 195,
            dieChance: .005,
            spawnChance: 1,
            sparkChance: 0.1,
            sparkDist: 100,
            sparkSize: 2,

            color: 'hsl(hue,100%,light%)',
            baseLight:30,
            addedLight: 10, // [50-10,50+10]
            shadowToTimePropMult: 1,
            baseLightInputMultiplier: .01,
            addedLightInputMultiplier: .02,

            cx: w / 2,
            cy: h / 2,
            repaintAlpha: .01,
            hueChange: 0.1
        },

        tick = 0,
        lines = [],
        dieX = w / 2 / opts.len,
        dieY = h / 2 / opts.len,

        baseRad = Math.PI * 2 / 6;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, w, h);
    var mouse;
    c.onmousemove =(evt)=>{
        var rect = c.getBoundingClientRect();
        mouse = {
          x: evt.clientX - w/2,
          y: evt.clientY -h/2
        };
    }
    function loop() {
        
        window.requestAnimationFrame(loop);

        ++tick;

        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(0,0,0,alp)'.replace('alp', opts.repaintAlpha);
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';

        if (lines.length < opts.count && Math.random() < opts.spawnChance)
            lines.push(new Line);

        lines.map(function (line) {
            line.step();
        });
    }

    function Line() {

        this.reset();
    }
    Line.prototype.reset = function () {

        // this.x = (Math.random() < .5 ? Math.random() : -Math.random()) * w/2 ;
        // this.y =(Math.random() < .5 ? Math.random() : -Math.random()) * h/2
        this.x = 0
        this.y = 0

        this.addedX = 0;
        this.addedY = 0;

        this.rad = 0;

        this.lightInputMultiplier = opts.baseLightInputMultiplier + opts.addedLightInputMultiplier * Math.random();

        this.color = opts.color.replace('hue', tick * opts.hueChange);
        this.cumulativeTime = 0;

        this.beginPhase();
    }
    Line.prototype.beginPhase = function () {

        this.x += this.addedX;
        this.y += this.addedY;
        // this.len = opts.len;
        this.len =8;
        this.time = 0;
        this.targetTime = 8
        // this.targetTime = (opts.baseTime + opts.addedTime * Math.random()) | 0;
        // this.target = Math.atan2(mouse.y - this.y, mouse.x -this.x)  
        // this.rad +=  (Math.random() < .5 ? 1 : -1);
        // this.rad =  Math.atan2(mouse.y - this.y, mouse.x -this.x)/10;;
        // this.rad = (Math.random() < .5 ? Math.random() : -Math.random()) * Math.PI*2;
        // if(this.rad < this.target)
            // this.rad = (Math.random() < .5 ? Math.random() : -Math.random())* 0.1 + this.target
        // else
            this.rad += (Math.random() < .5 ? Math.random() : -Math.random()) 
        // this.rad =  
        // console.log(this.rad  * 180 / Math.PI)
        this.addedX = Math.cos(this.rad);
        this.addedY = Math.sin(this.rad);

        if (Math.random() < opts.dieChance || this.x > dieX || this.x < -dieX || this.y > dieY || this.y < -dieY)
            this.reset();
    }
    Line.prototype.step = function () {
        // console.log(mouse)
        ++this.time;
        ++this.cumulativeTime;

        if (this.time >= this.targetTime)
            this.beginPhase();

        var prop = this.time / this.targetTime,
            wave = prop,
            // wave = Math.sin(prop * Math.PI / 2),
            x = this.addedX * wave,
            y = this.addedY * wave;
        
        var size = 1

        ctx.shadowBlur = prop * opts.shadowToTimePropMult;
        ctx.fillStyle = ctx.shadowColor = this.color.replace('light', opts.baseLight + opts.addedLight * Math.sin(this.cumulativeTime * this.lightInputMultiplier));
        ctx.fillRect(
            opts.cx + (this.x + x) * this.len, 
            opts.cy + (this.y + y) * this.len,
            size, size
         );
        if (Math.random() < Math.cos(prop) )

            ctx.fillRect(
                 opts.cx  - this.addedX + (this.x + x) * this.len + Math.random() * opts.sparkDist * (Math.random() < .5 ? 1 : -1) - opts.sparkSize / 2,
                 opts.cy - this.addedY + (this.y + y) * this.len + Math.random() * opts.sparkDist * (Math.random() < .5 ? 1 : -1) - opts.sparkSize / 2,
                opts.sparkSize ,
                opts.sparkSize
                )
        }
    loop();

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }

    window.addEventListener('resize', function () {

        w = c.width = window.innerWidth;
        h = c.height = window.innerHeight;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, w, h);

        opts.cx = w / 2;
        opts.cy = h / 2;

        dieX = w / 2 / opts.len;
        dieY = h / 2 / opts.len;
    });
}

export {run}