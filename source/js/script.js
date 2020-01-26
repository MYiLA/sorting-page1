'use strict';

const productsElements = [...document.querySelectorAll('.product__item')];
const btnsContainerElement = document.querySelector('.product__filter-buttons');
const productContainerElement = document.querySelector('.product__list');

const products = productsElements.map(element => {
  return {
    price: parseInt(element.querySelector('.product__num').innerText, 10),
    name: element.querySelector('.product__title-desc').innerText,
    description: element.querySelector('.product__desc').innerText,
  };
});

const createProduct = (data) => {
  const productsCard = productsElements[0].cloneNode(true);

  productsCard.querySelector('.product__num').textContent = data.price + '$';
  productsCard.querySelector('.product__title-desc').textContent = data.name;
  productsCard.querySelector('.product__desc').textContent = data.description;

  return productsCard;
};

const updateProducts = (data) => {
  let fragment = document.createDocumentFragment();
  data.forEach((it) => fragment.appendChild(createProduct(it)));

  productContainerElement.innerHTML = '';
  productContainerElement.appendChild(fragment);
};

const compareProducts = (first, second) => first.price - second.price;

const sortProducts = (arr, order) => {
  if (order === 'asc') {
    return arr.slice().sort(compareProducts);
  }

  if (order === 'desc') {
    return arr.slice().sort(compareProducts).reverse();
  }

  return arr;
};

const onSortClick = ({ target }) => {
  if (!target.dataset.order || target.classList.contains('active')) {
    return;
  }

  [...btnsContainerElement.children].forEach(element => {
    element.classList.remove('active');
  });
  target.classList.add('active');

  const sortedProducts = sortProducts(products, target.dataset.order);
  updateProducts(sortedProducts);
};

btnsContainerElement.addEventListener('click', onSortClick);

