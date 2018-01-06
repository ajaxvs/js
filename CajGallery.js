/*

simple web gallery
@author ajaxvs

We don't need thumbnails anymore.

Usage:
<script src="./CajGallery.js"></script>
<script>var gal = new CajGallery("img_gal_class_id");</script>

*/

//================================================================================

/**
 * Creates gallery for special images.
 * @param {string} imgClass gallery images class attribute.
 * @public
 */
function CajGallery(imgClass) {
	this.imgClass = imgClass;
	
	this.isInit = false;	
	this.aImages = [];
	this.currentImage = null;
	this.bgDiv = null;
	this.fullImage = null;
	this.butPrev = null;
	this.butNext = null;
	
	try {
		document.addEventListener("DOMContentLoaded", this.onWindowLoad.bind(this));	
		window.addEventListener("load", this.onWindowLoad.bind(this));
	} catch (err) {
		console.log("CajGallery doesn't support old IE versions.");
	}
}
//================================================================================

/** @static @public background transparency (1 = opaque) */
CajGallery.bgAlpha = 0.9;
/** @static @public */
CajGallery.fontName = "Verdana";
/** @static @public */
CajGallery.fontSize = "48px";
/** @static @public */
CajGallery.fontColor = "#FFFFFF";

/** @static @public */
CajGallery.nextOnImageClick = true;
/** @static @public */
CajGallery.hideOnImageClick = false;
/** @static @public */
CajGallery.hideOnBgClick = false;

/** @static @public pointer cursor to original images style */
CajGallery.addPointerCursor = true;

//================================================================================

/** @private */
CajGallery.prototype.onWindowLoad = function(e) {
	if (this.isInit) {
		return;
	}
	this.isInit = true;
	
    var aAll = document.getElementsByTagName("img");
	for (var i = 0; i < aAll.length; i++) {
		var img = aAll[i];
		if (img.getAttribute("class") == this.imgClass) {		
			if (CajGallery.addPointerCursor) {
				img.style.cursor = "pointer";
			}
			img.addEventListener("click", this.onImageClick.bind(this));
			this.aImages.push(img);
		}
	}
	
	if (this.aImages.length === 0) {
		console.log("CajGallery can't find images with class = " + this.imgClass);
	}
};

//================================================================================

/** @private */
CajGallery.prototype.onImageClick = function(e) {
	this.currentImage = e.target;
	this.show();
};

//================================================================================

/** @private */
CajGallery.prototype.createUI = function() {
	if (!this.bgDiv) {
		this.bgDiv = document.createElement("div");
		this.bgDiv.style.position = "fixed";
		this.bgDiv.style.left = "0px";
		this.bgDiv.style.top = "0px";
		this.bgDiv.style.width = "100%";
		this.bgDiv.style.height = "100%";
		this.bgDiv.style.backgroundColor = "rgba(0, 0, 0, " + CajGallery.bgAlpha + ")";
		if (CajGallery.hideOnBgClick) {
			this.bgDiv.addEventListener("click", this.hide.bind(this));
		}
		
		this.fullImage = document.createElement("img");
		this.fullImage.style.position = "fixed";
		this.fullImage.style.top = "0";
		this.fullImage.style.bottom = "0";
		this.fullImage.style.left = "0";
		this.fullImage.style.right = "0";
		this.fullImage.style["max-width"] = "100%";
		this.fullImage.style["max-height"] = "100%";
		this.fullImage.style.margin = "auto";
		this.fullImage.style.overflow = "auto";	
		this.fullImage.style["-webkit-user-select"] = "none";
		this.fullImage.addEventListener("click", this.onFullImageClick.bind(this));
		this.bgDiv.appendChild(this.fullImage);
		
		this.butPrev = this.createButton("&lt;", this.onPrevClick.bind(this));
		this.butPrev.style.left = "0px";
		this.centerYButton(this.butPrev);
		
		this.butNext = this.createButton("&gt;", this.onNextClick.bind(this));
		this.butNext.style.right = "0px";
		this.centerYButton(this.butNext);
		
		var butClose = this.createButton("X", this.hide.bind(this));
		butClose.style.right = "5px";
		butClose.style.top = "0px";
		this.bgDiv.appendChild(butClose);
	}
};

//================================================================================

/** @private */
CajGallery.prototype.centerYButton = function(but) {
	but.style.top = "50%";
	but.style["margin-top"] = "-" + parseInt(CajGallery.fontSize) * 0.5 + "px";
};

//================================================================================

/** @private */
CajGallery.prototype.createButton = function(label, onClick) {
	var but = document.createElement("div");
	but.style.position = "fixed";
	but.style.fontFamily = CajGallery.fontName;
	but.style.fontSize = CajGallery.fontSize;
	but.style.color = CajGallery.fontColor;
	but.style.cursor = "pointer";
	but.style["-webkit-user-select"] = "none";
	but.innerHTML = label;
	but.addEventListener("click", onClick);
	return but;
};

//================================================================================

/** @private */
CajGallery.prototype.correctUI = function() {
	if (!this.bgDiv) {
		this.createUI();
	}	
	
	//prev button:
	var i = this.aImages.indexOf(this.currentImage);
	if (this.bgDiv.contains(this.butPrev)) {
		if (i === 0) {
			this.bgDiv.removeChild(this.butPrev);
		}
	} else {
		if (i > 0) {
			this.bgDiv.appendChild(this.butPrev);	
		}		
	}
	
	//next button:
	if (this.bgDiv.contains(this.butNext)) {
		if (i == this.aImages.length - 1) {
			this.bgDiv.removeChild(this.butNext);
		}
	} else {
		if (i < this.aImages.length - 1) {
			this.bgDiv.appendChild(this.butNext);
		}
	}
};

//================================================================================

/** @private */
CajGallery.prototype.setImage = function(img) {
	this.currentImage = img;
	this.correctUI();
	this.fullImage.src = this.currentImage.src;
};

//================================================================================

/** @private */
CajGallery.prototype.onFullImageClick = function(e) {
	e.stopImmediatePropagation();
	if (CajGallery.hideOnImageClick) {
		this.hide(null);
	} else if (CajGallery.nextOnImageClick) {
		var i = this.aImages.indexOf(this.currentImage);
		if (i < this.aImages.length - 1) {
			this.changeImage(i + 1);
		}
	}
};

//================================================================================

/** @private */
CajGallery.prototype.onPrevClick = function(e) {
	e.stopImmediatePropagation();
	var i = this.aImages.indexOf(this.currentImage);
	this.changeImage(i - 1);
};

//================================================================================

/** @private */
CajGallery.prototype.onNextClick = function(e) {
	e.stopImmediatePropagation();
	var i = this.aImages.indexOf(this.currentImage);
	this.changeImage(i + 1);
};

//================================================================================

/** @private */
CajGallery.prototype.changeImage = function(newIndex) {
	if (newIndex === undefined || newIndex === null) {
		newIndex = 0;
	}
	if (newIndex < 0) {
		newIndex = 0;
	}
	if (newIndex >= this.aImages.length) {
		newIndex = this.aImages.length - 1;
	}
	
	this.setImage(this.aImages[newIndex]);	
};

//================================================================================

/** @private */
CajGallery.prototype.show = function(e) {
	if (!this.currentImage) {
		this.hide(null);
		return;
	}
	
	this.correctUI();
	
	if (!document.body.contains(this.bgDiv)) {
		document.body.appendChild(this.bgDiv);		
	}
	
	this.fullImage.src = this.currentImage.src;
};

//================================================================================

/** @private */
CajGallery.prototype.hide = function(e) {
	this.currentImage = null;
	if (this.bgDiv && document.body.contains(this.bgDiv)) {
		document.body.removeChild(this.bgDiv);
	}	
};

//================================================================================