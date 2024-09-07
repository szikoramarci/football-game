<script setup>
  import * as PIXI from 'pixi.js';
  import { defineHex, Grid, rectangle, Orientation } from 'honeycomb-grid'
  import { onMounted } from 'vue'
  import Field from '../classes/Field.class';
  import Player from '../classes/Player.class';

  // you may want the origin to be the top left corner of a hex's bounding box
  // instead of its center (which is the default)
  const Hex = defineHex({ 
    dimensions: 60, 
    origin: 'topLeft',
    orientation: Orientation.FLAT,
  });
  
  class FootballHex extends Hex {
    field;
    player;

    getGraphics() {
      const graphics = new PIXI.Container();

      this.field = new Field(this.col, this.row, this.corners);
      graphics.addChild(this.field.getGraphics());

      const kitNumber = Math.floor(Math.random() * 1000) + 1;
      if (kitNumber < 100) {
        this.player = new Player(this.x, this.y, kitNumber);
        graphics.addChild(this.player.getGraphics());
      }      

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

    grid.forEach((hex) => {                       
      app.stage.addChild(hex.getGraphics());
    })        
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
