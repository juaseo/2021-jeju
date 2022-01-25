//*************** main-wrapper *****************/
$(function () {


	//*************** 글로벌 설정 *****************/
	var $wrapper = $('.main-wrapper')
	var $slide = $('.main-wrapper .slide')
	var $pagerSlide = $('.main-wrapper .pager-slide')
	var video = $('.main-wrapper .video')[0]
	var len = $slide.length
	var lastIdx = len - 1
	var depth = 2
	var idx = 0
	var gap = 5000
	var speed = 500
	var timeout
	init()




	//*************** 사용자 함수 *****************/
	function init() {
		$slide.eq(idx).css('z-index', depth++)
		$slide.eq(idx).addClass('active')
		for (var i = 0; i < len; i++) {
			$('<i class="pager" ></i>').appendTo($pagerSlide).click(onPagerClick).addClass((idx === i) ? 'active' : '')
		}
		ani()
	}


	//*************** 이벤트 등록 *****************/
	video.addEventListener('loadeddata', onLoadedVideo)
	video.addEventListener('ended', onPlay)
	$('.bt-video').click(onModalVideo)
	$('.modal-video').find('.bt-close').click(onModalVideoClose)
	$('.cookie-wrapper').find('.bt-close').click(onCookieClose)
	$('.pager-wrapper .pager').click(function () {
		$('.pager-wrapper .pager').removeClass('active')
		$(this).addClass('active')
	})



	//*************** 이벤트 콜백 *****************/
	function onPagerClick() {
		idx = $(this).index()
		onPlay('pager')
	}

	function onCookieClose() {
		$('.cookie-wrapper').hide()
	}

	function onModalVideoClose() {
		$('.modal-video').hide()
	}

	function onModalVideo() {
		$('.modal-video').show()
	}

	function onLoadedVideo() {
		if (video.readyState >= 2) {
			video.playbackRate = 4.0
		}
	}

	function ani() {
		$(this).addClass('active')
		video.currentTime = 0
		if ($slide.eq(idx).hasClass('is-video')) video.play()
		else {
			clearTimeout(timeout)
			timeout = setTimeout(onPlay, gap)
		}
	}

	function onPlay(state) {
		if (state !== 'pager') idx = (idx == lastIdx) ? 0 : idx + 1;
		$pagerSlide.find('.pager').removeClass('active')
		$pagerSlide.find('.pager').eq(idx).addClass('active')
		$slide.eq(idx).css({
			'z-index': depth++,
			'left': '100%'
		})
		$slide.removeClass('active')
		$slide.eq(idx).stop().animate({
			'left': 0
		}, speed, ani)
	}










})