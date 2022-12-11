import React from 'react'
import '../../index.css';
import './styles.css';
const Navbar = (props) => {

    const { handleSaveBtn } = props;

    return (
        <div className='navbar'>
            <button className='save-btn border' onClick={handleSaveBtn}>
                Save Changes
            </button>
        </div>
    )
}

export default Navbar