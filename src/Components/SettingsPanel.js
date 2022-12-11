import React from 'react'
import '../index.css'
const SettingsPanel = ({ selectedNode, setSelectedNode, nodes, setNodes, closeSettingPanel, reactFlowInstance }) => {

    // const nodeData = reactFlowInstance.getNode(selectedNode)

    const { data: nodeValueObj = {} } = selectedNode || {};
    const { label: inputValue = "" } = nodeValueObj || {};

    const handleInputChange = (e) => {
        const value = e.target.value;
        const updatedNodes = nodes.map((node) => {
            if (node.id === selectedNode.id) {
                console.log("handle change", node, nodes)
                node.data = {
                    ...node.data,
                    label: value
                };
            }
            return node;
        });
        setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, label: value } })
        setNodes([...updatedNodes])
    }

    return (
        <div className='right-panel border'>
            <div onClick={closeSettingPanel}>{`<-`}</div>
            <textarea className='border' id="text_message" value={inputValue} rows="4" cols="30" onChange={handleInputChange} />
        </div >
    )
}

export default SettingsPanel