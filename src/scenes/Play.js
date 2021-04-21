class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/electro_beep.mp3');
        this.load.audio('sfx_explosion', './assets/explode.mp3');
        this.load.audio('sfx_rocket', './assets/whoosh.mp3');
        this.load.audio('sfx_play', './assets/playmusic.wav');
        this.load.image('gameover', './assets/GameOver.png');

        // load images/tile sprites
        this.load.image('rocket', './assets/SniperMonkey.png');
        this.load.image('dart', './assets/Dart.png');
        this.load.image('spaceship', './assets/ZOMG.png');
        this.load.image('spaceship2', './assets/MOAB.png');
        this.load.image('spaceship3', './assets/balloon.png');
        this.load.image('starfield', './assets/background.png');
        // load spritesheet
        this.load.spritesheet('explosion','./assets/explosion1.png',{
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        });
    }

    create() {

        let time;
        let multi = false;
        if(game.settings.gameTimer == 60000){

            time = 60;
        }
        if(game.settings.gameTimer == 45000){
            multi = true;
            time = 45;
        }

        this.sound.play('sfx_play', {volume: 0.1});
        //place starfield
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0xFBB040).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0,0);

        // add rocket {player 1}
        //this.p2Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding - 30, 'dart', true).setOrigin(0.5, 0);\

        //console.log("in else");
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding - 30, 'dart', false).setOrigin(0.5, 0);

        // add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0.0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship2', 0, 40).setOrigin(0.0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship3', 0, 10).setOrigin(0.0);


        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 9,
                first: 0
            }),
            frameRate: 30
        });
        
        // display score
         this.p1Score = 0;
         let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#8DC63F',
            color: '#FFFFFF',
            align: 'right',
            padding:{
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
         // display time
         let timeDisplay;
         
         let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '18px',
            backgroundColor: '#8DC63F',
            color: '#FFFFFF',
            align: 'right',
            padding:{
                top: 5,
                bottom: 5,
            },
            fixedWidth: 215
        }
        
        timeDisplay = this.add.text(borderUISize + borderPadding * 32.5, borderUISize + borderPadding*2, "Time Remaining: " + time + "s", timeConfig);   

        let minusTime = setInterval(updateTime, 1000);

        function updateTime(){
            console.log("In here");
            if(time > 0){
                time--;
            }
            timeDisplay.text = "Time Remaining: " + time + "s";
        }
        // GAME OVER flag
        this.gameOver = false;

        // 60 second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            //this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            //this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart <- for Menu', scoreConfig).setOrigin(0.5);
            this.mainback = this.add.tileSprite(0, 0, 640, 480, 'gameover').setOrigin(0, 0);
            this.gameOver = true;
            this.game.sound.stopAll();
        },null,this);
    }

    update() {
        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start('menuScene');
        }
        this.starfield.tilePositionX -= starSpeed;
        if(!this.gameOver){
            // update rocket
            this.p1Rocket.update();

            // update spaceships (x3)
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

    }

    checkCollision(rocket, ship){
        // simple AABB checking
        if( rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y){
                return true
        }
        else{
            return false;
        }
    }

    shipExplode(ship){
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}