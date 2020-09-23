import React, { Component } from "react";
import PropTypes from "prop-types";

class ViewSDKClient {
  constructor() {
    this.readyPromise = new Promise((resolve) => {
      if (window.AdobeDC) {
        resolve();
      } else {
        /* Wait for Adobe Document Cloud View SDK to be ready */
        document.addEventListener("adobe_dc_view_sdk.ready", () => {
          resolve();
        });
      }
    });
    this.adobeDCView = undefined;
  }

  ready() {
    return this.readyPromise;
  }

  previewFile(divId, url, fileName, viewerConfig, onPageChange) {
    const config = {
      clientId: "b2dadc9019db4678992d52f61c76f7b7",
    };
    if (divId) {
      /* Optional only for Light Box embed mode */
      /* Pass the div id in which PDF should be rendered */
      config.divId = divId;
    }
    /* Initialize the AdobeDC View object */
    this.adobeDCView = new window.AdobeDC.View(config);

    /* Invoke the file preview API on Adobe DC View object */
    const previewFilePromise = this.adobeDCView.previewFile(
      {
        /* Pass information on how to access the file */
        content: {
          /* Location of file where it is hosted */
          location: {
            url: url,
          },
        },
        /* Pass meta data of file */
        metaData: {
          /* file name */
          fileName: fileName,
        },
      },
      viewerConfig
    );
    this.adobeDCView.registerCallback(
      /* Type of call back */
      window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
      /* call back function */
      function (event) {
        if (event.type === "CURRENT_ACTIVE_PAGE" && onPageChange) {
          onPageChange(event.data.pageNumber);
        }
      },
      {
        listenOn: [
          window.AdobeDC.View.Enum.FilePreviewEvents.CURRENT_ACTIVE_PAGE,
        ],
        enablePDFAnalytics: true,
        enableFilePreviewEvents: true,
      }
    );

    return previewFilePromise;
  }
}

export default class AdobePdfViewer extends Component {
  numPages = 0;
  componentDidMount() {
    const onPageChange = (position) => {
      this.props.onPageChange(position, this.numPages);
      // console.log(position, this.numPages);
    };
    const viewSDKClient = new ViewSDKClient();
    viewSDKClient.ready().then(() => {
      /* Invoke file preview */
      viewSDKClient
        .previewFile(
          this.props.id,
          this.props.url,
          this.props.fileName,
          {
            embedMode: "SIZED_CONTAINER",
            dockPageControls: false,
            showPageControls: true,
            showDownloadPDF: false,
            defaultViewMode: "FIT_PAGE",
            showPrintPDF: true,
          },
          onPageChange
        )
        .then((adobeViewer) => {
          adobeViewer.getAPIs().then((apis) => {
            apis.getPDFMetadata().then((r) => {
              this.numPages = r.numPages;
            });
            if (this.props.position) {
              apis.gotoLocation(this.props.position);
            }
          });
        });
    });
  }

  render() {
    if (this.props.url) {
      return <div id={this.props.id} />;
    } else {
      return <p>Loading...</p>;
    }
  }
}

AdobePdfViewer.defaultProps = {
  fileName: "resumr",
};

AdobePdfViewer.propTypes = {
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  fileName: PropTypes.string,
  onPageChange: PropTypes.func,
};
