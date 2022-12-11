import React from "react";
import { Handle } from "reactflow";
import { sourceMap } from "../../../../Flow";
import "./styles.css";

//  this function returns true or false based on whether the connecting node is already present in the sourcemap or not 
const isValidConnection = (...args) => {
    const [connection, sourceMap] = args;
    const { source = null } = connection || {};
    return sourceMap[source] ? false : true;
};

const TextNode = (props) => {
    const { data: { label = '', customOnNodeClick } } = props;
    const validate = () => (...args) => isValidConnection(...args, sourceMap);

    return (
        <div className="border container" onClick={() => customOnNodeClick(props)}>
            <div className="header">
                Send Message
            </div>
            <Handle
                type="source"
                position="right"
                isValidConnection={validate}
            />
            <p className="message">{label}</p>
            <Handle
                type="target"
                position="left"
                isValidConnection={isValidConnection}
            />
        </div>
    );
}

export default TextNode;