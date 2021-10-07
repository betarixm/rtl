import React from "react";

import {register} from "../utils/api";
import {idValidator, nameValidator, phoneValidator} from "../utils/validators";
import Form from "../components/Form";
import Field from "../components/Field";


interface RegisterProps {
    onSuccess(id: string): void;
}

interface RegisterState {
    name: string;
    id: string;
    phone: string;

    validId: boolean;
    validName: boolean;
    validPhone: boolean;

    isRequesting: boolean;
    isSuccess: boolean;
    isError: boolean;

    errors: Array<string>;
}

class Register extends React.Component<RegisterProps, RegisterState> {
    state: RegisterState = {
        name: "",
        id: "",
        phone: "",
        validId: true,
        validName: true,
        validPhone: true,
        isRequesting: false,
        isSuccess: false,
        isError: false,
        errors: []
    }

    setId = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            id: e.target.value,
            validId: idValidator(e.target.value)
        })
    }

    setName = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            name: e.target.value,
            validName: nameValidator(e.target.value)
        })
    }

    setPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            phone: e.target.value,
            validPhone: phoneValidator(e.target.value)
        })
    }

    onSubmit = () => {
        this.setState({isRequesting: true});

        register(this.state.id, this.state.name, this.state.phone).then((res) => {
            if (res) {
                this.props.onSuccess(this.state.id);

                this.setState({
                    isRequesting: false,
                    isSuccess: true,
                    isError: false,
                    errors: []
                });
            } else {
                throw new Error("회원가입에 실패했습니다.");
            }
        }).catch((err) => {
            this.setState({
                isRequesting: false,
                isSuccess: false,
                isError: true,
                errors: err.errors
            });
        });
    }

    onEnded = () => {
        return (
            <>
                {
                    this.state.isError
                        ? (
                            <div
                                className={"animate-up text-center mx-auto rounded-3xl overflow-hidden shadow-lg p-3 px-5 mb-4 bg-gray-500 text-white w-full"}>
                                {this.state.errors}
                            </div>
                        )
                        : ""
                }

                {
                    this.state.isSuccess
                        ? (
                            <div
                                className={"animate-up text-center mx-auto rounded-3xl overflow-hidden shadow-lg p-3 px-5 mb-4 bg-gray-500 text-white w-full"}>
                                등록에 성공했습니다!
                            </div>
                        )
                        : ""
                }
            </>
        )
    }

    fields = () => {
        return (
            <>
                <Field id={"student-id"} type={"number"} label={"Student ID"} placeholder={"Student ID"} required={true}
                       onChange={this.setId} value={this.state.id}/>
                <Field id={"name"} type={"text"} label={"Name"} placeholder={"Name"} required={true}
                       onChange={this.setName} value={this.state.name}/>
                <Field id={"phone"} type={"number"} label={"Phone"} placeholder={"Phone"} required={true}
                       onChange={this.setPhone} value={this.state.phone}/>
            </>
        )
    }

    render = () => {
        return (
            <Form title={"Register"} fields={this.fields()} tipMessage={"이미 등록했나요?"} tipUrl={"/"} tipTitle={"Checkin"}
                  onEnd={this.onEnded()} onButtonClick={this.onSubmit}/>
        )
    }
}

export default Register;