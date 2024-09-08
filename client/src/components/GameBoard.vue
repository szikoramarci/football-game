<script setup>
  import * as PIXI from 'pixi.js';
  import { defineHex, Grid, rectangle, Orientation } from 'honeycomb-grid'
  import { onMounted } from 'vue'
  import FieldGraphics from '@/classes/graphics/FieldGraphics.class';
  import Player from '@/classes/Player.class';
  import PlayerToken from '@/classes/PlayerToken.class';
  import { fromEvent, filter, throttleTime } from 'rxjs';

  const player = new Player('Messi','10');
  const playerToken = new PlayerToken(player);

  // you may want the origin to be the top left corner of a hex's bounding box
  // instead of its center (which is the default)
  const Hex = defineHex({ 
    dimensions: 60, 
    origin: 'topLeft',
    orientation: Orientation.FLAT,
  });
  
  class FootballHex extends Hex {
    fieldGraphics;
    lineGraphics;

    getGraphics() {
      const graphics = new PIXI.Container();

      this.fieldGraphics = new FieldGraphics(this.col, this.row, this.corners);
      graphics.addChild(this.fieldGraphics);

      this.fieldGraphics.on('pointerdown', () => {
        playerToken.setPosition(this.x, this.y);
      })      
    
      return graphics;
    }

  }
  const grid = new Grid(FootballHex, rectangle({ width: 10, height: 4 }))

  const app = new PIXI.Application()
  await app.init({ antialias: true, resizeTo: window });

  onMounted(() => {
    document.getElementById('game').appendChild(app.canvas);

    let grabbed = false;

    // Make sure stage covers the whole scene
    app.stage.hitArea = app.screen;

    grid.forEach((hex) => {                       
      app.stage.addChild(hex.getGraphics());
    })    

    const tokenGraphics = playerToken.getGraphics();
    
    tokenGraphics.on('pointerdown', (e) => {
        if (grabbed) {  
            grabbed = false;
            console.log(e.target)
        } else {
            grabbed = true;
        }
    });
    
    fromEvent(document, 'mousemove')
        .pipe(
            filter(() => grabbed),
            throttleTime(10)
        )            
        .subscribe((e) => {
            console.log('MOST')
            tokenGraphics.x = e.clientX;
            tokenGraphics.y = e.clientY;
        });

    app.stage.addChild(playerToken.getGraphics());
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
