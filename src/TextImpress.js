var TEXT_ACCEL = 0.00003;

function TextImpress (filePath, x, y, layer) {
	var sprite = cc.Sprite.create(filePath);
	sprite.setPosition( cc.p(x, y));
	sprite.setZOrder (101);
	sprite.setVisible(false);
	sprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	layer.addChild(sprite);
	
	var animationStep = 0;
	var wait = 0;
	var alpha = 0;
	var offsetY = 0;
	var scale = 2;
	var speed = 0;
	
	sprite.setOpacity(alpha);
	sprite.setScale(scale);
	
	this.finish = false;
	this.finishFalling = false;
	
	this.Start = function () {
		animationStep = 1;
		sprite.setVisible(true);
	}
	this.Update = function (deltaTime) {
		if (animationStep == 1) {
			scale -= deltaTime * 0.005;
			if (scale <= 0.8) {
				scale = 0.8;
				animationStep = 2;
				this.finishFalling = true;
			}
			
			alpha += deltaTime * 2.55;
			if (alpha > 255) {
				alpha = 255;
			}
			
			sprite.setScale(scale);
			sprite.setOpacity(alpha);
		}
		else if (animationStep == 2) {
			wait += deltaTime;
			if (wait > 200) {
				animationStep = 3;
			}
		}
		else if (animationStep == 3) {
			speed += TEXT_ACCEL * deltaTime;
			
			offsetY += deltaTime * speed;
			sprite.setPositionY (y + offsetY);
			alpha -= deltaTime * 0.1;
			sprite.setOpacity(alpha);
			
			if (alpha < 0) {
				animationStep = 4;
				this.finish = true;
				layer.removeChild(sprite);
			}
		}
	}
}