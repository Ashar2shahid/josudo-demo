import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import initalData from "./initial-box-data";
import Column from "./column";
import { DragDropContext } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

class App extends React.Component {
  componentDidMount() {
    localStorage.clear();
  }

  state = initalData;

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.draggableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const start_column = this.state.columns[source.droppableId];
    const finish_column = this.state.columns[destination.droppableId];

    if (start_column === finish_column) {
      const newBoxIds = Array.from(start_column.boxids);
      console.log(newBoxIds);
      newBoxIds.splice(source.index, 1);
      newBoxIds.splice(destination.index, 0, draggableId);
      console.log(newBoxIds);

      const newColumn = {
        ...start_column,
        boxids: newBoxIds
      };
      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      };
      this.setState(newState);
      return;
    }

    //Moving between boxes
    const startBoxids = Array.from(start_column.boxids);
    startBoxids.splice(source.index, 1);
    const newStart = {
      ...start_column,
      boxids: startBoxids
    };

    const finishBoxids = Array.from(finish_column.boxids);
    finishBoxids.splice(destination.index, 1, draggableId);

    const newFinish = {
      ...finish_column,
      boxids: finishBoxids
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    };

    this.setState(newState, () => {
      // delete box content
      if (finish_column.boxids.length > 0) {
        let delete_box_id = finish_column.boxids[0];
        const emptybox = {
          id: delete_box_id,
          content: ""
        };

        localStorage.removeItem(this.state.boxes[delete_box_id].content);

        const newState = {
          ...this.state,
          boxes: {
            ...this.state.boxes,
            [emptybox.id]: emptybox
          }
        };

        this.setState(newState);
      }
      console.log(this.state);
    });
  };

  onImageUpload = (column_id, box_id, content) => {
    const finish_column = this.state.columns[column_id];
    const finishBoxids = Array.from(finish_column.boxids);
    // Check which box is empty
    let new_box_id;
    Object.entries(this.state.boxes).forEach(([key, value]) => {
      if (value.content === "") {
        new_box_id = key;
      }
    });
    const finish_box = this.state.boxes[new_box_id];
    finishBoxids.splice(0, 1, new_box_id);
    const newFinish = {
      ...finish_column,
      boxids: finishBoxids
    };

    const newBox = {
      ...finish_box,
      content: content
    };

    const newState = {
      ...this.state,
      boxes: {
        ...this.state.boxes,
        [newBox.id]: newBox
      },
      columns: {
        ...this.state.columns,
        [newFinish.id]: newFinish
      }
    };

    this.setState(newState, () => console.log(this.state));
  };

  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='.col-12 .col-md-2' />
          <div className='.col-12 .col-md-8'>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Container>
                {this.state.columnOrder.map(columnId => {
                  const column = this.state.columns[columnId];
                  const boxes = column.boxids.map(boxId => this.state.boxes[boxId]);

                  return <Column key={column.id} column={column} boxes={boxes} onImageUpload={this.onImageUpload} />;
                })}
              </Container>
            </DragDropContext>
          </div>
          <div className='.col-12 .col-md-2' />
        </div>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
