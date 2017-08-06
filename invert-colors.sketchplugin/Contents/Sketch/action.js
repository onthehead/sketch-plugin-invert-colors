var invertColors = function(context){
	var doc = context.document;
	var sels = context.selection;
	if (sels.length > 0) {
		var sets = checkClass(sels);
		for (var i = 0; i < sets.items.length; i++){
			var tar = sets.items[i];
			checkColors(tar.style().fills());
			checkColors(tar.style().borders());
		}
		for (var i = 0; i < sets.texts.length; i++){
			var tar = sets.texts[i];
			changeTextColor(tar, getColor(tar.textColor()));
			checkColors(tar.style().fills());
			checkColors(tar.style().borders());
		}
		for (var i = 0; i < sets.arbds.length; i++){
			var tar = sets.arbds[i];
			if (sets.arbds[i].hasBackgroundColor() === 1){
				changeArtboardColor(tar, getColor(tar.backgroundColor()));
			}
		}
		for (var i = 0; i < sels.length; i++){
			sels[i].select_byExpandingSelection(true, true);
		}
	}
	
	function checkColors(f){
		for (var i = 0; i < f.length; i++){
			var tarF = f[i];
			changeItemColor(tarF, getColor(tarF.color()));
			for (var g = 0; g < tarF.gradient().stops().length; g++){
				var tarG = tarF.gradient().stops()[g];
				changeItemColor(tarG, getColor(tarG.color()));
			}
		}
	}
	
	function changeItemColor(t, c){
		t.color = MSColor.colorWithRed_green_blue_alpha(c.r, c.g, c.b, c.a);
	}
	
	function changeTextColor(t, c){
		t.textColor = MSColor.colorWithRed_green_blue_alpha(c.r, c.g, c.b, c.a);
	}
	
	function changeArtboardColor(t, c){
		t.backgroundColor = MSColor.colorWithRed_green_blue_alpha(c.r, c.g, c.b, c.a);
	}
	
	function getColor(c){ 
		var obj = {};
		obj.r = 1 - c.red();
		obj.g = 1 - c.green();
		obj.b = 1 - c.blue();
		obj.a = c.alpha();
		return obj;
	}
	
	function checkClass(tar){
		var texts = [];
		var items = [];
		var arbds = [];
		for (var i = 0; i < tar.length; i++){
			tar[i].select_byExpandingSelection(false, true);
			
			if (tar[i].class() === MSLayerGroup){
				checkGrouo(tar[i].layers());
			} else {
				assignClass(tar[i]);
			}
		}
		function checkGrouo(gro){
			for (var i = 0; i < gro.length; i++){
				if (gro[i].class() === MSLayerGroup){
					checkGrouo(gro[i].layers());
				} else {
					assignClass(gro[i]);
				}
			}
		}
		function assignClass(lay){
			if (lay.class() === MSArtboardGroup){
				arbds.push(lay);
			} else if (lay.class() === MSTextLayer){
				texts.push(lay);
			} else {
				items.push(lay);
			}
		}
		var obj = {};
			obj.texts = texts;
			obj.items = items;
			obj.arbds = arbds;
		return obj;
	}
}