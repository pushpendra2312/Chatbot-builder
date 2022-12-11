import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Handle,
    getOutgoers,
    getIncomers,
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

    console.log("textNode", props)
    const { id = null, data: { label = '', customOnNodeClick } } = props;

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
    const { source = null, target = null } = connection || {};
    console.log("hi123123", connection, sourceMap);
    if (sourceMap[source]) {
        console.log("hi123123 sourcemap count", source, sourceMap[source])
        return false;
    } else {
        console.log("hi123123 sourc", source, sourceMap[source])
        return true;
    }

};
const flowKey = 'saved-flow';

const sourceMap = {};
const targetMap = {};
// const accessSourceMap = (callBackFn, ...args) => {
//     return callBackFn(sourceMap, ...args)
// }

const copyToClipboard = (id = null, cb) => {
    if (navigator.clipboard) {
        let copyText = document.getElementById(id).innerHTML;
        navigator.clipboard.writeText(copyText).then(() => {
            if (cb) cb();
        });
    }
}

const nodeTypes = {
    text_node: TextNode
};

const nodesIdsMap = {};
// const

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);

    const onConnect = useCallback((params) => {
        addSourceNodeIdToMap(params)
        addTargetNodeIdToMap(params)
        setEdges((eds) => addEdge(params, eds))
    }, []);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const addTargetNodeIdToMap = (args) => {
        console.log('hi123123 123123123XXXXXXXXXXXXXXXXXXXXXX', args)
        const { target = null } = args || {};
        if (targetMap[target]) {
            console.log("hi123123 targetmap count", target, targetMap[target])
        } else {
            console.log("hi123123 target", target, targetMap[target])
            targetMap[target] = ++targetMap[target]
        }
    }

    const addSourceNodeIdToMap = (args) => {
        console.log('hi123123 123123123XXXXXXXXXXXXXXXXXXXXXX', args)
        const { source = null } = args || {};
        if (sourceMap[source]) {
            console.log("hi123123 sourcemap count", source, sourceMap[source])
        } else {
            console.log("hi123123 sourc", source, sourceMap[source])
            sourceMap[source] = ++sourceMap[source]
        }
    }

    console.log("nodes", nodes, edges)

    const addNodeIdToSourceMap = (...args) => {
        const [nodeId] = args;
        // if (sourceMap[nodeId]) sourceMap[nodeId] = ++sourceMap[nodeId]
        sourceMap[nodeId] = 0;
    }

    const addNodeIdToTargetMap = (...args) => {
        const [nodeId] = args;
        // if (sourceMap[nodeId]) sourceMap[nodeId] = ++sourceMap[nodeId]
        targetMap[nodeId] = 0;
    }
    console.log('sourcemap', sourceMap, targetMap)

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
        [reactFlowInstance]
    );

    const customOnNodeClick = (data) => {
        console.log(data)
        setSelectedNode(data);
    }

    // const onNodeClick = (data) => {
    //     console.log("onNodeClick", data)
    //     const selectedNodeId = data.target.dataset.id;
    //     const selectedNode = reactFlowInstance.getNode(selectedNodeId)
    //     setSelectedNode(selectedNode);
    // }

    const closeSettingPanel = (nodeData) => {
        console.log("in closeSettingPanel", nodeData)
        setSelectedNode(null)
    }

    const onConnectEnd = (params) => {
        console.log("hi123123 endXXXXXXXXXXXXXX", params)
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
    }

    const handleSaveBtn = () => {
        if (isEmptyObject(targetMap)) return;
        let noTargetHandleNodesCount = -1;
        console.log('sourceMap targetMap', sourceMap, targetMap)

        nodes.map((node) => {
            const { id } = node;
            if (targetMap[id] === 0) ++noTargetHandleNodesCount;
        })

        if (noTargetHandleNodesCount > 0) alert('Cannot Save Flow')
        else alert('Need to implement Saved functionality')

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
                            // onNodeClick={onNodeClick}
                            nodeTypes={nodeTypes}
                            onEdgesDelete={onEdgesDelete}
                            onConnect={onConnect}
                            onNodesDelete={onNodesDelete}
                            onConnectEnd={onConnectEnd}
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
                            // handleInputChange={handleInputChange}
                            />
                        ) : <NodesPanel />
                    }
                </div>
            </ReactFlowProvider>
        </>
    );
};

export default DnDFlow;
