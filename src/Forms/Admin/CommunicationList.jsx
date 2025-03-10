import React, { Component, Fragment } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import DataGrid, {
  Column,
  SearchPanel,
  GroupPanel,
  Paging,
} from "devextreme-react/data-grid";

export class CommunicationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      SelectID: 0,
      jList: [],
    };
  }

  componentDidMount() {}

  onSelectionChanged = (e) => {
    this.setState({ SelectID: e.selectedRowsData[0].AutoID });
  };

  onSelectClick = (e) => {
    this.props.OnHide(this.state.SelectID);
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
            <Modal.Title>List of {this.props.Name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DataGrid
              id="grid-list"
              dataSource={this.props.ItemList}
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
              <Column dataField="Module" />
              <Column dataField="Status" />
              <Column dataField="Remark" />
            </DataGrid>

            <br></br>
            <br></br>

            <Button variant="secondary" onClick={this.onSelectClick}>
              Open
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

export default CommunicationList;
