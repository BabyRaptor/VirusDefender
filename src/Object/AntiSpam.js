var TARGET_RANGE = 300;

function AntiSpam(layer) {
	this.coreSprite = [];

	this.coreSprite[0] = new cc.Sprite("res/GSGamePlay/AntiSpam.png");
	this.coreSprite[0].setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
	this.coreSprite[0].setZOrder(100);
	this.coreSprite[0].setOpacity(0);
	this.coreSprite[0].setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	layer.addChild(this.coreSprite[0]);

	this.coreSprite[1] = new cc.Sprite("res/GSGamePlay/AntiSpam.png");
	this.coreSprite[1].setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
	this.coreSprite[1].setZOrder(100);
	this.coreSprite[1].setOpacity(0);
	this.coreSprite[1].setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	layer.addChild(this.coreSprite[1]);

	this.coreSprite[2] = new cc.Sprite("res/GSGamePlay/AntiSpam.png");
	this.coreSprite[2].setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
	this.coreSprite[2].setZOrder(100);
	this.coreSprite[2].setOpacity(0);
	this.coreSprite[2].setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	layer.addChild(this.coreSprite[2]);
	
	
	this.laserSprite = [];
	
	this.laserSprite[0] = new cc.Sprite("res/GSGamePlay/AntiSpamLaser.png");
	this.laserSprite[0].setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
	this.laserSprite[0].setZOrder(100);
	this.laserSprite[0].setOpacity(0);
	this.laserSprite[0].setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	layer.addChild(this.laserSprite[0]);

	this.laserSprite[1] = new cc.Sprite("res/GSGamePlay/AntiSpamLaser.png");
	this.laserSprite[1].setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
	this.laserSprite[1].setZOrder(100);
	this.laserSprite[1].setOpacity(0);
	this.laserSprite[1].setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	layer.addChild(this.laserSprite[1]);

	this.laserSprite[2] = new cc.Sprite("res/GSGamePlay/AntiSpamLaser.png");
	this.laserSprite[2].setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
	this.laserSprite[2].setZOrder(100);
	this.laserSprite[2].setOpacity(0);
	this.laserSprite[2].setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	layer.addChild(this.laserSprite[2]);
	
	

	this.startX = CANVAS_W * 0.5 + SKILL_2_POSITION_OFFSET_X;
	this.startY = CANVAS_H * 0.5 + SKILL_2_POSITION_OFFSET_Y;

	this.interval = 1200;
	this.timer = 0;
	
	this.targetList = [];

	this.Update = function (deltaTime) {
		if (this.enable) {
			for(var i = 0; i < this.coreSprite.length; i++){
				var temp = this.coreSprite[i].getOpacity() - deltaTime * 0.7;
				if (temp < 0) temp = 0;
				this.coreSprite[i].setOpacity(temp);
			}
	
			var possibleTargets = layer.enemyPool1.concat(layer.enemyPool2.concat(layer.enemyPool3));
			for(var i = possibleTargets.length - 1; i >= 0; i--){
				if (possibleTargets[i].live == false){
					possibleTargets.splice(i, 1);
				}
				else{
					var vector = [possibleTargets[i].x - this.startX, possibleTargets[i].y - this.startY];
					var distance = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);

					if (distance > TARGET_RANGE){
						possibleTargets.splice(i, 1);
					}
				}
			}
			
			for (var i=0; i<possibleTargets.length; i++) {
				if (this.targetList.length < 3) {
					if (this.targetList.indexOf (possibleTargets[i]) != -1) {
						
					}
					else {
						this.targetList.push (possibleTargets[i]);
					}
				}
				else {
					break;
				}
			}
			
			
			for (var i=0; i<this.laserSprite.length; i++) {
				this.laserSprite[i].setOpacity(0);
			}
			for (var i=0; i<this.targetList.length; i++) {
				var target = this.targetList[i];
				var angle = CalculateAngleBetweenTwoPoint(this.startX, this.startY, target.x, target.y);
				var dx = target.x - this.startX;
				var dy = target.y - this.startY;

				var laser = this.laserSprite[i];
				laser.setScaleY(Math.sqrt(dx * dx + dy * dy) / laser.height);
				laser.setRotation(angle);
				laser.setPosition(cc.p((target.x + this.startX) * 0.5, (target.y + this.startY) * 0.5));
				laser.setOpacity(150);
			}
			
			
			this.timer += deltaTime;
			if (this.timer >= this.interval){
				this.timer = 0;
				if (this.targetList.length > 0) {
					myAudio.PlaySound("res/GSGamePlay/Laser.mp3");
				}
				for (var i = this.targetList.length - 1; i >= 0; i--) {
					var target = this.targetList[i];
					var angle = CalculateAngleBetweenTwoPoint(this.startX, this.startY, target.x, target.y);
					var dx = target.x - this.startX;
					var dy = target.y - this.startY;

					var laser = this.coreSprite[i];
					laser.setScaleY(Math.sqrt(dx * dx + dy * dy) / laser.height);
					laser.setRotation(angle);
					laser.setPosition(cc.p((target.x + this.startX) * 0.5, (target.y + this.startY) * 0.5));
					laser.setOpacity(255);
					target.Hit(10);
					
					laser = this.laserSprite[i];
					laser.setOpacity(0);
				}
				this.targetList = [];
			}
		}
	},
	this.Enable = function(en) {
		this.enable = en;
		this.canShowText = en;
	},
	this.RequestTargetRemoval = function (target) {
		var index = this.targetList.indexOf (target);
		if (index != -1) {
			this.targetList.splice (index, 1);
		}
	}
}