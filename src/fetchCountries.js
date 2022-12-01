export { fetchCountries };

function fetchCountries() {
  const url = `https://restcountries.com/v3.1/all?fields=name,capital,population,flags,languages`;
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
