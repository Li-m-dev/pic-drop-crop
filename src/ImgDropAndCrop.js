import React, { Component } from "react";
import Dropzone from "react-dropzone";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import {
  base64StringtoFile,
  downloadBase64File,
  extractImageFileExtensionFromBase64,
  image64toCanvasRef
} from "./ResuableUtils";

const imageMaxSize = 100000000000;
const acceptedFiletypes =
  "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
const acceptedFileTypesArray = acceptedFiletypes
  .split(",")
  .map(item => item.trim());

class ImgDropAndCrop extends Component {
  constructor(props) {
    super(props);
    this.imagePreviewCanvasRef = React.createRef();
    // this.fileInputRef = React.createRef();
    this.state = {
      imgSrc: null,
      imgSrcExt: null,
      crop: {
        aspect: 1 / 1
      }
    };
  }

  verifyFile = files => {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;
      if (currentFileSize > imageMaxSize) {
        alert(
          "this file is not allowed, " + currentFileSize + " bytes is too large"
        );
        return false;
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        alert("this file is not allowed");
        return false;
      }
      return true;
    }
  };
  handleOnDrop = (files, rejectedFiles) => {
    // console.log(files);
    // console.log("rejected files are", rejectedFiles);
    if (rejectedFiles && rejectedFiles.length > 0) {
      this.verifyFile(rejectedFiles);
    }
    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files);
      if (isVerified) {
        //imageBase64Data
        const currentFile = files[0];
        const myFileReader = new FileReader();
        myFileReader.addEventListener(
          "load",
          () => {
            // console.log(myFileReader.result);
            const myResult = myFileReader.result;
            this.setState({
              imgSrc: myResult,
              imgSrcExt: extractImageFileExtensionFromBase64(myResult)
            });
          },
          false
        );
        myFileReader.readAsDataURL(currentFile);
      }
    }
  };

  handleImageLoaded = image => {
    // console.log(image);
  };
  handleOnCropComplete = (crop, pixelCrop) => {
    // console.log("crop, pixelCrop: ", crop, pixelCrop);
    const canvasRef = this.imagePreviewCanvasRef.current;
    // console.log("this.imagePreviewCanvasRef: ", this.imagePreviewCanvasRef);
    const { imgSrc } = this.state;
    image64toCanvasRef(canvasRef, imgSrc, pixelCrop);
  };
  handleOnCropChange = crop => {
    console.log(crop);
    this.setState({ crop });
  };

  handleDownloadClick = e => {
    e.preventDefault();
    const { imgSrc } = this.state;
    if (imgSrc) {
      const canvasRef = this.imagePreviewCanvasRef.current;
      // console.log("this.imagePreviewCanvasRef: ", this.imagePreviewCanvasRef);
      const { imgSrcExt } = this.state;
      const imgSrcNew = canvasRef.toDataURL("image/" + imgSrcExt);
      const filename = "previewFile." + imgSrcExt;

      //file to be uploaded
      const myNewCroppedFile = base64StringtoFile(imgSrcNew, filename);
      console.log("myNewCroppedFile: ", myNewCroppedFile);

      //download file
      downloadBase64File(imgSrcNew, filename);
      this.handleClearToDefault();
    }
  };

  handleClearToDefault = event => {
    if (event) event.preventDefault();
    const canvas = this.imagePreviewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    console.log("ctx: ", ctx);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.setState({
      // imgSrc: null,
      imgSrcExt: null,
      crop: {
        aspect: 1 / 1
      }
    });
  };

  // handleFileSelect = e => {
  //   console.log(e);
  //   const files = e.target;
  //   if (files && files.length > 0) {
  //     const isVerified = this.verifyFile(files);
  //     if (isVerified) {
  //       //imageBase64Data
  //       const currentFile = files[0];
  //       const myFileReader = new FileReader();
  //       myFileReader.addEventListener(
  //         "load",
  //         () => {
  //           // console.log(myFileReader.result);
  //           const myResult = myFileReader.result;
  //           this.setState({
  //             imgSrc: myResult,
  //             imgSrcExt: extractImageFileExtensionFromBase64(myResult)
  //           });
  //         },
  //         false
  //       );
  //       myFileReader.readAsDataURL(currentFile);
  //     }
  //   }
  // };
  render() {
    const { imgSrc } = this.state;
    return (
      <div>
        <h1>Drop and Crop</h1>
        {/* <input
          ref={this.fileInputRef}
          type="file"
          multiple={false}
          accept={acceptedFiletypes}
          onChange={this.handleFileSelect}
        /> */}
        {imgSrc !== null ? (
          <div>
            {/* {imgSrc}
            <img src={imgSrc} alt="previewImg" /> */}
            <ReactCrop
              src={imgSrc}
              crop={this.state.crop}
              onImageLoaded={this.handleImageLoaded}
              onComplete={this.handleOnCropComplete}
              onChange={this.handleOnCropChange}
            />

            <br />
            <p> Preview Canvas Crop</p>
            <canvas ref={this.imagePreviewCanvasRef} />
            <button onClick={this.handleDownloadClick}> Download</button>
            <button onClick={this.handleClearToDefault}>Clear</button>
          </div>
        ) : (
          <Dropzone
            onDrop={this.handleOnDrop}
            accept={acceptedFiletypes}
            multiple={false}
            maxSize={imageMaxSize}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone>
        )}
      </div>
    );
  }
}

export default ImgDropAndCrop;
