import axios from 'axios';
import { useEffect, useState } from 'react';
import * as store from 'store';
import './sass/App.scss';

function App() {
  const [randomPokemon, setRandomPokemon] = useState(null);
  const [favoritePokemons, setFavoritePokemons] = useState(null);
  const [refreshScreen, setRefreshScreen] = useState(false);
  const pokemonBaseUrl = 'https://pokeapi.co/api/v2/pokemon/';
  const localStorageKey = 'favorites';

  // Max count from documentation
  // https://pokeapi.co/api/v2/pokemon
  const maxPokemonCount = 898;

  const getRandomPokemon = (e) => {
    e.preventDefault();

    const randomNumber = Math.floor(Math.random() * maxPokemonCount);

    const url = pokemonBaseUrl + randomNumber;

    axios.get(url).then((pokemon) => {
      setRandomPokemon({
        id: pokemon.data.id,
        name: pokemon.data.name,
        sprite: pokemon.data.sprites.front_default,
      });
    });
  };

  const saveToFav = (e) => {
    e.preventDefault();

    if (randomPokemon) {
      let temp = store.get(localStorageKey);

      if (temp != null) {
        if (!temp.some((pokemon) => pokemon.id === randomPokemon.id)) {
          temp.push(randomPokemon);
          store.set(localStorageKey, temp);
        }
      } else {
        temp = [];
        temp.push(randomPokemon);
        store.set(localStorageKey, temp);
      }

      // Screen refresher because favorites are added on localstorage,
      // it doesn't cause the component to reload so force reload it
      setRefreshScreen(!refreshScreen);
    }
  };

  useEffect(() => {
    setFavoritePokemons(store.get(localStorageKey));
  }, [refreshScreen]);

  const clearFavs = () => {
    store.clearAll();

    // Screen refresher because favorites are added on localstorage,
    // it doesn't cause the component to reload so force reload it
    setRefreshScreen(!refreshScreen);
  };

  return (
    <div>
      <header className="header">
        <div className="header__text-box">
          <h1 className="heading-primary">
            Adrian's Pokedex App
          </h1>
          <p className="heading-text">
            You can use this to look at some random pokemon and save your favourites!
          </p>
          <button className="btn btn--lg" onClick={getRandomPokemon}>Get Random Pokemon</button>
        </div>
      </header>
      <section className="section">
        <div className="u-center-text">
          {randomPokemon && (
            <div className="card">
              <h2 className="heading-tertiary u-center-margin u-margin-bottom-medium">Your random pokemon is:</h2>
              <div className="card__container">
                <figure className="card__shape">
                  <picture>
                    <img
                      alt={randomPokemon.name} className="card__img"
                      loading="lazy"
                      src={randomPokemon.sprite}
                    />
                  </picture>

                  <figcaption className="heading-tertiary  card__caption">
                    {randomPokemon.name}
                  </figcaption>
                  <button className="btn btn--reverse btn--lg" onClick={saveToFav}>Save to favourites!</button>

                </figure>
              </div>
            </div>
          )
          }
        </div>
      </section>

      <section className="section section-favourite">
        <div className="u-center-text">
          <h2 className="heading-secondary u-center-margin u-margin-bottom-medium">Favorites</h2>
          {
            favoritePokemons &&
            favoritePokemons.map((pokemon) => (
              <div key={pokemon.id} className="card u-margin-bottom-medium">
                <div className="card__container">
                  <figure className="card__shape">
                    <picture>
                      <img
                        alt={pokemon.name} className="card__img"
                        loading="lazy"
                        src={pokemon.sprite}
                      />
                    </picture>

                    <figcaption className="heading-tertiary  card__caption">
                      {pokemon.name}
                    </figcaption>
                  </figure>
                </div>
              </div>
            ))
          }
          <button className="btn btn--reverse btn--lg" onClick={clearFavs}>Clear Favorites</button>
        </div>
      </section>

    </div>
  );
}

export default App;
