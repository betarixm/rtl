import React from "react";
import {Redirect, RouteComponentProps, withRouter} from "react-router-dom";
import {checkClientExist, checkEventExist} from "../utils/api";
import {URL_WS} from "../env/url";

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
        }).catch((err) => {
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
            setTimeout(() => {
                this.heartbeat();
            }, 1000);
        }

        this.ws.onmessage = (e: { data: string; }) => {
            const message = JSON.parse(e.data);
            if("numbers" in message) {
                this.setState({
                    clientNumbers: message.numbers
                })
            }

            if("error" in message) {
                this.ws.close();
            }
        }

        this.ws.onerror = () => {

        }
    }

    render = () => {
        if (this.state.isLoading) {
            return (<></>);
        } else if (!this.state.isValid) {
            return (
                <Redirect to={"/"}/>
            );
        } else {
            return (
                <div className={"container mx-auto items-center justify-center max-w-xl"}>

                    <div className="flex-col rounded-xl shadow-lg">
                        <div className={"grid grid-cols-3 p-5 bg-white rounded-t-xl"}>
                            <div className={"col-span-2"}>
                                <div className={"space-y-2.5 mb-4"}>
                                    <h1 className={"font-extrabold text-xl mb-3"}>Ticket</h1>
                                    <div>
                                        <h2>Student ID</h2>
                                        <div className={"font-extrabold text-2xl"}>{this.props.id}</div>
                                    </div>
                                    <div>
                                        <h2>School</h2>
                                        <div className={"font-extrabold text-2xl"}>POSTECH</div>
                                    </div>
                                </div>
                            </div>

                            <div className={""}>
                                <div className={"w-full"}>
                                    참여 중인 인원
                                </div>
                                <div className={"font-extrabold text-6xl"}>
                                    {this.state.clientNumbers}
                                </div>

                            </div>
                        </div>
                        <div className="flex bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-b-xl p-5 text-white">
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