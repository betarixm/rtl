import React from "react";

import {Link} from "react-router-dom";

import "../index.css";


interface FormProps {
    title: string;
    fields: JSX.Element;

    tipMessage: string;
    tipUrl: string;
    tipTitle: string;

    onEnd: JSX.Element;
    onButtonClick(): any;
}

interface FormState {

}

class Form extends React.Component<FormProps, FormState> {
    state: FormState = {

    }


    render = () => {
        return (
            <div className={"container mx-auto items-center justify-center"}>
                <h1 className={"mt-6 text-center text-3xl font-extrabold text-gray-900"}>rtl</h1>
                <h2 className={"mt-2 text-center text-sm text-gray-600"}>Realtime Lottery</h2>
                <div className={"animate-up animate-fadeIn flex flex-col mx-auto rounded-3xl overflow-hidden shadow-xl p-8 m-4 bg-white max-w-md space-y-4"}>
                    <h1 className={"text-center text-2xl font-bold text-gray-900"}>{this.props.title}</h1>
                    {this.props.onEnd}
                    <div className="space-y-2">
                        {this.props.fields}
                    </div>
                    <div>
                        <button
                            onClick={this.props.onButtonClick}
                            type="submit"
                            className={"rounded-3xl shadow-lg group relative w-full flex justify-center py-3 px-5 border border-transparent text-sm font-medium text-white mt-4 bg-postech-400 hover:bg-postech-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-postech-500"}>
                            Go
                        </button>
                    </div>
                </div>

                <h2 className={"mt-2 text-center text-sm text-gray-600"}>
                    {this.props.tipMessage} ─{" "}
                    <Link to={this.props.tipUrl} className={"underline"}>
                        {this.props.tipTitle}
                    </Link>
                </h2>

            </div>
        )
    }
}

export default Form;