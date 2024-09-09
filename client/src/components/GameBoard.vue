<script setup>
  import * as PIXI from 'pixi.js';
  import { defineHex, Grid, rectangle, Orientation } from 'honeycomb-grid'
  import { onMounted } from 'vue'
  import FieldGraphics from '@/classes/graphics/FieldGraphics.class';
  import Player from '@/classes/Player.class';
  import PlayerToken from '@/classes/PlayerToken.class';
  import { fromEvent, filter, throttleTime } from 'rxjs';
  import FieldContextManager from '@/contexts/field/FieldContextManager';

  const player = new Player('Messi','10');
  const playerToken = new PlayerToken(player);

  let grabbed = null;

  // you may want the origin to be the top left corner of a hex's bounding box
  // instead of its center (which is the default)
  const Hex = defineHex({ 
    dimensions: 60, 
    origin: 'topLeft',
    orientation: Orientation.FLAT,
  });
  
  class FootballHex extends Hex {
    field;
    state; // TODO egy state ami a fielden van rajta (átlátszó, de színes)
    lineGraphics;

    getGraphics() {
      const graphics = new PIXI.Container();

      this.field = new FieldGraphics(this.col, this.row, this.x, this.y);
      graphics.addChild(this.field.getGraphics());

      this.field.getGraphics().on('pointerout', () => {
        if (grabbed) {
          this.field.setBaseDesign();
        }
      });

      this.field.getGraphics().on('pointerenter', () => {
        if (grabbed) {
          this.field.setHovered();
        }        
      });
      

      this.field.getGraphics().on('pointerdown', () => {
        if (grabbed) {
          playerToken.setPosition(this.x, this.y);
          playerToken.getGraphics().eventMode = 'static';
          this.field.setBaseDesign();
          grabbed = null;
        }      
      })     
    
      return graphics;
    }

  }
  const grid = new Grid(FootballHex, rectangle({ width: 10, height: 4 }))

  const app = new PIXI.Application()
  await app.init({ antialias: true, resizeTo: window });

  onMounted(() => {
    document.getElementById('game').appendChild(app.canvas);

    // Make sure stage covers the whole scene
    app.stage.hitArea = app.screen;
    
    const firstHex = grid.getHex([0,0]);
    FieldContextManager.setUpContexts(firstHex.corners);

    grid.forEach((hex) => {                       
      app.stage.addChild(hex.getGraphics());
    })    

    const tokenGraphics = playerToken.getGraphics();
    
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
