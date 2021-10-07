import React from "react";

import "../index.css";


interface FieldProps {
    id: string;
    type: string;
    label: string;
    value?: string;
    placeholder: string;
    required: boolean;
    onChange(e: React.ChangeEvent<HTMLInputElement>): any;
}

interface FieldState {

}

class Field extends React.Component<FieldProps, FieldState> {
    state: FieldState = {}

    render = () => {
        return (
            <div>
                <label htmlFor={this.props.id} className="sr-only">
                    {this.props.label}
                </label>
                <input
                    id={this.props.id}
                    type={this.props.type}
                    required={this.props.required}
                    className="rounded-0 appearance-none relative block w-full px-3 py-2 border-b border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-postech-500 focus:border-postech-500 focus:z-10 sm:text-sm"
                    placeholder={this.props.placeholder}
                    onChange={this.props.onChange}
                    value={this.props.value}
                />
            </div>

        )
    }
}

export default Field;