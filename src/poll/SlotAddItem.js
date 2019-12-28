import React from 'react';
import DateTimePicker from 'react-datetime-picker';


export default function SlotAddItem(props) {
    return (
        <li key={props.index} className="list-group-item" >
            <div>
                from
                <DateTimePicker
                    onChange={(date) => props.onChangeSlot(props.index, true, date)}
                    value={props.slot.from}
                    />
                to
                <DateTimePicker
                    onChange={(date) => props.onChangeSlot(props.index, false, date)}
                    value={props.slot.to}
                    />
            </div>
            <button className="btn btn-danger btn-sm" 
                onClick={(e) => props.onRemoveSlot(props.index, e)}>حذف بازه</button>
        </li>
    )
} 