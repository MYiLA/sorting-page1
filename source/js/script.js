'use strict';

// const menuOpenElement = document.querySelectorAll('.main-nav__burger');
// menuOpenElement.addEventListener('click', onClickMoveMenu);
// openElement.classList.add('active');
// closeElement.classList.remove('active');
// setTimeout(closeMenu, 600);
// const 
// parseint для того чтобы убрать доллар
// забрать информацию из дом-элементов в массив блоков
// 2. Найти все нужные дом-элементы и записать в переменные/сформировать из них списки/объекты
// 3. написать функцию генерирования и отрисовки карточек (рандомный порядок)
// 4. написать функцию сортировки
// 3. поставить слушатель на кнопку сортировки

const productsElements = [...document.querySelectorAll('.product__item')];
const filterButtons = [...document.querySelectorAll('.product__filter-btn')];

let products = productsElements.map(element => {
  return {
    price: parseInt(element.querySelector('.product__num').innerText, 10),
    name: element.querySelector('.product__title-desc').innerText,
    description: element.querySelector('.product__desc').innerText,
  };
});

console.log(products);

//   var renderUserPhotos = window.util.debounce(function (dataPhoto) {
//   var fragment = document.createDocumentFragment();
//   dataPhoto.forEach(function (it) {
//     fragment.appendChild(renderPhoto(it));
//   });

//   picturesElement.appendChild(fragment);
// });


var updateProducts = function (arr) {
  if (filterButtons[0].classList.contains('active')) {
    return arr;
  }

  if (filterButtons[1].classList.contains('active')) {
    var cheapProductsArr = arr.slice().sort(function (first, second) {
      if (first.price > second.price) {
        return 1;
      } else if (first.price < second.price) {
        return -1;
      } else {
        return 0;
      }
    });
    return cheapProductsArr;
  }

  if (filterButtons[2].classList.contains('active')) {
    var expensiveProductsArr = arr.slice().sort(function (first, second) {
      if (first.price < second.price) {
        return 1;
      } else if (first.price > second.price) {
        return -1;
      } else {
        return 0;
      }
    });
    return expensiveProductsArr;
  }

  return arr;
};

var onFilterClick = function (buttonsArr, index, productsArr) {
  buttonsArr.forEach(function (it) {
    if (it.classList.contains('active')) {
      it.classList.remove('active');
    }
  });

  buttonsArr[index].classList.add('active');
  // window.util.removeOldChildrens('.picture');
  // renderUserPhotos(updatePhotos(productsArr));
};

var setupFilter = function (productsArr) {
  filterButtons[1].addEventListener('click', function () {
    onFilterClick(filterButtons, 1, productsArr);
  });
  filterButtons[2].addEventListener('click', function () {
    onFilterClick(filterButtons, 2, productsArr);
  });
  filterButtons[0].addEventListener('click', function () {
    onFilterClick(filterButtons, 0, productsArr);
  });
};