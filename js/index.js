//*************** index *****************/
$(function () {

	setCookie()
	weather()
	slideMain()
	slideDream()
	slidePromo()
	initStyle()
	slideRoom()

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
		var swiper = getSwiper('.dream-wrapper', {
			break: 3
		})
		// var swiper = new Swiper(container, getSwiper(el, { break: 3 }));
		// swiperHover(swiper, el)
	}

	function slidePromo() {
		var $promoWrapper = $('.promo-wrapper');
		var $slideWrapper = $promoWrapper.find('.slide-wrapper');

		function onGetData(r) {
			// for(var i=0; i<r.promo.length; i++) {}
			r.promo.forEach(function (v, i) {
				var html = '';
				html += '<li class="slide swiper-slide">';
				html += '<div class="img-wrap ratio-wrap" data-ratio="1">';
				html += '<div class="ratio-bg" style="background-image: url(' + v.src + ');"></div>';
				html += '</div>';
				html += '<div class="cont-wrap">';
				html += '<h3 class="title">' + v.title + '</h3>';
				html += '<div class="desc">' + v.desc + '</div>';
				html += '</div>';
				html += '</li>';
				$slideWrapper.append(html);
			})
			var swiper = getSwiper('.promo-wrapper', {
				break: 4,
				pager: false
			});
		}
		$.get('../json/promotion.json', onGetData); // init
	}

	function initStyle() {
		$(window).resize(onResize).trigger('resize')

		function onResize() {
			$('.style-wrapper .ratio-wrap').each(function () {
				var ratio = $(this).data('ratio')
				var width = $(this).innerWidth();
				var height = width * Number(ratio);
				$(this).innerHeight(height);
			})
		}
	}

	function slideRoom() {
		var room = [], swiper
		var $movingBox = $('.room-wrapper .desc-wrapper .moving-box')
		var $tag = $('.room-wrapper .desc-wrapper .tag > div')
		var $title = $('.room-wrapper .desc-wrapper .title > div')
		var $desc = $('.room-wrapper .desc-wrapper .desc > div')
		function onGetData(r) {
			room = r.room.slice()
			swiper = getSwiper('.room-wrapper', {	break: 2, speed: 600 })
			swiper.on('slideChange', onBefore);
			swiper.on('slideChangeTransitionEnd', onchange);
			showDesc(0)
		}

		function onBefore() {
			$movingBox.removeClass('active')
		}

		function onchange(e) {
			var idx = e.realIndex
			showDesc(idx)
		}

		function showDesc(n) {
			$tag.text(room[n].tag)
			$title.text(room[n].title)
			$desc.text(room[n].desc)
			$movingBox.addClass('active')
		}

		$.get('../json/room.json', onGetData)
	}




})