import './css/styles.css';
import Notiflix from 'notiflix';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};
refs.input.addEventListener('input', debounce(onInputListener, 300));

function onInputListener(event) {
  const name = event.target.value.trim();
  if (!name) {
    return;
  }
  fetchCountries(name);
}

function fetchCountries(name) {
  fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(country => {
      onMarkUp(country);
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}
function onMarkUp(countries) {
  if (countries.length > 10) {
    refs.info.innerHTML = '';
    refs.list.innerHTML = '';
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (countries.length === 1) {
    refs.list.innerHTML = '';
    onCountryCountryCardMarkUp(countries[0]);
  } else {
    refs.info.innerHTML = '';
    onCountryListMarkUp(countries);
  }
}
function onCountryListMarkUp(countries) {
  refs.list.innerHTML = [...countries]
    .map(
      country =>
        `<li><img src=${country.flags.svg} width=40 > <p>${country.name.official}</p></li>`
    )
    .join('');
}
function onCountryCountryCardMarkUp(country) {
  refs.info.innerHTML = `<img src=${country.flags.svg} width=40 ><h1>${
    country.name.official
  }</h1><p>Capital:${country.capital.map(
    capital => capital
  )}</p><p>Population:${country.population}</p><p>Languages:${Object.values(
    country.languages
  )}</p>`;
}
