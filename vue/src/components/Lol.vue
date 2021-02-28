<template>
    <div style='color:white;'>
    </div>
</template>

<script>
var lol = require('./lol.js')
export default {
    name: 'Lol',
    data() {
      return {
        error: null,
        loading: null,
        timeout:null
      }
    },
    mounted: function() {
       if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            // window.addEventListener('devicemotion', () => {});
            lol.run()
          }
        })
        .catch(console.error);
    } else {
      lol.run()
      // handle regular non iOS 13+ devices
    }

       if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
             lol.run()
          }
        })
        .catch(console.error);
    } else {
      // handle regular non iOS 13+ devices
    }

      
    },
    created: function() {
    },
    methods: {
        
     }
}
</script>


</style>
