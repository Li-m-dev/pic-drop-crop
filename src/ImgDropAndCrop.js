import React, { Component } from "react";
import Dropzone from "react-dropzone";

const imageMaxSize = 100;
class ImgDropAndCrop extends Component {
  handleOnDrop = (files, rejectedFiles) => {
    console.log(files);
    console.log("rejected files are", rejectedFiles);
    if (rejectedFiles && rejectedFiles.length > 0) {
      const currentRejectFile = rejectedFiles[0];
      const currentRejectFileType = currentRejectFile.type;
      const currentRejectFileSize = currentRejectFile.size;
      if (currentRejectFileSize > imageMaxSize) {
        alert("this file is too big");
      }
    }
    if (files && files.length > 0) {
      const currentFile = rejectedFiles[0];
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;
      if (currentFileSize > imageMaxSize) {
        alert("this file is too big");
      }
    }
  };
  render() {
    return (
      <div>
        <h1>Drop and Crop</h1>
        <Dropzone
          onDrop={this.handleOnDrop}
          accept="image/*"
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
