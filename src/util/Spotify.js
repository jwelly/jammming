const clientId = '3334f5774a1a48fd94749c9d00762af1';
const redirectUri = 'http://localhost:3000';
let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            let expiresIn = Number(expiresInMatch[1]);

            // The following clears the parameters, allowing us to grab a new access token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessUrl;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();     // our response gets converted to JSON
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            } else {
                return jsonResponse.tracks.items.map(track => ({    // we have ({ because we are returning an object
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }))
            }
        })
    },

    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {   // if there's no name or trackUris, so if this array is empty, just return
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        return fetch('https://api.spotify.com/v1/me', { headers: headers }
        ).then(response => response.json()      // here we requested and returned the user's Spotify username
        ).then(jsonResponse => {         // then we converted the res to JSON..
            userId = jsonResponse.id;    // ..and saved the response id param to the user's ID var.

            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,         // here we create a new playlist in the user's account and return its id
                method: 'POST',
                body: JSON.stringify({ name: name })    // we set the playlist name to the name argument entered
            }).then(response => response.json()     // we then convert the res to json
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {   // (more recent endpoint)
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackUris })    // here we add the tracks to our new playlist!
                })
            })
        });
    }
}

export default Spotify;