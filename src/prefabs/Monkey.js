// Rocket {player} prefab
class Rocket extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);

        // add object to the existing scene
        scene.add.existing(this);
        this.isFiring = false;             // track rocket firing status
        this.moveSpeed = 2;                // pixels per frame
    }

    update(){
        // left and right movement
        if(!this.isFiring){
            if(keyLEFT.isDown && this.x >= borderUISize + this.width){
                this.x -= this.moveSpeed;
            }
            else if(keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width){
                this.x += this.moveSpeed;
            }
        }
    }

    // reset rocket to ground
    reset(){
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding - 30;
    }
}