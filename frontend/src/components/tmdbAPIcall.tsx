async function getMovieInfo(event: any): Promise<void> {
      event.preventDefault();

      //Get movie name and put into search term variable "search"

      const url = 'https://api.themoviedb.org/3/search/movie?query=' + search + '&include_adult=false&language=en-US&page=1';
      const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOWQ1MDQ0NWUxNmU2NzRlNTlhOWM2ZGU4ZWJlYTA4NCIsIm5iZiI6MTczMzI0NTY3Ny44NjA5OTk4LCJzdWIiOiI2NzRmM2FlZGMyYjMwYjc4MjQ1NTM1MjMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.8gGVBc8duuqWh0bzDn918jP3DvlTSd65KQ2gWSmo480'
        }
      };
  
      try {
          const response = await fetch(url, options);

          var res = JSON.parse(await response.text());

          if (res.total_results <= 0) {
              setMessage('No such movie found in tmdb');
          }
          else {
                //Modify this section per front end needs --------------------------------------
              var imageURL = 'https://image.tmdb.org/t/p/w500' + res.results[0].poster_path
                
              var data = {id: res.results[0].id , title: res.results[0].title, rating: res.results[0].vote_average,
                         posterURL: imageURL, overview: res.results[0].overview}
              localStorage.setItem(res.results[0].title + '_data', JSON.stringify(data));

              setMessage('');
              window.location.href = '/movies';
          }
       }
      catch (error: any) {
          alert(error.toString());
          return;
       }
  };
