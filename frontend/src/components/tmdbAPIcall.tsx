async function getMovieInfo(event: any): Promise<void> {
      event.preventDefault();

      //Get movie name and put into search term variable

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

          if (res.id <= 0) {
              setMessage('User/Password combination incorrect');
          }
          else {
              var user = {id: res.id , email: res.email, username: res.username}
              localStorage.setItem('user_data', JSON.stringify(user));

              setMessage('');
              window.location.href = '/movies';
          }
       }
      catch (error: any) {
          alert(error.toString());
          return;
       }
  };
