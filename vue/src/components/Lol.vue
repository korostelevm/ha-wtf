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
      lol.run()
      
    },
    created: function() {
    },
    methods: {
        
     }
}
</script>


</style>
