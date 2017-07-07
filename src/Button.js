function Button (plist, buttonNormal, buttonDown, callback) {
	cc.spriteFrameCache.addSpriteFrames(plist);
	
	var buttonSprite = new cc.Sprite("#" + buttonNormal);
	buttonSprite.frame = [];
	buttonSprite.frame[0] = cc.spriteFrameCache.getSpriteFrame(buttonNormal);
	buttonSprite.frame[1] = cc.spriteFrameCache.getSpriteFrame(buttonDown);
	
	this.addToLayer = function (layer) {
		layer.addChild(buttonSprite);
	}
	this.setPosition = function (position) {
		buttonSprite.setPosition (position);
	}
	this.setAnchorPoint = function (anchor) {
		buttonSprite.setAnchorPoint (anchor);
	}
	
	var enable = true;
	this.Show = function () {
		enable = true;
		buttonSprite.setVisible (true);
	}
	this.Hide = function () {
		enable = false;
		buttonSprite.setVisible (false);
	}

	
	var lastTouchPos = null;
	
	cc.eventManager.addListener({
		event: cc.EventListener.TOUCH_ONE_BY_ONE,
		swallowTouches: true,
		onTouchBegan: function (touch, event) {
			if (enable) {
				lastTouchPos = touch.getLocation();
				var buttonRect = buttonSprite.getBoundingBox();
				if (cc.rectContainsPoint(buttonRect, lastTouchPos)) {
					buttonSprite.setSpriteFrame (buttonSprite.frame[1]);
					return true;
				}
			}
			return false;
		},
		onTouchMoved: function (touch, event) {
			if (enable) {
				lastTouchPos = touch.getLocation();
				var buttonRect = buttonSprite.getBoundingBox();
				if (cc.rectContainsPoint(buttonRect, lastTouchPos)) {
					buttonSprite.setSpriteFrame (buttonSprite.frame[1]);
				}
				else {
					buttonSprite.setSpriteFrame (buttonSprite.frame[0]);
				}
			}
		},
		onTouchEnded: function (touch, event) {
			if (enable) {
				var buttonRect = buttonSprite.getBoundingBox();
				if (cc.rectContainsPoint(buttonRect, lastTouchPos)) {
					if (callback) callback();
				}
				buttonSprite.setSpriteFrame (buttonSprite.frame[0]);
			}
		}
	}, buttonSprite);
}