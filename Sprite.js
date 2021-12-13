class Sprite {
    constructor(config) {

        //Set up the image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        //Shadow
        this.shadow = new Image();
        this.useShadow = true; //config.useShadow || false
        if (this.useShadow) {
            this.shadow.src = "images/characters/shadow.png";
        }
        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        }



        //config animation and initial state
        this.animations = config.animations || {
            "idle-down": [[1, 0]],
            "idle-right": [[1, 12]],
            "idle-up": [[1, 4]],
            "idle-left": [[1, 8]],


            "walk-down": [[1, 0], [0, 0], [2, 0], [0, 0]],
            "walk-right": [[1, 12], [0, 12], [1, 12], [2, 12]],
            "walk-up": [[1, 4], [2, 4], [1, 4], [2, 4]],
            "walk-left": [[1, 8], [0, 8], [1, 8], [2, 8]]


        }
        this.currentAnimation = "idle-right"; // config.currentAnimation || "idle-down";
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 8;
        this.animationFrameProgress = this.animationFrameLimit;


        //Reference the game object
        this.gameObject = config.gameObject;
    }

    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame]
    }

    setAnimation(key) {
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() {
        //Downtick frame progress
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        //Reset the counter
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        if (this.frame === undefined) {
            this.currentAnimationFrame = 0
        }


    }


    draw(ctx) {
        const x = this.gameObject.x - 16;
        const y = this.gameObject.y - 18;

        this.isShadowLoaded && ctx.drawImage(this.shadow, x - 8, y);


        const [frameX, frameY] = this.frame;

        this.isLoaded && ctx.drawImage(this.image,
            frameX * 16, frameY * 8,
            16, 32,
            x, y,
            16, 32
        )

        this.updateAnimationProgress();

    }

}