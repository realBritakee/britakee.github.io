// input mask
$('.card_info').inputmask('mask', {
	'mask': '99 / 99 / 999'
});


// Ввод только чисел

$(document).on('keydown change keyup', '.num', function() {
	var value = Number($(this).val());
	var max = Number($(this).attr('max'));
	var min = Number($(this).attr('min'));

	if (this.value > max) {
	 this.value = max;
 }

 if (this.value < min) {
	 this.value = '';
	 if ($(this).hasClass('minNumbered')) {
		this.value = min;
	}
}
});

$(document).on('keydown change keyup', '.onlyNum', function() {

})
// Получаем ширину скрола
var scrollWidth;
function getScrollBarWidth() {
	let $divs = $('<div class="div1" style="width: 100vw; overflow-y: scroll;"><div class="div2" style="width: 100%;"></div></div>');
	$('body').append($divs);
	let width1 = $('.div1').width(),
	width2 = $('.div2').width();
	scrollWidth = width1 - width2;
	$divs.remove();
}

$(function() {
	getScrollBarWidth();
});

function bodyScroll() {
	if ($('html').hasClass('no-scroll')) {
		let scrollTop = $('html').attr('data-scroll');
		if (scrollTop != 0) {
			$('.header__blured').addClass('active');
		}
	} else {
		let scrollTop = $(document).scrollTop();
		if (scrollTop == 0) {
			$('.header__blured').removeClass('active');
		}
	}
}

// blocking scroll for page
function blockBody(enable) {
	if (typeof enable == 'undefined') {
		enable=!$('html').hasClass('no-scroll');
	}
	var windowHeight = $(window).innerHeight();
	var htmlHeight = $('html').innerHeight();

	if (enable) {
		let scrollTop = $(document).scrollTop();
		if (windowHeight >= htmlHeight) {
			$('html').addClass('no-scroll').addClass('no-scroll-fixed');
		} else {
			$('html').addClass('no-scroll');
		}
		$('html').css({
			top: '-' + scrollTop + 'px'
		});
		$('html').attr('data-scroll', scrollTop);
	} else {
		let scrollTop = $('html').attr('data-scroll');
		if (windowHeight >= htmlHeight) {
			$('html').removeClass('no-scroll').removeClass('no-scroll-fixed');
		} else {
			$('html').removeClass('no-scroll');
		}
		$('html').attr('style', '');
		$(document).scrollTop(scrollTop);
	}

	bodyScroll();
}

// height viewport
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

let vhr = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vhr', `${vhr}px`)

window.addEventListener('resize', () => {
	vhr = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vhr', `${vhr}px`);
});

function clickMenu() {
	$('.open_menu').toggleClass('active');
	$('.hidden_menu').toggleClass('active');
	if ($('body').hasClass('white_page')) {
		$('.header').toggleClass('active');
	}
	blockBody();
}

function headerChange() {
	var scrollTop = $(document).scrollTop();
	if (scrollTop > 0) {
		$('.header__blured').addClass('active');
	} else {
		$('.header__blured').removeClass('active');
	}
	bodyScroll();
}

function scrollbarAnimation() {
	let scrollTop = $(document).scrollTop();
	var result;
	var scrollThumbHeight;
	$('.FAQ__content_parent').each(function() {
		var thisIndex = $(this).index();
		var blockTop = $(this).offset().top;
		var blockHeight = $(this).innerHeight();
		if (scrollTop > blockTop - 305) {
			$('.FAQ__navigation').find('li a.active').removeClass('active');
			$('.FAQ__navigation').find('li').eq(thisIndex).find('a').addClass('active');
			var block = $('.FAQ__navigation').find('a.active').parent('li');
			var itemOffset = block.offset().top;
			var blockOffset = block.closest('.FAQ__navigation').offset().top;
			scrollThumbHeight = block.innerHeight();
			if (thisIndex == 0) {
				result = 0;
			} else {
				result = itemOffset - blockOffset;
			}
		}
	});
	$('.scroll_thumb').css({transform: 'translateY(' + result + 'px)', height: scrollThumbHeight});
}

function sliderCreate() {
	if ($('.slider__wrapper').length) {
		$('.slider__wrapper').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			speed: 1500,
			arrows: false,
			fade: true,
			dots: true,
			dotsClass: 'customDots',
			adaptiveHeight: false,
			autoplay: true,
			autoplaySpeed: 7000,
		});
	}

	if ($('.card__wrapper').length) {
		$('.card__wrapper').on('afterChange', function(event, slick, currentSlide, nextSlide){
			$('.card_slider .card_slider_button').attr('href', $('.card_slider .slick-active .best_sellers_card_img').data('link'));
		}).slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			speed: 1000,
			prevArrow: $('.card_prev'),
			nextArrow: $('.card_next'),
			dotsClass: 'customDots',
			dots: true,
			infinite: false,
			variableWidth: true,
			responsive: [
			{
				breakpoint: 760,
				settings: {
					arrows: false,
				}
			}],
		}).trigger('afterChange');
	}
}

function formatNumber() {
	if ($('.viewed').length) {
		$('.viewed .text').each(function() {
			var num = $(this).text();
			let formatter = new Intl.NumberFormat("ru");
			var formatted = formatter.format(num);
			$(this).html(formatted);
		});
	}
}

function cardHeightBlock() {
	if ($('.category_card .card_choose__row').length) {
		if (window.innerWidth > 991) {
			$('.category_card').each(function() {
				var $this=$(this);
				var $card_row = $this.find('.card_choose__row');
				var $card = $card_row.find('.card');
				var cardCount = $card.length;
				var $card_footer_button = $this.find('.category_card_footer .white_button');
				var rowCount = 0;
				var itemHeight = 0;
				rowCount = Math.ceil(cardCount / 3);
				if (cardCount > parseInt($card_row.attr('data-show'))) {
					rowCount = 2;
				} else {
					$card_footer_button.hide();
				}
				itemHeight = $card.innerHeight() + parseFloat($card.css('margin-bottom'));
				$card_row.css({height: (itemHeight * rowCount) + 'px'});
			});
		} else {
			$('.category_card').each(function() {
				var $this=$(this);
				var $card_row = $this.find('.card_choose__row');
				$card_row.css({height: ''});
				$card_row.find('.card').css({display: ''});
			});
		}
	} else if ($('.card__choose__section').length) {
		$('.card__choose__section').each(function() {
			var blockWrapper =	$(this).find('.card_choose__row');
			var itemCount;
			var ItemHeight;
			var blockInner = blockWrapper.find('.card__inner').innerHeight();
			if (window.innerWidth > 1200) {
				itemCount = blockWrapper.attr('data-show') / 2;
				ItemHeight = $('.card').innerHeight() + 54;
			} else {
			 itemCount = blockWrapper.attr('data-show');
			 ItemHeight = $('.card').innerHeight() + 37;
		 }

		 blockWrapper.css({
			height: ItemHeight * itemCount + 'px'
		});
	 });
	}
}

function maxFieldInput() {
	$('.field_show').each(function() {
		var maxField = $(this).attr('maxlength');
		var currentField = $(this).val().trim().length;
		$(this).prev('.pre_input_text').find('.max_field').html(maxField)
		.prev('.field').html(currentField);
	})
}

// swiped and close

if	($('#swiper_close').length) {
	$("#swiper_close").swipe( {

		swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
			if (direction == 'down' && window.innerWidth < 1270) {
				$(this).closest('.card__settings_section').removeClass('active');
			}
		},

		threshold: 15
	});
}

// add color for "choose background for logo" input
function filledColor() {
	$('.color_buble').each(function() {
		if ($(this).attr('data-color')=='transparent') {
			$(this).css('visibility', 'hidden');
		} else {
			$(this).css('background-color', $(this).attr('data-color'));
		}
	})
}

// change tab function
function changeTab() {
	var index = $('.nav__item.active').index();
	$('.card__settings_item.active').removeClass('active');
	$('.card__settings_item').eq(index).addClass('active');
}

/************************************** Event function ******************************/

/*menu open*/
$('.open_menu').click(function() {
	clickMenu();
});

/*header change after scroll*/
$(document).scroll(function() {
	headerChange();
	/* animation scroll on FAQ section*/
	scrollbarAnimation();
});

$(window).on('resize', function() {
	// block width card list height
	cardHeightBlock();
});

$(document).ready(function() {
	$(document).scroll();
	// activated sliders
	sliderCreate();
	// formatted numbers of view
	formatNumber();
	// character counter in input
	maxFieldInput();
	// add color for "choose background for logo" input
	filledColor();
	$(window).trigger('resize');
})


/*toggle like*/
$(document).on('click', '.best_sellers_card_like', function() {
	var $this=$(this);
	var $this_value=$this.find('.best_sellers_card_like_value');
	var card_name=$this.closest('.best_sellers_card').data('card-name');
	$this.toggleClass('active');
	if ($this.hasClass('active')) {
		$this_value.html(parseInt($this_value.html())+1);
		Cookies.set(card_name+'_like', 1, { sameSite: 'strict' });
	} else {
		Cookies.remove(card_name+'_like', { sameSite: 'strict' });
		$this_value.html(parseInt($this_value.html())-1);
	}
});

/*color change in card choose*/

if ($('.category_card .card_choose__row').length) {
	$('.best_sellers_card_color').on('click', function(e) {
		e.preventDefault();
		var $this=$(this);
		const card_color=$this.data('color-name');
		if (!$this.hasClass('active')) {
			var $category=$this.closest('.category_card');
			$category.find('.color.active').removeClass('active');
			$category.find('.color[data-color-name="'+card_color+'"]').addClass('active');
			$category.find('.best_sellers_card').each(function() {
				var $card=$(this);
				const card_name=$card.data('card-name');
				$card.data('card-color', card_color).attr('data-card-color', card_color).find('.best_sellers_card_bg').attr('src', $card.data('metal-'+card_color));
				$card.find('.best_sellers_card_link').attr('href','sites/order/order.html?template='+card_name+'&color='+card_color);
			});
		}
	});
} else {
	$('.best_sellers_card_color').on('click', function() {
		var $this=$(this);
		if (!$this.hasClass('active')) {
			var $card=$this.closest('.best_sellers_card');
			const card_color=$this.data('color-name');
			const card_name=$card.data('card-name');
			$this.closest('.color__row').find('.color.active').removeClass('active');
			$this.addClass('active');
			$card.data('card-color', card_color).attr('data-card-color', card_color).find('.best_sellers_card_bg').attr('src', window.template_directory_uri+'/images/cards/'+card_name+'/'+card_color+'.jpg');
			$card.find('.best_sellers_card_link').attr('href','sites/order/order.html?template='+card_name+'&color='+card_color);
		}
	});
}

/*load more card design*/
var animationReturn = false;
if ($('.category_card .card_choose__row').length) {
	$('.category_card .white_button_load_more_event').on('click', function() {
		if (animationReturn) {
			return;
		} else {
			animationReturn = true;
		}
		var $this=$(this);
		var $card_row = $this.closest('.category_card').find('.card_choose__row');
		var $card = $card_row.find('.card');
		var cardCount = $card.length;
		var $card_footer_button = $this.find('.category_card_footer .white_button');
		var rowCount = 0;
		var itemHeight = 0;
		rowCount = Math.ceil(cardCount / 3);
		itemHeight = $card.innerHeight() + parseFloat($card.css('margin-bottom'));
		if ($card_row.toggleClass('active').hasClass('active')) {
			$this.html($this.data('see-less'));
			$card.css({display:''});
		} else {
			rowCount = 2;
			$this.html($this.data('load-more'));
		}
		$card_row.css({height: itemHeight * rowCount + 'px'});
		animationReturn = false;
	});
} else {
	$('.card__choose__section .white_button_load_more_event').on('click', function() {
		if (animationReturn) {
			return;
		} else {
			animationReturn = true;
		}
		var blockWrapper =	$(this).closest('.card__choose__section').find('.card_choose__row');
		var itemCount;
		var ItemHeight;
		var blockInner = blockWrapper.find('.card__inner').innerHeight();
		if (window.innerWidth > 1200) {
			itemCount = blockWrapper.attr('data-show') / 2;
			ItemHeight = $('.card').innerHeight() + 54;
		} else {
			itemCount = blockWrapper.attr('data-show');
			ItemHeight = $('.card').innerHeight() + 37;
		}
		if (blockWrapper.hasClass('active')) {
			blockWrapper.css({height: ItemHeight * itemCount + 'px'});
			animationReturn = false;
			blockWrapper.removeClass('active');
			$(this).html('Load More');
		} else {
			blockWrapper.css({height: blockInner + 'px'});
			animationReturn = false;
			blockWrapper.addClass('active');
			$(this).html('See Less');
		}
	});
}

if ($('.category_explore_items_scroll').length) {
	$('.category_explore_items_scroll').on('scroll', function() {
		var $this=$(this);
		var $arrows=$this.closest('.category_explore').find('.category_explore_arrows');
		var $arrow_left=$arrows.find('.category_explore_arrow_left');
		var $arrow_right=$arrows.find('.category_explore_arrow_right');
		// var $this_items=$this.find('.category_explore_items');
		if ($this.scrollLeft()>0) {
			$arrow_left.addClass('active');
		} else {
			$arrow_left.removeClass('active');
		}
		if ($this.get(0).scrollWidth-$this.scrollLeft()>$this.innerWidth()) {
			$arrow_right.addClass('active');
		} else {
			$arrow_right.removeClass('active');
		}
	}).trigger('scroll');
	var category_explore_arrow_scroll_interval=null;
	$('.category_explore_arrow_left,.category_explore_arrow_right').on('click', function(e) {
		e.preventDefault();
	});
	$('.category_explore_arrow_left,.category_explore_arrow_right').on('touchstart mousedown', function(e) {
		var e = event || window.event;
		e.preventDefault && e.preventDefault();
		e.stopPropagation && e.stopPropagation();
		e.cancelBubble = true;
		e.returnValue = false;
		var $this=$(this);
		if ($this.hasClass('active')) {
			var $category_explore_items_scroll=$('.category_explore_items_scroll');
			var step=10;
			if ($(this).hasClass('category_explore_arrow_left')) {
				step=-step;
			}
			category_explore_arrow_scroll_interval=setInterval(function() {
				if ($this.hasClass('active')) {
					$category_explore_items_scroll.scrollLeft($category_explore_items_scroll.scrollLeft()+step);
				} else {
					clearInterval(category_explore_arrow_scroll_interval);
				}
			}, 10);
		}
		return false;
	});
	$('body').on('touchend mouseup', function() {
		clearInterval(category_explore_arrow_scroll_interval);
	});
	
	var category_explore_items_scroll_slick_config={
		slidesToShow: 6,
		slidesToScroll: 1,
		swipeToSlide: true,
		speed: 500,
		arrows: true,
		fade: false,
		dots: false,
		appendArrows: '.category_explore_arrows_slick',
		adaptiveHeight: false,
		autoplay: false,
		infinite: false,
		responsive: [
			{
				breakpoint: 9999,
				settings: {
					slidesToShow: 6,
				},
			},
			{
				breakpoint: 1270,
				settings: {
					slidesToShow: 5,
				},
			},
			{
				breakpoint: 991,
				settings: 'unslick',
			},
		]
	};
	
	$('.category_explore_items_scroll').slick(category_explore_items_scroll_slick_config);
	$(window).on('resize', function(e) {
		if ($(window).innerWidth()>991) {
			$('.category_explore_items_scroll:not(.slick-initialized)').slick(category_explore_items_scroll_slick_config);
		}
});
}

/* open/close FAQ question */
var animationReturnFAQ = false;
$('.FAQ__question-parent').click(function() {
	if (animationReturnFAQ) {
		return;
	} else {
		animationReturnFAQ = true;
	}
	$(this).closest('.FAQ__question_item').toggleClass('active');
	$(this).siblings('.FAQ__question-answer').slideToggle(function() {
		animationReturnFAQ = false;
	})
});

/*FAQ anchor*/

$('.FAQ__navigation a').on('click', function(e) {
	e.preventDefault();
	var id = $(this).attr('href');
	$(this).closest('ul').find('a.active').removeClass('active');
	$(this).addClass('active');
	var height = $(id).offset().top - 200;
	$('body,html').animate({scrollTop: height}, 1000);
})

$('.scroll_link').on('click', function(e) {
	var id = $(this).attr('href').split('#');
	if (id.length>1) {
		id='#'+id[1];
	} else {
		id='';
	}
	if (id.length && $(id).length) {
		e.preventDefault();
		$('body,html').animate({scrollTop: ($(id).offset().top-200)+'px'}, 1000);
	}
})

/*dropdown*/
$(document).on('click', '.parent_drop', function() {
	if ($(this).closest('.dropdown').hasClass('active')) {
		$(this).closest('.dropdown').removeClass('active');
	} else {
		if ($(this).closest('.step_section').length) {
			$(this).closest('.step_section').find('.dropdown').removeClass('active');
		}
		$(this).closest('.dropdown').addClass('active');
	}
});

/*dropdown choose*/
$(document).on('click', '.child_drop li', function() {
	var $this=$(this);
	var value = $this.html();
	var text = $this.text();
	var $dropdown=$this.closest('.dropdown');
	$dropdown.find('li.active').removeClass('active');
	$this.addClass('active');
	$dropdown.toggleClass('active').find('.parent_drop').html(value);
	$this.closest('.input_box').find('input').val(text).trigger('change');
	if ($this.closest('.card_editor_bottom').length) {
		$this.closest('.card_editor_bottom').find('.submit.nonactive').removeClass('nonactive');
	}
});

$('body').on('click', function(e) {
	/*dropdown close*/
	if (!$('.dropdown.active').is(e.target) && $('.dropdown.active').has(e.target).length === 0) {
		$('.dropdown.active').removeClass('active');
	}
	/*hint close*/
	if (!$('.-hint').is(e.target) && $('.-hint').has(e.target).length === 0) {
		$('.-hint.active').removeClass('active');
	}
	/*card tab editor close*/
	if (!$('.mob_content').is(e.target) && $('.mob_content').has(e.target).length === 0
	&& !$('.header_currency_input_box').is(e.target) && $('.header_currency_input_box').has(e.target).length === 0 && !$('.open_menu').is(e.target) && $('.open_menu').has(e.target).length === 0 && !$('.modal__wrapper').is(e.target) && $('.modal__wrapper').has(e.target).length === 0) {
		$('.card__settings_section.active').removeClass('active');
	}
});

/*character counter in input*/
$(document).on('keyup', '.field_show', function() {
	maxFieldInput();
})

/*show hint on mobile*/
$('.-hint').click(function() {
	if (window.innerWidth < 1270) {
		$(this).toggleClass('active')
	}
});

/*change tab in order page*/
$('.nav__item').click(function() {
	if (window.innerWidth < 1270) {
		$(this).closest('.card__settings_section').addClass('active');
	}
});


/*number input*/
$('.number input').on('input change paste', function() {
	$(this).val(this.value.replace(/[^0-9\-]/, ''));
});

$('.onlyNum').on('input change paste', function() {
	$(this).val(this.value.replace(/[^0-9\-]/, ''));
});

$(document).on('click', '.number_controls > div', function() {
	$(this).closest('.number_controls').find('div.nonactive').removeClass('nonactive');
	var input = $(this).closest('.number').find('input');
	var value = parseInt(input.val()) || 0;
	var max = parseInt(input.attr('max'));
	var min = parseInt(input.attr('min'));
	if ($(this).hasClass('nc-minus')) {
		value = value - 1;
		if (value == min) {
			$(this).addClass('nonactive');
		}
	}
	if ($(this).hasClass('nc-plus')) {
		value = value + 1;
		if (value == max) {
			$(this).addClass('nonactive');
		}
	}
	input.val(value).change();
});

//changed Tab

$(document).on('click', '.nav__item', function() {
	$(this).closest('.card__settings_nav_block').find('.nav__item.active').removeClass('active');
	$(this).addClass('active');
	changeTab();
})


/*************--- validation ---***************/

$('.contact__form form').on('submit', function (e) {
	e.preventDefault();
	var form=this;
	var $form=$(this);

	var $name = $form.find('[name="feedback_user_name"]');
	var $email = $form.find('[name="feedback_user_email"]');
	var $message = $form.find('[name="feedback_user_message"]');

	var isValid = true;

	$('select, input, textarea').removeClass('error');

	if ($name.length) {
		if ($name.val().length > 1) {
		} else {
			isValid = false;
			$name.addClass('error');
		}
	}
	if ($email.length) {
		if ($email.val().length > 1) {
		} else {
			isValid = false;
			$email.addClass('error');
		}
	}

	if ($message.length) {
		if ($message.val().length > 1) {
		} else {
			isValid = false;
			$message.addClass('error');
		}
	}

	if (isValid) {
		var form_data = new FormData(form);
		form_data.append('action', 'feedback_form__submit');
		$.ajax({
			method: 'post',
			url: "/wp-admin/admin-ajax.php",
			data: form_data,
			processData: false,
			contentType: false,
			success: function (reply) {
				if (reply=='ok') {
					// alert('success')
					$('.contact__form').html('<h3 class="title_2 title_2-success">Thanks,<br>your message has been sent.</h3>')
				} else {
					alert('error: '+reply)
				}
			},
			error: function () {
				alert('Error');
			}
		});
	}

});

$('input, select, textarea').on('mouseenter click focus', function () {
	$(this).removeClass('error');
});


if ($('.main_section_hero_video').length) {
	var msh_video=$('.main_section_hero_video video').get(0);
	var msh_video_loaded=false;
	msh_video.onpause=function() {
		this.style.visibility='visible';
		msh_video_loaded=true;
	}
	msh_video.style.visibility='hidden';
	msh_video.playbackRate=10;
	msh_video.play();
	
	var msh_video_scroll_event_timeout=null;
	var msh_video_scroll_event=function() {
		clearTimeout(msh_video_scroll_event_timeout);
		if (msh_video_loaded) {
			var win_top=$(window).scrollTop();
			var $scroll_block=$('.main_section');
			var scroll_block_top=$scroll_block.offset().top;
			var scroll_block_height=Math.floor($(window).height()*0.8);//$scroll_block.outerHeight();
			var scroll_start=scroll_block_top;
			var scroll_end=scroll_block_top+scroll_block_height;
			var video_pos=0;
			var video_fps=25
			var vid_frame=Math.floor(msh_video.currentTime*video_fps);
			if (scroll_start<win_top) {
				var vid_frame_all=Math.floor(msh_video.duration*video_fps);
				if (win_top<scroll_end) {
					msh_video.style.visibility='visible';
					var vid_progress=(win_top-scroll_start)/(scroll_end-scroll_start);
					video_pos=Math.floor(vid_frame_all*vid_progress);
				} else {
					video_pos=vid_frame_all;
					msh_video.style.visibility='hidden';
				}
			}
			if (vid_frame!=video_pos) {
				msh_video.currentTime=video_pos/video_fps;
			}
		} else {
			msh_video_scroll_event_timeout=setTimeout(msh_video_scroll_event, 100);
		}
	}
	$(window).on('scroll resize', msh_video_scroll_event);
	msh_video_scroll_event();
}

if ($('.palm_img_video').length) {
	var palm_video=$('.palm_img_video video').get(0);
	var palm_video_loaded=false;
	palm_video.onpause=function() {
		this.style.visibility='visible';
		palm_video_loaded=true;
	}
	palm_video.style.visibility='hidden';
	palm_video.playbackRate=10;
	palm_video.play();
	
	var palm_video_scroll_event_timeout=null;
	var palm_video_scroll_event=function() {
		clearTimeout(palm_video_scroll_event_timeout);
		if (palm_video_loaded) {
			var win_top=$(window).scrollTop();
			var $scroll_block=$('.palm_img_video');
			var scroll_block_top=$scroll_block.offset().top;
			var scroll_block_height=$scroll_block.outerHeight();
			var scroll_start=scroll_block_top+scroll_block_height-$(window).height();
			var scroll_end=scroll_block_top;
			var video_pos=0;
			var video_fps=25
			var vid_frame=Math.floor(palm_video.currentTime*video_fps);
			// console.log(scroll_start,scroll_end,win_top);
			if (scroll_start<win_top) {
				var vid_frame_all=Math.floor(palm_video.duration*video_fps);
				if (win_top<scroll_end) {
					var vid_progress=(win_top-scroll_start)/(scroll_end-scroll_start);
					video_pos=Math.floor(vid_frame_all*vid_progress);
				} else {
					video_pos=vid_frame_all;
				}
			}
			if (vid_frame!=video_pos) {
				palm_video.currentTime=video_pos/video_fps;
			}
		} else {
			palm_video_scroll_event_timeout=setTimeout(palm_video_scroll_event, 100);
		}
	}
	$(window).on('scroll resize', palm_video_scroll_event);
	palm_video_scroll_event();
}