var CANVAS_W = 800;
var CANVAS_H = 600;

var g_gsLoader;
var g_gsGamePlay;


function GoToLoader () {
	if (g_gsLoader == null) 
		g_gsLoader = new GSLoader();
	
	cc.director.runScene(g_gsLoader);
}
function GoToGamePlay () {
	if (g_gsGamePlay == null) {
		g_gsGamePlay = new GSGamePlay();
	}
	cc.director.runScene(new cc.TransitionFade(1, g_gsGamePlay));
}
function ResetGame () {
	g_gsGamePlay = new GSGamePlay();
	cc.director.runScene(new cc.TransitionFade(1, g_gsGamePlay));
}













cc.game.onStart = function(){
    cc.view.enableRetina(false);
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(CANVAS_W, CANVAS_H, cc.ResolutionPolicy.FIXED_HEIGHT);
    cc.view.resizeWithBrowserSize(true);
	
	var winSize = cc.director.getWinSize();
	CANVAS_W = winSize.width;
	CANVAS_H = winSize.height;
	
	cc.LoaderScene.preload(g_preloadList, function () {
        GoToLoader();
    }, this);
};
cc.game.run();