import React, { useEffect, useState } from 'react'
import hero from '/hero.png'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { useDebounce} from 'react-use'

const API_BASE_URL = 'https://api.themoviedb.org/3/';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMesssage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // oddálený příkaz vyhledávání, aby se zabránilo příliš velkému množství požadavků na API
  // čeká až uživatelpřestane psát 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async ( query = '' ) => {
    setIsLoading(true);
    setErrorMesssage('');

    try {
      const endpoint =  query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=cs-CZ`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&language=cs-CZ`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Nepodařilo se načíst filmy.')
      }

      const data = await response.json();

      if(data.Response === 'False') {
        setErrorMesssage(data.Error || 'Nepodařilo se načíst filmy');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
      
    } catch (error){
      console.log(`Chyba při načítání filmů: ${error}`);
      setErrorMesssage('Chyba při načítání filmů. Prosím zkuste to později')
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
          <div className="pattern" />

          <div className="wrapper">
            <header>
              <img src={hero} alt="Hero Banner" />
              <h1>
                Objevujte <span className="text-gradient">filmy</span> které si užijete
              </h1>
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            </header>

          <section className="all-movies">
            <h2 className="mt-[40px]"> Všechny filmy</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>
            )}
            </section>  
          </div>
    </main>
  )
}

export default App