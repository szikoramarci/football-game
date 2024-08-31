<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import Phaser from 'phaser';

  // Hivatkozás a játék konténerére
  const gameContainer = ref(null);
  let game = null;

  // Preload fázis a játékhoz
  const preload = function () {
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('star', 'https://labs.phaser.io/assets/sprites/star.png');
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
  };

  // Create fázis a játékhoz
  const create = function () {
    this.add.image(400, 300, 'sky');

    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    this.player = this.physics.add.sprite(100, 450, 'star');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, platforms);
  };

  // Update fázis a játékhoz
  const update = function () {
    // Itt helyezheted el a játékmenet logikáját (pl. mozgás, interakciók)
  };

  // Játék inicializálása a komponens betöltésekor
  onMounted(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: {
        preload,
        create,
        update
      },
      parent: gameContainer.value, // A Phaser játék ezen az elem referencián fut majd
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      }
    };

    game = new Phaser.Game(config);
  });

  // Játék megsemmisítése a komponens eltávolításakor
  onBeforeUnmount(() => {
    if (game) {
      game.destroy(true);
    }
  });
</script>

<template>
  <div ref="gameContainer" id="game"></div>
</template>

<style scoped>
  #game {
    width: 100%;
    height: 100%;
  }
</style>
