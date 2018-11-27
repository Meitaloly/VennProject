import React, { Component } from 'react'
import axios from 'axios'
import ImagesArea from './ImagesArea';
import ReactLoading from "react-loading";
import './../Styling/GalleryStyling.css';

//api request
const getImages = (searchTerm, pageNumber, photosPerPage) => {
    return axios
        .get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&safe_search=1&format=json&nojsoncallback=1&api_key=bac9f1ccfd854f27894fd47c4f01b1e8&text=${searchTerm}&per_page=${photosPerPage}&page=${pageNumber}&content_type=1&is_getty=1`)
};

export default class ImageGallery extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            images: [],
            page: 1,
            perPage: 20,
            numOfPages: 0,
        }
        this.handleTextChange = this.handleTextChange.bind(this);
        this.isBottom = this.isBottom.bind(this);
    }


    isBottom(el) {
        return el.getBoundingClientRect().bottom <= (window.innerHeight + 1);
    }

    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
    }

    // check if user arrived to the buttom of the page with the scroll bar
    // and call the 'getImage' function to load more images using api request
    trackScrolling = () => {
        const wrappedElement = document.getElementById('MainApp');
        if (this.isBottom(wrappedElement)) {
            let pageCounter = this.state.page + 1;
            if (pageCounter <= this.state.numOfPages) {
                this.setState({ page: pageCounter });
                getImages(this.state.searchText, pageCounter, this.state.perPage)
                    .then(res => this.setState({ images: [...this.state.images, ...res.data.photos.photo] }))
                    .catch(err => console.log(err));
            }
        }
    };

    // update the text in state +
    // check if text isn't empty and call 'getImage' function for the api request
    handleTextChange(e) {

        console.log("text: " + e.target.value);
        this.setState({
            searchText: e.target.value,
            page: 1
        });

        if (e.target.value === "") {
            this.setState({
                images: [],
                numOfPages: 0,
            })
        }

        else {

            getImages(e.target.value, 1, this.state.perPage)
                .then(res => this.setState({ images: res.data.photos.photo, numOfPages: res.data.photos.pages }))
                .catch(err => console.log(err));
        }
    }

    // render the app
    render() {
        return (
            <div className="imageGalleryContainer">
                <div className="headerContainer">
                    <h1 className="pageTitle">
                        Image Gallery
                        </h1>
                    <div className="searchData">

                        <span className="searchDataText"> Your text: </span>
                        {/* <input className="searchInput" type="text" value={this.state.searchText} onChange={this.handleTextChange} /> */}
                        <input className="searchInput" type="text" onChange={this.handleTextChange} />

                    </div>
                </div>

                <ImagesArea images={this.state.images} />

                <ReactLoading className="loader" hidden={(this.state.page + 1 > this.state.numOfPages) || (this.state.numOfPages <= 1)} type={"spinningBubbles"} color="#fff" />

                <div className="endOfPageMsg" hidden={this.state.page < this.state.numOfPages}>
                    There are no more photos for your search
                 </div>
            </div>
        )
    }
}