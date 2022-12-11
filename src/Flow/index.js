import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Navbar from '../Components/Navbar';
import SettingsPanel from '../Components/SettingsPanel';
import NodesPanel from '../Components/NodesPanel';


import '../index.css';

const initialNodes = [];

const isEmptyObject = (obj) => {
    return Object.keys(obj).length > 0 ? false : true;
}

const TextNode = (props) => {

    const { data: { label = '', customOnNodeClick } } = props;

    return (
        <div className='border text_node' onClick={() => customOnNodeClick(props)}>
            <Handle
                type="source"
                position="right"
                isValidConnection={isValidConnection}
            />
            <div>{label}</div>
            <Handle
                type="target"
                position="left"
                isValidConnection={isValidConnection}
            />
        </div>
    );
}

const isValidConnection = (connection) => {
    const { source = null } = connection || {};
    return sourceMap[source] ? false : true;
};

const sourceMap = {};
const targetMap = {};

const nodeTypes = {
    text_node: TextNode
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const Flow = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);

    const onConnect = useCallback((params) => {
        addSourceNodeIdToMap(params)
        addTargetNodeIdToMap(params)
        setEdges((eds) => addEdge(params, eds))
    }, [setEdges]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const addTargetNodeIdToMap = (args) => {
        const { target = null } = args || {};
        if (targetMap[target]) ++targetMap[target];
        else targetMap[target] = ++targetMap[target];
    }

    const addSourceNodeIdToMap = (args) => {
        const { source = null } = args || {};
        if (sourceMap[source]) ++sourceMap[source];
        else sourceMap[source] = ++sourceMap[source];

    }

    const addNodeIdToSourceMap = (...args) => {
        const [nodeId] = args;
        sourceMap[nodeId] = 0;
    }

    const addNodeIdToTargetMap = (...args) => {
        const [nodeId] = args;
        targetMap[nodeId] = 0;
    }

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: 'Text Message', customOnNodeClick: customOnNodeClick },
            };
            addNodeIdToTargetMap(newNode.id)
            addNodeIdToSourceMap(newNode.id)
            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes]
    );

    const customOnNodeClick = (data) => {
        console.log(data)
        setSelectedNode(data);
    }

    const closeSettingPanel = (nodeData) => {
        console.log("in closeSettingPanel", nodeData)
        setSelectedNode(null)
    }

    const onEdgesDelete = (deletedEdges) => {
        deletedEdges.forEach((edge) => {
            const { source, target } = edge
            sourceMap[source] = --sourceMap[source];
            targetMap[target] = --targetMap[target];
        })
    }

    const onNodesDelete = (deleteNodes) => {
        deleteNodes.forEach((node) => {
            const { id } = node
            delete sourceMap[id]
            delete targetMap[id]
        })
        setSelectedNode(null)
    }

    const handleSaveBtn = () => {
        if (isEmptyObject(targetMap)) return;
        let noTargetHandleNodesCount = -1;

        nodes.forEach((node) => {
            const { id } = node;
            if (targetMap[id] === 0) ++noTargetHandleNodesCount;
        })

        if (noTargetHandleNodesCount > 0) alert('Cannot Save Flow')
        else alert('Need to Implement Saved Functionality')

    }

    return (
        <>
            <ReactFlowProvider>
                <Navbar handleSaveBtn={handleSaveBtn} />
                <div className="dndflow">
                    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            nodeTypes={nodeTypes}
                            onEdgesDelete={onEdgesDelete}
                            onConnect={onConnect}
                            onNodesDelete={onNodesDelete}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            fitView
                        >
                            <Controls />
                        </ReactFlow>
                    </div>
                    {
                        selectedNode ? (
                            <SettingsPanel
                                selectedNode={{ ...selectedNode }}
                                setSelectedNode={setSelectedNode}
                                nodes={nodes}
                                setNodes={setNodes}
                                closeSettingPanel={closeSettingPanel}
                                reactFlowInstance={reactFlowInstance}
                            />
                        ) : <NodesPanel />
                    }
                </div>
            </ReactFlowProvider>
        </>
    );
};

export default Flow;
