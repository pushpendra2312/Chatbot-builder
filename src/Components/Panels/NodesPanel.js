import React from 'react';
import '../../index.css';
import './styles.css';

const CUSTOM_NODES = [
    {
        id: '1',
        placeholder: "Message",
        nodeType: 'text_node',
        styleClasses: 'msg-node border',
        isDraggable: true
    }
];

const DraggableDiv = (props) => {

    const { placeholder } = props;

    return (
        <div {...props}>
            {placeholder}
        </div>
    )
};

const NodesPanel = () => {

    const onDragStart = (nodeType) => (event) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className='border'>
            {
                CUSTOM_NODES.map((node) => {
                    const { id, placeholder, nodeType, styleClasses, isDraggable } = node;
                    return (
                        <DraggableDiv
                            key={id}
                            placeholder={placeholder}
                            className={styleClasses}
                            draggable={isDraggable}
                            onDragStart={onDragStart(nodeType)}
                        />
                    )
                })
            }
        </aside>
    );
};

export default NodesPanel
