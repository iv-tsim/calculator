document.addEventListener('DOMContentLoaded', () => {

    const DAY_STRING = ['день','дня','дней'];

    const DATA = {
        whichSite: ['landing', 'multiPage', 'onlineStore'],
        price: [12000, 20000, 40000],
        desktopTemplates: [50, 40, 30],
        adapt: 20,
        mobileTemplates: 15,
        editable: 20,
        metrikaYandex: [1000, 2000, 4000],
        analyticsGoogle: [1500, 3000, 5000],
        sendOrder: 1000,
        deadlineDay: [[6,14], [10,25], [25,50]],
        deadlinePercent: [20,17,15]
    };

    const hero = document.querySelector('.hero'),
          calc = document.querySelector('.calc'),
          totalPriceSum = document.querySelector('.calc-total__content'),
          formCalculate = document.querySelector('.calc-main'),
          fastRange = document.querySelector('.fast-range'),
          adapt = document.querySelector('#adapt'),
          mobileTemplates = document.querySelector('#mobileTemplates'),
          typeSite = document.querySelector('.type-site'),
          maxDeadline = document.querySelector('.max-deadline'),
          rangeDeadline = document.querySelector('.range-deadline'),
          deadlineValue = document.querySelector('.deadline-value'),
          adaptValue = document.querySelector('.adapt_value'),
          desktopTemplatesValue = document.querySelector('.desktopTemplates_value'),
          mobileTemplatesValue = document.querySelector('.mobileTemplates_value'),
          editableValue = document.querySelector('.editable_value'),
          desktopTemplates = document.querySelector('#desktopTemplates'),
          calcDescription = document.querySelector('.calc-description')
          metrikaYandex = document.querySelector('#metrikaYandex'),
          analyticsGoogle = document.querySelector('#analyticsGoogle'),
          sendOrder = document.querySelector('#sendOrder');


    //Показать элемент
    const showElem = elem => {

        elem.classList.add('active');

    }

    //Скрыть элемент
    const hideElem = elem => {

        elem.classList.remove('active');

    }

    //склонение дней
    declOfNum = (n, titles) => {
        return n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
                                0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
    }   

    hideElem(calc);

    document.addEventListener('click', event => {

        const { target } = event;

        if (target.closest('.header-btn') || target.closest('.hero-text__btn')) {

            showElem(calc);
            hideElem(hero);

        }

        if (target.closest('.calc-btn')) {

            let currentTarget = target.closest('.calc-btn');

            currentTarget.href = 'data:application/txt;charset=utf-8,' + encodeURIComponent(`${calcDescription.textContent} 
Можете связаться со мной по почте iv-tsim@yandex.ru`);
            currentTarget.download = 'description.txt';

        }

    });

    const dopOptionsString = () => {

        let str = '';

        if (metrikaYandex.checked || analyticsGoogle.checked || sendOrder.checked) {

            str += 'Подключим ';
            if (metrikaYandex.checked) {

                str += ' Яндекс Метрику';
    
                if (analyticsGoogle.checked && sendOrder.checked) {

                    str += ', Гугл Аналитику и отправку заявок на почту';

                    return str;

                }
    
               
    
                if (analyticsGoogle.checked || sendOrder.checked) {

                    str += ' и';

                }

            }
    
            if (analyticsGoogle.checked) {

                str += ' Гугл Аналитику';

                if (sendOrder.checked) {

                    str += ' и';

                }

            }
    
            if (sendOrder.checked) {

                str += ' отправку заявок на почту';

            }

            str += '.';
        }

        return str;
    };
    
    //отрисовка
    const renderTextContent = (total, site, maxDay, minDay) => {
    
        if (adapt.checked) {

            mobileTemplates.disabled = false;

        } else {

            mobileTemplates.disabled = true;
            mobileTemplates.checked = false;

        }
    
        adaptValue.textContent = adapt.checked ? 'Да' : 'Нет';
        mobileTemplatesValue.textContent = mobileTemplates.checked ? 'Да' : 'Нет';
        desktopTemplatesValue.textContent = desktopTemplates.checked ? 'Да' : 'Нет';
        editableValue.textContent = editable.checked ? 'Да' : 'Нет';
    
        typeSite.textContent = site;
        totalPriceSum.textContent = total;
        maxDeadline.textContent = declOfNum(maxDay, DAY_STRING);
        rangeDeadline.min = minDay;
        rangeDeadline.max = maxDay;
        deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_STRING);

        calcDescription.textContent = `Сделаем ${site} ${adapt.checked ? ', адаптированный под мобильные устройства и планшеты' : '' } за ~${deadlineValue.textContent}*. ${editable.checked ? 'Установим панель админстратора, чтобы вы могли самостоятельно менять содержание на сайте без разработчика.' : '' } ${dopOptionsString()}`;
    
    } 
    
    //подсчёт
    const priceCalculation = (elem = {}) => {

        let result = 0, 
            index = 0, 
            options = [],
            site = '',
            maxDeadlineDay = DATA.deadlineDay[index][1],
            minDeadlineDay = DATA.deadlineDay[index][0],
            overPercent = 0;
    
        if (elem.name === 'whichSite') {

            for (const item of formCalculate.elements) {

                if (item.type === 'checkbox') {

                    item.checked = false;

                }

            }

            hideElem(fastRange);

        }
    
        for (const item of formCalculate.elements) {

            if (item.name === 'whichSite' && item.checked) {

                index = DATA.whichSite.indexOf(item.value);
                site = item.dataset.site;
                maxDeadlineDay = DATA.deadlineDay[index][1];
                minDeadlineDay = DATA.deadlineDay[index][0];

            } else if (item.classList.contains('calc-handler') && item.checked) {

                options.push(item.value);

            } else if (item.classList.contains('want-faster') && item.checked) {

                const overDay = maxDeadlineDay - rangeDeadline.value;
                overPercent = overDay * (DATA.deadlinePercent[index]  / 100);

            }

        }
    
        result += DATA.price[index];
    
        options.forEach( (key) => {

            if (typeof(DATA[key]) === 'number') {

                if (key === 'sendOrder') {

                    //отправка на почту
                    result += DATA[key];

                } else {

                    //подсчёт
                    result += DATA.price[index] * DATA[key] / 100;

                }

            } else {

                if (key === 'desktopTemplates') {

                    //разработка дизайн макета
                    result += DATA.price[index] * DATA.desktopTemplates[index] / 100;

                } else {

                    //аналитика
                    result += DATA[key][index];

                }

            }

        });
    
        
    
        result += result * overPercent;
    
        renderTextContent(result, site, maxDeadlineDay, minDeadlineDay);
    
    };
    
    const handlerCallBackForm = (event) => {

        const { target } = event;
    
        if (adapt.checked) {

            mobileTemplates.disabled = false;

        } else {

            mobileTemplates.disabled = true;
            mobileTemplates.checked = false;

        }
    
        if (target.classList.contains('want-faster')) {

            target.checked ? showElem(fastRange) :  hideElem(fastRange);
            priceCalculation(target);

        }
    
        if (target.classList.contains('calc-handler')) {

            priceCalculation(target);

        }
    
    
    };

    formCalculate.addEventListener('input', handlerCallBackForm);
    
    priceCalculation();

});