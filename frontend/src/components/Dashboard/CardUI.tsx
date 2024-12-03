import React, { useState } from 'react';
import searchIcon from '/home/bitnami/stack/projects/movies/frontend/src/assets/icons/search.png'; // Import the image

function CardUI() {
    let _ud: any = localStorage.getItem('user_data');
    let ud = JSON.parse(_ud);
    let userId: string = ud.id;

    const [message, setMessage] = useState('');
    const [searchResults, setResults] = useState('');
    const [cardList, setCardList] = useState<any[]>([]); // Generic typing
    const [search, setSearchValue] = React.useState('');
    const [watchListTitle, setWatchListTitle] = React.useState('');
    const [watchedTitle, setWatchedTitle] = React.useState('');
    const [watchedReview, setWatchedReview] = React.useState('');
    const [watchedRating, setWatchedRating] = React.useState('');
    const [editingMovie, setEditingMovie] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [newReview, setNewReview] = useState('');
    const [newRating, setNewRating] = useState('');

    async function addWatchedMovie(e: any): Promise<void> {
        e.preventDefault();
        let obj = { userId: userId, title: watchedTitle, review: watchedReview, rating: watchedRating };
        let js = JSON.stringify(obj);
        try {
            const response = await
                fetch('https://www.cop4331gerber.online/api/addmovieWatched',
                    {
                        method: 'POST', body: js, headers: {
                            'Content-Type':
                                'application/json'
                        }
                    });
            let txt = await response.text();
            let res = JSON.parse(txt);
            if (res.error.length > 0) {
                setMessage("API Error:" + res.error);
            }
            else {
                setMessage('Movie review has been added');
            }
        }
        catch (error: any) {
            setMessage(error.toString());
        }
    };

    async function addMovieWatchList(e: any): Promise<void> {
        e.preventDefault();
        let obj = { userId: userId, title: watchListTitle};
        let js = JSON.stringify(obj);
        try {
            const response = await
                fetch('https://www.cop4331gerber.online/api/addmovieWatchList',
                    {
                        method: 'POST', body: js, headers: {
                            'Content-Type':
                                'application/json'
                        }
                    });
            let txt = await response.text();
            let res = JSON.parse(txt);
            if (res.error.length > 0) {
                setMessage("API Error:" + res.error);
            }
            else {
                setMessage('Movie has been added');
            }
        }
        catch (error: any) {
            setMessage(error.toString());
        }
    };

    async function searchWatched(e: any): Promise<void> {
        e.preventDefault();
        let obj = { userId: userId, search: search };
        let js = JSON.stringify(obj);
    
        try {
            const response = await fetch('https://www.cop4331gerber.online/api/searchWatched', {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
    
            let txt = await response.text();
            let res = JSON.parse(txt);
    
            if (res.error) {
                setResults('Error: ' + res.error);
            } else {
                setResults('Movies have been retrieved');
                setCardList(res.results); // Set the response as the array directly
            }
        } catch (error: any) {
            alert(error.toString());
            setResults(error.toString());
        }
    }

    async function editMovieWatched(originalTitle: string): Promise<void> {
        let obj = { 
            userId: userId, 
            title: originalTitle, 
            newTitle: newTitle || originalTitle, 
            newReview: newReview || cardList.find(movie => movie.title === originalTitle).review,
            newRating: newRating || cardList.find(movie => movie.title === originalTitle).rating,
        };
        let js = JSON.stringify(obj);
    
        try {
            const response = await fetch('https://www.cop4331gerber.online/api/editmovieWatched', {
                method: 'POST',
                body: js,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            let txt = await response.text();
            let res = JSON.parse(txt);
    
            if (res.error) {
                setMessage('Error editing movie: ' + res.error);
            } else {
                setMessage('Movie edited successfully');
                setCardList(cardList.map(movie =>
                    movie.title === originalTitle
                        ? { ...movie, title: newTitle, review: newReview, rating: newRating }
                        : movie
                ));
                setEditingMovie(null); // Exit edit mode
            }
        } catch (error: any) {
            setMessage('Failed to edit movie: ' + error.toString());
        }
    }

    async function searchWatchList(e: any): Promise<void> {
        e.preventDefault();
        let obj = { userId: userId, search: search };
        let js = JSON.stringify(obj);
    
        try {
            const response = await fetch('https://www.cop4331gerber.online/api/searchWatched', {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
    
            let txt = await response.text();
            let res = JSON.parse(txt);
    
            if (res.error) {
                setResults('Error: ' + res.error);
            } else {
                setResults('Movies have been retrieved');
                setCardList(res.results); // Set the response as the array directly
            }
        } catch (error: any) {
            alert(error.toString());
            setResults(error.toString());
        }
    }

    async function deleteMovieWatched(movieTitle: any): Promise<void> {

        let obj = { userId: userId, title: movieTitle };
        let js = JSON.stringify(obj);

        try {
          // Send a DELETE request to your API
          const response = await fetch('https://www.cop4331gerber.online/api/deletemovieWatched', {
            method: 'POST',
            body: js,
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          let txt = await response.text();
          let res = JSON.parse(txt);

          if (res.error) {
            setMessage('Error deleting movie: ' + res.error);
          } else {
            // Successfully deleted, update the card list in the UI
            setMessage('Movie deleted successfully');
            setCardList(cardList.filter((movie) => movie.title !== movieTitle));
          }
        } catch (error: any) {
          setMessage('Failed to delete movie: ' + error.toString());
        }
      }
    

    function handleSearchTextChange(e: any): void {
        setSearchValue(e.target.value);
    }

    function handleWatchedTitleChange(e: any): void {
        setWatchedTitle(e.target.value);
    }

    function handleWatchedListTitleChange(e: any): void {
        setWatchListTitle(e.target.value);
    }

    function handleWatchedReview(e: any): void {
        setWatchedReview(e.target.value);
    }

    function handleWatchedRating(e: any): void {
        setWatchedRating(e.target.value);
    }

    return (
        <div id="cardUIDiv">
            <br />
            <input id="searchBar" type="text" placeholder="Search Your Reviews.."
                onChange={handleSearchTextChange} />
            <button id="searchButton" onClick={searchWatched}><img id = "searchIcon" src={searchIcon}/></button><br />
            <span id="cardSearchResult">{searchResults}</span>
            
            <div id="container">
                <div className="section" id="watched">
                    <h2>Watched</h2>
                    <div className="movie-list">
                    {cardList.map((movie: any, index: number) => (
                        <div key={index} className="movie-card">
                            {editingMovie === movie.title ? (
                                // Render edit form
                                <div>
                                    <input
                                        type="text"
                                        defaultValue={movie.title}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        defaultValue={movie.review}
                                        onChange={(e) => setNewReview(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        defaultValue={movie.rating}
                                        onChange={(e) => setNewRating(e.target.value)}
                                    />
                                    <button onClick={() => editMovieWatched(movie.title)}>Save</button>
                                    <button onClick={() => setEditingMovie(null)}>Cancel</button>
                                </div>
                            ) : (
                                // Render movie details
                                <div>
                                    <h3>{movie.title}</h3>
                                    <p>Review: {movie.review}</p>
                                    <p>Rating: {movie.rating}</p>
                                    <button onClick={() => deleteMovieWatched(movie.title)}>Delete</button>
                                    <button onClick={() => setEditingMovie(movie.title)}>Edit</button>
                                </div>
                            )}
                        </div>
                    ))}
                    </div>
            
                </div>

                <div className="section" id="wantToWatch">
                    <h2>Want to Watch</h2>
                   
                </div>
            </div>

            <h2>Add Your Review</h2>

            <input type="text" id="watchedTitle" placeholder="Movie Title"
                onChange={handleWatchedTitleChange} /><br />
            <input type="text" id="watchedReview" placeholder="Movie Review"
                onChange={handleWatchedReview} /><br />
            <input type="number" step="1" min="0" max="5" id="watchedRating" placeholder="Movie Rating"
                onChange={handleWatchedRating} /><br />

            <button type="button" id="addMovieButton" className="buttons"
                onClick={addWatchedMovie}> Add Movie Review </button><br />
            <span id="movieAddResult">{message}</span>

            <h2>Add Movie You Want To Watch</h2>

            <input type="text" id="watchListTitle" placeholder="Movie Title"
                onChange={handleWatchedListTitleChange} /><br />

            <button type="button" id="addMovieButton" className="buttons"
                onClick={addMovieWatchList}> Add Movie </button><br />
            <span id="movieAddResult">{message}</span>

        </div>
    );
}
export default CardUI;
