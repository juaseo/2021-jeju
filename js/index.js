//*************** main-wrapper *****************/
$(function () {


	//*************** 글로벌 설정 *****************/
	var $wrapper = $('.main-wrapper')
	var $slide = $('.main-wrapper .slide')
	var $pagerSlide = $('.main-wrapper .pager-slide')
	var video = $('.main-wrapper .video')[0]
	var $weather = $('.main-wrapper .weather')
	var len = $slide.length
	var lastIdx = len - 1
	var depth = 2
	var idx = 0
	var gap = 5000
	var speed = 500
	var timeout
	var weatherURL = 'https://api.openweathermap.org/data/2.5/weather'
	var weatherData = {
		appid: 'a79e2f75b07479b3333c6463a9e30d05',
		units: 'metric'
	}
	var weatherIcon = {
		i01d: 'bi-brightness-high',
		i01n: 'bi-brightness-high-fill',
		i02d: 'bi-cloud-sun',
		i02n: 'bi-cloud-sun-fill',
		i03d: 'bi-cloud',
		i03n: 'bi-cloud-fill',
		i04d: 'bi-clouds',
		i04n: 'bi-cloud-fills',
		i09d: 'bi-cloud-rain-heavy',
		i09n: 'bi-cloud-rain-heavy-fill',
		i10d: 'bi-cloud-drizzle',
		i10n: 'bi-cloud-drizzle-fill',
		i11d: 'bi-cloud-lightning',
		i11n: 'bi-cloud-lightning-fill',
		i13d: 'bi-cloud-snow',
		i13n: 'bi-cloud-snow-fill',
		i50d: 'bi-cloud-haze',
		i50n: 'bi-cloud-haze-fill'
	}
	init()
	weather()




	//*************** 사용자 함수 *****************/
	function init() {
		$slide.eq(idx).css('z-index', depth++)
		$slide.eq(idx).addClass('active')
		for (var i = 0; i < len; i++) {
			$('<i class="pager" ></i>').appendTo($pagerSlide).click(onPagerClick).addClass((idx === i) ? 'active' : '')
		}
		ani()
	}

	function weather() {
		navigator.geolocation.getCurrentPosition(onGetGeo, onErrorGeo)
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
	function onGetWeather(r) {
		console.log(r)
		$weather.find('.icon').addClass(weatherIcon['i' + r.weather[0].icon])
		$weather.find('.temp').text(Math.floor(r.main.temp))
		$weather.find('.date').text(moment(r.dt * 1000).format('YYYY. M. D. ddd'))
		$weather.find('.time > span').text(moment(r.dt * 1000).format('hh:mm'))
		$weather.find('.time > small').text(moment(r.dt * 1000).format('A'))
	}

	function onGetGeo(r) {
		weatherData.lat = r.coords.latitude
		weatherData.lon = r.coords.longitude
		$.get(weatherURL, weatherData, onGetWeather)
	}

	function onErrorGeo() {
		weatherData.let = 33.4857397138786
		weatherData.llon = 126.48154043372092
		$.get(weatherURL, weatherData, onGetWeather)
	}

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