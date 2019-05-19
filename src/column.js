import React, { Component } from "react";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import Box from "./box";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 325px;
  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
`;
const BoxList = styled.div`
  padding: 8px;
  transition: background-color 0.5s ease;
  background-color: ${props => (props.isDraggingOver ? "lightgrey" : "white")};
  flex-grow: 1;
  min-height: 150px;
`;

export default class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mouse_hover: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps != this.props) {
      this.uploadHoverOut();
    }
  }

  onFileUpload = e => {
    const file = e.target.files[0];
    this.getBase64(file).then(base64 => {
      let filename = `fileBase64-${Math.floor(Math.random() * 10000) + 1}`;
      localStorage[filename] = base64;
      this.props.onImageUpload(this.props.column.id, this.props.column.title, filename);
      this.uploadHoverOut();
      //console.log("file stored", base64);
    });
  };

  getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  uploadHoverIn = () => {
    this.setState({
      mouse_hover: true
    });
  };

  uploadHoverOut = () => {
    this.setState({
      mouse_hover: false
    });
  };

  render() {
    const inputfile =
      this.props.column.boxids.length !== undefined ? (
        this.props.column.boxids.length > 0 ? (
          ""
        ) : (
          <div style={{ paddingLeft: "100px" }}>
            <img
              src='http://www.stickpng.com/assets/images/586ac16ab6fc1117b60b2762.png'
              style={{
                width: "100px",
                height: "100px",
                border: "1px solid grey",
                borderRadius: "10px",
                backgroundColor: this.state.mouse_hover ? "lightgrey" : "white"
              }}
              onClick={e => this.upload_image.click()}
              alt={this.props.column.id}
              onMouseEnter={() => {
                this.uploadHoverIn();
              }}
              onMouseLeave={() => {
                this.uploadHoverOut();
              }}
            />
            <input
              type='file'
              onChange={this.onFileUpload}
              ref={ref => (this.upload_image = ref)}
              style={{ display: "none" }}
            />
          </div>
        )
      ) : (
        ""
      );

    return (
      <Container>
        <Title style={{ paddingLeft: "120px" }}>{this.props.column.title}</Title>

        <Droppable droppableId={this.props.column.id}>
          {(provided, snapshot) => (
            <div>
              <BoxList ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>
                {this.props.boxes.map((box, index) => {
                  return <Box key={box.id} box={box} index={index} />;
                })}
                {provided.placeholder}
                {inputfile}
              </BoxList>
            </div>
          )}
        </Droppable>
      </Container>
    );
  }
}
