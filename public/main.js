var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");
var trash = document.getElementsByClassName("fa-trash-o");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const email = this.parentNode.parentNode.childNodes[1].innerText
        const artistName = this.parentNode.parentNode.childNodes[3].innerText
        const songTitle = this.parentNode.parentNode.childNodes[5].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[7].innerText)
        fetch('chartedSongs', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'email': email,
            'artistName': artistName,
            'songTitle': songTitle,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});
Array.from(thumbDown).forEach(function(element) {
  element.addEventListener('click', function(){
    const email = this.parentNode.parentNode.childNodes[1].innerText
    const artistName = this.parentNode.parentNode.childNodes[3].innerText
    const songTitle = this.parentNode.parentNode.childNodes[5].innerText
    const thumbDown = parseFloat(this.parentNode.parentNode.childNodes[7].innerText)
    fetch('chartedSongs', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'email': email,
        'artistName': artistName,
        'songTitle': songTitle,
        'thumbDown' :thumbDown 
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
  .then(data => {
    console.log(data)
    window.location.reload(true)
  })
});
  });



Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const email = this.parentNode.parentNode.childNodes[1].innerText
        const artistName = this.parentNode.parentNode.childNodes[3].innerText
        const songTitle = this.parentNode.parentNode.childNodes[5].innerText
        fetch('chartedSongs', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'email': email,
            'artistName': artistName,
            'songTitle': songTitle,
           
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

//Random radio station!
document.addEventListener('DOMContentLoaded', function() {
  // Fetch and display a random station
  fetch('/random-station')
      .then(response => response.json())
      .then(station => {
          const stationName = document.getElementById('station-name');
          const audioSource = document.getElementById('audio-source');
          const audioPlayer = document.getElementById('audio-player');

          stationName.textContent = station.name || 'Unknown Station';
          audioSource.src = station.url_resolved; // Station's stream URL
          audioPlayer.load(); // Reload the audio player with the new source

          // Add event listener for the vote button
          document.getElementById('vote-button').addEventListener('click', () => {
              fetch(`/vote-station`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ stationId: station.stationuuid })
              })
              .then(res => {
                  if (res.ok) {
                      alert('Thanks for voting!');
                  } else {
                      alert('Error voting for the station.');
                  }
              });
          });
      })
      .catch(err => {
          console.error('Error fetching station:', err);
      });
});

