class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  startGameLoop() {
    const step = () => {
      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


      //Update all objects
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        })
      })

      //Draw Lower layer
      this.map.drawLowerImage(this.ctx);


      var a = this.ctx.fillRect(95, 115, 16, 8) // This is the location in the canvas I want to link to the home page of my website.
      this.ctx.fillStyle = "transparent"


      // this.canvas.addEventListener('keyup', function (event) {
      //   this.x = event.pageX - elemLeft,
      //    this.y = event.pageY - elemTop;
      //   console.log(x, y);
      //   elements.forEach(function (element) {
      //     if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
      //       window.location.assign ("https://physicalrobot.github.io/code_blog")
      //     }
      //   });

      // }, false);

      //Draw Game Objects
      Object.values(this.map.gameObjects).forEach(object => {
        object.sprite.draw(this.ctx);
      })

      //Draw Upper layer
      this.map.drawUpperImage(this.ctx);




      requestAnimationFrame(() => {
        step();
      })
    }
    step();
  }
  bindActionInput() {
    new KeyPressListener("Enter", () => {
      //Is there a person here to talk to?
      this.map.checkForActionCutscene()
    })
  }


  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", e => {
      if (e.detail.whoId === "hero") {
        //Hero's position has changed
        this.map.checkForFootstepCutscene()
      }
    })
  }


  startMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    ;
    this.map.mountObjects();

  }

  init() {
    this.startMap(window.OverworldMaps.DemoRoom);


    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
  }


}