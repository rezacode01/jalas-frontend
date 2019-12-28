import React from 'react';


export default function Error(props) {
    return (
        <div>
            Error {props.code}: {props.message}
        </div>
    )
} 