import React, {Component} from 'react'
import {addImage} from '../reducers/imagesReducer'
import {connect} from 'react-redux'

class UploadImage extends Component {

  handleChange = (event) => {
  if (event.target.files[0]) {
    for (var key in event.target.files) {
      if (!event.target.files.hasOwnProperty(key)) continue;
      console.log("eve", event.target.files[key])
      let upload = URL.createObjectURL(event.target.files[key])
      let image_object = {
        image_data: upload
      }
      this.props.addImage(image_object)
    }
    return
  }
}


render() {
    return (
      <div className="squareCenter">
        { /* File uploader */ }
        <section className="hero">
          <label className="fileUploaderContainer">
            Click here to upload documents
            <input type="file" id="fileUploader" onChange={this.handleChange} multiple />
          </label>
        </section>
      </div>
    )
  }
}

const mapDispatchToProps = {
  addImage
}

const ConnectedUpload = connect(null, mapDispatchToProps)(UploadImage)
export default ConnectedUpload
