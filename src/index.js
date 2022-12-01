import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
const allPossibleCountries = [];
let searchQuery = '';

searchBox.addEventListener('input', debounce(enteredData, DEBOUNCE_DELAY));

function enteredData(e) {
  e.preventDefault();
  searchQuery = e.target.value.trim();
  allPossibleCountries.length = 0;
  if (!searchQuery) {
    emptySearch();
    return;
  }
  fetchCountries(searchQuery)
    .then(findEachCountry)
    .catch(error => console.log(error));
}

function findEachCountry(countries) {
  countries.map(country => {
    if (country.name.common.toLowerCase().includes(searchQuery.toLowerCase())) {
      allPossibleCountries.push(country);
    }
  });
  emptySearch();
  selection();
}

function createList(country) {
  return country
    .map(({ flags, name }) => {
      return `
                <li class='mini-container'><img class="flags-img" src=${flags.svg} alt=${name.official} width = "30" height = "auto" />
                    ${name.official}
                <li>`;
    })
    .join('');
}

function createInfo(country) {
  return country
    .map(({ flags, name, capital, population, languages }) => {
      return `
                <div class='mini-container'><img class="flags-img" src=${
                  flags.svg
                } alt=${name.official} width = "30" height = "auto" />
                    <h1 class ='title'>${name.official}</h1>
                </div>
                    <ul class='info-list'>
                        <li><b>Capital:</b> ${capital}</li>
                        <li><b>Population:</b> ${population}</li>
                        <li><b>Languages:</b> ${Object.values(languages)}</li>
                    </ul>`;
    })
    .join('');
}

function selection() {
  if (allPossibleCountries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (
    1 < allPossibleCountries.length &&
    allPossibleCountries.length < 10
  ) {
    countryList.innerHTML = createList(allPossibleCountries);
  } else if (allPossibleCountries.length === 1) {
    countryInfo.innerHTML = createInfo(allPossibleCountries);
  } else {
    Notify.failure('Oops, there is no country with that name');
  }
}

function emptySearch() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}
