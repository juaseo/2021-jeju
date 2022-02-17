//*************** index *****************/
$(function () {

	function getSwiperOption(cls, opt) {
		/* 
		- cls: '.promo-wrapper'
		-opt
		{
			pager: true,
			navi: true,
			auto: true,
			delay: 3000,
			loop: true,
			space: 40,
			break: 4
		}
		*/

		var pagination = (opt.pager === false) ? false : {
			el: cls + '.pager-wrapper',
			clickable: true
		}

		var navigation = (opt.navi === false) ? false : {
			nextEl: cls + '.bt-slide.right',
			prevEl: cls + '.bt-slide.left',
		}

		var autoplay = (opt.auto === false) ? false : {
			delay: opt.delay || 3000
		}

		var breakpoints = {};
		if (opt.break == 2) {
			breakpoints = {
				768: {
					slidesPerView: 2
				}
			}
		} else if (opt.break == 3) {
			breakpoints = {
				768: {
					slidesPerView: 2
				},
				1200: {
					slidesPerView: 3
				}
			}
		} else if (opt.break == 4) {
			breakpoints = {
				576: {
					slidesPerView: 2
				},
				992: {
					slidesPerView: 3
				},
				1200: {
					slidesPerView: 4
				}
			}
		} else if (opt.break == 5) {
			breakpoints = {
				576: {
					slidesPerView: 2
				},
				768: {
					slidesPerView: 3
				},
				992: {
					slidesPerView: 4
				},
				1200: {
					slidesPerView: 5
				}
			}
		}


		return {
			pagination: pagination,
			navigation: navigation,
			autoplay: autoplay,
			loop: opt.loop === false ? false : true,
			slidesPerView: 1,
			spaceBetween: opt.space || 40,
			breakpoints: breakpoints
		}
	}

	setCookie()
	weather()
	slideMain()
	slideDream()
	slidePromo()

	function setCookie() {
		var $cookieWrapper = $('.cookie-wrapper')
		var $cookieClose = $cookieWrapper.find('.bt-close')
		var $cookieCloseConfirm = $cookieWrapper.find('.bt-confirm')

		if ($.cookie('hideCookie') === 'Y') onCloseCookie()

		function onCloseTodayCookie() {
			$.cookie('hideCookie', 'Y', {
				expires: 1,
				path: '/'
			});
			onCloseCookie();
		}

		function onCloseCookie() {
			$('.cookie-wrapper').hide()
		}

		$cookieCloseConfirm.click(onCloseTodayCookie)
		$cookieClose.click(onCloseCookie)
	}

	function weather() {
		var $weather = $('.main-wrapper .weather')
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

		function onGetWeather(r) {
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
		navigator.geolocation.getCurrentPosition(onGetGeo, onErrorGeo)
	}

	function slideMain() {
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

		function onPagerClick() {
			idx = $(this).index()
			onPlay('pager')
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



		$slide.eq(idx).css('z-index', depth++)
		$slide.eq(idx).addClass('active')
		for (var i = 0; i < len; i++) {
			$('<i class="pager" ></i>').appendTo($pagerSlide).click(onPagerClick).addClass((idx === i) ? 'active' : '')

			video.addEventListener('loadeddata', onLoadedVideo)
			video.addEventListener('ended', onPlay)
			$('.bt-video').click(onModalVideo)
			$('.modal-video').find('.bt-close').click(onModalVideoClose)
			$('.pager-wrapper .pager').click(function () {
				$('.pager-wrapper .pager').removeClass('active')
				$(this).addClass('active')
			})

			ani()
		}
	}

	function slideDream() {
		var swiper = new Swiper('.dream-wrapper .swiper-container', );

		$('.dream-wrapper .slide-stage').hover(function () {
			swiper.autoplay.stop()
		}, function () {
			swiper.autoplay.start()
		})
	}

	function slidePromo() {
		var $promoWrapper = $('.promo-wrapper')
		var $slideWrap = $promoWrapper.find('.slide-wrap')

		function onGetData(r) {
			r.promo.forEach(function (v, i) {
				var html = ''
				html += '<li class="slide swiper-slide">';
				html += '<div class="img-wrap">';
				html += '<img src="' + v.src + '" alt="메뉴" class="w-100">';
				html += '</div>';
				html += '<div class="cont-wrap">';
				html += '<h3 class="title">' + v.title + '</h3>';
				html += '<div class="desc">' + v.desc + '</div>';
				html += '</div>';
				html += '</li>';
				$slideWrap.append(html)
			})
			var swiper = new Swiper('.promo-wrapper .swiper-container', )
		}

		$.get('../json/promotion.json', onGetData)
	}






})