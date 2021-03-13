<template>
    <div style='color:white;'>
    </div>
</template>

<script>
var lol = require('./boxes.js')
export default {
    name: 'Boxes',
    data() {
      return {
        error: null,
        loading: null,
        timeout:null
      }
    },
    mounted: function() {
      lol.run()
      
    },
    created: function() {
    },
    methods: {
        
     }
}
</script>


</style>
