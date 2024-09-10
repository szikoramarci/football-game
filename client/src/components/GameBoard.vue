<script setup>
  import { onMounted } from 'vue'
  import Player from '@/models/Player.class';
  import PlayerToken from '@/models/PlayerToken.class';
  import AppManager from '@/services/AppManager'

  const player = new Player('Messi','10');
  const playerToken = new PlayerToken(player);

  let grabbed = null;

  await AppManager.init();

  onMounted(() => {
    document.getElementById('game').appendChild(AppManager.getCanvas());
  

    /*const tokenGraphics = playerToken.getGraphics();
    
    tokenGraphics.on('pointerdown', (e) => {
        if (grabbed) {  
            grabbed = null;
        } else {
            grabbed = playerToken;
        }
    });
    
    fromEvent(document, 'mousemove')
        .pipe(
            filter(() => grabbed),
            throttleTime(10)
        )            
        .subscribe((e) => {
            tokenGraphics.x = e.clientX;
            tokenGraphics.y = e.clientY;
            tokenGraphics.eventMode = 'none';
        });

    app.stage.addChild(playerToken.getGraphics());*/
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
