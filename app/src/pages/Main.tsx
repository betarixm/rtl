import React from "react";

import {Redirect, RouteComponentProps, withRouter} from "react-router-dom";

import "../index.css";
import {checkClientExist} from "../utils/api";
import Form from "../components/Form";
import Field from "../components/Field";

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
            if (res) {
                this.props.onSuccess(_id)
                this.setState({isSuccess: true})
            }

            this.setState({isFailed: !res});
        }).catch(() => {
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

    onValidateFailed = () => {
        return (
            <> {
                this.state.isFailed
                    ? (
                        <div
                            className={"animate-up text-center mx-auto rounded-3xl overflow-hidden shadow-lg p-3 px-5 mb-4 bg-gray-500 text-white w-full"}>
                            등록되지 않은 학번입니다.
                        </div>
                    )
                    : ""
            } </>
        );

    }

    fields = () => {
        return (
            <>
                <Field id={"event-id"} type={"text"} label={"Event Code"}
                       value={this.props.match.params.eventId !== null ? this.props.match.params.eventId : ""}
                       placeholder={"Event Code"} required={true} onChange={this.setLink}/>
                <Field id={"student-id"} type={"number"} label={"Student ID"} value={this.state.id} placeholder={"Student ID"}
                       required={true} onChange={this.setId}/>
            </>
        )
    }

    render = () => {
        if (this.state.isSuccess && !this.state.isFailed) {
            return (
                <Redirect to={this.state.link}/>
            );
        }

        return (
            <Form title={"Checkin"} fields={this.fields()} tipMessage={"아직 등록하지 않았나요?"} tipUrl={"/register"}
                  tipTitle={"Register"} onEnd={this.onValidateFailed()} onButtonClick={this.validateExistId}/>
        )
    }
}

const Main = withRouter(_Main);

export default Main;