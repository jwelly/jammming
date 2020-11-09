import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {      // this state will be updated as a user provides input into the searchbar
            term: ''
        }
        
        this.search = this.search.bind(this);
        this.searchKeydown = this.searchKeydown.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }
    
    search() {
        if (!this.state.term) {
            return false
        } else {
            this.props.onSearch(this.state.term);
        }
    }

    searchKeydown(event) {
        if (event.keyCode === 13) {
            this.search();
        }
    }

    handleTermChange(e) {
        this.setState({ term: e.target.value })
    }

    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyDown={this.searchKeydown} />
                <button className="SearchButton" onClick={this.search}>SEARCH</button>
            </div>
        )
    }
}

export default SearchBar;