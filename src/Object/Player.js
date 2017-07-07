var SHIP_SIZE = 50;
var SHOOT_DELAY = 50;
var RECOIL = 5;
var FEEDBACK = 3;
var PLAYER_SAFE_ZONE = 25;

function Player(x, y, layer) {
	this.x = x;
	this.y = y;
	this.a = 0;
	this.s = false;
	
	this.level = 1;
	
	this.feedBackCount = 0;
	
	var coreSprite = cc.Sprite.create("res/GSGamePlay/MainChar.png");
	coreSprite.setAnchorPoint(cc.p(0.5, 0.5));
	coreSprite.setPosition (cc.p(x, y));
	coreSprite.setVisible (false);
	//coreSprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	coreSprite.setZOrder (99);
	layer.addChild(coreSprite);
	
	var glowSprite = cc.Sprite.create("res/GSGamePlay/MainChar_GlowOnly.png");
	glowSprite.setAnchorPoint(cc.p(0.5, 0.5));
	glowSprite.setPosition (cc.p(x, y));
	glowSprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	glowSprite.setZOrder (98);
	glowSprite.setOpacity (0);
	layer.addChild(glowSprite);
	
	
	var playLevel1ParticleDelay = 1000;
	var shootCooldown = 0;
	
	var glowCycleCount = 0;
	var glowDir = 0;
	
	var unlockText1 = new TextImpress("res/GSGamePlay/UnlockText1.png", this.x + TEXT_1_POSITION_OFFSET_X, this.y + TEXT_1_POSITION_OFFSET_Y, layer);
	var unlockText2 = new TextImpress("res/GSGamePlay/UnlockText2.png", CANVAS_W * 0.5 + SKILL_1_POSITION_OFFSET_X + TEXT_2_POSITION_OFFSET_X, CANVAS_H * 0.5 + SKILL_1_POSITION_OFFSET_Y + TEXT_2_POSITION_OFFSET_Y, layer);
	var unlockText3 = new TextImpress("res/GSGamePlay/UnlockText3.png", CANVAS_W * 0.5 + SKILL_2_POSITION_OFFSET_X + TEXT_3_POSITION_OFFSET_X, CANVAS_H * 0.5 + SKILL_2_POSITION_OFFSET_Y + TEXT_3_POSITION_OFFSET_Y, layer);
	var unlockText4 = new TextImpress("res/GSGamePlay/UnlockText4.png", CANVAS_W * 0.5 + SKILL_3_POSITION_OFFSET_X + TEXT_4_POSITION_OFFSET_X, CANVAS_H * 0.5 + SKILL_3_POSITION_OFFSET_Y + TEXT_4_POSITION_OFFSET_Y, layer);
	


	this.SetPointAt = function (x, y) {
		this.a = CalculateAngleBetweenTwoPoint(this.x, this.y, x, y);
		coreSprite.setRotation (this.a);
		glowSprite.setRotation (this.a);
	}
	this.SetShooting = function (value) {
		this.s = value;
	}
	this.Update = function (deltaTime) {
		shootCooldown += deltaTime;

		if (this.s == true) {
			if (shootCooldown >= SHOOT_DELAY) {
				shootCooldown = 0;
				
				myAudio.PlaySound("res/GSGamePlay/Shoot.mp3");
				
				var recoil = Math.random() * RECOIL * 2 - RECOIL;
				if (this.level == 1) {
					var tempBullet = layer.getABullet();
					if (tempBullet) tempBullet.Spawn (this.x, this.y, this.a + recoil);
				}
				else if (this.level == 2) {
					var tempBullet = layer.getABullet();
					
					var leftBulletPosX =  this.x + this.AngleToVector(this.a - 15)[0] * 20;
					var leftBulletPosY =  this.y + this.AngleToVector(this.a - 15)[1] * 20;
					
					if (tempBullet) tempBullet.Spawn (leftBulletPosX, leftBulletPosY, this.a + recoil - 3);
					tempBullet = layer.getABullet();
					
					var rightBulletPosX =  this.x + this.AngleToVector(this.a + 15)[0] * 20;
					var rightBulletPosY =  this.y + this.AngleToVector(this.a + 15)[1] * 20;
					
					if (tempBullet) tempBullet.Spawn (rightBulletPosX, rightBulletPosY, this.a + recoil + 3);
				}
				else if (this.level >= 3) {
					var tempBullet = layer.getABullet();
					if (tempBullet) tempBullet.Spawn (this.x, this.y, this.a + recoil);
					
					tempBullet = layer.getABullet();
					var leftBulletPosX =  this.x + this.AngleToVector(this.a - 20)[0] * 25;
					var leftBulletPosY =  this.y + this.AngleToVector(this.a - 20)[1] * 25;
					if (tempBullet) tempBullet.Spawn (leftBulletPosX, leftBulletPosY, this.a + recoil - 5);
					
					tempBullet = layer.getABullet();
					var rightBulletPosX =  this.x + this.AngleToVector(this.a + 20)[0] * 25;
					var rightBulletPosY =  this.y + this.AngleToVector(this.a + 20)[1] * 25;
					if (tempBullet) tempBullet.Spawn (rightBulletPosX, rightBulletPosY, this.a + recoil + 5);
				}
			}
			if (this.feedBackCount == 0) {
				this.feedBackCount = 1;
				coreSprite.setAnchorPoint(cc.p(0.5, 0.52));
			}
			else if (this.feedBackCount == 1) {
				this.feedBackCount = 2;
				coreSprite.setAnchorPoint(cc.p(0.5, 0.54));
			}
			else if (this.feedBackCount == 2) {
				this.feedBackCount = 3;
				coreSprite.setAnchorPoint(cc.p(0.5, 0.52));
			}
			else {
				this.feedBackCount = 0;
				coreSprite.setAnchorPoint(cc.p(0.5, 0.5));
			}
		}
		else {
			coreSprite.setAnchorPoint(cc.p(0.5, 0.5));
		}
		
		if (playLevel1ParticleDelay > 0) {
			playLevel1ParticleDelay -= deltaTime;
			if (playLevel1ParticleDelay <= 0) {
				layer.playUnlockParticle (1);
				coreSprite.setVisible (true);
				unlockText1.Start();
			}
		}
		
		
		if (glowDir == 0) {
			glowCycleCount += deltaTime;
			if (glowCycleCount > 1000) {
				glowDir = 1;
			}
		}
		else {
			glowCycleCount -= deltaTime;
			if (glowCycleCount < 0) {
				glowDir = 0;
			}
		}
		glowSprite.setOpacity (glowCycleCount * 0.1 + 30);
		
		
		unlockText1.Update(deltaTime);
		unlockText2.Update(deltaTime);
		unlockText3.Update(deltaTime);
		unlockText4.Update(deltaTime);
		
		if (unlockText2.finishFalling == true) {
			layer.blockSprite2.setVisible(false);
		}
		if (unlockText3.finishFalling == true) {
			layer.blockSprite3.setVisible(false);
		}
		if (unlockText4.finishFalling == true) {
			layer.blockSprite4.setVisible(false);
		}
		
	}
	
	this.AngleToVector = function(angle){
		var vector = [];
		vector[0]= Math.sin(angle * DEG_TO_RAD);
		vector[1]= Math.cos(angle * DEG_TO_RAD);
		
		return vector;
	}
	
	this.LevelUp = function (level) {
		if (this.level < level) {
			this.level = level;
			if (this.level == 2) {
				//coreSprite.setSpriteFrame (coreSprite.frame[1]);
				layer.shield.Enable(true);
				unlockText2.Start();
			}
			else if (this.level == 3) {
				//coreSprite.setSpriteFrame (coreSprite.frame[2]);
				layer.antiSpam.Enable(true);
				unlockText3.Start();
			}
			else if (this.level == 4) {
				layer.playUnlockParticle (4);
				layer.priorityUpdate.Enable(true);
				unlockText4.Start();
			}
		}
	}
}