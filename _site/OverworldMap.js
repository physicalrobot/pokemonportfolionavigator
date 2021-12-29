class OverworldMap {
    constructor(config) {
        this.overworld = null;
        this.gameObjects = config.gameObjects;
        this.cutsceneSpaces = config.cutsceneSpaces || {};
        this.walls = config.walls || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = false;
    }



    drawLowerImage(ctx) {
        ctx.drawImage(this.lowerImage, 0, 0)



    }

    drawUpperImage(ctx) {
        ctx.drawImage(this.upperImage, 0, 0)

    }

    isSpaceTaken(currentX, currentY, direction) {
        const { x, y } = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {

            let object = this.gameObjects[key];
            object.id = key;


            //TODO: determine if this object should actually mount
            object.mount(this);

        })
    }
    async startCutscene(events) {
        this.isCutscenePlaying = true;

        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this,
            })
            await eventHandler.init();
        }

        this.isCutscenePlaying = false;


        //Reset NPCs to do their idle behavior
        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    }


    checkForActionCutscene() {
        const hero = this.gameObjects["hero"]
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
        })
        console.log({ match });
        if (!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events)
        }
    }


    checkForFootstepCutscene() {
        const hero = this.gameObjects["hero"];


        const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
        // console.log({ match });

        if (!this.isCutscenePlaying && match) {
            this.startCutscene(match[0].events)
        }
    }


    addWall(x, y) {
        this.walls[`${x},${y}`] = true;
    }
    removeWall(x, y) {
        delete this.walls[`${x},${y}`]
    }
    moveWall(wasX, wasY, direction) {
        this.removeWall(wasX, wasY);
        const { x, y } = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x, y);
    }

}

window.OverworldMaps = {
    DemoRoom: {
        lowerSrc: "images/maps/DemoLower.png",
        upperSrc: "images/maps/DemoUpper.png",
        gameObjects: {


            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(12),
                y: utils.withGrid(9),

            }),

            /*
            npc1: new Person({
                x: utils.withGrid(7),
                y: utils.withGrid(9),
                src: "images/characters/people/npc1.png"
            })
            */
        },
        walls: {
            [utils.asGridCoord(5, 7)]: true, //house mailbox


            //left side
            [utils.asGridCoord(6, 6)]: true,
            [utils.asGridCoord(6, 5)]: true,
            [utils.asGridCoord(6, 4)]: true,


            //front
            [utils.asGridCoord(6, 7)]: true,
            [utils.asGridCoord(7, 6)]: true, //front door
            [utils.asGridCoord(8, 7)]: true,
            [utils.asGridCoord(9, 7)]: true,
            [utils.asGridCoord(10, 7)]: true,




            //right side
            [utils.asGridCoord(10, 6)]: true,
            [utils.asGridCoord(10, 5)]: true,
            [utils.asGridCoord(10, 4)]: true,

            //back
            [utils.asGridCoord(6, 4)]: true,
            [utils.asGridCoord(7, 4)]: true,
            [utils.asGridCoord(8, 4)]: true,
            [utils.asGridCoord(9, 4)]: true,



            //neighbhor's house

            [utils.asGridCoord(14, 7)]: true, //house mailbox


            //left side
            [utils.asGridCoord(15, 6)]: true,
            [utils.asGridCoord(15, 5)]: true,
            [utils.asGridCoord(15, 4)]: true,


            //front
            [utils.asGridCoord(15, 7)]: true,
            [utils.asGridCoord(16, 6)]: true, //front door
            [utils.asGridCoord(17, 7)]: true,
            [utils.asGridCoord(18, 7)]: true,
            [utils.asGridCoord(19, 7)]: true,

            //right side
            [utils.asGridCoord(19, 6)]: true,
            [utils.asGridCoord(19, 5)]: true,
            [utils.asGridCoord(19, 4)]: true,

            //back
            [utils.asGridCoord(15, 4)]: true,
            [utils.asGridCoord(16, 4)]: true,
            [utils.asGridCoord(17, 4)]: true,
            [utils.asGridCoord(18, 4)]: true,


            //Lab

            //left side
            [utils.asGridCoord(14, 10)]: true,
            [utils.asGridCoord(14, 11)]: true,
            [utils.asGridCoord(14, 12)]: true,

            //front
            [utils.asGridCoord(14, 13)]: true,
            [utils.asGridCoord(15, 13)]: true,
            [utils.asGridCoord(16, 13)]: true,
            [utils.asGridCoord(17, 12)]: true,//front door
            [utils.asGridCoord(18, 13)]: true,
            [utils.asGridCoord(19, 13)]: true,
            [utils.asGridCoord(20, 13)]: true,

            //right side
            [utils.asGridCoord(20, 12)]: true,
            [utils.asGridCoord(20, 11)]: true,
            [utils.asGridCoord(20, 10)]: true,

            //back
            [utils.asGridCoord(15, 10)]: true,
            [utils.asGridCoord(16, 10)]: true,
            [utils.asGridCoord(17, 10)]: true,
            [utils.asGridCoord(18, 10)]: true,
            [utils.asGridCoord(19, 10)]: true,
            [utils.asGridCoord(20, 10)]: true,

            //border

            //left top
            [utils.asGridCoord(12, 1)]: true,
            [utils.asGridCoord(11, 1)]: true,
            [utils.asGridCoord(10, 1)]: true,
            [utils.asGridCoord(9, 1)]: true,
            [utils.asGridCoord(8, 1)]: true,
            [utils.asGridCoord(7, 1)]: true,
            [utils.asGridCoord(6, 1)]: true,
            [utils.asGridCoord(5, 1)]: true,
            [utils.asGridCoord(4, 1)]: true,
            [utils.asGridCoord(3, 1)]: true,
            [utils.asGridCoord(2, 1)]: true,

            //left down
            [utils.asGridCoord(2, 2)]: true,
            [utils.asGridCoord(2, 3)]: true,
            [utils.asGridCoord(2, 4)]: true,
            [utils.asGridCoord(2, 5)]: true,
            [utils.asGridCoord(2, 6)]: true,
            [utils.asGridCoord(2, 7)]: true,
            [utils.asGridCoord(2, 8)]: true,
            [utils.asGridCoord(2, 9)]: true,
            [utils.asGridCoord(2, 10)]: true,
            [utils.asGridCoord(2, 11)]: true,
            [utils.asGridCoord(2, 12)]: true,
            [utils.asGridCoord(2, 13)]: true,
            [utils.asGridCoord(2, 14)]: true,
            [utils.asGridCoord(2, 15)]: true,
            [utils.asGridCoord(2, 16)]: true,
            [utils.asGridCoord(2, 17)]: true,
            [utils.asGridCoord(2, 18)]: true,
            [utils.asGridCoord(2, 19)]: true,

            //bottom 
            [utils.asGridCoord(3, 19)]: true,
            [utils.asGridCoord(4, 19)]: true,
            [utils.asGridCoord(5, 19)]: true,
            [utils.asGridCoord(6, 19)]: true,

            [utils.asGridCoord(8, 19)]: true,
            [utils.asGridCoord(8, 18)]: true,
            [utils.asGridCoord(8, 17)]: true,

            [utils.asGridCoord(9, 17)]: true,
            [utils.asGridCoord(10, 17)]: true,
            [utils.asGridCoord(11, 17)]: true,


            [utils.asGridCoord(11, 18)]: true,
            [utils.asGridCoord(11, 19)]: true,
            [utils.asGridCoord(11, 20)]: true,

            [utils.asGridCoord(19, 19)]: true,
            [utils.asGridCoord(20, 19)]: true,
            [utils.asGridCoord(21, 19)]: true,
            [utils.asGridCoord(22, 19)]: true,

            [utils.asGridCoord(23, 18)]: true,
            [utils.asGridCoord(23, 17)]: true,
            [utils.asGridCoord(23, 16)]: true,
            [utils.asGridCoord(23, 15)]: true,
            [utils.asGridCoord(23, 14)]: true,
            [utils.asGridCoord(23, 13)]: true,
            [utils.asGridCoord(23, 12)]: true,
            [utils.asGridCoord(23, 11)]: true,
            [utils.asGridCoord(23, 10)]: true,
            [utils.asGridCoord(23, 9)]: true,
            [utils.asGridCoord(23, 8)]: true,
            [utils.asGridCoord(23, 7)]: true,
            [utils.asGridCoord(23, 6)]: true,
            [utils.asGridCoord(23, 5)]: true,
            [utils.asGridCoord(23, 4)]: true,
            [utils.asGridCoord(23, 3)]: true,
            [utils.asGridCoord(23, 2)]: true,
            [utils.asGridCoord(23, 1)]: true,

            [utils.asGridCoord(22, 1)]: true,
            [utils.asGridCoord(21, 1)]: true,
            [utils.asGridCoord(20, 1)]: true,
            [utils.asGridCoord(19, 1)]: true,
            [utils.asGridCoord(18, 1)]: true,
            [utils.asGridCoord(17, 1)]: true,
            [utils.asGridCoord(16, 1)]: true,
            [utils.asGridCoord(15, 1)]: true,
            [utils.asGridCoord(12, 0)]: true,
            [utils.asGridCoord(15, 0)]: true,

            //fences
            [utils.asGridCoord(6, 11)]: true,
            [utils.asGridCoord(7, 11)]: true,
            [utils.asGridCoord(8, 11)]: true,
            [utils.asGridCoord(9, 11)]: true,
            [utils.asGridCoord(10, 11)]: true,

            [utils.asGridCoord(14, 16)]: true,
            [utils.asGridCoord(15, 16)]: true,
            [utils.asGridCoord(16, 16)]: true,
            [utils.asGridCoord(17, 16)]: true,
            [utils.asGridCoord(18, 16)]: true,
            [utils.asGridCoord(19, 16)]: true,



            //sign
            [utils.asGridCoord(6, 14)]: true,

        },
        cutsceneSpaces: {

            [utils.asGridCoord(7, 7)]: [
                {
                    events: [
                        { type: "changeMap", url: "https://physicalrobot.github.io/code_blog/" }
                    ]
                }
            ],
            [utils.asGridCoord(16, 7)]: [
                {
                    events: [
                        { type: "changeMap", url: "https://physicalrobot.github.io/code_blog/navpages/codenav/" }
                    ]
                }
            ],
            [utils.asGridCoord(17, 13)]: [
                {
                    events: [
                        { type: "changeMap", url: "https://physicalrobot.github.io/code_blog/navpages/portnav/" }
                    ]
                }
            ],
            [utils.asGridCoord(7, 8)]: [
                {
                    events: [
                        { who: "hero", type: "stand", direction: "up" },
                        { type: "textMessage", text: "About Me" },
                    ]
                }
            ],
            [utils.asGridCoord(16, 8)]: [
                {
                    events: [
                        { who: "hero", type: "stand", direction: "up" },
                        { type: "textMessage", text: "Code Blog" },
                    ]
                }
            ],
            [utils.asGridCoord(10, 12)]: [
                {
                    events: [
                        { who: "hero", type: "stand", direction: "up" },

                        { type: "textMessage", text: "By Vikalp Malhotra" },
                    ]
                }
            ],
            [utils.asGridCoord(17, 14)]: [
                {
                    events: [
                        { who: "hero", type: "stand", direction: "up" },

                        { type: "textMessage", text: "Portfolio Projects" },
                    ]
                }
            ],




        }
    },

    Kitchen: {
        lowerSrc: "images/maps/KitchenLower.png",
        upperSrc: "images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new GameObject({
                x: 3,
                y: 5,
            }),
            npcA: new GameObject({
                x: 9,
                y: 6,
                src: "images/characters/people/npc2.png"
            }),
            npcB: new GameObject({
                x: 10,
                y: 8,
                src: "images/characters/people/npc3.png"
            })
        }
    },
}