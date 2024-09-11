<script setup>
  import { onMounted } from 'vue';
  import AppManager from '@/services/AppManager'
  import GrabManager from '@/services/GrabManager';
  import { fromEvent, filter, throttleTime } from 'rxjs';


  await AppManager.init();

  onMounted(() => {
    document.getElementById('game').appendChild(AppManager.getCanvas());

    
    fromEvent(document, 'mousemove')
        .pipe(
            filter(() => GrabManager.isGrabbed()),
            throttleTime(10)
        )            
        .subscribe((e) => {
          const grabbedElement = GrabManager.getGrabbedElement();
          grabbedElement.setPosition(e.clientX, e.clientY);
        });
  })    

</script>

<template>
  <div id="game"></div>
</template>

<style scoped>
  #game {
    width: 100%;
    height: 100%;
  }
</style>
