//добавление других js  к общему файлу


//необходимая часть , не удалять!!!!!!!!!!
function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
    if (support == true) {
        document.querySelector('body').classList.add('webp');
    } else {
        document.querySelector('body').classList.add('no-webp');
    }
});

//основной скрипт



window.addEventListener('DOMContentLoaded', function () {
    ////////////////////скрипт для слайдера swiper//////////////////////
    @@include('swiper1.js');
    /////////////////////////////////////////////////////////////
    let h1Bwidth = document.querySelector('.header1block').clientHeight;
    let h2Bwidth = document.querySelector('.header2block').clientHeight;

    this.window.addEventListener('scroll', () => {
        let scrolledDown = window.pageYOffset || document.documentElement.scrollTop;
        if (scrolledDown > h1Bwidth && document.documentElement.clientWidth <= 720) {
            // Если страница прокручена вниз более, чем на 550 пикселей,
            // выводим кнопку на экран
            //    document.getElementById('arrow').style.display = 'block';
            document.querySelector('.header1block').classList.add('modifed')
            document.querySelector('.header2block').classList.add('modifed')
            this.document.querySelector('main').style.marginTop = h2Bwidth + 'px'


        } else {
            // В противном случае убираем кнопку с экрана
            //    document.getElementById('arrow').style.display = 'none';
            document.querySelector('.header1block').classList.remove('modifed')
            document.querySelector('.header2block').classList.remove('modifed')
            this.document.querySelector('main').style.marginTop = 0
        }
    })

    this.document.querySelector('.openClose')?.addEventListener('click', () => {
        this.document.querySelector('.popupFrame').classList.remove('active')
    })
    this.document.querySelector('.coverPopup')?.addEventListener('click', () => {
        this.document.querySelector('.popupFrame').classList.remove('active')
    })
    this.document.querySelector('.popupButton')?.addEventListener('click', () => {
        console.log('rdvdfvdfvfd')
        this.document.querySelector('.popupFrame').classList.add('active')
    })

});


