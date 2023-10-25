/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-24 14:15:13
 * @LastEditTime: 2023-10-24 16:36:17
 * @Description:
 */
import { type CSSProperties } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface IMoveOptions {
  boxStyle?: CSSProperties;
  itemStyle?: CSSProperties;
  dataSource: any[];
  disabled?: boolean;
  renderItem: (...args: any[]) => JSX.Element;
  onChange?: (value: any[]) => void;
}

function CustomMove(options: IMoveOptions) {

  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };


  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    userSelect: "none",
    background: isDragging ? "#e8e8e8" : "transparent",
    padding: '2px',
    ...draggableStyle
  });

  const getListStyle = (isDraggingOver: boolean) => ({
    // background: isDraggingOver ? "lightgrey" : "transparent"
  });


  const onDragEnd = (result: Record<string, any>) => {
    if (!result.destination) {
      return;
    }

    const list = reorder(
      options.dataSource,
      result.source.index,
      result.destination.index
    );

    options.onChange?.(list);
  }

  return (
    <>
      <DragDropContext onDragEnd={(event: any) => onDragEnd(event)}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {options.dataSource.map((item, index) => {
                const id = `${item?.question?.id || index}`;
                return (
                  <Draggable
                    key={id}
                    draggableId={id}
                    index={index}
                    isDragDisabled={options.disabled}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <options.renderItem {...item} index={index} disabled={options.disabled} />
                      </div>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

    </>
  )
}

export default CustomMove;
