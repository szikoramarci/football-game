<script setup>
  import * as PIXI from 'pixi.js';
  import { defineHex, Grid, rectangle, Orientation } from 'honeycomb-grid'
  import { onMounted } from 'vue'

  // you may want the origin to be the top left corner of a hex's bounding box
  // instead of its center (which is the default)
  const Hex = defineHex({ 
    dimensions: 30, 
    origin: 'topLeft',
    orientation: Orientation.FLAT,
  })
  class FootballHex extends Hex {
    graphics;
    selected = false;
    hovered = false;

    createGrapchics(){
      this.graphics = new PIXI.Graphics().poly(this.corners);
      this.graphics.eventMode = 'static';
      this.graphics.cursor = 'pointer';  
      this.graphics.on('pointerenter', (e) => {    
        this.hovered = true;
        this.render();
      });
      this.graphics.on('pointerleave', (e) => {    
        this.hovered = false;
        this.render();
      });
      this.graphics.on('pointerdown', (e) => {    
        this.selected = !this.selected;
        this.render();
      });
    }

    getGraphics() {      
      if (this.graphics === undefined) {
        this.createGrapchics();
        this.render();
      }
      return this.graphics;
    }

    render(){
      if (this.selected) {
        this.setSelectedDesign();
      } else if (this.hovered) {
        this.setVisitedDesign();
      } else {
        this.setBaseDesign();
      }
    }

    setBaseDesign(){
      this.graphics.stroke('red');
      this.graphics.fill('white');
    }

    setVisitedDesign(){
      this.graphics.stroke('red');
      this.graphics.fill('green');
    }

    setSelectedDesign(){
      this.graphics.stroke('red');
      this.graphics.fill('black');
    }

    /*setPolygon(polygon) {  
      this.polygon.on('pointerenter', function() {    
        this.polygon.stroke('blue').fill('black');
      });
      this.polygon.on('pointerleave', function() {       
        this.polygon.stroke('red').fill('white');
      });      
    }*/
  }
  const grid = new Grid(FootballHex, rectangle({ width: 16, height: 6 }))

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
