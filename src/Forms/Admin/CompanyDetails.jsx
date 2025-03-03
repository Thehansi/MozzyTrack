import React, { Component } from "react";
import Aux from "../../hoc/_Aux";
import Form, { SimpleItem, Item, EmptyItem } from "devextreme-react/form";
import Card from "../../App/components/MainCard";
import { Button, Navbar } from "react-bootstrap";
import { connect } from "react-redux";

export class CompanyDetails extends Component {
  constructor(props) {
    super(props);

    this.state = { DocReadOnly: false };
  }

  componentDidMount() {
    let auth =
      this.props.data.userWiseAuthorization.find((item) => item.MenuID === 9009)
        .Auth === 1;

    this.setState({ DocReadOnly: auth });
  }

  render() {
    return (
      <Aux>
        <Card title="Company Details">
          <Form>
            <Item itemType="group" colCount={2} />
          </Form>
        </Card>
        <Navbar bg="light" variant="light">
          <Button variant="secondary" disabled={this.state.DocReadOnly}>
            Save
          </Button>
        </Navbar>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.loggedReducer,
  };
};
export default connect(mapStateToProps)(CompanyDetails);
