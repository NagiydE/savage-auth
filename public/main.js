var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");
var trash = document.getElementsByClassName("fa-trash-o");
// Thumbs Up
// Handle Thumbs Up
Array.from(thumbUp).forEach(function (element) {
  element.addEventListener('click', function () {
    const post = this.closest('.artist'); // Get the closest parent element with class "artist"
    const postId = post.dataset.id; // Use the data-id attribute for _id
    const thumbCount = parseInt(post.querySelector('.thumb-count').innerText);

    fetch('/chartedSongs', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId, // Send _id
        thumbUp: thumbCount + 1, // thumbs up increases
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Failed to update thumbs up');
      })
      .then((data) => {
        console.log(data);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while updating thumbs up.');
      });
  });
});

//Thumbs Down
Array.from(thumbDown).forEach(function (element) {
  element.addEventListener('click', function () {
    const post = this.closest('.artist');
    const postId = post.dataset.id;
    const thumbCount = parseInt(post.querySelector('.thumb-count').innerText);

    fetch('/chartedSongs', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId,
        thumbDown: thumbCount - 1, // thumb count decreases
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Failed to update thumbs down');
      })
      .then((data) => {
        console.log(data);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while updating thumbs down.');
      });
  });
});

// Delete
Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const post = this.closest('.artist');
    const postId = post.dataset.id;

    fetch('/chartedSongs', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }), 
    })
      .then((response) => {
        if (response.ok) window.location.reload();
        else throw new Error('Failed to delete the song');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while deleting the song.');
      });
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

