import React, { Component } from 'react'
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'

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
            <div>
                {/* <PerfectScrollbar onYReachEnd={()=>console.log("end of page!")}> */}
                    {
                        images&&images.length ?
                            images.map((photo, index) =>
                                <div key={index}>
                                    <img className="photo" src={this.getImageURL(photo)} />
                                </div>)
                            : <div></div>
                    }
                {/* </PerfectScrollbar> */}
            </div >
        )
    }
}