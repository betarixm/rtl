import React from "react";
import {Link, Redirect} from "react-router-dom";

import {register} from "../utils/api";
import {idValidator, nameValidator, phoneValidator} from "../utils/validators";


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
            this.props.onSuccess(this.state.id);

            this.setState({
                isRequesting: false,
                isSuccess: true,
                isError: false,
                errors: []
            });

        }).catch((err) => {
            this.setState({
                isRequesting: false,
                isSuccess: false,
                isError: true,
                errors: err.errors
            });
        });
    }

    render = () => {
        return (
            <div className={"container mx-auto items-center justify-center"}>
                <h1 className={"mt-6 text-center text-3xl font-extrabold text-gray-900"}>rtl</h1>
                <h2 className={"mt-2 text-center text-sm text-gray-600"}>Real-Time Lottery</h2>

                <div className={"mx-auto rounded-xl overflow-hidden shadow-lg p-6 m-4 bg-white max-w-md"}>
                    {
                        this.state.isError
                            ? (
                                <div className={"mx-auto rounded-xl overflow-hidden shadow-sm p-3 px-5 mb-4 bg-red-500 text-white space-y-1 max-w-md"}>
                                    {this.state.errors}
                                </div>
                            )
                            : ""
                    }

                    {
                        this.state.isSuccess
                            ? (
                                <div className={"mx-auto rounded-xl overflow-hidden shadow-sm p-3 px-5 mb-4 bg-white space-y-1 max-w-md"}>
                                    Success
                                </div>
                            )
                            : ""
                    }
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="student-id" className="sr-only">
                                Student ID
                            </label>
                            <input
                                id="student-id"
                                type="number"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Student ID"
                                onChange={this.setId}
                            />
                        </div>
                    </div>

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="name" className="sr-only">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Name"
                                onChange={this.setName}
                            />
                        </div>
                    </div>

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="phone" className="sr-only">
                                Phone
                            </label>
                            <input
                                id="phone"
                                type="number"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Phone"
                                onChange={this.setPhone}
                            />
                        </div>
                    </div>

                    <button
                        disabled={this.state.isRequesting}
                        onClick={this.onSubmit}
                        className={"group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white mt-4 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"}>
                        {this.state.isRequesting ? "Loading" : "Register"}
                    </button>

                </div>

                <h2 className={"mt-2 text-center text-sm text-gray-600"}>
                    이미 등록했나요? ─{" "}
                    <Link to={"/"} className={"underline"}>
                        Checkin
                    </Link>
                </h2>

            </div>
        )
    }
}

export default Register;