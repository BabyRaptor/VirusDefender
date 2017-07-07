var ENEMY_2_SIZE = 70;
var ENEMY_2_HP = 5;
var ENEMY_2_SCORE = 5;
var ENEMY_2_DAMAGE = 8;
var ENEMY_2_SPAWN_RATE = 1500;

function Enemy2(layer) {
	this.x = 0;
	this.y = 0;
	this.a = 0;
	this.w = ENEMY_2_SIZE;
	this.hp = 0;
	this.live = false;
	this.turnRate = 0;
	
	var coreSprite = new cc.Sprite("res/GSGamePlay/Enemy2.png");
	coreSprite.setAnchorPoint(cc.p(0.5, 0.5));
	coreSprite.setPosition (cc.p(0, 0));
	coreSprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	coreSprite.setZOrder (90);
	coreSprite.setVisible (false);
	layer.addChild(coreSprite);
	
	var colorH = 0;
	var colorS = 0;
	var colorV = 0;
	this.colorRGB = null;
	

	this.Spawn = function () {
		var side = (Math.random() * 4) >> 0;
		
		if (side == 0) {
			this.x = Math.random() * CANVAS_W;
			this.y = -ENEMY_2_SIZE;
		}
		else if (side == 1) {
			this.x = Math.random() * CANVAS_W;
			this.y = CANVAS_H + ENEMY_2_SIZE;
		}
		else if (side == 2) {
			this.y = Math.random() * CANVAS_H;
			this.x = CANVAS_W + ENEMY_2_SIZE;
		}
		else if (side == 3) {
			this.y = Math.random() * CANVAS_H;
			this.x = -ENEMY_2_SIZE;
		}
		
		this.a = CalculateAngleBetweenTwoPoint(this.x, this.y, CANVAS_W * 0.5, CANVAS_H * 0.5);
		if (Math.random() > 0.5) {
			this.a += 70;
		}
		else {
			this.a -= 70;
		}
		
		this.speed = 0.3;
		this.live = true;
		this.hp = ENEMY_2_HP;
		
		var vector = [this.x - CANVAS_W * 0.5, this.y - CANVAS_H * 0.5];
		var distance = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
		this.turnRate = 0.01 * distance/350;
		
		colorH = Math.random() * 360;
		colorS = 1;
		colorV = 1;
		this.colorRGB = getRGBColorFromHSV (colorH, colorS, colorV);
		coreSprite.setColor (this.colorRGB);
		coreSprite.setVisible (true);
		
		layer.antiSpam.RequestTargetRemoval (this);
		
		myAudio.PlaySound("res/GSGamePlay/ExplosionN.mp3");
	}
	this.Update = function (deltaTime) {
		if (this.live == true) {
			var vector = [this.x - CANVAS_W * 0.5, this.y - CANVAS_H * 0.5];
			var distance = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
			var distanceSpeed = 1;
			if(distance < 250){
				distanceSpeed = distance/250;
				if(distanceSpeed < 0.5){
					distanceSpeed = 0.5;
				}
			}
			
			this.x += this.speed * distanceSpeed * deltaTime * Math.sin(this.a * DEG_TO_RAD);
			this.y += this.speed * distanceSpeed * deltaTime * Math.cos(this.a * DEG_TO_RAD);
		
			var distanceTurn = 	1 - distance/300;
			if(distanceTurn < 0){
				distanceTurn = 0;
			}
				
			this.turnRate += deltaTime/1000 * (0.015 + distanceTurn * 0.1);
			
			var targetAngle = CalculateAngleBetweenTwoPoint(this.x, this.y, CANVAS_W * 0.5, CANVAS_H * 0.5);

			var rotateSpeedThisLoop = this.turnRate * deltaTime;
			if (Math.abs(targetAngle - this.a) <= 180) {
				if (targetAngle > this.a + rotateSpeedThisLoop) {
					this.a += rotateSpeedThisLoop;
				}
				else if (targetAngle < this.a - rotateSpeedThisLoop) {
					this.a -= rotateSpeedThisLoop;
				}
				else {
					this.a = targetAngle;
				}
			}
			else {
				if (targetAngle > this.a) this.a -= rotateSpeedThisLoop;
				else if (targetAngle < this.a) this.a += rotateSpeedThisLoop;
			}
			
			if (this.a > 360) this.a -= 360;
			if (this.a < 0) this.a += 360;
			
			coreSprite.setPosition (cc.p(this.x, this.y));
			coreSprite.setRotation (this.a);
			
			if (this.x < -ENEMY_2_SIZE * 1.5 || this.x > CANVAS_W + ENEMY_2_SIZE * 1.5
			||  this.y < -ENEMY_2_SIZE * 1.5 || this.y > CANVAS_H + ENEMY_2_SIZE * 1.5) {
				this.Spawn();
			}
		}
	}
	this.Explode = function(earnScore) {
		if (this.live == true) {
			this.live = false;
			coreSprite.setVisible (false);
			
			var bulletParticle = cc.ParticleSystem.create("res/GSGamePlay/Enemy2Particle.plist");
			bulletParticle.setPosition(cc.p(this.x, this.y));
			bulletParticle.setAutoRemoveOnFinish(true);
			bulletParticle.setZOrder (91);
			bulletParticle.setBlendAdditive (true);
			bulletParticle.setAngleEqualEmitAngle (true);
			bulletParticle.setParticleCollisionRect(cc.rect(0, 0, CANVAS_W, CANVAS_H));
			bulletParticle.setAirResistant(0.98);
			bulletParticle.setLengthDependOnSpeed (0.1);
			bulletParticle.setStartColor(this.colorRGB);
			bulletParticle.setEndColor(cc.color(this.colorRGB.r * 0.5, this.colorRGB.g * 0.5, this.colorRGB.b * 0.5, 0));
			layer.addChild(bulletParticle);
			
			var explosionParticle = cc.ParticleSystem.create("res/GSGamePlay/Explosion.plist");
			explosionParticle.setPosition(cc.p(this.x, this.y));
			explosionParticle.setAutoRemoveOnFinish(true);
			explosionParticle.setZOrder (92);
			explosionParticle.setBlendAdditive (true);
			explosionParticle.setAirResistant(0.8);
			explosionParticle.setStartColor(cc.color(255, 255, 255, 255));
			explosionParticle.setEndColor(cc.color(this.colorRGB.r, this.colorRGB.g, this.colorRGB.b, 0));
			layer.addChild(explosionParticle);
			
			if (earnScore)  layer.addScore(ENEMY_2_SCORE);
			else 			layer.loseScore(ENEMY_2_DAMAGE);
			
			layer.antiSpam.RequestTargetRemoval (this);
		}
	}
	this.Hit = function (damage) {
		if (damage == null) damage = 1;
		this.hp -= damage;
		if (this.hp <=0) {
			this.Explode(true);
		}
	}
	this.CheckCollisionWithPlayer = function(player, shield) {
		if (this.live) {
			var checkAOE = PLAYER_SAFE_ZONE;
			if (shield.online == true) {
				checkAOE = SHIELD_SAFE_ZONE;
			}
			if (Math.abs (this.x - player.x) < (ENEMY_2_SIZE + checkAOE) * 0.5
			&&  Math.abs (this.y - player.y) < (ENEMY_2_SIZE + checkAOE) * 0.5) {
				this.Explode(shield.online );
			}
		}
	}
}