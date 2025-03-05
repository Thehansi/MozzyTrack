import React, { Component } from "react";
import { Card } from "react-bootstrap";

export class About extends Component {
  render() {
    return (
      <Card className='text-center' bg={"secondary"} text={"white"}>
        <Card.Body>
          <Card.Title>MozziTrack</Card.Title>
          <Card.Text>© 2025 Thehansi Gunaratne</Card.Text>
          <Card.Text>Version 1.0.0</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default About;
