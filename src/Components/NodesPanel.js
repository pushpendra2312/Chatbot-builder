import React from 'react';
import '../index.css';
const NodesPanel = () => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className='border'>
            {/* <div className="description">You can drag these nodes to the pane on the right.</div> */}
            {/* <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
                Input Node
            </div> */}
            <div className="msg-node border" onDragStart={(event) => onDragStart(event, 'text_node')} draggable>
                Message
            </div>
            {/* <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
                Output Node
            </div> */}
        </aside>
    );
};

export default NodesPanel
