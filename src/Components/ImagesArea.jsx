import React, { Component } from 'react'

    export default class ImagesArea extends Component {

    constructor(props) {
        super(props);
        this.getImageURL = this.getImageURL.bind(this);
    }


    getImageURL(item) {
        return 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg'
    }

    render() {
        const { images } = this.props;
        return (
            <div className="photosContainer flex-container wrap">
                {
                    images !== [] ?
                        images.map((photo, index) =>
                            <div key={index}>
                                <img className="flex-item" src={this.getImageURL(photo)} alt={photo.title} />
                            </div>)
                        : <div></div>
                }
            </div >
        )
    }
}