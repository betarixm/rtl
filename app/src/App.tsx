import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Main from "./pages/Main";
import Register from "./pages/Register";
import Event from "./pages/Event";

import {checkClientExist} from "./utils/api";

import './index.css';
import './App.css';


interface AppProps {

}

interface AppState {
    id: string;

    isLoading: boolean;
    isRegistered: boolean;
}

class App extends React.Component<AppProps, AppState> {
    state: AppState = {
        id: "",
        isLoading: true,
        isRegistered: false
    }

    componentDidMount = () => {
        const id: string | null = localStorage.getItem("id");

        if (id !== null) {
            checkClientExist(id).then((res) => {
                this.setState({
                    id: id,
                    isRegistered: res
                });
            }).catch((err) => {

            }).finally(() => {
                this.setState({isLoading: false})
            });

        } else {
            this.setState({isLoading: false});
        }
    }

    onRegisterSuccess = (id: string) => {
        localStorage.setItem("id", id);

        this.setState({
            id: id,
            isRegistered: true
        });
    }

    content = () => {
        if (this.state.isLoading) {
            return (
                <div>
                    Loading
                </div>
            )
        } else {
            return (
                <Router>
                    <Switch>
                        <Route exact path={"/"}>
                            <Main onSuccess={this.onRegisterSuccess}/>
                        </Route>

                        <Route exact path={"/register"}>
                            <Register onSuccess={this.onRegisterSuccess}/>
                        </Route>

                        <Route exact path={"/e/:eventId"}>
                            {
                                this.state.isRegistered
                                    ? <Event id={this.state.id}/>
                                    : <Main onSuccess={this.onRegisterSuccess}/>
                            }
                        </Route>

                    </Switch>
                </Router>

            );
        }
    }

    render = () => {
        return (
            <div className={"min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"}>
                {this.content()}
            </div>
        )
    }
}

export default App;
