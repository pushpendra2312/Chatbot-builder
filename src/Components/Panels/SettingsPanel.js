import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import React from 'react'
import '../../index.css'
import './styles.css'

const SettingsPanel = ({ selectedNode, setSelectedNode, nodes, setNodes, closeSettingsPanel }) => {
    const { data: nodeValueObj = {}, nodeType } = selectedNode || {};
    const { label: inputValue = "" } = nodeValueObj || {};

    const handleInputChange = (e) => {
        const value = e.target.value;
        const updatedNodes = nodes.map((node) => {
            if (node.id === selectedNode.id) {
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
        <aside className='border'>
            <div className='settings-panel-header'>
                <FontAwesomeIcon icon={faArrowLeft} size="lg" className='left-arrow' onClick={closeSettingsPanel} />
                <span style={{ flex: '90%', textAlign: 'center', marginRight: '20px' }}>
                    Message
                </span>
            </div>
            <textarea className='border text-area' id="text_message" value={inputValue} rows="4" cols="30" onChange={handleInputChange} />
        </aside >
    )
}

export default SettingsPanel