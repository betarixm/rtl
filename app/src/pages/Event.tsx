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
}

class _Event extends React.Component<EventProps, EventState> {
    ws: any;

    state: EventState = {
        eventId: this.props.match.params.eventId,
        clientNumbers: 0,
        isValid: true,
        isLoading: true
    }

    componentDidMount = () => {
        checkEventExist(this.state.eventId).then((res) => {
            if (res) {
                this.heartbeat();
            }

            this.setState({isValid: res});
        }).catch(() => {
            this.setState({isValid: false});
        }).finally(() => {
            this.setState({isLoading: false})
        })
    }

    heartbeat = () => {
        const f = () => {
            this.ws.send(JSON.stringify({
                id: this.props.id,
                event: this.state.eventId
            }));
        }

        let intervalId: NodeJS.Timeout;

        this.ws = new WebSocket(`${URL_WS}/ws/event/${this.state.eventId}/${this.props.id}/`);

        this.ws.onopen = () => {
            intervalId = setInterval(f, 1000);
        }

        this.ws.onclose = () => {
            clearInterval(intervalId);
            this.heartbeat();
        }

        this.ws.onmessage = (e: { data: string; }) => {
            const message = JSON.parse(e.data);
            if ("numbers" in message) {
                this.setState({
                    clientNumbers: message.numbers
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

    render = () => {
        if (this.state.isLoading) {
            return (<></>);
        } else if (!this.state.isValid) {
            return (
                <Error message={"존재하지 않는 페이지입니다."}/>
            );
        } else {
            return (
                <div className={"container mx-auto items-center justify-center max-w-xs md:max-w-xl"}>

                    <div className="animate-scale relative flex-col rounded-3xl shadow-xl">
                        <span className="absolute flex h-6 w-6 top-0 right-0 -mt-2 -mr-2">
                            <span className="animate-ping relative inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                            <span className="absolute inline-flex rounded-full h-6 w-6 bg-red-500 shadow-lg" />
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
            );
        }
    }
}

const Event = withRouter(_Event);

export default Event;