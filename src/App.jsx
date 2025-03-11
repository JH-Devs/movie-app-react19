import React, { useEffect, useState } from 'react'
import hero from '/hero.png'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';

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

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMesssage('');

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&language=cs-CZ`;

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
    fetchMovies();
  }, []);

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