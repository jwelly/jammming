import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {
    alreadyInPlaylist(track) {
        let checkTrack = this.props.tracksInPlaylist;
        if (!checkTrack) {      // check if checkTrack is not undefined
            return;
        } else {        // check if track is in the playlist
            return checkTrack.find((savedTrack) => (savedTrack.id === track.id) ? true : false);
        }
    }
    
    render() {
        return (
            <div className="TrackList">
                {this.props.tracks.map(track => {
                    if (!this.alreadyInPlaylist(track)) {   // if track is NOT in playlist, ie false
                        return (                            // then display it in the search results
                            <Track track={track}
                                key={track.id}
                                onAdd={this.props.onAdd}
                                onRemove={this.props.onRemove} 
                                isRemoval={this.props.isRemoval} />
                        )
                    } else {
                        return null;        // if track IS in playlist, true,
                }                           // then remove it from search results
                })}
            </div>
        )
    }
}

export default TrackList;