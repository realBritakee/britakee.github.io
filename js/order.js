function math_round_2(x) {
	// return Math.round(x*100)/100;
}
var canvas_obj = {
	min_item_visible_corner: 50,
	bg_img_front: null,
	bg_img_back: null,
	bg_img_border_front: null,
	bg_img_border_front_path: null,
	card_logo_img_front: null,
	card_logo_img_front_top: null,
	card_logo_img_front_left: null,
	card_custom_text_front_top: null,
	card_custom_text_front_left: null,
	card_holder_name_text_front_top: null,
	card_holder_name_text_front_left: null,
};
var order_info = {};
const canvas_virtual_width = 570;
const canvas_virtual_height = 358;
const card_bg_color_options = {
	black: {
		text_color: 'silver',
		logo_color: [192,192,192],
	},
	silver: {
		text_color: '#555555',
		logo_color: [85,85,85],
	},
	gold: {
		text_color: '#555555',
		logo_color: [85,85,85],
	},
	rose: {
		text_color: 'silver',
		logo_color: [105,105,105],
	},
	blackgold: {
		text_color: 'gold',
		logo_color: [255,215,0],
	},
	rainbow: {
		text_color: '#555555',
		logo_color: [85,85,85],
	},
}

var canvas_color_changing=false;
var canvas_frame_loading=false;

function custom_text_filter(text) {
	text=text.trim();
	if (text.length==0) {
		text='(Enter Text)';
	}
	return text;
}

function holdername_text_filter(text) {
	text=text.trim();
	if (text.length==0) {
		text = '(Name Here)';
	}
	return text;
}

function waitForWebfonts(fonts, callback) {
	var loadedFonts = 0;
	var callback_called = false;
	for (var i = 0, l = fonts.length; i < l; ++i) {
		(function(font) {
			if (typeof font == 'string' || (typeof font == 'object' && typeof font.family == 'string')) {
				var node = document.createElement('span');
				node.innerHTML = 'giItT1WQy@!-/#'; // Characters that vary significantly among different fonts
				node.style.position = 'absolute'; // Visible - so we can measure it - but not on the screen
				node.style.left = '-10000px';
				node.style.top = '-10000px';
				node.style.fontSize = '300px'; // Large font size makes even subtle changes obvious
				node.style.fontFamily = 'sans-serif'; // Reset any font properties
				node.style.fontVariant = 'normal';
				node.style.fontStyle = 'normal';
				node.style.fontWeight = 'normal';
				node.style.letterSpacing = '0';
				document.body.appendChild(node);
				var width = node.offsetWidth; // Remember width with no applied web font
				if (typeof font == 'string') {
					node.style.fontFamily = font;
				} else {
					if (typeof font.family != 'undefined') {
						node.style.fontFamily = font.family;
					}
					if (typeof font.weight != 'undefined') {
						node.style.fontWeight = font.weight;
					}
					if (typeof font.style != 'undefined') {
						node.style.fontStyle = font.style;
					}
				}
				var interval = null;
				var checkFont = function() {
					if (node && node.offsetWidth != width) { // Compare current width with original width
						++loadedFonts;
						node.parentNode.removeChild(node);
						node = null;
					}
					if (loadedFonts >= fonts.length) { // If all fonts have been loaded
						if (interval) {
							clearInterval(interval);
						}
						if (loadedFonts == fonts.length) {
							if (!callback_called) {
								callback_called = true;
								callback();
							}
							return true;
						}
					}
				};
				if (!checkFont()) {
					interval = setInterval(checkFont, 50);
				}
			} else {
				++loadedFonts;
			}
		})(fonts[i]);
	}
};

function canvas_text_logo_color_update(bg_color_name) {
	if (typeof bg_color_name != 'string') {
		bg_color_name = $('[name="color_radio"]:checked').val();
	}
	const text_color=card_bg_color_options[bg_color_name].text_color;
	if (typeof canvas_obj.card_holder_name_text_front != 'undefined') {
		canvas_obj.card_holder_name_text_front.set({
			fill: text_color,
		});
	}
	if (typeof canvas_obj.card_number_text_front != 'undefined') {
		canvas_obj.card_number_text_front.set({
			fill: text_color,
		});
	}
	if (typeof canvas_obj.card_validthru_text_front != 'undefined') {
		canvas_obj.card_validthru_text_front.set({
			fill: text_color,
		});
	}
	if (typeof canvas_obj.card_month_year_text_front != 'undefined') {
		canvas_obj.card_month_year_text_front.set({
			fill: text_color,
		});
	}
	if (typeof canvas_obj.card_custom_text_front != 'undefined') {
		canvas_obj.card_custom_text_front.set({
			fill: text_color,
		});
	}
	if (typeof canvas_obj.card_holder_name_text_back != 'undefined') {
		canvas_obj.card_holder_name_text_back.set({
			fill: text_color,
		});
	}
	if (typeof canvas_obj.card_number_text_back != 'undefined') {
		canvas_obj.card_number_text_back.set({
			fill: text_color,
		});
	}
	if (typeof canvas_obj.card_validthru_text_back != 'undefined') {
		canvas_obj.card_validthru_text_back.set({
			fill: text_color,
		});
	}
	if (typeof canvas_obj.card_month_year_text_back != 'undefined') {
		canvas_obj.card_month_year_text_back.set({
			fill: text_color,
		});
	}
	if (typeof canvas_obj.card_authorized_signature_text_back != 'undefined') {
		canvas_obj.card_authorized_signature_text_back.set({
			fill: text_color,
		});
	}
	if (typeof canvas_obj.card_not_valid_unless_signed_text_back != 'undefined') {
		canvas_obj.card_not_valid_unless_signed_text_back.set({
			fill: text_color,
		});
	}
	if (typeof canvas_obj.card_cvv2_text_back != 'undefined') {
		canvas_obj.card_cvv2_text_back.set({
			fill: text_color,
		});
	}
	canvas_load_logo_from_input($('[name="logo_to_card_file"]'), false);
}

function canvas_obj_append() {
	const card_holder_name_default_text = holdername_text_filter($('[name="cardhoder_name"]').val());
	const card_number_default_text = '0000 0000 0000 0000';
	const card_validthru_default_text = 'VALID\nTHRU';
	const card_month_year_default_text = '55/55';
	const card_authorized_signature_default_text = 'Authorized Signature';
	const card_not_valid_unless_signed_default_text = 'Not Valid Unless Signed';
	const card_cvv2_default_text = '555';
	const number_on_front = $('[name="where_cardnumberon"]').val().trim().toLowerCase() == 'front';
	const holdername_on_front = $('[name="where_cardholdernameon"]').val().trim().toLowerCase() == 'front';
	canvas_obj.card_holder_name_text_front = new fabric.Text(card_holder_name_default_text, {
		fill: '#fff',
		fontFamily: 'Copperplate Gothic',
		fontWeight: 300,
		lineHeight: 1.428571429,
		selectable: true,
		evented: true,
		hoverCursor: 'move',
		borderColor: '#fff',
	});
	canvas_obj.card_holder_name_text_front.setControlsVisibility({
		'tl': false,
		'tr': false,
		'bl': false,
		'br': false,
		'ml': false,
		'mr': false,
		'mt': false,
		'mb': false,
		'mtr': false,
	});
	canvas_obj.fabric_front.add(canvas_obj.card_holder_name_text_front);
	canvas_obj.card_holder_name_text_front_left = 88;
	canvas_obj.card_holder_name_text_front_top = 267;
	if (!holdername_on_front) {
		canvas_obj.card_holder_name_text_front.set('opacity', 0);
	}
	
	canvas_obj.card_number_text_front = new fabric.Text(card_number_default_text, {
		fill: '#fff',
		fontFamily: 'Copperplate Gothic',
		fontWeight: 300,
		lineHeight: 1.428571429,
		selectable: false,
		evented: false,
		hoverCursor: 'default',
	});
	canvas_obj.fabric_front.add(canvas_obj.card_number_text_front);
	canvas_obj.card_validthru_text_front = new fabric.Text(card_validthru_default_text, {
		fill: '#fff',
		fontFamily: 'Copperplate Gothic',
		fontWeight: 300,
		lineHeight: 1.2,
		selectable: false,
		evented: false,
		hoverCursor: 'default',
	});
	canvas_obj.fabric_front.add(canvas_obj.card_validthru_text_front);
	canvas_obj.card_month_year_text_front = new fabric.Text(card_month_year_default_text, {
		fill: '#fff',
		fontFamily: 'Copperplate Gothic',
		fontWeight: 300,
		lineHeight: 1.2,
		selectable: false,
		evented: false,
		hoverCursor: 'default',
	});
	canvas_obj.fabric_front.add(canvas_obj.card_month_year_text_front);
	if (!number_on_front) {
		canvas_obj.card_number_text_front.set('opacity', 0);
		canvas_obj.card_validthru_text_front.set('opacity', 0);
		canvas_obj.card_month_year_text_front.set('opacity', 0);
	}
	canvas_obj.card_custom_text_front = new fabric.Text('', {
		fill: '#fff',
		fontFamily: 'Copperplate Gothic',
		fontWeight: 300,
		lineHeight: 1.428571429,
		opacity: 0,
		lockRotation: true,
		cornerStyle: 'circle',
	});
	canvas_obj.card_custom_text_front.setControlsVisibility({
		'tl': true,
		'tr': true,
		'bl': false,
		'br': false,
		'ml': false,
		'mr': false,
		'mt': false,
		'mb': false,
		'mtr': false,
	});
	canvas_obj.fabric_front.add(canvas_obj.card_custom_text_front);
	canvas_obj.card_custom_text_front_left = 50;
	canvas_obj.card_custom_text_front_top = 50;

	canvas_obj.card_authorized_signature_text_back = new fabric.Text(card_authorized_signature_default_text, {
		fill: '#fff',
		fontFamily: 'Copperplate Gothic',
		fontWeight: 300,
		lineHeight: 1.666666667,
		selectable: false,
		evented: false,
		hoverCursor: 'default',
	});
	canvas_obj.fabric_back.add(canvas_obj.card_authorized_signature_text_back);
	canvas_obj.card_not_valid_unless_signed_text_back = new fabric.Text(card_not_valid_unless_signed_default_text, {
		fill: '#fff',
		fontFamily: 'Copperplate Gothic',
		fontWeight: 300,
		lineHeight: 1.666666667,
		selectable: false,
		evented: false,
		hoverCursor: 'default',
	});
	canvas_obj.fabric_back.add(canvas_obj.card_not_valid_unless_signed_text_back);
	canvas_obj.card_cvv2_text_back = new fabric.Text(card_cvv2_default_text, {
		fill: '#fff',
		fontFamily: 'Copperplate Gothic',
		fontWeight: 300,
		lineHeight: 1.2,
		selectable: false,
		evented: false,
		hoverCursor: 'default',
	});
	canvas_obj.fabric_back.add(canvas_obj.card_cvv2_text_back);
	canvas_obj.card_signature_rect_back = new fabric.Rect({
		fill: '#fff',
		selectable: false,
		evented: false,
		hoverCursor: 'default',
	});
	canvas_obj.fabric_back.add(canvas_obj.card_signature_rect_back);
	canvas_obj.card_number_text_back = new fabric.Text(card_number_default_text, {
		fill: '#fff',
		fontFamily: 'Copperplate Gothic',
		fontWeight: 300,
		lineHeight: 1.666666667,
		selectable: false,
		evented: false,
		hoverCursor: 'default',
	});
	canvas_obj.fabric_back.add(canvas_obj.card_number_text_back);
	canvas_obj.card_validthru_text_back = new fabric.Text(card_validthru_default_text, {
		fill: '#fff',
		fontFamily: 'Copperplate Gothic',
		fontWeight: 300,
		// fontFamily: 'Aeonik',
		// fontWeight: 400,
		lineHeight: 1.2,
		selectable: false,
		evented: false,
		hoverCursor: 'default',
	});
	canvas_obj.fabric_back.add(canvas_obj.card_validthru_text_back);
	canvas_obj.card_month_year_text_back = new fabric.Text(card_month_year_default_text, {
		fill: '#fff',
		fontFamily: 'Copperplate Gothic',
		fontWeight: 300,
		lineHeight: 1.666666667,
		selectable: false,
		evented: false,
		hoverCursor: 'default',
	});
	canvas_obj.fabric_back.add(canvas_obj.card_month_year_text_back);
	if (number_on_front) {
		canvas_obj.card_number_text_back.set('opacity', 0);
		canvas_obj.card_validthru_text_back.set('opacity', 0);
		canvas_obj.card_month_year_text_back.set('opacity', 0);
	}
	canvas_obj.card_holder_name_text_back = new fabric.Text(card_holder_name_default_text, {
		fill: '#fff',
		fontFamily: 'Copperplate Gothic',
		fontWeight: 300,
		lineHeight: 1.428571429,
		selectable: false,
		evented: false,
		hoverCursor: 'default',
	});
	canvas_obj.fabric_back.add(canvas_obj.card_holder_name_text_back);
	if (holdername_on_front) {
		canvas_obj.card_holder_name_text_back.set('opacity', 0);
	}
	canvas_text_logo_color_update();
}

function canvas_refresh() {
	canvas_obj.fabric_front.renderAll();
	canvas_obj.fabric_back.renderAll();
}

function canvas_load_logo_from_input($input, make_logo_active) {
	if (typeof make_logo_active != 'boolean') {
		make_logo_active=true;
	}
	const window_url = window.URL || window.webkitURL;
	const input=$input.get(0);
	if (input.files && input.files[0]) {
		const fileName = $input.val().split('/').pop().split('\\').pop();
		const ext = fileName.substring(fileName.lastIndexOf('.') + 1);
		if (ext=='png' || ext=='jpg' || ext=='jpeg' || ext=='svg' ) {
			var img = document.createElement('img');
			img.onload = function() {
				window_url.revokeObjectURL(img.src); // no longer needed, free memory
				if (img.width >= 1200 && img.height >= 2080) {
					$input.closest('.card_editor_top').find('.logo_to_card_editor_resolution').html('<em>High Resolution</em>');
				} else {
					$input.closest('.card_editor_top').find('.logo_to_card_editor_resolution').html('<em>Low Resolution</em>');
				}
				var tmpcnvs = window.temp_img_draw_canvas;
				var tmpcnvs_ctx = tmpcnvs.getContext('2d');
				tmpcnvs_ctx.canvas.width = img.width;
				tmpcnvs_ctx.canvas.height = img.height;
				tmpcnvs_ctx.drawImage(img, 0, 0);
				logo_bg_remove(tmpcnvs_ctx);
				canvas_add_logo(tmpcnvs.toDataURL('image/png'), function() {
					if (!make_logo_active) {
						$('[name="logo_to_card_proportions"]').addClass('doNotSetActive');
					}
					$('.proportions_button.active').trigger('click');
					var canvas_add_logo_height=50;
					var canvas_add_logo_width=Math.round(50*canvas_obj.card_logo_img_front.width/canvas_obj.card_logo_img_front.height);
					if (canvas_add_logo_width>90) {
						canvas_add_logo_width=90;
						canvas_add_logo_height=Math.round(canvas_add_logo_width*canvas_obj.card_logo_img_front.height/canvas_obj.card_logo_img_front.width);
					}
					$('[name="logo_to_card_height"]').val(canvas_add_logo_height);
					$('[name="logo_to_card_width"]').val(canvas_add_logo_width);
					if (!make_logo_active) {
						$('[name="logo_to_card_proportions"]').addClass('doNotSetActive');
					}
					$('.proportions_button').trigger('click');
					canvas_resize();
				}, make_logo_active);
			}
			img.src = window_url.createObjectURL(input.files[0]); // set src to blob url
		}
	}
}

function canvas_add_logo(logo, callback, make_logo_active) {
	if (typeof make_logo_active != 'boolean') {
		make_logo_active=true;
	}
	const canvas_front_container = $('.card_front_side');
	const canvas_front_width = canvas_front_container.outerWidth();
	const canvas_front_height = canvas_front_container.outerHeight();
	fabric.Image.fromURL(logo, function(oImg) {
		if (canvas_obj.card_logo_img_front_left == null) {
			canvas_obj.card_logo_img_front_left = Math.round(70 * canvas_front_width / canvas_virtual_width);
		}
		if (canvas_obj.card_logo_img_front_top == null) {
			canvas_obj.card_logo_img_front_top = Math.round(80 * canvas_front_height / canvas_virtual_height);
		}
		if (canvas_obj.card_logo_img_front != null) {
			canvas_obj.fabric_front.remove(canvas_obj.card_logo_img_front);
			canvas_obj.card_logo_img_front=null;
		}
		canvas_obj.card_logo_img_front = oImg;
		canvas_obj.card_logo_img_front.set({
			selectable: true,
			evented: true,
			borderColor: '#fff',
			hoverCursor: 'move',
			cornerStyle: 'circle',
		});
		canvas_obj.card_logo_img_front.setControlsVisibility({
			'tl': true,
			'tr': true,
			'bl': false,
			'br': false,
			'ml': false,
			'mr': false,
			'mt': false,
			'mb': false,
			'mtr': false,
		});
		canvas_obj.fabric_front.add(canvas_obj.card_logo_img_front);
		canvas_obj.fabric_front.discardActiveObject();
		canvas_obj.fabric_front.setActiveObject(canvas_obj.card_logo_img_front);
		canvas_refresh();
		if (!make_logo_active) {
			canvas_obj.fabric_front.discardActiveObject();
		}
		canvas_resize();
		if (typeof callback == 'function') {
			callback();
		}
	});
}

function logo_bg_remove(ctx) {
	const bg_color_name = $('[name="color_radio"]:checked').val();
	var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height); // pull the entire image into an array of pixel data
	var pix_red_from = 0;
	var pix_red_to = 255;
	var pix_green_from = 0;
	var pix_green_to = 255;
	var pix_blue_from = 0;
	var pix_blue_to = 255;
	var mid_color=0;
	var new_bg_color=0;
	var new_bg_color_alpha_change=true;
	var new_color_r=card_bg_color_options[bg_color_name].logo_color[0];
	var new_color_g=card_bg_color_options[bg_color_name].logo_color[1];
	var new_color_b=card_bg_color_options[bg_color_name].logo_color[2];
	if ($('[name="card_color"]:checked').val()=='blackgold') {
		new_color_r=255;
		new_color_g=215;
		new_color_b=0;
	}
	for (var i = 0; i < imageData.data.length; i += 4) {
		var avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
		imageData.data[i] = avg;
		imageData.data[i + 1] = avg;
		imageData.data[i + 2] = avg;
		mid_color+=avg;
	}
	mid_color/=imageData.data.length/4;
	const chosen_color=$('[name="logo_to_card_bg_color"]').val().toLowerCase();
	const inverted=$('[name="logo_to_card_inversion"]:checked').length>0;
	if (chosen_color.indexOf('white') >= 0) {
		if (inverted) {
			pix_red_to = mid_color;
			pix_green_to = mid_color;
			pix_blue_to = mid_color;
		} else {
			new_bg_color=255;
			pix_red_from = mid_color;
			pix_green_from = mid_color;
			pix_blue_from = mid_color;
		}
	} else if (chosen_color.indexOf('black') >= 0) {
		if (inverted) {
			new_bg_color=255;
			pix_red_from = mid_color;
			pix_green_from = mid_color;
			pix_blue_from = mid_color;
		} else {
			pix_red_to = mid_color;
			pix_green_to = mid_color;
			pix_blue_to = mid_color;
		}
	} else {
		new_bg_color_alpha_change=false;
		if (inverted) {
			pix_red_to = mid_color;
			pix_green_to = mid_color;
			pix_blue_to = mid_color;
		} else {
			new_bg_color=255;
			pix_red_from = mid_color;
			pix_green_from = mid_color;
			pix_blue_from = mid_color;
		}
	}
	for (var i = 0; i < imageData.data.length; i += 4) {
		var avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
		if (imageData.data[i] >= pix_red_from && imageData.data[i] <= pix_red_to &&
			imageData.data[i + 1] >= pix_green_from && imageData.data[i + 1] <= pix_green_to &&
			imageData.data[i + 2] >= pix_blue_from && imageData.data[i + 2] <= pix_blue_to) {
			imageData.data[i] = new_bg_color;
			imageData.data[i + 1] = new_bg_color;
			imageData.data[i + 2] = new_bg_color;
			if (new_bg_color_alpha_change) {
				imageData.data[i + 3] = 0;
			}
		} else {
			imageData.data[i] = new_color_r;
			imageData.data[i + 1] = new_color_g;
			imageData.data[i + 2] = new_color_b;
		}
	}
	ctx.putImageData(imageData, 0, 0); // put the altered data back on the canvas
}

function canvas_load_frame(frame_path, callback) {
	// console.log(canvas_obj.bg_img_border_front_path+' '+frame_path)
	if (canvas_obj.bg_img_border_front==null || canvas_obj.bg_img_border_front_path!=frame_path) {
		canvas_obj.bg_img_border_front_path=frame_path;
		fabric.Image.fromURL(frame_path, function(oImg) {
			if (canvas_obj.bg_img_border_front != null) {
				canvas_obj.fabric_front.remove(canvas_obj.bg_img_border_front);
			}
			canvas_obj.bg_img_border_front = oImg;
			canvas_obj.fabric_front.add(canvas_obj.bg_img_border_front);
			canvas_obj.bg_img_border_front.set({
				selectable: false,
				evented: false,
				hoverCursor: 'default',
				opacity: 1,
			});
			canvas_obj.bg_img_border_front.sendToBack();
			canvas_obj.bg_img_back.sendToBack();
			if (typeof callback == 'function') {
				callback();
			}
			canvas_resize();
		});
	} else {
		canvas_obj.bg_img_border_front.set({
			opacity: 1,
		});
		canvas_refresh();
		if (typeof callback == 'function') {
			callback();
		}
	}
};

function canvas_load_bg(bg_color_name, bg_type, callback) {
	var bg_front_name = window.template_directory_uri+'/images/cards/' + bg_type + '/' + bg_color_name + '.jpg';
	if (typeof window.card_bg == 'object' && typeof window.card_bg[bg_color_name] == 'string') {
		bg_front_name = window.card_bg[bg_color_name];
	}
	var bg_back_name = window.template_directory_uri+'/images/cards/simple/' + bg_color_name + '.jpg';
	// if (bg_color_name == 'blackgold') {
	// 	bg_back_name = window.template_directory_uri+'/images/cards/simple/gold.jpg';
	// }
	fabric.Image.fromURL(bg_front_name, function(oImg) {
		if (canvas_obj.bg_img_front != null) {
			canvas_obj.fabric_front.remove(canvas_obj.bg_img_front);
			canvas_obj.bg_img_front=null;
		}
		canvas_obj.bg_img_front = oImg;
		fabric.Image.fromURL(bg_back_name, function(oImg) {
			canvas_obj.fabric_front.add(canvas_obj.bg_img_front);
			canvas_obj.bg_img_front.set({
				selectable: false,
				evented: false,
				hoverCursor: 'default',
			});
			canvas_obj.bg_img_front.sendToBack();
			if (canvas_obj.bg_img_back != null) {
				canvas_obj.fabric_back.remove(canvas_obj.bg_img_back);
				canvas_obj.bg_img_back=null;
			}
			canvas_obj.bg_img_back = oImg;
			canvas_obj.fabric_back.add(canvas_obj.bg_img_back);
			canvas_obj.bg_img_back.set({
				selectable: false,
				evented: false,
				hoverCursor: 'default',
			});
			canvas_obj.bg_img_back.sendToBack();
			canvas_text_logo_color_update(bg_color_name);
			if (typeof callback == 'function') {
				callback();
			}
		});
	});
}

function canvas_init() {
	const bg_color_name = $('[name="color_radio"]:checked').val();

	canvas_obj.card_template = $('[name="card_template"]').val();

	canvas_obj.fabric_front = new fabric.Canvas('card_front_side_canvas');
	canvas_obj.fabric_front.set({
		selection: false,
		uniScaleKey: null,
	});

	canvas_obj.fabric_front_resize_icon = document.createElement('img');
	canvas_obj.fabric_front_resize_icon.src = "data:image/svg+xml,%3Csvg width='43' height='42' viewBox='0 0 43 42' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='21.5' cy='21' r='21' fill='%23171717'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M28.5 18.5C28.5 19.3284 29.1716 20 30 20C30.8284 20 31.5 19.3284 31.5 18.5V12.5C31.5 11.6716 30.8284 11 30 11H24C23.1716 11 22.5 11.6716 22.5 12.5C22.5 13.3284 23.1716 14 24 14L26.3787 14L13.5 26.8787V24.5C13.5 23.6716 12.8284 23 12 23C11.1716 23 10.5 23.6716 10.5 24.5V30.5C10.5 31.3284 11.1716 32 12 32H18C18.8284 32 19.5 31.3284 19.5 30.5C19.5 29.6716 18.8284 29 18 29H15.6214L28.5 16.1214V18.5Z' fill='%23FEFEFE'/%3E%3C/svg%3E";
	canvas_obj.fabric_front_remove_icon = document.createElement('img');
	canvas_obj.fabric_front_remove_icon.src = "data:image/svg+xml,%3Csvg width='43' height='42' viewBox='0 0 43 42' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='21.5' cy='21' r='21' fill='%23E86136'/%3E%3Cpath d='M28.6205 14.3615V15.3065C28.6205 15.5675 28.409 15.779 28.148 15.779H13.973C13.7121 15.779 13.5005 15.5675 13.5005 15.3065V14.3615C13.5005 14.1006 13.7121 13.889 13.973 13.889H18.2255V12.944C18.2255 12.4221 18.6486 11.999 19.1705 11.999H22.9505C23.4724 11.999 23.8955 12.4221 23.8955 12.944V13.889H28.148C28.409 13.889 28.6205 14.1006 28.6205 14.3615ZM15.2677 29.1413C15.3373 30.1331 16.1634 30.9015 17.1577 30.899H24.9823C25.9765 30.9015 26.8027 30.1331 26.8723 29.1413L27.6755 17.669H14.4455L15.2677 29.1413Z' fill='%23FEFEFE'/%3E%3C/svg%3E";

	fabric.Object.prototype.controls.tl.cursorStyleHandler = function() { return 'pointer'; };
	fabric.Object.prototype.controls.tl.actionHandler = function() {};
	fabric.Object.prototype.controls.tl.mouseDownHandler = function(e, o, x, y) {
		if (typeof o.target.text == 'string') {
			$('.text_to_card_editor_cancel').trigger('click');
		} else {
			$('.logo_to_card_editor_cancel').trigger('click');
		}
	}

	fabric.Object.prototype.controls.tl.render = function(ctx, left, top, styleOverride, fabricObject) {
		var size = this.cornerSize;
		ctx.save();
		ctx.translate(left, top);
		ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
		ctx.drawImage(canvas_obj.fabric_front_remove_icon, -size / 2, -size / 2, size, size);
		ctx.restore();
	};

	fabric.Object.prototype.controls.tr.render = function(ctx, left, top, styleOverride, fabricObject) {
		var size = this.cornerSize;
		ctx.save();
		ctx.translate(left, top);
		ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
		ctx.drawImage(canvas_obj.fabric_front_resize_icon, -size / 2, -size / 2, size, size);
		ctx.restore();
	};

	canvas_obj.fabric_back = new fabric.Canvas('card_back_side_canvas');
	canvas_obj.fabric_back.set({
		selection: false,
		uniScaleKey: null,
	});
	
	canvas_color_changing=true;
	canvas_load_bg(bg_color_name, canvas_obj.card_template, function() {
		fabric.Image.fromURL(window.template_directory_uri+'/images/cards/circuit.png', function(oImg) {
			canvas_obj.circuit_img_front = oImg;
			canvas_obj.fabric_front.add(canvas_obj.circuit_img_front);
			canvas_obj.circuit_img_front.set({
				selectable: false,
				evented: false,
				hoverCursor: 'default',
			});
			fabric.Image.fromURL(window.template_directory_uri+'/images/cards/magnet-stripe.png', function(oImg) {
				canvas_obj.magnet_stripe_img_back = oImg;
				canvas_obj.fabric_back.add(canvas_obj.magnet_stripe_img_back);
				canvas_obj.magnet_stripe_img_back.set({
					selectable: false,
					evented: false,
					hoverCursor: 'default',
				});
				canvas_obj_append();

				canvas_obj.fabric_front.on('object:scaling', function(e) {
					const canvas_front_container = $('.card_front_side');
					const canvas_front_width = canvas_front_container.outerWidth();
					const canvas_front_height = canvas_front_container.outerHeight();
					if (e.target.flipX == true || e.target.flipY == true) {
						e.target.set({
							flipX: false,
							flipY: false,
						});
					}
					if (e.target == canvas_obj.card_custom_text_front) {
						var text_to_card_editor_font_size = Math.round(e.target.fontSize * e.target.scaleX);
						const text_to_card_editor_font_size_min = parseInt($('[name="text_to_card_editor_font_size"]').attr('min'));
						const text_to_card_editor_font_size_max = parseInt($('[name="text_to_card_editor_font_size"]').attr('max'));
						if (text_to_card_editor_font_size < text_to_card_editor_font_size_min) {
							text_to_card_editor_font_size = text_to_card_editor_font_size_min;
						}
						if (text_to_card_editor_font_size > text_to_card_editor_font_size_max) {
							text_to_card_editor_font_size = text_to_card_editor_font_size_max;
						}
						$('[name="text_to_card_editor_font_size"]').val(text_to_card_editor_font_size);
					}
					if (e.target == canvas_obj.card_logo_img_front) {
						$('[name="logo_to_card_width"]').val(Math.round(e.target.scaleX * 100 * canvas_obj.card_logo_img_front.width / canvas_front_width));
						$('[name="logo_to_card_height"]').val(Math.round(e.target.scaleY * 100 * canvas_obj.card_logo_img_front.height / canvas_front_height));
					}
				});
				canvas_obj.fabric_front.on('object:modified', function(e) {
					const canvas_front_container = $('.card_front_side');
					const canvas_front_width = canvas_front_container.outerWidth();
					const canvas_front_height = canvas_front_container.outerHeight();
					if (e.target == canvas_obj.card_custom_text_front) {
						$('[name="text_to_card_editor_text"]').val(canvas_obj.card_custom_text_front.text);
						canvas_obj.card_custom_text_front.scale(1);
						canvas_obj.card_custom_text_front_left = Math.round(canvas_obj.card_custom_text_front.left / canvas_front_width * canvas_virtual_width);
						canvas_obj.card_custom_text_front_top = Math.round(canvas_obj.card_custom_text_front.top / canvas_front_height * canvas_virtual_height);
						canvas_resize();
					}
					if (e.target == canvas_obj.card_logo_img_front) {
						canvas_obj.card_logo_img_front_left = Math.round(canvas_obj.card_logo_img_front.left / canvas_front_width * canvas_virtual_width);
						canvas_obj.card_logo_img_front_top = Math.round(canvas_obj.card_logo_img_front.top / canvas_front_height * canvas_virtual_height);
						canvas_resize();
						$('[name="logo_to_card_width"]').trigger('change');
						if (!$('[name="logo_to_card_proportions"]').prop('checked')) {
							$('[name="logo_to_card_height"]').trigger('change');
						}
					}
					if (e.target == canvas_obj.card_holder_name_text_front) {
						canvas_obj.card_holder_name_text_front_left = Math.round(canvas_obj.card_holder_name_text_front.left / canvas_front_width * canvas_virtual_width);
						canvas_obj.card_holder_name_text_front_top = Math.round(canvas_obj.card_holder_name_text_front.top / canvas_front_height * canvas_virtual_height);
						canvas_resize();
					}
				});
				canvas_obj.fabric_front.on('selection:created', function(e) {
					canvas_obj.fabric_front.uniformScaling = true;
					if (e.selected.length == 1) {
						if (e.selected[0] == canvas_obj.card_logo_img_front) {
							canvas_obj.fabric_front.uniformScaling = $('[name="logo_to_card_proportions"]').prop('checked');
						}
					}
				});

				canvas_obj.fabric_front.on('selection:cleared', function() {
					canvas_obj.fabric_front.uniformScaling = true;
				});
				canvas_resize();
				canvas_color_changing=false;
			});
		});
	});
}

function canvas_resize() {
	const canvas_front_container = $('.card_front_side');
	const canvas_back_container = $('.card_back_side');
	const canvas_front_width = canvas_front_container.outerWidth();
	const canvas_front_height = canvas_front_container.outerHeight();
	const canvas_back_width = canvas_back_container.outerWidth();
	const canvas_back_height = canvas_back_container.outerHeight();
	canvas_obj.fabric_front.setWidth(canvas_front_width);
	canvas_obj.fabric_front.setHeight(canvas_front_height);
	canvas_obj.fabric_back.setWidth(canvas_back_width);
	canvas_obj.fabric_back.setHeight(canvas_back_height);
	fabric.Object.prototype.controls.tl.cornerSize = Math.round(42 * canvas_front_width / canvas_virtual_width);
	fabric.Object.prototype.controls.tl.sizeX = fabric.Object.prototype.controls.tl.cornerSize
	fabric.Object.prototype.controls.tl.sizeY = fabric.Object.prototype.controls.tl.cornerSize
	fabric.Object.prototype.controls.tl.offsetX = -Math.round(fabric.Object.prototype.controls.tl.cornerSize / 2);
	fabric.Object.prototype.controls.tl.offsetY = -Math.round(fabric.Object.prototype.controls.tl.cornerSize / 2);
	fabric.Object.prototype.controls.tr.cornerSize = Math.round(42 * canvas_front_width / canvas_virtual_width);
	fabric.Object.prototype.controls.tr.offsetX = Math.round(fabric.Object.prototype.controls.tr.cornerSize / 2);
	fabric.Object.prototype.controls.tr.offsetY = -Math.round(fabric.Object.prototype.controls.tr.cornerSize / 2);
	fabric.Object.prototype.controls.tr.sizeX = fabric.Object.prototype.controls.tr.cornerSize
	fabric.Object.prototype.controls.tr.sizeY = fabric.Object.prototype.controls.tr.cornerSize
	if (canvas_obj.card_holder_name_text_front_left > canvas_virtual_width - canvas_obj.min_item_visible_corner) {
		canvas_obj.card_holder_name_text_front_left = canvas_virtual_width - canvas_obj.min_item_visible_corner;
	}
	if (canvas_obj.card_holder_name_text_front_top > canvas_virtual_height - canvas_obj.min_item_visible_corner) {
		canvas_obj.card_holder_name_text_front_top = canvas_virtual_height - canvas_obj.min_item_visible_corner;
	}
	if (canvas_obj.card_holder_name_text_front_left + canvas_obj.card_holder_name_text_front.width*canvas_virtual_width/canvas_front_width - canvas_obj.min_item_visible_corner < 0) {
		canvas_obj.card_holder_name_text_front_left = canvas_obj.min_item_visible_corner - canvas_obj.card_holder_name_text_front.width*canvas_virtual_width/canvas_front_width;
	}
	if (canvas_obj.card_holder_name_text_front_top + canvas_obj.card_holder_name_text_front.height*canvas_virtual_height/canvas_front_height - canvas_obj.min_item_visible_corner < 0) {
		canvas_obj.card_holder_name_text_front_top = canvas_obj.min_item_visible_corner - canvas_obj.card_holder_name_text_front.height*canvas_virtual_height/canvas_front_height;
	}
	canvas_obj.card_holder_name_text_front.set({
		left: Math.round(canvas_obj.card_holder_name_text_front_left * canvas_front_width / canvas_virtual_width),
		top: Math.round(canvas_obj.card_holder_name_text_front_top * canvas_front_height / canvas_virtual_height),
		borderScaleFactor: Math.round(3 * canvas_front_width / canvas_virtual_width),
		borderDashArray: [Math.round(6 * canvas_front_width / canvas_virtual_width)],
		fontSize: 28 * canvas_front_height / canvas_virtual_height,
	});
	canvas_obj.card_number_text_front.set({
		fontSize: 28 * canvas_front_height / canvas_virtual_height,
	});
	canvas_obj.card_number_text_front.set({
		left: Math.round(canvas_front_width / 2 - canvas_obj.card_number_text_front.width / 2),
		top: Math.round(178 * canvas_front_height / canvas_virtual_height),
	});
	canvas_obj.card_validthru_text_front.set({
		fontSize: 10 * canvas_front_height / canvas_virtual_height,
	});
	canvas_obj.card_month_year_text_front.set({
		fontSize: 28 * canvas_front_height / canvas_virtual_height,
	});
	canvas_obj.card_validthru_text_front.set({
		left: Math.round(canvas_front_width / 2 - (canvas_obj.card_validthru_text_front.width + 6 * canvas_front_width / canvas_virtual_width + canvas_obj.card_month_year_text_front.width) / 2),
		top: Math.round(canvas_obj.card_number_text_front.top + canvas_obj.card_number_text_front.height + 6 * canvas_front_height / canvas_virtual_height),
	});
	canvas_obj.card_month_year_text_front.set({
		left: Math.round(canvas_obj.card_validthru_text_front.left + canvas_obj.card_validthru_text_front.width + 6 * canvas_front_width / canvas_virtual_width),
		top: Math.round(canvas_obj.card_validthru_text_front.top + canvas_obj.card_validthru_text_front.height / 2 - canvas_obj.card_month_year_text_front.height / 2),
	});
	var card_custom_text_front_font_size = parseInt($('[name="text_to_card_editor_font_size"]').val());
	if (isNaN(card_custom_text_front_font_size)) { card_custom_text_front_font_size = 15; }
	canvas_obj.card_custom_text_front.set({
		fontSize: card_custom_text_front_font_size * canvas_front_height / canvas_virtual_height,
		borderScaleFactor: Math.round(3 * canvas_front_width / canvas_virtual_width),
		borderDashArray: [Math.round(6 * canvas_front_width / canvas_virtual_width)],
		padding: Math.round(3 * canvas_front_width / canvas_virtual_width),
	});
	if (canvas_obj.card_custom_text_front_left > canvas_virtual_width - canvas_obj.min_item_visible_corner) {
		canvas_obj.card_custom_text_front_left = canvas_virtual_width - canvas_obj.min_item_visible_corner;
	}
	if (canvas_obj.card_custom_text_front_top > canvas_virtual_height - canvas_obj.min_item_visible_corner) {
		canvas_obj.card_custom_text_front_top = canvas_virtual_height - canvas_obj.min_item_visible_corner;
	}
	if (canvas_obj.card_custom_text_front_left + canvas_obj.card_custom_text_front.width*canvas_virtual_width/canvas_front_width - canvas_obj.min_item_visible_corner < 0) {
		canvas_obj.card_custom_text_front_left = canvas_obj.min_item_visible_corner - canvas_obj.card_custom_text_front.width*canvas_virtual_width/canvas_front_width;
	}
	if (canvas_obj.card_custom_text_front_top + canvas_obj.card_custom_text_front.height*canvas_virtual_height/canvas_front_height - canvas_obj.min_item_visible_corner < 0) {
		canvas_obj.card_custom_text_front_top = canvas_obj.min_item_visible_corner - canvas_obj.card_custom_text_front.height*canvas_virtual_height/canvas_front_height;
	}
	// if (canvas_obj.card_custom_text_front_left+canvas_obj.card_custom_text_front.width)
	canvas_obj.card_custom_text_front.set({
		left: Math.round(canvas_obj.card_custom_text_front_left * canvas_front_width / canvas_virtual_width),
		top: Math.round(canvas_obj.card_custom_text_front_top * canvas_front_height / canvas_virtual_height),
	});
	if (canvas_obj.card_logo_img_front != null) {
		var card_logo_scale_x = parseInt($('[name="logo_to_card_width"]').val());
		var card_logo_scale_y = parseInt($('[name="logo_to_card_height"]').val());
		if (isNaN(card_logo_scale_x)) { card_logo_scale_x = 50; }
		if (isNaN(card_logo_scale_y)) { card_logo_scale_y = 50; }
		canvas_obj.card_logo_img_front.set({
			borderScaleFactor: Math.round(3 * canvas_front_width / canvas_virtual_width),
			borderDashArray: [Math.round(6 * canvas_front_width / canvas_virtual_width)],
			scaleX: card_logo_scale_x * canvas_front_width / canvas_obj.card_logo_img_front.width / 100,
			scaleY: card_logo_scale_y * canvas_front_height / canvas_obj.card_logo_img_front.height / 100,
		});
		if (canvas_obj.card_logo_img_front_left > canvas_virtual_width - canvas_obj.min_item_visible_corner) {
			canvas_obj.card_logo_img_front_left = canvas_virtual_width - canvas_obj.min_item_visible_corner;
		}
		if (canvas_obj.card_logo_img_front_top > canvas_virtual_height - canvas_obj.min_item_visible_corner) {
			canvas_obj.card_logo_img_front_top = canvas_virtual_height - canvas_obj.min_item_visible_corner;
		}
		if (canvas_obj.card_logo_img_front_left + canvas_virtual_width*card_logo_scale_x/100 - canvas_obj.min_item_visible_corner < 0) {
			canvas_obj.card_logo_img_front_left = canvas_obj.min_item_visible_corner - canvas_virtual_width*card_logo_scale_x/100;
		}
		if (canvas_obj.card_logo_img_front_top + canvas_virtual_height*card_logo_scale_y/100 - canvas_obj.min_item_visible_corner < 0) {
			canvas_obj.card_logo_img_front_top = canvas_obj.min_item_visible_corner - canvas_virtual_height*card_logo_scale_y/100;
		}
		canvas_obj.card_logo_img_front.set({
			left: Math.round(canvas_obj.card_logo_img_front_left * canvas_front_width / canvas_virtual_width),
			top: Math.round(canvas_obj.card_logo_img_front_top * canvas_front_height / canvas_virtual_height),
		});
	}

	canvas_obj.bg_img_front.set({
		left: 0,
		top: 0,
	});
	canvas_obj.bg_img_front.scale(canvas_front_width / canvas_obj.bg_img_front.width);
	if (canvas_obj.bg_img_border_front != null) {
		canvas_obj.bg_img_border_front.set({
			left: 0,
			top: 0,
		});
		canvas_obj.bg_img_border_front.scale(canvas_front_width / canvas_obj.bg_img_border_front.width);
	}
	canvas_obj.circuit_img_front.set({
		left: Math.round(56 * canvas_front_width / canvas_virtual_width),
		top: Math.round(121.9 * canvas_front_height / canvas_virtual_height),
	});
	canvas_obj.circuit_img_front.scale(78 / canvas_obj.circuit_img_front.width * canvas_front_width / canvas_virtual_width);
	canvas_obj.bg_img_back.set({
		left: 0,
		top: 0,
	});
	canvas_obj.bg_img_back.scale(canvas_back_width / canvas_obj.bg_img_back.width);
	canvas_obj.magnet_stripe_img_back.set({
		left: 0,
		top: Math.round(28 * canvas_back_height / canvas_virtual_height),
	});
	canvas_obj.magnet_stripe_img_back.scale(canvas_back_width / canvas_obj.magnet_stripe_img_back.width);
	canvas_obj.card_signature_rect_back.set({
		left: Math.round(24 * canvas_back_width / canvas_virtual_width),
		top: Math.round(108 * canvas_back_height / canvas_virtual_height),
		width: Math.round(348 * canvas_back_width / canvas_virtual_width),
		height: Math.round(72.19 * canvas_back_height / canvas_virtual_height),
	});
	canvas_obj.card_authorized_signature_text_back.set({
		left: Math.round(canvas_obj.card_signature_rect_back.left),
		top: Math.round(canvas_obj.card_signature_rect_back.top + canvas_obj.card_signature_rect_back.height + 6 * canvas_back_width / canvas_virtual_width),
		fontSize: 12 * canvas_back_height / canvas_virtual_height,
	});
	canvas_obj.card_not_valid_unless_signed_text_back.set({
		fontSize: 12 * canvas_back_height / canvas_virtual_height,
	});
	canvas_obj.card_not_valid_unless_signed_text_back.set({
		left: Math.round(canvas_obj.card_signature_rect_back.left + canvas_obj.card_signature_rect_back.width - canvas_obj.card_not_valid_unless_signed_text_back.width),
		top: canvas_obj.card_authorized_signature_text_back.top,
	});
	canvas_obj.card_cvv2_text_back.set({
		fontSize: 28 * canvas_back_height / canvas_virtual_height,
	});
	canvas_obj.card_cvv2_text_back.set({
		left: Math.round(canvas_obj.card_signature_rect_back.left + canvas_obj.card_signature_rect_back.width + 16 * canvas_back_width / canvas_virtual_width),
		top: Math.round(canvas_obj.card_signature_rect_back.top + canvas_obj.card_signature_rect_back.height / 2 - canvas_obj.card_cvv2_text_back.height / 2),
	});
	canvas_obj.card_number_text_back.set({
		left: Math.round(canvas_obj.card_signature_rect_back.left),
		top: Math.round(canvas_obj.card_authorized_signature_text_back.top + canvas_obj.card_authorized_signature_text_back.height + 23 * canvas_back_height / canvas_virtual_height),
		fontSize: 28 * canvas_back_height / canvas_virtual_height,
	});
	canvas_obj.card_validthru_text_back.set({
		left: Math.round(canvas_obj.card_number_text_back.left),
		top: Math.round(canvas_obj.card_number_text_back.top + canvas_obj.card_number_text_back.height + 6 * canvas_back_height / canvas_virtual_height),
		fontSize: 10 * canvas_back_height / canvas_virtual_height,
	});
	canvas_obj.card_month_year_text_back.set({
		fontSize: 28 * canvas_back_height / canvas_virtual_height,
	});
	canvas_obj.card_month_year_text_back.set({
		left: Math.round(canvas_obj.card_validthru_text_back.left + canvas_obj.card_validthru_text_back.width + 6 * canvas_back_width / canvas_virtual_width),
		top: Math.round(canvas_obj.card_validthru_text_back.top + canvas_obj.card_validthru_text_back.height / 2 - canvas_obj.card_month_year_text_back.height / 2),
	});
	canvas_obj.card_holder_name_text_back.set({
		left: Math.round(canvas_obj.card_validthru_text_back.left),
		top: Math.round(canvas_obj.card_validthru_text_back.top + canvas_obj.card_validthru_text_back.height + 8 * canvas_back_height / canvas_virtual_height),
		fontSize: 28 * canvas_front_height / canvas_virtual_height,
	});

	canvas_obj.card_holder_name_text_front.sendToBack();
	canvas_obj.card_custom_text_front.sendToBack();
	if (canvas_obj.card_logo_img_front != null) {
		canvas_obj.card_logo_img_front.sendToBack();
	}
	if (canvas_obj.bg_img_border_front != null) {
		canvas_obj.bg_img_border_front.sendToBack();
	}
	canvas_obj.bg_img_front.sendToBack();
	canvas_refresh();
}

function order_create_ajax(payment_id) {
	$('.payment_modal').removeClass('active');
	$('.email_submitting').addClass('active');
	var form_data=new FormData();
	form_data.append('payment_id', payment_id);
	form_data.append('person_name', order_info.person_name);
	form_data.append('person_email', order_info.person_email);
	form_data.append('address_country', order_info.address_country);
	form_data.append('address_state', order_info.address_state);
	form_data.append('address_city', order_info.address_city);
	form_data.append('address_zipcode', order_info.address_zipcode);
	form_data.append('address_street_house', order_info.address_street_house);
	form_data.append('comment', order_info.comment);
	form_data.append('promo_code', order_info.promo_code);
	if (order_info.card_care) {
		form_data.append('card_care', order_info.card_care);
	}
	form_data.append('card_color', order_info.card_color);
	form_data.append('card_template', order_info.card_template);
	form_data.append('shipping', order_info.shipping);
	form_data.append('total', order_info.total_cost);
	form_data.append('currency', order_info.currency);
	form_data.append('card_person_name', $('[name="order_person_name"]').val());
	form_data.append('card_holder', $('[name="cardhoder_name"]').val());
	form_data.append('card_text', $('[name="text_to_card_editor_text"]').val());
	var input_img=$('[name="logo_to_card_file"]').get(0).files;
	if ( input_img.length==1 ) {
		const ext = input_img[0].name.substring(input_img[0].name.lastIndexOf('.') + 1);
		if (ext=='png' || ext=='jpg' || ext=='jpeg' || ext=='svg' ) {
			form_data.append( 'img_logo', input_img[0], 'logo.'+ext );
		}
	}
	
	canvas_obj.fabric_front.discardActiveObject();
	canvas_obj.fabric_back.discardActiveObject();
	canvas_refresh();

	card_front_side_canvas.toBlob(function(blob) {
		form_data.append('img_front', blob, 'front.png');
		card_back_side_canvas.toBlob(function(blob) {
			form_data.append('img_back', blob, 'back.png');
			form_data.append('action', 'order_create__exec');
			$.ajax({
				method: 'post',
				url: "/wp-admin/admin-ajax.php",
				data: form_data,
				contentType: false,
				processData: false,
				xhr: function() {
					var xhr = new window.XMLHttpRequest();
					xhr.upload.addEventListener('progress', function(evt) {
						if (evt.lengthComputable) {
							var percentComplete = 0;
							if (typeof evt.loaded!='undefined' && typeof evt.total!='undefined') {
								percentComplete=Math.round(evt.loaded / evt.total*10000)/100;
							}
							$('.email_submitting_progress').css('width', Math.round(percentComplete * 100)/100 + 'px');
						}
					}, false);
					return xhr;
				},
				success: function(reply) {
					const payok=reply=='ok';
					if (payok) {
						$('.modal__wrapper .modal_content').removeClass('active');
						$('.payment_success_modal').addClass('active');
					} else {
						$('.payment_verify_text').css('color','red').html('Error saving your order: '+reply+'<br>Payment successfull with id #'+payment_id+'.<br>Please contact us to place your order.');
						$('.payment_verify_preloader').css('visibility', 'hidden');
					}
					$('.order_create_form_button').hide();
					if (payok && typeof fbq == 'function') {
						fbq('track', 'Purchase', {value: order_info.total_cost, currency: order_info.currency});
					}
				},
				error: function() {
					$('.payment_verify_text').css('color','red').html('Error saving your order. Please check Internet connection.<br>Payment successfull with id #'+payment_id+'.<br>Please contact us to place your order.');
					$('.payment_verify_preloader').css('visibility', 'hidden');
					$('.order_create_form_button').hide();
				},
			});
		});
	});
}

$(function() {
	
	var window_resize_timeout = null;
	$(window).on('resize', function() {
		clearTimeout(window_resize_timeout);
		window_resize_timeout = setTimeout(function() {
			canvas_resize();
		}, 300);
	})
	waitForWebfonts([{ family: 'Copperplate Gothic', weight: '300' }], function() {
		canvas_init();
		var card_holder_name_text_front_change_timeout = null;
		$('[name="cardhoder_name"]').on('input cut paste', function() {
			var $input=$(this);
			clearTimeout(card_holder_name_text_front_change_timeout);
			card_holder_name_text_front_change_timeout = setTimeout(function() {
				var canvas_refresh_bool=false;
				if (typeof canvas_obj.card_holder_name_text_front != 'undefined') {
					canvas_obj.card_holder_name_text_front.set('text', holdername_text_filter($input.val()));
					canvas_refresh_bool=true;
				}
				if (typeof canvas_obj.card_holder_name_text_back != 'undefined') {
					canvas_obj.card_holder_name_text_back.set('text', holdername_text_filter($input.val()));
					canvas_refresh_bool=true;
				}
				if (canvas_refresh_bool) {
					canvas_refresh();
				}
			}, 300);
		});
		$('[name="cardhoder_name"]').on('change', function() {
			var $input=$(this);
			var input_text=$input.val().trim();
			if (input_text!=$input.val()) {
				$input.val($input.val().trim()).trigger('input');
			}
		});
	});
	$('[name="where_cardnumberon"]').on('change', function() {
		var op = 0;
		if ($(this).val().trim().toLowerCase() == 'front') {
			op = 1;
		}
		const notop=Math.abs(op - 1);
		canvas_obj.card_number_text_front.set('opacity', op);
		canvas_obj.card_validthru_text_front.set('opacity', op);
		canvas_obj.card_month_year_text_front.set('opacity', op);
		canvas_obj.card_number_text_back.set('opacity', notop);
		canvas_obj.card_validthru_text_back.set('opacity', notop);
		canvas_obj.card_month_year_text_back.set('opacity', notop);
		canvas_refresh();
	});
	$('[name="where_cardholdernameon"]').on('change', function() {
		var op = 0;
		if ($(this).val().trim().toLowerCase() == 'front') {
			op = 1;
		}
		const notop=Math.abs(op - 1);
		canvas_obj.card_holder_name_text_front.set('opacity', op);
		canvas_obj.card_holder_name_text_back.set('opacity', notop);
		canvas_refresh();
	});
	var color_radio_change_timeout=null;
	$('[name="color_radio"]').on('change', function() {
		var $input=$(this);
		const bg_color_name = $('[name="color_radio"]:checked').val();
		clearTimeout(color_radio_change_timeout);
		if (!canvas_color_changing) {
			canvas_color_changing=true;
			canvas_load_bg(bg_color_name, canvas_obj.card_template, function() {
				canvas_resize();
				$('.check_list_border input[type="checkbox"]').first().trigger('change');
				canvas_color_changing=false;
			});
			calc_order_form();
		} else {
			color_radio_change_timeout=setTimeout(function() {
				$input.trigger('change');
			},300);
		}
	});

	var frame_radio_change_timeout=null;
	$('.check_list_border').on('change', 'input[type="checkbox"]', function() {
		var $input = $(this);
		var input_name = $input.attr('name');
		clearTimeout(frame_radio_change_timeout);
		if (!canvas_frame_loading) {
			canvas_frame_loading=true;
			if ($input.prop('checked')) {
				$('.check_list_border input[type="checkbox"]:checked').each(function() {
					var $checked_input = $(this);
					if ($checked_input.attr('name') != input_name) {
						$checked_input.prop('checked', false);
					}
				});
			}
			$input=$('.check_list_border input[type="checkbox"]:checked');
			if ($input.length>0) {
				const card_color = $('[name="color_radio"]:checked').val();
				var frame_path=frames_img[$input.data('frame')].color.silver;
				if (card_color=='blackgold') {
					frame_path=frames_img[$input.data('frame')].color.gold;
				}
				canvas_load_frame(window.template_directory_uri+frame_path, function() {
					canvas_frame_loading=false;
				});
			} else {
				if (canvas_obj.bg_img_border_front!=null) {
					canvas_obj.bg_img_border_front.set({ opacity: 0 });
					canvas_refresh();
				}
				canvas_frame_loading=false;
			}
		} else {
			frame_radio_change_timeout=setTimeout(function() {
				$input.trigger('change');
			}, 300);
		}
	});

	$('.add_logo_to_card').on('click', function() {
		$(this).closest('.adding_button_container').slideUp();
		$(this).closest('.card_logo_text_add_container').find('.logo_to_card_editor').slideDown();
	});
	$('.add_text_to_card').on('click', function() {
		$(this).closest('.adding_button_container').slideUp();
		$(this).closest('.card_logo_text_add_container').find('.text_to_card_editor').slideDown();
		$('[name="text_to_card_editor_text"]').val($('[name="text_to_card_editor_text"]').data('value'));
		canvas_obj.card_custom_text_front.set({
			selectable: true,
			evented: true,
			borderColor: '#fff',
			opacity: 1,
			hoverCursor: 'move',
			text: custom_text_filter($('[name="text_to_card_editor_text"]').val()),
		});
		canvas_obj.fabric_front.discardActiveObject();
		canvas_obj.fabric_front.setActiveObject(canvas_obj.card_custom_text_front);
		canvas_refresh();
	});

	var logo_to_card_editor_title_default_html = $('.logo_to_card_editor_title').html();
	var logo_to_card_editor_resolution_default_html = $('.logo_to_card_editor_title').html();
	var logo_to_card_height_input_default_val = $('[name="logo_to_card_height"]').val();
	var logo_to_card_width_input_default_val = $('[name="logo_to_card_width"]').val();
	var logo_to_card_bg_color_default_parent_drop_html = $('[name="logo_to_card_bg_color"]').val('').closest('.input_box').find('.parent_drop').html();
	$('.logo_to_card_editor_cancel').on('click', function() {
		var $this = $(this);
		$this.closest('.logo_to_card_editor').slideUp();
		$this.closest('.card_logo_text_add_container').find('.add_logo_to_card').closest('.adding_button_container').slideDown();
		$this.closest('.card_editor').find('.first_setting').removeClass('none');
		$this.closest('.card_editor').find('.second_setting').addClass('none');
		$this.closest('.card_editor_top').find('.logo_to_card_editor_title').html(logo_to_card_editor_title_default_html);
		$this.closest('.card_editor_top').find('.logo_to_card_editor_resolution').html(logo_to_card_editor_resolution_default_html);
		$('[for="logo_to_card_file"]').addClass('nonactive');
		$('[name="logo_to_card_bg_color"]').val('').closest('.input_box').find('.parent_drop').html(logo_to_card_bg_color_default_parent_drop_html);
		$('.orderToggleActiveContainer .orderToggleActive').removeClass('active');
		$('.orderToggleActiveContainer input[type="checkbox"]').prop('checked', false).trigger('changed');
		$('[name="logo_to_card_height"]').val(logo_to_card_height_input_default_val);
		$('[name="logo_to_card_width"]').val(logo_to_card_width_input_default_val);
		canvas_obj.fabric_front.remove(canvas_obj.card_logo_img_front);
		canvas_obj.card_logo_img_front = null;
		$('.logo_to_card_file_event').html($('.logo_to_card_file_event').html());
	});
	$('.text_to_card_editor_cancel').on('click', function() {
		canvas_obj.card_custom_text_front_left = 50;
		canvas_obj.card_custom_text_front_top = 50;

		$(this).closest('.text_to_card_editor').slideUp();
		$(this).closest('.card_logo_text_add_container').find('.add_text_to_card').closest('.adding_button_container').slideDown();
		// $('[name="text_to_card_editor_text"]').data('value',$('[name="text_to_card_editor_text"]').val());
		$('[name="text_to_card_editor_text"]').val('');
		canvas_obj.card_custom_text_front.set({
			selectable: false,
			evented: false,
			opacity: 0,
			hoverCursor: 'default',
			text: custom_text_filter($('[name="text_to_card_editor_text"]').val()),
		});
		canvas_obj.fabric_front.discardActiveObject();
		canvas_refresh();
	});

	var card_custom_text_front_change_timeout = null;
	$('[name="text_to_card_editor_font_size"],[name="text_to_card_editor_text"]').on('input cut paste', function() {
		clearTimeout(card_custom_text_front_change_timeout);
		card_custom_text_front_change_timeout = setTimeout(function() {
			canvas_obj.card_custom_text_front.set({
				text: custom_text_filter($('[name="text_to_card_editor_text"]').val()),
			});
			canvas_obj.fabric_front.discardActiveObject();
			canvas_obj.fabric_front.setActiveObject(canvas_obj.card_custom_text_front);
			canvas_resize();
		}, 300);
	});

	$('[name="text_to_card_editor_font_size"]').on('change', function() {
		var $input_font=$('[name="text_to_card_editor_font_size"]');
		$input_font.val($input_font.val().trim());
		var text_to_card_editor_font_size = parseInt($input_font.val());
		if (isNaN(text_to_card_editor_font_size)) { text_to_card_editor_font_size = 15; }
		const text_to_card_editor_font_size_min = parseInt($input_font.attr('min'));
		const text_to_card_editor_font_size_max = parseInt($input_font.attr('max'));
		if (text_to_card_editor_font_size < text_to_card_editor_font_size_min) {
			text_to_card_editor_font_size = text_to_card_editor_font_size_min;
		}
		if (text_to_card_editor_font_size > text_to_card_editor_font_size_max) {
			text_to_card_editor_font_size = text_to_card_editor_font_size_max;
		}
		$input_font.val(text_to_card_editor_font_size).trigger('input');
	});
	
	$('[name="text_to_card_editor_text"]').on('change', function() {
		var $input=$(this);
		var input_text=$input.val().trim();
		if (input_text!=$input.val()) {
			$input.val($input.val().trim()).trigger('input');
		}
		$('[name="text_to_card_editor_font_size"]').trigger('change');
	});

	$('.logo_to_card_file_event').on('change', '[name="logo_to_card_file"]', function() {
		if (this.files && this.files[0]) {
			var $this = $(this);
			const fileName = $this.val().split('/').pop().split('\\').pop();
			const ext = fileName.substring(fileName.lastIndexOf('.') + 1);
			if (ext=='png' || ext=='jpg' || ext=='jpeg' || ext=='svg' ) {
				canvas_load_logo_from_input($this);
				$this.closest('.card_editor').find('.first_setting').addClass('none');
				$this.closest('.card_editor').find('.second_setting').removeClass('none');
				$this.closest('.card_editor_top').find('.logo_to_card_editor_title').html(fileName);
			}
		}
	});
	$('.orderToggleActive').on('click', function() {
		var $this = $(this);
		$this.toggleClass('active');
		$this.closest('.orderToggleActiveContainer').find('input[type="checkbox"]').prop('checked', $this.hasClass('active')).trigger('change');
	});
	$('[name="logo_to_card_proportions"]').on('change', function() {
		var $this=$(this);
		canvas_obj.fabric_front.uniformScaling = true;
		var selected = canvas_obj.fabric_front.getActiveObjects();
		if (selected.length == 1) {
			if (selected[0] == canvas_obj.card_logo_img_front) {
				canvas_obj.fabric_front.uniformScaling = $('[name="logo_to_card_proportions"]').prop('checked');
			}
		}
		canvas_obj.fabric_front.discardActiveObject();
		canvas_obj.fabric_front.setActiveObject(canvas_obj.card_logo_img_front);
		canvas_refresh();
		if ($this.hasClass('doNotSetActive')) {
			canvas_obj.fabric_front.discardActiveObject();
		}
		$this.removeClass('doNotSetActive');
		canvas_refresh();
	});
	$('[name="logo_to_card_inversion"]').on('change', function() {
		// var tmpcnvs = window.temp_img_draw_canvas;
		// var tmpcnvs_ctx = tmpcnvs.getContext('2d');
		// logo_invert(tmpcnvs_ctx);
		// canvas_add_logo(tmpcnvs.toDataURL('image/png'));
		canvas_load_logo_from_input($('[name="logo_to_card_file"]'));
	});

	var card_logo_img_front_change_timeout = null;
	$('[name="logo_to_card_width"],[name="logo_to_card_height"]').on('input cut paste', function() {
		const canvas_front_container = $('.card_front_side');
		const canvas_front_width = canvas_front_container.outerWidth();
		const canvas_front_height = canvas_front_container.outerHeight();
		const props = $('[name="logo_to_card_proportions"]').prop('checked');
		var $width = $('[name="logo_to_card_width"]');
		var card_logo_scale_x = parseInt($width.val());
		var $height = $('[name="logo_to_card_height"]');
		var card_logo_scale_y = parseInt($height.val());
		if (isNaN(card_logo_scale_x)) { card_logo_scale_x = 50; }
		if (isNaN(card_logo_scale_y)) { card_logo_scale_y = 50; }
		const card_logo_scale_x_min = parseInt($('[name="logo_to_card_width"]').attr('min'));
		const card_logo_scale_x_max = parseInt($('[name="logo_to_card_width"]').attr('max'));
		const card_logo_scale_y_min = parseInt($('[name="logo_to_card_height"]').attr('min'));
		const card_logo_scale_y_max = parseInt($('[name="logo_to_card_height"]').attr('max'));
		const pwidth = Math.round(canvas_obj.card_logo_img_front.scaleX * 100 * canvas_obj.card_logo_img_front.width / canvas_front_width);
		const pheight = Math.round(canvas_obj.card_logo_img_front.scaleY * 100 * canvas_obj.card_logo_img_front.height / canvas_front_height);
		if (this.name == 'logo_to_card_width') {
			if (card_logo_scale_x < card_logo_scale_x_min) {
				card_logo_scale_x = card_logo_scale_x_min;
			}
			if (card_logo_scale_x > card_logo_scale_x_max) {
				card_logo_scale_x = card_logo_scale_x_max;
			}
			if (props) {
				card_logo_scale_y = Math.round(card_logo_scale_x * pheight / pwidth);
			}
			$height.val(card_logo_scale_y);
		} else {
			if (card_logo_scale_y < card_logo_scale_y_min) {
				card_logo_scale_y = card_logo_scale_y_min;
			}
			if (card_logo_scale_y > card_logo_scale_y_max) {
				card_logo_scale_y = card_logo_scale_y_max;
			}
			if (props) {
				card_logo_scale_x = Math.round(card_logo_scale_y * pwidth / pheight);
			}
			$width.val(card_logo_scale_x);
		}
		canvas_obj.card_logo_img_front.set({
			scaleX: card_logo_scale_x * canvas_front_width / canvas_obj.card_logo_img_front.width / 100,
			scaleY: card_logo_scale_y * canvas_front_height / canvas_obj.card_logo_img_front.height / 100,
		});
		clearTimeout(card_logo_img_front_change_timeout);
		card_logo_img_front_change_timeout = setTimeout(function() {
			canvas_obj.fabric_front.discardActiveObject();
			canvas_obj.fabric_front.setActiveObject(canvas_obj.card_logo_img_front);
			canvas_refresh();
		}, 300);
	});

	$('[name="logo_to_card_width"],[name="logo_to_card_height"]').on('change', function() {
		const canvas_front_container = $('.card_front_side');
		const canvas_front_width = canvas_front_container.outerWidth();
		const canvas_front_height = canvas_front_container.outerHeight();
		const props = $('[name="logo_to_card_proportions"]').prop('checked');
		var $width = $('[name="logo_to_card_width"]');
		var card_logo_scale_x = parseInt($width.val());
		var $height = $('[name="logo_to_card_height"]');
		var card_logo_scale_y = parseInt($height.val());
		if (isNaN(card_logo_scale_x)) { card_logo_scale_x = 50; }
		if (isNaN(card_logo_scale_y)) { card_logo_scale_y = 50; }
		const card_logo_scale_x_min = parseInt($('[name="logo_to_card_width"]').attr('min'));
		const card_logo_scale_x_max = parseInt($('[name="logo_to_card_width"]').attr('max'));
		const card_logo_scale_y_min = parseInt($('[name="logo_to_card_height"]').attr('min'));
		const card_logo_scale_y_max = parseInt($('[name="logo_to_card_height"]').attr('max'));
		const pwidth = Math.round(canvas_obj.card_logo_img_front.scaleX * 100 * canvas_obj.card_logo_img_front.width / canvas_front_width);
		const pheight = Math.round(canvas_obj.card_logo_img_front.scaleY * 100 * canvas_obj.card_logo_img_front.height / canvas_front_height);
		var trigger_width = true;
		if (this.name == 'logo_to_card_width') {
			trigger_width = true;
			if (card_logo_scale_x < card_logo_scale_x_min) {
				card_logo_scale_x = card_logo_scale_x_min;
			}
			if (card_logo_scale_x > card_logo_scale_x_max) {
				card_logo_scale_x = card_logo_scale_x_max;
			}
			if (props) {
				card_logo_scale_y = Math.round(card_logo_scale_x * pheight / pwidth);
				if (card_logo_scale_y < card_logo_scale_y_min) {
					trigger_width = false;
					card_logo_scale_y = card_logo_scale_y_min;
				}
				if (card_logo_scale_y > card_logo_scale_y_max) {
					trigger_width = false;
					card_logo_scale_y = card_logo_scale_y_max;
				}
				if (!trigger_width) {
					card_logo_scale_x = Math.round(card_logo_scale_y * pwidth / pheight);
				}
			}
		} else {
			trigger_width = false;
			if (card_logo_scale_y < card_logo_scale_y_min) {
				card_logo_scale_y = card_logo_scale_y_min;
			}
			if (card_logo_scale_y > card_logo_scale_y_max) {
				card_logo_scale_y = card_logo_scale_y_max;
			}
			if (props) {
				card_logo_scale_x = Math.round(card_logo_scale_y * pwidth / pheight);
				if (card_logo_scale_x < card_logo_scale_x_min) {
					trigger_width = true;
					card_logo_scale_x = card_logo_scale_x_min;
				}
				if (card_logo_scale_x > card_logo_scale_x_max) {
					trigger_width = true;
					card_logo_scale_x = card_logo_scale_x_max;
				}
				if (trigger_width) {
					card_logo_scale_y = Math.round(card_logo_scale_x * pheight / pwidth);
				}
			}
		}
		$width.val(card_logo_scale_x);
		$height.val(card_logo_scale_y);
		canvas_obj.fabric_front.discardActiveObject();
		canvas_obj.fabric_front.setActiveObject(canvas_obj.card_logo_img_front);
		if (trigger_width) {
			$width.trigger('input');
		} else {
			$height.trigger('input');
		}
	});

});

function get_current_currency() {
	var currency = ($('[name="currency"]').val().split(' ')[0]);
	if (typeof currencies[currency] == 'undefined') {
		currency = $('[name="currency"]').val().split('>')[1];// img lazyload active
	}
	return currency;
}

function calc_order_form() {
	var currency = get_current_currency();
	var tax_percent = 0;
	if (typeof taxes[currency] != 'undefined' && typeof taxes[currency].percent != 'undefined') {
		tax_percent = taxes[currency].percent;
	}
	const card_cost = prices.card[currency];
	const card_color_cost = parseInt($('[name="color_radio"]:checked').closest('div').find('.price_value').html());
	const card_care_cost = parseInt($('[name="card_care"]:checked').closest('div').find('.price_value').html()) || 0;
	const card_production_cost = card_cost + card_color_cost + card_care_cost;
	const card_shipping_cost = parseInt($('[name="card_shipping"]:checked').data('price'));
	const card_discount_value = parseInt($('[name="promo_code"]').data('discount'));
	const card_discount_unit = $('[name="promo_code"]').data('discount-unit');
	
	var card_discount_cost=0;
	if (card_discount_unit=='%' && card_discount_value>=0 && card_discount_value<=100) {
		card_discount_cost=Math.ceil((card_cost + card_color_cost)*card_discount_value/100);
	}
	
	const card_tax_cost = Math.ceil((card_shipping_cost + card_production_cost - card_discount_cost) * tax_percent / 100);
	const card_total_cost = card_production_cost + card_shipping_cost + card_tax_cost - card_discount_cost;
	
	$('.total_card_price').html(card_cost);
	$('.total_mirror_price').html(card_color_cost);
	if (card_color_cost>0) {
		$('.total_mirror_price').closest('li').slideDown();
	} else {
		$('.total_mirror_price').closest('li').slideUp();
	}
	$('.total_mcsum_price').html(card_cost+card_color_cost);
	$('.total_production_price').html(card_production_cost);
	$('.total_discount_price').html(card_discount_cost);
	if (card_discount_cost>0) {
		$('.total_discount_price').closest('li').slideDown();
	} else {
		$('.total_discount_price').closest('li').slideUp();
	}
	$('.total_shipping_price').html(card_shipping_cost);
	$('.total_tax_price').html(card_tax_cost);
	$('.total_sum_price').html(card_total_cost);
	if (tax_percent == 0) {
		$('.total_tax_price').closest('li').css('visibility', 'hidden');
	} else {
		$('.total_tax_price').closest('li').css('visibility', '');
	}
	order_info.currency = currency;
	order_info.card_color = $('[name="color_radio"]:checked').val();
	order_info.card_template = $('[name="card_template"]').val();
	order_info.card_care = $('[name="card_care"]:checked').length > 0;
	order_info.shipping = $('[name="card_shipping"]:checked').val();
	order_info.person_name = $('[name="order_person_name"]').val();
	order_info.person_email = $('[name="order_person_email"]').val();
	order_info.address_country = $('[name="order_address_country"]').val();
	order_info.address_state = $('[name="order_address_state"]').val();
	order_info.address_city = $('[name="order_address_city"]').val();
	order_info.address_zipcode = $('[name="order_address_zipcode"]').val();
	order_info.address_street_house = $('[name="order_address_street_house"]').val();
	order_info.promo_code = $('[name="promo_code"]').val();
	order_info.comment = $('[name="order_comment"]').val();
	order_info.total_cost=card_total_cost;
}

// function order_create_ajax_paypal() {
// 	var form_data=new FormData();
// 	form_data.append('person_name', order_info.person_name);
// 	form_data.append('person_email', order_info.person_email);
// 	form_data.append('address_country', order_info.address_country);
// 	form_data.append('address_state', order_info.address_state);
// 	form_data.append('address_city', order_info.address_city);
// 	form_data.append('address_zipcode', order_info.address_zipcode);
// 	form_data.append('address_street_house', order_info.address_street_house);
// 	form_data.append('comment', order_info.comment);
// 	form_data.append('promo_code', order_info.promo_code);
// 	if (order_info.card_care) {
// 		form_data.append('card_care', order_info.card_care);
// 	}
// 	form_data.append('card_color', order_info.card_color);
// 	form_data.append('card_template', order_info.card_template);
// 	form_data.append('shipping', order_info.shipping);
// 	form_data.append('total', order_info.total_cost);
// 	form_data.append('currency', order_info.currency);
// 	form_data.append('card_person_name', $('[name="order_person_name"]').val());
// 	form_data.append('card_holder', $('[name="cardhoder_name"]').val());
// 	form_data.append('card_text', $('[name="text_to_card_editor_text"]').val());
// 	var input_img=$('[name="logo_to_card_file"]').get(0).files;
// 	if ( input_img.length==1 ) {
// 		const ext = input_img[0].name.substring(input_img[0].name.lastIndexOf('.') + 1);
// 		if (ext=='png' || ext=='jpg' || ext=='jpeg' || ext=='svg' ) {
// 			form_data.append( 'img_logo', input_img[0], 'logo.'+ext );
// 		}
// 	}
//
// 	canvas_obj.fabric_front.discardActiveObject();
// 	canvas_obj.fabric_back.discardActiveObject();
// 	canvas_refresh();
//
// 	card_front_side_canvas.toBlob(function(blob) {
// 		form_data.append('img_front', blob, 'front.png');
// 		card_back_side_canvas.toBlob(function(blob) {
// 			form_data.append('img_back', blob, 'back.png');
// 			form_data.append('paypalcheckout', 'create');
// 			form_data.append('action', 'paypal_payment__init');
// 			fetch("/wp-admin/admin-ajax.php", {
// 				method: 'post',
// 				body: form_data,
// 			})
// 			.then(function(result) {
// 				return result.clone().json();
// 			})
// 			.then(function(data) {
// 				if (typeof data.error != 'undefined') {
// 					alert('Error starting payment: '+data.error);
// 				} else if(typeof data.linkPay != 'undefined') {
// 					window.location.href = data.linkPay;
// 				} else {
// 					alert('Error processing payment');
// 				}
// 			});
// 		});
// 	});
// }

$(function() {
	$('[name="currency"]').on('change', function() {
		var currency = get_current_currency();
		$('.currency_prefix').html(currencies[currency].prefix);
		$('.currency_suffix').html(currencies[currency].suffix);
		$('.currency_code').html(currency);
		$.each(prices.metal, function(i, v) {
			var $price_value = $('.price_card_color_' + i + '_value');
			$price_value.html(v[currency]);
			$price_container = $price_value.closest('.price_block_container');
		});
		$('.card_care_price_value').html(prices.card_care[currency]);
		var checked = true;
		$('[name="card_shipping"]').each(function() {
			var $input = $(this);
			var input_value = $input.val();
			if (typeof prices.shipping[input_value] != 'undefined' && typeof prices.shipping[input_value][currency] != 'undefined') {
				$input.prop('disabled', false).prop('checked', checked).data('price', prices.shipping[input_value][currency]).closest('.card_shipping_container').show();
				checked = false;
			} else {
				$input.prop('disabled', true).prop('checked', false).closest('.card_shipping_container').hide();
			}
		});
		calc_order_form();
	}).trigger('change');
	
	
	$('[name="promo_code"]').on('click input blur focus', function() {
		var $this=$(this);
		var $coupon_input=$this.closest('.coupon_input');
		var this_val=$this.val().trim();
		var this_val_old=$this.data('value');
		if (this_val!=this_val_old) {
			$coupon_input.addClass('coupon_input_apply').removeClass('coupon_input_clear');
		} else {
			$coupon_input.removeClass('coupon_input_apply');
			if (this_val!='') {
				$coupon_input.addClass('coupon_input_clear');
			}
		}
		$coupon_input.find('.alert').removeClass('active');
	});
	$('.promo_code_apply').on('click', function(e) {
		e.preventDefault();
		var $this=$(this);
		var $coupon_input=$this.closest('.coupon_input');
		var $promo_code_input=$coupon_input.find('[name="promo_code"]');
		var this_val=$promo_code_input.val().trim();
		$coupon_input.find('.alert').removeClass('active');
		$promo_code_input.data('discount', 0);
		$promo_code_input.data('discount-unit', '-');
		$coupon_input.removeClass('coupon_input_apply').removeClass('coupon_input_clear');
		$coupon_input.find('.input').addClass('active');
		var form_data=new FormData();
		form_data.append('action', 'promo_code__check');
		form_data.append('promo_code_name', this_val);
		$.ajax({
			method: 'post',
			url: "/wp-admin/admin-ajax.php",
			data: form_data,
			contentType: false,
			processData: false,
			uploadProgress: function(event, positio, total, percentComplete) {
				$('.email_submitting_progress').css('width', Math.round(percentComplete * 100)/100 + 'px');
			},
			success: function(reply) {
				$coupon_input.find('.input').removeClass('active');
				$coupon_input.addClass('coupon_input_apply');
				if (typeof reply.error != 'undefined') {
					$promo_code_input.data('value', '').data('discount', 0).data('discount-unit', '-');
					$coupon_input.find('.alert').addClass('active').text(reply.error);
				} else {
					if (this_val!='') {
						$coupon_input.addClass('coupon_input_clear');
					}
					var reply_unit='-';
					if (reply.unit==1) {
						reply_unit='%';
					}
					$promo_code_input.data('value', this_val).data('discount', reply.value).data('discount-unit', reply_unit);
				}
				calc_order_form();
			},
			error: function() {
				$coupon_input.find('.input').removeClass('active');
				$coupon_input.addClass('coupon_input_apply');
				$coupon_input.find('.alert').addClass('active').text('Please check Internet connection');
			},
		});
	});
	$('.promo_code_clear').on('click', function(e) {
		e.preventDefault();
		var $this=$(this);
		var $coupon_input=$this.closest('.coupon_input');
		var $promo_code_input=$coupon_input.find('[name="promo_code"]');
		$promo_code_input.val('').data('value', '').data('discount', 0).data('discount-unit', '-');
		$coupon_input.removeClass('coupon_input_apply').removeClass('coupon_input_clear');
		calc_order_form();
	});
	
	//coupon search

	// $('.coupon_input input').keyup(function() {
	// 	var val = $(this).val();
	// 	if (val.length >= 1) {
	// 		$(this).parent('.input').addClass('active');
	// 		$(this).closest('.coupon_input').find('.alert').addClass('active');
	// 	} else {
	// 	 $(this).parent('.input').removeClass('active');
	// 	 $(this).closest('.coupon_input').find('.alert').removeClass('active');
	//  }
	// })


	var stripe = Stripe("pk_live_51Hw4iYJFAQeMdV8rwLplq122ZKq8fiL6h201DZRxedJWbtdwY4CEdcW0ZOkw8oPea0qNiY2rOnnsq4HDbWgVv9Ko00CRHiB8UX");
	
	// The items the customer wants to buy
	// Disable the button until we have Stripe set up on the page
	document.querySelector("button").disabled = true;
	var getStripe=function() {
		var form_data = new FormData();
		form_data.append('action', 'stripe_payment__init');
		form_data.append('body', JSON.stringify(order_info));
		fetch("/wp-admin/admin-ajax.php", {
			method: 'post',
			body: form_data,
		})
		.then(function(result) {
			// console.log(result);
			return result.json();
		})
		.then(function(data) {
			// console.log(data);
			if (typeof data.error != 'undefined') {
				alert('Error starting payment: '+data.error);
			} else {
				var elements = stripe.elements();
				var style = {
					base: {
						color: "#32325d",
						fontFamily: 'Arial, sans-serif',
						fontSmoothing: "antialiased",
						fontSize: "16px",
						"::placeholder": {
							color: "#32325d"
						}
					},
					invalid: {
						fontFamily: 'Arial, sans-serif',
						color: "#fa755a",
						iconColor: "#fa755a"
					}
				};
				var card = elements.create("card", { style: style, hidePostalCode : true });
				// Stripe injects an iframe into the DOM
				card.mount("#card-element");
				card.on("change", function(event) {
					// Disable the Pay button if there are no card details in the Element
					document.querySelector("button").disabled = event.empty;
					document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
				});
				var form = document.getElementById("payment-form");
				form.addEventListener("submit", function(event) {
					event.preventDefault();
					// Complete payment when the submit button is clicked
					payWithCard(stripe, card, data.clientSecret);
				});
			}
		});
	}

	// Calls stripe.confirmCardPayment
	// If the card requires authentication Stripe shows a pop-up modal to
	// prompt the user to enter authentication details without leaving your page.
	var payWithCard = function(stripe, card, clientSecret) {
		loading(true);
		stripe
			.confirmCardPayment(clientSecret, {
				payment_method: {
					card: card
				}
			})
			.then(function(result) {
				if (result.error) {
					// Show error to your customer
					showError(result.error.message);
				} else {
					// The payment succeeded!
					orderComplete(result.paymentIntent.id);
				}
			});
	};
	/* ------- UI helpers ------- */
	// Shows a success message when the payment is complete
	var orderComplete = function(paymentIntentId) {
		loading(false);
		// $(".result-message .paymentId").html(paymentIntentId)
		// .setAttribute(
		//   "href",
		//   "https://dashboard.stripe.com/test/payments/" + paymentIntentId
		// );
		// $(".result-message").removeClass("hidden");
		order_create_ajax(paymentIntentId);
		document.querySelector("button").disabled = true;
	};
	// Show the customer the error from Stripe if their card fails to charge
	var showError = function(errorMsgText) {
		loading(false);
		var errorMsg = document.querySelector("#card-error");
		errorMsg.textContent = errorMsgText;
		setTimeout(function() {
			errorMsg.textContent = "";
		}, 4000);
	};
	// Show a spinner on payment submission
	var loading = function(isLoading) {
		if (isLoading) {
			// Disable the button and show a spinner
			document.querySelector("button").disabled = true;
			document.querySelector("#spinner").classList.remove("hidden");
			document.querySelector("#button-text").classList.add("hidden");
			if($('#payment-request-button-paypal').length > 0) {
				$('#payment-request-button-paypal').addClass('disabled');
			}
		} else {
			document.querySelector("button").disabled = false;
			document.querySelector("#spinner").classList.add("hidden");
			document.querySelector("#button-text").classList.remove("hidden");
		}
	};


	// open modal widnow

	$('.step_section form').on('submit', function(e) {
		e.preventDefault();

		var $order_person_name = $(this).find('[name="order_person_name"]');
		var $order_person_email = $(this).find('[name="order_person_email"]');
		var $order_person_country = $(this).find('[name="order_address_country"]');
		var $order_person_state = $(this).find('[name="order_address_state"]');
		var $order_person_city = $(this).find('[name="order_address_city"]');
		var $order_person_zipcode = $(this).find('[name="order_address_zipcode"]');
		var $order_person_street = $(this).find('[name="order_address_street_house"]');

		var isValid = true;
		$('input, textarea').removeClass('error');
		if ($order_person_name.length && $order_person_name.val().length <= 1) {
			isValid = false;
			$order_person_name.addClass('error');
		}
		if ($order_person_email.length && $order_person_email.val().length <= 1) {
			isValid = false;
			$order_person_email.addClass('error');
		}
		if ($order_person_country.length && $order_person_country.val().length <= 1) {
			isValid = false;
			$order_person_country.addClass('error');
		}
		if ($order_person_state.length && $order_person_state.val().length <= 1) {
			isValid = false;
			$order_person_state.addClass('error');
		}
		if ($order_person_city.length && $order_person_city.val().length <= 1) {
			isValid = false;
			$order_person_city.addClass('error');
		}
		if ($order_person_zipcode.length && $order_person_zipcode.val().length <= 1) {
			isValid = false;
			$order_person_zipcode.addClass('error');
		}
		if ($order_person_street.length && $order_person_street.val().length <= 1) {
			isValid = false;
			$order_person_street.addClass('error');
		}

		// isValid=true;
		if (isValid) {
			$(this).find('.step').removeClass('active').next('.step').addClass('active')
				.closest('.modal_content').find('.current_step_row li.active').removeClass('active')
				.next('li').addClass('active');
		}

		$('.shipping_information_block').html(
			'<p>' + $('[name="order_person_name"]').val() + ', ' + $('[name="order_person_email"]').val() + '</p>' +
			'<p>' + $('[name="order_address_country"]').val() + ', ' + $('[name="order_address_state"]').val() + '</p>' +
			'<p>' + $('[name="order_address_city"]').val() + ', ' + $('[name="order_address_zipcode"]').val() + ', ' + $('[name="order_address_street_house"]').val() + '</p>'
		);

		$('.order_card_title').html($('[name="color_radio"]:checked').data('title') + ' ' + $('[name="card_template_title"]').val());

		$('.order_card_preview_front').attr('src', canvas_obj.fabric_front.toDataURL());
		$('.order_card_preview_back').attr('src', canvas_obj.fabric_back.toDataURL());

		calc_order_form();
	});
	
	$('[name="card_shipping"],[name="card_care"]').on('change', function() {
		calc_order_form();
	});
	
	$('.payment_success-close').click(function() {
		$(this).closest('.modal_content').find('.close_modal').click();
	});

	$('.open_order_modal').on('click', function() {
		blockBody(true);
		$('.modal__wrapper').toggleClass('active');
		$('.order_modal').toggleClass('active');
		$('.step').removeClass('active');
		$('.step_1').addClass('active');
		$('.current_step_row li').removeClass('active');
		$('.current_step_row li:first-child').addClass('active');
		if (typeof fbq == 'function') {
			fbq('track', 'InitiateCheckout');
		}
	});
	
	$('#order_agree_checkbox_id').on('change', function(e) {
		if (!$('#order_agree_checkbox_id').prop('checked')) {
			$('.order_agree_checkbox_container').addClass('error');
		} else {
			$('.order_agree_checkbox_container').removeClass('error');
		}
	});
	$('.final_step').on('click', function() {
		if (!$('#order_agree_checkbox_id').prop('checked')) {
			$('.order_agree_checkbox_container').addClass('error');
		} else {
			$('.order_agree_checkbox_container').removeClass('error');
			blockBody(false);
			$(this).closest('.step').removeClass('active').closest('.order_modal').removeClass('active')
				.next('.payment_modal').addClass('active')
				.closest('.modal_content').find('.current_step_row li.active').removeClass('active')
				.prev('li').addClass('active');
				getStripe();
				// order_create_ajax(0);
		}
	});

	$('.back_step').on('click', function() {
		$(this).closest('.step.active').removeClass('active')
			.prev('.step').addClass('active')
			.closest('.modal_content').find('.current_step_row li.active').removeClass('active')
			.prev('li').addClass('active');
	})

	$('.close_modal').on('click', function() {
		blockBody(false);
		$(this).closest('.modal_content').removeClass('active').closest('.modal__wrapper').removeClass('active');
		$(this).closest('.modal__wrapper').find('.step').removeClass('active');
	})

	$('.modal__wrapper').on('click', function(e) {
		if (!$('.modal_content').is(e.target) && $('.modal_content').has(e.target).length === 0) {
			$('.close_modal').click();
		}
	});
	// $('#payment-request-button-paypal').click(function() {
	// 	loading(true);
	// 	order_create_ajax_paypal()
	// });

	function getParameterByName(name, url = window.location.href) {
	    name = name.replace(/[\[\]]/g, '\\$&');
	    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	// PAYPAL
	// var success = getParameterByName('buycomplite');
	// if(success && success == 'y') {
	//
	// 	var paymentId = getParameterByName('paymentId');
	// 	var PayerID = getParameterByName('PayerID');
	// 	var token = getParameterByName('token');
	//
	// 	if(paymentId && PayerID) {
	// 		$('body').addClass('loadexecute');
	// 		var form_data = new FormData();
	// 		form_data.append('paymentId', paymentId);
	// 		form_data.append('PayerID', PayerID);
	// 		form_data.append('token', token);
	// 		form_data.append('paypalcheckout', 'final');
	// 		form_data.append('action', 'paypal_payment__init');
	//
	// 		setTimeout(function() {
	// 			fetch("/wp-admin/admin-ajax.php", {
	// 				method: 'post',
	// 				body: form_data,
	// 			})
	// 			.then(function(result) {
	// 				console.log(result);
	// 				return result.clone().json();
	// 			})
	// 			.then(function(data) {
	// 				console.log(data);
	// 				const payok=typeof data.status != 'undefined' && data.status == 'approved';
	// 				$('body').removeClass('loadexecute');
	// 				// alert(data.status);
	// 				if(payok) {
	// 					$('.modal__wrapper .modal_content').removeClass('active');
	//					$('.payment_success_modal').addClass('active');
	// 				} else {
	// 					alert(data.error);
	// 				}
	// 				if (payok && typeof fbq == 'function') {
	// 					fbq('track', 'Purchase', {value: order_info.total_cost, currency: order_info.currency});
	// 				}
	// 			})
	// 		}, 500);
	// 	}
	// }
});

$(function() {
	if (typeof fbq == 'function') {
		fbq('track', 'AddToCart');
	}
})

var tutorial_modal_slider_init=false;
function showTutorial() {
	$('.modal__wrapper, .tutorial_modal').addClass('active');
	if (!tutorial_modal_slider_init) {
		$('.tutorial_modal_slider').on('beforeChange', function(e,s,c,n) {
			var $slider=$(this);
			var $modal_footer=$slider.closest('.modal_content').find('.tutorial_modal_footer');
			var $next_button=$modal_footer.find('.tutorial_button_next');
			var $skipall_button=$modal_footer.find('.tutorial_button_skipall');
			if (n+1==$slider.find('.slick-slide').length) {
				$next_button.html($next_button.data('final')).addClass('tutorial_button_next_final');
				$skipall_button.finish().fadeOut(200);
			} else {
				$next_button.html($next_button.data('next')).removeClass('tutorial_button_next_final');
				if (window.innerWidth>767) {
					$skipall_button.finish().fadeIn(200);
				} else {
					$skipall_button.finish().fadeOut(200);
				}
			}
		}).on('afterChange', function(e,s,c) {
			var $slider=$(this);
			var $slide=$slider.find('.slick-slide').eq(c);
			$slider.find('video.playing').removeClass('playing').each(function() {
				this.pause();
				this.currentTime=0;
			});
			$video=$slide.find('video:visible');
			if ($video.length) {
				$video.addClass('playing').get(0).play();
			}
		}).slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			swipeToSlide: true,
			speed: 500,
			arrows: false,
			fade: true,
			dots: true,
			appendDots: '.tutorial_modal_slider_dots',
			adaptiveHeight: false,
			autoplay: false,
			infinite: false,
			responsive: [{
				breakpoint : 767,
				settings: {
					fade: false,
				}
			}],
		});
		tutorial_modal_slider_init=true;
	} else {
		$('.tutorial_modal_slider').slick('slickGoTo', 0, true);
	}
}
$('.tutorial_button_next').on('click', function(e) {
	e.preventDefault();
	var $this=$(this);
	if ($this.hasClass('tutorial_button_next_final')) {
		$this.closest('.modal_content').find('.close_modal').click();
	} else {
		$('.tutorial_modal_slider').slick('slickNext');
	}
});
$('.tutorial_button_skipall').on('click', function(e) {
	e.preventDefault();
	$(this).closest('.modal_content').find('.close_modal').click();
});

$('.tutorial_fixed_icon_link').on('click', function(e) {
	e.preventDefault();
	showTutorial();
});

$(function() {
	if (Cookies.get('tutorial_shown')!='true') {
		showTutorial();
		Cookies.set('tutorial_shown', 'true', {sameSite: 'Strict', path: ''});
	}
});