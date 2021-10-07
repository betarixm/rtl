import React from "react";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";

import "../index.css";

interface ErrorProps extends RouteComponentProps {
    message: string;
}

interface ErrorState {

}

class _Error extends React.Component<ErrorProps, ErrorState> {
    state: ErrorState = {

    }

    render = () => {
        return (
            <div className={"container mx-auto items-center justify-center"}>
                <h1 className={"mt-6 text-center text-3xl font-extrabold text-gray-900"}>rtl</h1>
                <h2 className={"mt-2 text-center text-sm text-gray-600"}>Realtime Lottery</h2>

                <div className={"flex flex-col mx-auto rounded-3xl overflow-hidden shadow-md p-8 m-4 bg-white max-w-md space-y-4"}>
                    <h1 className={"text-center text-2xl font-bold text-gray-900"}>{this.props.message}</h1>

                    <div>
                        <Link
                            to={"/"}
                            type="submit"
                            className={"rounded-3xl shadow-lg group relative w-full flex justify-center py-3 px-5 border border-transparent text-sm font-medium text-white mt-4 bg-postech-400 hover:bg-postech-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-postech-500"}>
                            메인으로
                        </Link>
                    </div>
                </div>

            </div>
        )
    }
}

const Error = withRouter(_Error);

export default Error;
