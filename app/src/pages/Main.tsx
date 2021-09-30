import React from "react";

import {Link, Redirect, RouteComponentProps, withRouter} from "react-router-dom";

import "../index.css";
import {checkClientExist} from "../utils/api";

interface MainParams {
    eventId?: string;
}

interface MainProps extends RouteComponentProps<MainParams> {
    onSuccess(id: string): void;
}

interface MainStates {
    id: string;
    link: string;
    isLoading: boolean;
    isFailed: boolean;
    isSuccess: boolean;
    error?: string;
}

class _Main extends React.Component<MainProps, MainStates> {
    state: MainStates = {
        id: "",
        link: "/",
        isSuccess: false,
        isLoading: false,
        isFailed: false
    }

    validateExistId = () => {
        this.setState({isLoading: true});

        const _id = this.state.id;

        checkClientExist(_id).then((res) => {
            if(res) {
                this.props.onSuccess(_id)
                this.setState({isSuccess: true})
            }

            this.setState({isFailed: !res});
        }).catch((err) => {
            this.setState({isFailed: true});
        }).finally(() => {
            this.setState({isLoading: false});
        })
    }

    setLink = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            link: `/e/${e.target.value}`
        });
    }

    setId = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            id: e.target.value
        });
    }

    render = () => {
        if(this.state.isSuccess && !this.state.isFailed) {
            return (
                <Redirect to={this.state.link} />
            );
        }
        return (
            <div className={"container mx-auto items-center justify-center"}>
                <h1 className={"mt-6 text-center text-3xl font-extrabold text-gray-900"}>rtl</h1>
                <h2 className={"mt-2 text-center text-sm text-gray-600"}>Real-Time Lottery</h2>
                <div className={"mx-auto rounded-xl overflow-hidden shadow-lg p-6 m-4 bg-white max-w-md"}>
                    {
                        this.state.isFailed
                            ? (
                                <div className={"mx-auto rounded-xl overflow-hidden shadow-sm p-3 px-5 mb-4 bg-red-500 text-white space-y-1 max-w-md"}>
                                    등록되지 않은 학번입니다.
                                </div>
                            )
                            : ""
                    }
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="event-id" className="sr-only">
                                Event Code
                            </label>
                            <input
                                id="event-id"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Event Code"
                                onChange={this.setLink}
                                value={this.props.match.params.eventId !== null ? this.props.match.params.eventId : ""}
                            />
                        </div>
                        <div>
                            <label htmlFor="student-id" className="sr-only">
                                Student ID
                            </label>
                            <input
                                id="student-id"
                                type="number"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Student ID"
                                onChange={this.setId}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                              onClick={this.validateExistId}
                              type="submit"
                              className={"group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white mt-4 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"}>
                            Go
                        </button>
                    </div>
                </div>

                <h2 className={"mt-2 text-center text-sm text-gray-600"}>
                    아직 등록하지 않았나요? ─{" "}
                    <Link to={"/register"} className={"underline"}>
                        Register
                    </Link>
                </h2>

            </div>
        )
    }
}

const Main = withRouter(_Main);

export default Main;