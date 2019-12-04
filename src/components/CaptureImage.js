import React, {Component} from 'react'
import Webcam from 'react-webcam'
import {addImage} from '../reducers/imagesReducer'
import {connect} from 'react-redux'

class CaptureImage extends Component {

  state = {
    imageData: null,
    saveImage: false,
    show: false,
    showVideo: true,
  }

  toggleShow = () => {
    this.setState({
      show: true
    })
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot()
    this.setState({
      imageData: imageSrc,
      showVideo: false
    })
  }

  onClickRetake = () => {
    this.setState({
      imageData: null,
      showVideo: true
    })
  }

  onClickSave = () => {
    let imageObject = {
      image_data: this.state.imageData
    }
    this.props.addImage(imageObject)
    this.setState({
      imageData: null,
      show: false
    })
  }

  pad = {
    padding: "50px"
  }

  padLeft = {
    paddingLeft: "10px"
  }

  padRight = {
    paddingRight: "10px"
  }

render() {
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
    screenshotFormat: 'image/png'
  }

    return (

      <div>
      <div className="squareCenter">
      <section className="hero">
        <label className="fileUploaderContainer" onClick={this.toggleShow}>
        Click here to take Photo
      </label>
    </section>
    </div>
      {this.state.show ?
        <div>
        {this.state.showVideo ?
                  <div>
                    <Webcam
                      audio={false}
                      height={350}
                      ref={this.setRef}
                      screenshotFormat="image/png"
                      width={1280}
                      videoConstraints={videoConstraints}
                      />
                    <div className="squareCenter" style={this.pad}><button className="button" onClick={this.capture}>Capture photo</button></div>
                  </div> :
                  <div>
                  {this.state.imageData ?
                    <div style={this.pad}>
                      <p><img height={350} width={640} src={this.state.imageData} alt=""/></p>
                      <div className="sameLine">
                        <span style={this.padRight}><button className="button" onClick={this.onClickRetake}>Retake?</button></span>
                        <span style={this.padLeft}><button className="button" onClick={this.onClickSave}>Save</button></span>
                      </div>
                    </div>
                    : null}
                    </div>
                  }
            </div>
        : null}
      </div>
    )
  }
}

const mapDispatchToProps = {
  addImage
}

const ConnectedCapture = connect(null, mapDispatchToProps)(CaptureImage)

export default ConnectedCapture
