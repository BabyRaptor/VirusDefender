var ROCKET_ANIMATION_DELAY = 100;
var ROCKET_SPEED = 0.2;
var ROCKET_TURN_RATE = 0.05;
var ROCKET_DAMAGE = 50;
var ROCKET_SPAWN_RATE = 3000;
var ROCKET_SIZE = 50;

function PriorityUpdate(layer) {
	cc.spriteFrameCache.addSpriteFrames("res/GSGamePlay/Rocket.plist");
	
	this.gameplay = layer;
	this.m_rockets = new Array();
	for (var i=0; i<5; i++) {
		this.m_rockets[i] = new cc.Sprite("#Rocket_0.png");
		this.m_rockets[i].frame = [];
		this.m_rockets[i].frame[0] = cc.spriteFrameCache.getSpriteFrame("Rocket_0.png");
		this.m_rockets[i].frame[1] = cc.spriteFrameCache.getSpriteFrame("Rocket_1.png");
		this.m_rockets[i].frame[2] = cc.spriteFrameCache.getSpriteFrame("Rocket_2.png");
		this.m_rockets[i].frame[3] = cc.spriteFrameCache.getSpriteFrame("Rocket_3.png");
		this.m_rockets[i].setSpriteFrame (this.m_rockets[i].frame[0]);
		
		this.m_rockets[i].live = false;
		this.m_rockets[i].setVisible(false);
		this.m_rockets[i].setZOrder(100);
		this.m_rockets[i].setScale (0.6);
		this.gameplay.addChild(this.m_rockets[i]);	
		
		
		this.m_rockets[i].trailParticle = cc.ParticleSystem.create("res/GSGamePlay/RocketTrail.plist");
		this.m_rockets[i].trailParticle.setZOrder (92);
		this.m_rockets[i].trailParticle.setBlendAdditive (true);
		this.m_rockets[i].trailParticle.stopSystem();
		this.gameplay.addChild(this.m_rockets[i].trailParticle);
	}

	this.startX = CANVAS_W * 0.5 + SKILL_3_POSITION_OFFSET_X;
	this.startY = CANVAS_H * 0.5 + SKILL_3_POSITION_OFFSET_Y;

	this.interval = ROCKET_SPAWN_RATE;
	this.currentTime = ROCKET_SPAWN_RATE;
	
	
	
	this.Enable = function(enable) {
		this.enable = enable;
	}

	this.Update = function (deltaTime) {
		if (this.enable) {
			this.currentTime += deltaTime;
			if (this.currentTime >= this.interval) {
				this.currentTime = 0;
				var shoot = false;
				var possibleTargets = layer.enemyPool1.concat(layer.enemyPool2.concat(layer.enemyPool3));
				for(var i=0; i<possibleTargets.length; i++){
					var enemy = possibleTargets[i];
					if (enemy.live == true){
						var rocket = null;
						for (var j=0; j<this.m_rockets.length; j++) {
							if (this.m_rockets[j].live == false) {
								rocket = this.m_rockets[j];
								break;
							}
						}
						
						if (rocket == null) {
							break;
						}
						else {
							rocket.setPosition(cc.p(this.startX, this.startY));
							rocket.target = enemy;
							rocket.currentSpeed = 0;
							rocket.animationFrame = 0;
							rocket.animationCount = 0;
							rocket.angle = CalculateAngleBetweenTwoPoint(rocket.x, rocket.y, rocket.target.x, rocket.target.y);
							rocket.live = true;
							
							rocket.setRotation (rocket.angle);
							rocket.setVisible(true);
							rocket.trailParticle.resetSystem ();
							
							shoot = true;
						}
					}
				}
				if (shoot) {
					cc.audioEngine.playEffect("res/GSGamePlay/MissileShot.mp3", false);
				}
			}

			for(var i=0; i<this.m_rockets.length; i++){
				var rocket = this.m_rockets[i];

				if (rocket.live) {
					rocket.x += ROCKET_SPEED * deltaTime * Math.sin(rocket.angle * DEG_TO_RAD);
					rocket.y += ROCKET_SPEED * deltaTime * Math.cos(rocket.angle * DEG_TO_RAD);
					
					rocket.animationCount += deltaTime;
					if (rocket.animationCount >= ROCKET_ANIMATION_DELAY) {
						rocket.animationCount = 0;
						rocket.animationFrame ++;
						if (rocket.animationFrame == 4) rocket.animationFrame = 0;
						rocket.setSpriteFrame (rocket.frame[rocket.animationFrame]);
					}
					
					if (rocket.target) {
						if (rocket.target.live == true) {
							var targetAngle = CalculateAngleBetweenTwoPoint(rocket.x, rocket.y, rocket.target.x, rocket.target.y);
							var rotateSpeedThisLoop = ROCKET_TURN_RATE * deltaTime;
							if (Math.abs(targetAngle - rocket.angle) <= 180) {
								if (targetAngle > rocket.angle + rotateSpeedThisLoop) {
									rocket.angle += rotateSpeedThisLoop;
								}
								else if (targetAngle < rocket.angle - rotateSpeedThisLoop) {
									rocket.angle -= rotateSpeedThisLoop;
								}
								else {
									rocket.angle = targetAngle;
								}
							}
							else {
								if (targetAngle > rocket.angle) rocket.angle -= rotateSpeedThisLoop;
								else if (targetAngle < rocket.angle) rocket.angle += rotateSpeedThisLoop;
							}
							
							if (rocket.angle > 360) rocket.angle -= 360;
							if (rocket.angle < 0) rocket.angle += 360;
						}
						else {
							rocket.target = null;
						}
					}
					
					rocket.setPosition (cc.p(rocket.x, rocket.y));
					rocket.setRotation (rocket.angle);
					rocket.trailParticle.setPosition (cc.p(rocket.x, rocket.y));
					
					var possibleTargets = layer.enemyPool1.concat(layer.enemyPool2.concat(layer.enemyPool3));
					for (var j=0; j<possibleTargets.length; j++) {
						var enemy = possibleTargets[j];
						if (enemy.live) {
							if (Math.abs (rocket.x - enemy.x) < ROCKET_SIZE * 0.5
							&&  Math.abs (rocket.y - enemy.y) < ROCKET_SIZE * 0.5) {
								enemy.Hit(ROCKET_DAMAGE);
								this.RocketExplodeAt (rocket.x, rocket.y);
								rocket.trailParticle.stopSystem ();
								rocket.live = false;
								rocket.setVisible (false);
							}
						}
					}
					
					if (rocket.x < 10 || rocket.x > CANVAS_W - 10
					||  rocket.y < 10 || rocket.y > CANVAS_H - 10) {
						rocket.live = false;
						rocket.setVisible(false);
						this.RocketExplodeAt (rocket.x, rocket.y);
						rocket.trailParticle.stopSystem ();
					}
				}
			}
		}
	},
	this.Enable = function(en) {
		this.enable = en;
		this.canShowText = en;
	},
	this.RocketExplodeAt = function (x, y) {
		var explosionParticle = cc.ParticleSystem.create("res/GSGamePlay/Explosion.plist");
		explosionParticle.setPosition(cc.p(x, y));
		explosionParticle.setAutoRemoveOnFinish(true);
		explosionParticle.setZOrder (92);
		explosionParticle.setBlendAdditive (true);
		explosionParticle.setAirResistant(0.8);
		explosionParticle.setStartColor(cc.color(255, 255, 255, 255));
		explosionParticle.setEndColor(cc.color(255, 5, 5, 0));
		layer.addChild(explosionParticle);
		
		var bulletParticle = cc.ParticleSystem.create("res/GSGamePlay/BulletParticle.plist");
		bulletParticle.setPosition(cc.p(x, y));
		bulletParticle.setAutoRemoveOnFinish(true);
		bulletParticle.setZOrder (91);
		bulletParticle.setBlendAdditive (true);
		bulletParticle.setAngleEqualEmitAngle (true);
		bulletParticle.setParticleCollisionRect(cc.rect(0, 0, CANVAS_W, CANVAS_H));
		bulletParticle.setAirResistant(0.98);
		bulletParticle.setLengthDependOnSpeed (0.04);
		bulletParticle.setStartColor(cc.color(255, 50, 50, 255));
		bulletParticle.setEndColor(cc.color(255, 0, 5, 0));
		layer.addChild(bulletParticle);
		
		myAudio.PlaySound("res/GSGamePlay/ExplosionN.mp3");
	}
}