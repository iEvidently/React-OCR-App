import React, {Component} from 'react'
import Input from './Input'
import Select from './Select'
import Tesseract from 'tesseract.js'
import CaptureImage from './CaptureImage'
import UploadImage from './UploadImage'
import {connect} from 'react-redux'
import {clearImages} from '../reducers/imagesReducer'

class Form extends Component {

    state = {
      asn: '',
      location: '',
      gtin: '',
      sn: '',
      exp: '',
      lot: '',
      locOptions: ['St. Louis','Tempe','Whitestown','Florence'],
      uploads: [],
      patterns: [],
      documents: [],
      show: false,
    }

    generateText = () => {

    let uploads = this.props.images

    for(var i = 0; i < uploads.length; i++) {
      Tesseract.recognize(uploads[i].image_data, {
        lang: 'eng'
      })
      .catch(err => {
        console.error(err)
      })
      .then(result => {
        // Get Confidence score
        let confidence = result.confidence

        // Get full output
        let text = result.text
        console.log("text", text)

        // Get codes
        let pattern = /\b\w{3,3}\b/g
        let patterns = result.text.match(pattern)

        //Try pattern, if no match keep empty string
        let exp = ''
        let expPattern = /EXP:\s.+|EXP\s.+|EXP.\s.+|Exp:\s.+|Exp\s.+|Exp.\s.+/g
        let expMatch = result.text.match(expPattern)
        if (expMatch) {
          let expToString = String(expMatch)
          exp = expToString.split(" ")[1]
        }

        let lot = ''
        let lotPattern = /LOT:\s[A-Za-z0-9]+|LOT\s[A-Za-z0-9]+|Lot:\s[A-Za-z0-9]+|Lot\s[A-Za-z0-9]+|LOT.\s[A-Za-z0-9]+|Lot.\s[A-Za-z0-9]+/g
        let lotMatch = result.text.match(lotPattern)
        if (lotMatch) {
          let lotToString = String(lotMatch)
          lot = lotToString.split(" ")[1]
        }

        let sn = ''
        let snPattern = /SN\s[A-Za-z0-9]+|Sr.\sNo.\s[A-Za-z0-9]+|SNO.\s[A-Za-z0-9]+|SNO\s[A-Za-z0-9]+/g
        let snMatch = result.text.match(snPattern)
        if (snMatch) {
          let snToString = String(snMatch)
          sn = snToString.split(" ")[1]
        }

        let gtin = ''
        let gtinPattern = /GTIN\s[0-9]+|GTIN.\s[0-9]+|GTIN:\s[0-9]+|gtin\s[0-9]+/g
        let gtinMatch = result.text.match(gtinPattern)
        if (gtinMatch) {
          let gtinToString = String(gtinMatch)
          gtin = gtinToString.split(" ")[1]
        }

        // Update state
        this.setState({
          patterns: this.state.patterns.concat(patterns),
          documents: this.state.documents.concat({
            pattern: patterns,
            text: text,
            confidence: confidence,
          }),
          gtin: gtin,
          sn: sn,
          lot: lot,
          exp: exp
        }, this.stateHelper)
        this.props.clearImages()
      })
    }
  }

    stateHelper = () => {
      console.log("State", this.state)
    }

    handleInput = (event) => {
      let value = event.target.value
      let name = event.target.name
      this.setState({
        ...this.state, [name]: value
      }, this.stateHelper)
    }

    toggleShow = () => {
      this.setState({
        show: true
      }, this.stateHelper)
    }

    handleFormSubmit = () => {
      this.setState({
        asn: '',
        location: '',
        gtin: '',
        sn: '',
        exp: '',
        lot: '',
        locOptions: ['St. Louis','Tempe','Whitestown','Florence'],
        uploads: [],
        patterns: [],
        documents: [],
        show: false,
      })
    }

    formValid = () => {
      if (this.state.asn !== '' && this.state.location !== '' && this.state.exp !== ''
        && this.state.lot !== '' && this.state.sn !== '' && this.state.gtin !== '') {
        return true
      }

      return false
    }


    render() {

      return (
        <div>
          <div className="container">
            <Input
              type={'text'}
              title={'ASN'}
              name={'asn'}
              value={this.state.asn}
              placeholder = {'Enter ASN#'}
              handleChange = {this.handleInput} />
            <Select
              title={'Location'}
              name={'location'}
              options={this.state.locOptions}
              value={this.state.location}
              placeholder={'Select Location'}
              handleChange={this.handleInput} />
            <Input
              type={'text'}
              title={'EXP'}
              name={'exp'}
              value={this.state.exp}
              placeholder = {this.state.exp}
              handleChange = {this.handleInput} />
            <Input
              type={'text'}
              title={'LOT'}
              name={'lot'}
              value={this.state.lot}
              placeholder = {this.state.lot}
              handleChange = {this.handleInput} />
            <Input
              type={'text'}
              title={'SN'}
              name={'sn'}
              value={this.state.sn}
              placeholder = {this.state.sn}
              handleChange = {this.handleInput} />
            <Input
              type={'text'}
              title={'GTIN'}
              name={'gtin'}
              value={this.state.gtin}
              placeholder = {this.state.gtin}
              handleChange = {this.handleInput} />
              {this.state.documents.map((value, index) => {
                return (
                  <div key={index} className="results__result__info__codes">
                    <strong>Confidence Score:</strong> {value.confidence}
                  </div>
                )
              })}
              <br/>
              {this.formValid() ?
            <div className="squareCenter">
              <button className="buttonSubmit" onClick={this.handleFormSubmit}>Update EBS</button>
            </div>
            : null}
          </div>
          <div>
            <UploadImage/>
            <CaptureImage/>
          </div>
          <section className="hero">
            <div>
              { this.props.images.map((value, index) => {
                return <img key={index} src={value.image_data} width="640px" alt="" />
              })}
            </div>
            <br/>
      {/*
          <section className="results">
            { this.state.documents.map((value, index) => {
              return (
                <div key={index} className="results__result">
                  <div className="results__result__image">
                    <img src={this.state.uploads[index]} width="250px" alt="" />
                  </div>
                  <div className="results__result__info">
                    <div className="results__result__info__codes">
                      <small><strong>Confidence Score:</strong> {value.confidence}</small>
                    </div>
                    <div className="results__result__info__text">
                      <small><strong>Full Output:</strong> {value.text}</small>
                    </div>
                    <div className="results__result__info__text">
                      <small><strong>EXP:</strong> {value.exp}</small>
                    </div>
                    <div className="results__result__info__text">
                      <small><strong>LOT:</strong> {value.lot}</small>
                    </div>
                    <div className="results__result__info__text">
                      <small><strong>SN:</strong> {value.sn}</small>
                    </div>
                    <div className="results__result__info__text">
                      <small><strong>GTIN:</strong> {value.gtin}</small>
                    </div>
                  </div>
                </div>
              )
            }) }
          </section>
      */}
        {this.props.images.length !== 0 ?
            <div className="squareCenter">
              <button onClick={this.generateText} className="button">Extract Text</button>
            </div>
            : null}
          </section>
        </div>
      )
    }
  }

  const mapStateToProps = (state) => {
    return {
      images: state
    }
  }

  const mapDispatchToProps = {
    clearImages
  }

const ConnectForm = connect(mapStateToProps, mapDispatchToProps)(Form)
export default ConnectForm
