document.addEventListener('DOMContentLoaded', function () {
	;(function () {
		const mediaQueryOne = window.matchMedia('(max-width: 1124px)')
		const mediaQueryTwo = window.matchMedia('(max-width: 768px)')
		// -----focus for navItem-----
		const navItems = document
			.querySelectorAll('.header-top__nav-link')[0]
			.focus()

		// -----polyfill for cycle-----
		if (!('forEach' in NodeList.prototype)) {
			NodeList.prototype.forEach = function (callback, thisArg) {
				thisArg = thisArg || window
				for (var i = 0; i < this.length; i++) {
					callback.call(thisArg, this[i], i, this)
				}
			}
		}

		// -----dropdown-----
		const dropdownBtn = document.getElementById('dropdownBtn')
		const dropdownCollapse = document.getElementById('dropdownCollapse')
		const dropdownItems = document.querySelectorAll('.form__dropdown__item')
		const dropdownStorage = document.getElementById('dropdownStorage')
		const dropdownIcon = document.getElementById('dropdownIcon')

		function addRemoveBtnAction(action, actionAttr) {
			dropdownBtn.classList[action]('btn--active')
			dropdownIcon.classList[action]('icon--active')
			dropdownCollapse.classList[action]('collapse--visible')
			dropdownItems.forEach(function (item) {
				item[actionAttr]('tabindex', '0')
			})
		}

		dropdownBtn.addEventListener('click', function (event) {
			event.preventDefault()
			event.stopPropagation()
			this.classList.contains('btn--active')
				? addRemoveBtnAction('remove', 'removeAttribute')
				: addRemoveBtnAction('add', 'setAttribute')
			dropdownItems[0].focus()
		})

		dropdownItems.forEach(function (item) {
			item.addEventListener('click', function () {
				dropdownBtn.focus()
				dropdownBtn.innerText = this.innerText
				dropdownStorage.value = this.dataset.value
				console.log(dropdownStorage.value)
				addRemoveBtnAction('remove', 'removeAttribute')
			})
		})

		dropdownItems.forEach(function (item) {
			item.addEventListener(
				'keydown',
				event => event.key === 'Enter' && item.click()
			)
		})

		document.addEventListener('click', function (event) {
			event.target !== dropdownBtn &&
				addRemoveBtnAction('remove', 'removeAttribute')
		})

		document.addEventListener('keydown', function (event) {
			event.key === 'Escape' && addRemoveBtnAction('remove', 'removeAttribute')
		})

		// -----form slider-input-----
		const sliderInput = document.getElementById('sliderInput')
		const percentageDisplay = document.getElementById('percentage')
		sliderInput.addEventListener('input', () => {
			const value = sliderInput.value
			percentageDisplay.textContent = `${value}%`
		})

		// -----form file-----
		const file = document.getElementById('file')
		const fileLabel = document.getElementById('fileLabel')
		file.addEventListener('change', function (e) {
			let fileName = e.target.files[0].name
			fileLabel.innerText = fileName
		})
		fileLabel.addEventListener('keydown', function (event) {
			event.key === 'Enter' && file.click()
		})

		// -----burger-----
		const burger = document.getElementById('burger')
		const nav = document.getElementById('nav')
		const navLink = document.querySelectorAll('.header-top__nav-link')

		function updateTabindexResize() {
			mediaQueryOne.matches
				? burger.setAttribute('tabindex', '0')
				: burger.setAttribute('tabindex', '-1')
		}

		function addRemoveBurgerAction(action, actionAttr) {
			burger.classList[action]('burger--active')
			nav.classList[action]('nav--active')
			navLink.forEach(function (item) {
				item[actionAttr]('tabindex', '-1')
			})
		}

		burger.addEventListener('click', function () {
			this.classList.contains('burger--active')
				? addRemoveBurgerAction('remove', 'setAttribute')
				: addRemoveBurgerAction('add', 'removeAttribute')
		})

		mediaQueryOne.matches
			? addRemoveBurgerAction('remove', 'setAttribute')
			: null

		updateTabindexResize()
		window.addEventListener('resize', updateTabindexResize)

		// -----num order-----
		const orderIcon = document.querySelectorAll('.order__item__icon-wrap')
		orderIcon.forEach(function (item, index) {
			item.classList.add('item-' + (index + 1))
		})

		// -----footer link-----
		const links = document.querySelectorAll(
			'.footer__payment-item, .footer__social-item'
		)
		const linkData = {
			// тест ошибка
			test: 'https://w.qiwi.com/' /* Qiwi wallet */,
			'Yandex Money': 'https://yoomoney.ru/',
			'Web Money': 'https://www.webmoney.ru/',
			// тест ошибка
			test: 'https://www.email.ru/' /* info@ipsum228.com */,
			'Мы вконтакте': 'https://vk.com/',
		}

		function handleLinkClick(event) {
			event.preventDefault()
			const linkText = event.currentTarget.querySelector(
				'.footer__payment-text, .footer__social-text'
			).textContent
			const linkUrl = linkData[linkText]
			if (linkUrl) {
				window.open(linkUrl, '_blank')
			} else {
				showErrorPopup(linkText)
			}
		}

		function showErrorPopup(message) {
			const footerError = document.querySelector('.footer__error')
			const footerErrorText = document.querySelector('.footer__error-text')
			footerError.classList.add('error--active')
			footerErrorText.innerHTML = `Упс... по техническим причинам нельзя перейти на сайт ${message}. Попробуйте обновить страницу.`
			setTimeout(() => {
				footerError.classList.remove('error--active')
			}, 5000)
		}

		links.forEach(link => {
			link.addEventListener('click', handleLinkClick)
			link.addEventListener('keydown', function (event) {
				if (event.key === 'Enter') {
					event.preventDefault()
					handleLinkClick(event)
				}
			})
		})

		// -----slider reviews-----
		const sliderReviews = document.getElementById('sliderReviews')
		const slide = document.querySelector('.slide')
		const prevBtn = document.getElementById('prevBtn')
		const nextBtn = document.getElementById('nextBtn')

		let currentIndex = 0
		let totalSlides

		function prevBtnHandler() {
			currentIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1
			updateButtonState()
			updateSlider()
		}

		function nextBtnHandler() {
			currentIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1
			updateButtonState()
			updateSlider()
		}

		function updateNumSlides() {
			totalSlides = mediaQueryTwo.matches
				? sliderReviews.children.length
				: sliderReviews.children.length / 2

			currentIndex = Math.min(currentIndex, totalSlides - 1)
			updateSlider()
		}

		function updateSlider() {
			let slideWidth
			slideWidth = mediaQueryTwo.matches
				? slide.offsetWidth
				: slide.offsetWidth * 2

			sliderReviews.style.transform = `translateX(-${
				currentIndex * slideWidth
			}px)`
		}

		function disabledBtn(btn, action, actionAttr) {
			btn.classList[action]('btn--disabled')
			btn[actionAttr]('tabindex', '-1')
		}

		function updateButtonState() {
			if (currentIndex === 0) {
				disabledBtn(prevBtn, 'add', 'setAttribute')
			} else {
				disabledBtn(prevBtn, 'remove', 'removeAttribute')
			}

			if (currentIndex === totalSlides - 1) {
				disabledBtn(nextBtn, 'add', 'setAttribute')
			} else {
				disabledBtn(nextBtn, 'remove', 'removeAttribute')
			}
		}

		window.addEventListener('resize', () => {
			updateNumSlides()
			updateSlider()
		})

		prevBtn.addEventListener('click', prevBtnHandler)
		nextBtn.addEventListener('click', nextBtnHandler)

		updateButtonState()
		updateNumSlides()
		updateSlider()
	})()
})
