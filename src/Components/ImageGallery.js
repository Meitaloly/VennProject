import React, { Component } from 'react'
import axios from 'axios'
import ImagesArea from './ImagesArea';


const getImages = (searchTerm, pageNumber, photosPerPage) => {
    return new Promise((resolve, reject) => {
        searchTerm && searchTerm !== ""
            ? axios
                .get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&safe_search=1&format=json&nojsoncallback=1&api_key=bac9f1ccfd854f27894fd47c4f01b1e8&text=${searchTerm}&per_page=${photosPerPage}&page=${pageNumber}&content_type=1&is_getty=1`)
                .then(result => resolve(result))
                .catch(err => reject(err))
            : resolve([]);
    })
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
        // this.changeNumOfPhotosPerPage = this.changeNumOfPhotosPerPage.bind(this);
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

    trackScrolling = () => {
        const wrappedElement = document.getElementById('MainApp');
        if (this.isBottom(wrappedElement)) {
            var pageCounter = this.state.page + 1;
            console.log('load more photos');
            console.log('pageCounter = ' + pageCounter);
            console.log('numOfPages = ' + this.state.numOfPages);
            if (pageCounter <= this.state.numOfPages) {
                this.setState({ page: pageCounter });
                getImages(this.state.searchText, this.state.page, this.state.perPage)
                    .then(res => this.setState({ images: [...this.state.images, ...res.data.photos.photo] }))
                    .catch(err => console.log(err));
            }
        }
    };

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
                page: 1
            })
        }

        else {
            getImages(e.target.value, this.state.page, this.state.perPage)
                .then(res => this.setState({ images: res.data.photos.photo, numOfPages: res.data.photos.pages }))
                .catch(err => console.log(err));
        }
    }

    // changeNumOfPhotosPerPage(e) {
    //     this.setState({ perPage: e.target.value });
    //     getImages(this.state.searchText, this.state.page, this.state.perPage)
    //     .then(res => this.setState({ images: res.data.photos.photo, numOfPages: res.data.photos.pages }))
    //     .catch(err => console.log(err));
    // }

    // render the app
    render() {
        return (
            <div className="imageGalleryContainer">
                <div className="headerContainer">
                    <div className="pageTitle">
                        Image Gallery
                        </div>
                    <div className="searchData">

                        <span className="searchDataText"> Your text: </span>
                        <input className="searchInput" type="text" value={this.state.searchText} onChange={this.handleTextChange} />

                        {/* // <span className="searchDataText">photos per page: </span> */}
                        {/* // <input type="number" value={this.state.perPage} onChange={this.changeNumOfPhotosPerPage} min="10" /> */}
                    </div>
                </div>

                <ImagesArea images={this.state.images} />
                <div className="endOfPage" hidden={this.state.page < this.state.numOfPages}>
                    There are no more photos for your search
                 </div>
            </div>
        )
    }
}