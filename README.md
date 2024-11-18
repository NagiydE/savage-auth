## Installation

1. Clone repo
2. run `npm install`
3. Set up your MongoDB database:
Create a database and collections (users, chartedSongs).
Update database configuration in your code if necessary.
run `node server.js`
5. Open the app in your browser:
## Usage
Random Radio Station
The home page (/home) displays a random station daily.
Users can listen to the station using the embedded audio player.
A "Vote for this station" button allows users to vote on the current station.

Charted Songs
Users can add new songs to the chart using the form on the home page.
Songs are listed with details such as artist name, song title, and votes.
Users can:
Upvote or downvote songs using the thumbs-up and thumbs-down icons.
Delete songs using the trash icon.

## API Integration
Radio Browser API
The Radio Browser API is used to fetch random radio stations and register votes for stations.

Endpoints:
/random-station: Fetches a random radio station to display on the home page.
/vote-station: Registers a vote for the selected station.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
