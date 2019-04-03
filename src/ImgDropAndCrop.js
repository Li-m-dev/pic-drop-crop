import React, { Component } from "react";
import Dropzone from "react-dropzone";

const imageMaxSize = 100000000000;
const acceptedFiletypes =
  "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
const acceptedFileTypesArray = acceptedFiletypes
  .split(",")
  .map(item => item.trim());

class ImgDropAndCrop extends Component {
  state = {
    imgSrc: null
  };

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
    console.log(files);
    console.log("rejected files are", rejectedFiles);
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
            console.log(myFileReader.result);
            this.setState({
              imgSrc: myFileReader.result
            });
          },
          false
        );
        myFileReader.readAsDataURL(currentFile);
      }
    }
  };
  render() {
    const { imgSrc } = this.state;
    return (
      <div>
        <h1>Drop and Crop</h1>
        {imgSrc !== null ? (
          <div>
            {imgSrc}
            <img src={imgSrc} />
          </div>
        ) : (
          ""
        )}
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
      </div>
    );
  }
}

export default ImgDropAndCrop;
