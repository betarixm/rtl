import React from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {checkEventExist} from "../utils/api";
import {URL_WS} from "../env/url";
import Error from "./Error";

interface EventParams {
    eventId: string;
}

interface EventProps extends RouteComponentProps<EventParams> {
    id: string;
}

interface EventState {
    eventId: string;
    clientNumbers: number;
    isValid: boolean;
    isLoading: boolean;
    isDraw: boolean;
    drawResult: { name: string, phone_number: string };
}

class _Event extends React.Component<EventProps, EventState> {
    ws: any;

    state: EventState = {
        eventId: this.props.match.params.eventId,
        clientNumbers: 0,
        isValid: true,
        isLoading: true,
        isDraw: false,
        drawResult: {
            name: "",
            phone_number: ""
        }
    }

    componentDidMount = () => {
        checkEventExist(this.state.eventId).then((res) => {
            if (res) {
                this.initHeartbeat();
            }

            this.setState({isValid: res});
        }).catch(() => {
            this.setState({isValid: false});
        }).finally(() => {
            this.setState({isLoading: false})
        })
    }

    initHeartbeat = () => {
        const f = () => {
            this.ws.send(JSON.stringify({
                id: this.props.id,
                event: this.state.eventId
            }));
        }

        let intervalId: NodeJS.Timeout;

        this.ws = new WebSocket(`${URL_WS}/ws/event/${this.state.eventId}/${this.props.id}/`);

        this.ws.onopen = () => {
            intervalId = setInterval(f, 1000 * 3);
        }

        this.ws.onclose = () => {
            clearInterval(intervalId);
            this.initHeartbeat();
        }

        this.ws.onmessage = (e: { data: string; }) => {
            const message = JSON.parse(e.data);

            if ("type" in message && message.type === "event_number") {
                this.setState({
                    clientNumbers: message.numbers
                })
            }

            if ("type" in message && message.type === "event_draw_result") {
                this.setState({
                    isDraw: true,
                    drawResult: {
                        name: message.name,
                        phone_number: message.phone_number
                    }
                })
            }

            if ("error" in message) {
                this.ws.close();
            }
        }

        this.ws.onerror = () => {
            clearInterval(intervalId);
            this.ws.close();
        }
    }

    modal = () => {
        return (
            <div id="popup-modal" tabIndex={-1}
                 className="fixed top-0 left-0 right-0 z-50 overflow-x-hidden overflow-y-auto md:inset-0 h-full backdrop-blur-md bg-black bg-opacity-25 backdrop-filter backdrop-blur-xs object-bottom">
                <div className="absolute bottom-0 w-full p-4 m-auto md:top-0">
                    <div className="animate-up max-w-md bg-white rounded-3xl shadow-xl dark:bg-gray-700 m-auto">
                        <div className="p-6 text-center">
                            <h1 className={"font-extrabold text-xl"}>🎉</h1>
                            <h1 className={"font-extrabold text-xl mb-1"}>Congratulations!</h1>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                {this.state.drawResult.name} ({this.state.drawResult.phone_number})
                            </h3>
                            <button data-modal-toggle="popup-modal" type="button" onClick={() => {
                                this.setState({isDraw: false})
                            }}
                                    className="text-white bg-gradient-to-r from-postech-400 to-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render = () => {
        if (this.state.isLoading) {
            return (<></>);
        } else if (!this.state.isValid) {
            return (
                <Error message={"존재하지 않는 페이지입니다."}/>
            );
        } else {
            return (
                <>
                    {this.state.isDraw ? this.modal() : ""}
                    <div className={"container mx-auto items-center justify-center max-w-xs md:max-w-xl"}>
                        <div className="animate-scale relative flex-col rounded-3xl shadow-xl">
                        <span className="absolute flex h-6 w-6 top-0 right-0 -mt-2 -mr-2">
                            <span
                                className="animate-ping relative inline-flex h-full w-full rounded-full bg-red-500 opacity-75"/>
                            <span className="absolute inline-flex rounded-full h-6 w-6 bg-red-500 shadow-lg"/>
                        </span>
                            <div className={"flex-row p-5 bg-white rounded-t-3xl"}>
                                <h1 className={"font-extrabold text-xl mb-5 tracking-wider"}>
                                    EVENT PASS
                                </h1>
                                <div className={"grid grid-cols-1 md:grid-cols-3 font-mono"}>
                                    <div className={"col-span-2 mb-10 md:mb-0"}>
                                        <div className={"space-y-2.5 mb-4"}>
                                            <div>
                                                <h2>Student ID</h2>
                                                <div className={"font-bold text-2xl"}>{this.props.id}</div>
                                            </div>
                                            <div>
                                                <h2>School</h2>
                                                <div className={"font-bold text-2xl"}>POSTECH</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={""}>
                                        <div className={"w-full"}>
                                            Participants
                                        </div>
                                        <div className={"font-bold text-6xl"}>
                                            {this.state.clientNumbers}
                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div
                                className="bg-gradient-to-r from-postech-400 to-red-500 rounded-b-3xl px-6 p-4 text-white font-mono truncate">
                                {this.state.eventId}
                            </div>
                        </div>

                    </div>
                </>
            );
        }
    }
}

const Event = withRouter(_Event);

export default Event;