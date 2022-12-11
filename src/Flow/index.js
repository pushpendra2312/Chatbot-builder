import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';
import "./styles.css";
import "../index.css";
import Navbar from '../Components/Navbar/Navbar';

import { isEmptyObject } from '../Utils/isEmptyObject';
import { NODE_TYPES } from '../Components/Nodes/nodesTypesMap';
import SettingsPanel from '../Components/Panels/SettingsPanel';
import NodesPanel from '../Components/Panels/NodesPanel';

// made maps to store the no. of target edges and source edges a node have
export const sourceMap = {};
export const targetMap = {};

const initialNodes = [];

// this generate unique ids for the nodes
let id = 0;
const getId = () => `node_${id++}`;

const Flow = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);

    const onConnect = useCallback((params) => {
        addSourceNodeIdToMap(params);
        addTargetNodeIdToMap(params);
        setEdges((eds) => addEdge(params, eds));
    }, [setEdges]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const addTargetNodeIdToMap = (args) => {
        const { target = null } = args || {};
        targetMap[target] = ++targetMap[target];
    }

    const addSourceNodeIdToMap = (args) => {
        const { source = null } = args || {};
        sourceMap[source] = ++sourceMap[source];

    }

    const addNodeIdToSourceMap = (...args) => {
        const [nodeId] = args;
        sourceMap[nodeId] = 0;
    }

    const addNodeIdToTargetMap = (...args) => {
        const [nodeId] = args;
        targetMap[nodeId] = 0;
    }

    // on node click this shows up the settings panel and hides nodes panel
    const customOnNodeClick = useCallback((data) => {
        setSelectedNode(data);
    }, [setSelectedNode]);

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

            addNodeIdToTargetMap(newNode.id);
            addNodeIdToSourceMap(newNode.id);

            setNodes((nds) => nds.concat(newNode));
        },
        [customOnNodeClick, reactFlowInstance, setNodes]
    );

    const closeSettingsPanel = () => setSelectedNode(null);

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

    // on save this function will check if there are more than one nodes that don't have target handles 
    const handleSaveBtn = () => {
        if (isEmptyObject(targetMap)) return;
        let noTargetHandleNodesCount = -1;

        nodes.forEach((node) => {
            const { id } = node;
            if (targetMap[id] === 0) ++noTargetHandleNodesCount;
        })

        if (noTargetHandleNodesCount > 0) alert("Cannot Save Flow");
        else alert("Need to Implement Saved Functionality");

    }

    return (
        <>
            <ReactFlowProvider>
                <Navbar handleSaveBtn={handleSaveBtn} />
                <div className="flow">
                    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            nodeTypes={NODE_TYPES}
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
                                closeSettingsPanel={closeSettingsPanel}
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
