import React, { Component, Fragment } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import DataGrid, {
  Column,
  SearchPanel,
  GroupPanel,
  Paging,
} from "devextreme-react/data-grid";

export class ReportList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      DataRow: {},
    };
  }

  componentDidMount() {}

  onSelectionChanged = (e) => {
    this.setState({ DataRow: e.selectedRowsData[0] });
  };

  onViewClick = () => {
    if (this.state.DataRow.FileName) {
      window.open(
        `${window.location.protocol}//${window.location.hostname}${window["Config"].LayoutURL}?f=${this.state.DataRow.FileName}&i=${this.props.AutoID}&t=1`,
        "_blank"
      );
    }
  };

  onCloseClick = (e) => {
    this.props.OnHide(0);
  };

  render() {
    return (
      <Fragment>
        <Modal
          size="xl"
          show={this.props.Show}
          onHide={this.onCloseClick}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>List of Layout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DataGrid
              id="grid-list"
              dataSource={this.props.Layout}
              keyExpr="AutoID"
              showBorders={true}
              wordWrapEnabled={true}
              allowSearch={true}
              selection={{ mode: "single" }}
              hoverStateEnabled={true}
              onSelectionChanged={this.onSelectionChanged}
            >
              <SearchPanel visible={true} />
              <GroupPanel visible={true} />
              <Paging defaultPageSize={20} />
              <Column dataField="AutoID" visible={false} />
              <Column dataField="Name" />
              <Column dataField="Remark" />
            </DataGrid>

            <br></br>
            <br></br>

            <Button variant="secondary" onClick={this.onViewClick}>
              View
            </Button>
            <Button
              variant="secondary"
              onClick={this.onCloseClick}
              icon="feather icon-layers"
            >
              Close
            </Button>
          </Modal.Body>
        </Modal>
      </Fragment>
    );
  }
}

export default ReportList;
