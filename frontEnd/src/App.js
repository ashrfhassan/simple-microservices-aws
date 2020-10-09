import React, {Fragment} from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Row} from "react-bootstrap";
import io from 'socket.io-client';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            socketConnection: undefined,
            authUser: undefined,
            login: {
                email: '',
                password: '',
            },
            register: {
                name: '',
                email: '',
                password: '',
                address: '',
                selectedColor: 'primary'
            },
            text: '',
            users: [
                // {
                //     id: 2,
                //     name: 'tom',
                //     email: 'tom@tom.com',
                //     address: "12st, nyc",
                //     'bootstrap-color': "primary",
                // },
            ],
            messages: [
                //     {
                //     sender: 3,
                //     text: 'helloooooo'
                // }
            ]
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.socketConnection === undefined && this.state.socketConnection !== undefined) {
            this.loadUsers();
            this.loadMessages();
            this.state.socketConnection.on('receiveMessage', this.pushMessage);
        }
    }

    loadUsers = () => {
        //?jwt was sent because of the preflight OPTIONS as Authorization not sent to kong
        fetch(`${process.env.REACT_APP_API_GATEWAY}/users/api/users/?jwt=` + this.state.authUser.token, {
            method: 'get',
            headers: {'Authorization': 'Bearer ' + this.state.authUser.token},
        })
            .then(res =>
                res.json()
            ).then((results) => {
            this.setState({
                ...this.state,
                users: results
            })
        });
    }

    loadMessages = () => {
        fetch(`${process.env.REACT_APP_API_GATEWAY}/chat-db/api/messages/?jwt=` + this.state.authUser.token, {
            method: 'get',
            headers: {'Authorization': 'Bearer ' + this.state.authUser.token},
        })
            .then(res =>
                res.json()
            ).then((results) => {
            this.setState({
                ...this.state,
                messages: results
            })
        });
    }

    handleText = (e) => {
        const text = e.target.value;
        this.setState({
            ...this.state,
            text: text
        })
    }

    sendMessage = (e) => {
        const key = e.keyCode;
        if (key === 13) {
            this.setState({
                ...this.state,
                text: '',
            });
            this.state.socketConnection.emit('sendMessage', {
                sender: this.state.authUser.id,
                text: this.state.text
            })
        }
    }

    pushMessage = (msg) => {
        this.setState({
            ...this.state,
            messages: [
                ...this.state.messages,
                msg
            ]
        })
    }

    // login form

    login = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_GATEWAY}/auth/api/users/login`, {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "email": this.state.login.email,
                    "password": this.state.login.password,
                })
            });
            const results = await res.json();
            if (results.errors) {
                this.setState({
                    ...this.state,
                    errors: results.errors
                });
                return;
            }
            if (results.statusCode) {
                this.setState({
                    ...this.state,
                    errors: [results.message]
                });
                return;
            }
            this.setState({
                ...this.state,
                errors: [],
                socketConnection: io(process.env.REACT_APP_SOCKET_URI + '?jwt=' + results.token
                    , {transports: ['websocket'], extraHeaders: {Authorization: 'Bearer ' + results.token}}),
                authUser: results
            })
        } catch (e) {
            this.setState({
                ...this.state,
                errors: [`Login failed!: ${(typeof e === 'object') ? JSON.stringify(e.message) : e.toString()}`]
            });
        }
    }

    handleEnterLogin = (e) => {
        if (e.keyCode === 13) {
            this.login();
        }
    }

    handleLoginEmail = (e) => {
        const text = e.target.value;
        this.setState({
            ...this.state,
            login: {
                ...this.state.login,
                email: text
            }
        })
    }

    handleLoginPassword = (e) => {
        const text = e.target.value;
        this.setState({
            ...this.state,
            login: {
                ...this.state.login,
                password: text
            }
        })
    }

    // registration form

    register = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_GATEWAY}/auth/api/users/register`, {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "name": this.state.register.name,
                    "email": this.state.register.email,
                    "password": this.state.register.password,
                    "address": this.state.register.address,
                    "bootstrapColor": this.state.register.selectedColor,
                })
            });
            const results = await res.json();
            if (results.errors) {
                this.setState({
                    ...this.state,
                    errors: results.errors
                });
                return;
            }
            if (results.statusCode) {
                this.setState({
                    ...this.state,
                    errors: [results.message]
                });
                return;
            }
            this.setState({
                ...this.state,
                errors: [],
                socketConnection: io(process.env.REACT_APP_SOCKET_URI + '?jwt=' + results.token
                    , {transports: ['websocket'], extraHeaders: {Authorization: 'Bearer ' + results.token}}),
                authUser: results
            });
        } catch (e) {
            this.setState({
                ...this.state,
                errors: [`Register failed!: ${(typeof e === 'object') ? JSON.stringify(e.message) : e.toString()}`]
            });
        }
    }

    handleEnterRegister = (e) => {
        if (e.keyCode === 13) {
            this.register();
        }
    }

    handleRegisterName = (e) => {
        const text = e.target.value;
        this.setState({
            ...this.state,
            register: {
                ...this.state.register,
                name: text
            }
        })
    }

    handleRegisterEmail = (e) => {
        const text = e.target.value;
        this.setState({
            ...this.state,
            register: {
                ...this.state.register,
                email: text
            }
        })
    }

    handleRegisterPassword = (e) => {
        const text = e.target.value;
        this.setState({
            ...this.state,
            register: {
                ...this.state.register,
                password: text
            }
        })
    }

    handleRegisterAddress = (e) => {
        const text = e.target.value;
        this.setState({
            ...this.state,
            register: {
                ...this.state.register,
                address: text
            }
        })
    }

    handleSelectedColor = (e) => {
        const text = e.target.value;
        this.setState({
            ...this.state,
            register: {
                ...this.state.register,
                selectedColor: text
            }
        })
    }

    render() {
        const {users, authUser, messages} = this.state;
        return (
            <div className="App container-fluid">
                <header className="justify-content-center row">
                    <img src={logo} className="App-logo" alt="logo"/>
                </header>
                <br/>
                <div>
                    <ul>
                        {
                            this.state.errors.map((errorMsg, i) => (
                                <li className="alert-danger" key={i}>{errorMsg}</li>
                            ))
                        }
                    </ul>
                </div>
                {
                    (authUser === undefined) ?
                        <Fragment>
                            <div className="row justify-content-around">
                                <div className="col-6 text-center">
                                    <h3>Register</h3>
                                    <input placeholder="enter your name..."
                                           value={this.state.register.name}
                                           onChange={this.handleRegisterName}
                                           onKeyUp={this.handleEnterRegister}
                                           className="form-control"/><br/>
                                    <input placeholder="enter your email..."
                                           value={this.state.register.email}
                                           onChange={this.handleRegisterEmail}
                                           onKeyUp={this.handleEnterRegister}
                                           className="form-control"/><br/>
                                    <input placeholder="enter your password..."
                                           value={this.state.register.password}
                                           onChange={this.handleRegisterPassword}
                                           onKeyUp={this.handleEnterRegister}
                                           type="password"
                                           className="form-control"/><br/>
                                    <input placeholder="enter your address..."
                                           value={this.state.register.address}
                                           onChange={this.handleRegisterAddress}
                                           onKeyUp={this.handleEnterRegister}
                                           type="text" className="form-control"/><br/>
                                    <select className="form-control" value={this.state.register.selectedColor}
                                            onChange={this.handleSelectedColor}
                                            onKeyUp={this.handleEnterRegister}
                                    >
                                        <option className="alert-primary" value="primary">Primary</option>
                                        <option className="alert-info" value="info">Info</option>
                                        <option className="alert-warning" value="warning">Warning</option>
                                        <option className="alert-danger" value="danger">Danger</option>
                                    </select><br/>
                                    <button className="btn btn-info" onClick={this.register}>Register</button>
                                </div>
                                <div className="col-6 text-center">
                                    <h3>Login</h3>
                                    <input placeholder="enter your email..."
                                           onChange={this.handleLoginEmail}
                                           onKeyUp={this.handleEnterLogin}
                                           className="form-control"/><br/>
                                    <input placeholder="enter your password..."
                                           onChange={this.handleLoginPassword}
                                           onKeyUp={this.handleEnterLogin}
                                           type="password" className="form-control"/><br/>
                                    <button className="btn btn-info" onClick={this.login}>Login</button>
                                </div>
                            </div>
                        </Fragment>
                        :
                        <Fragment>
                            <div className="row justify-content-around">
                                <div className="col-7 chat">
                                    {
                                        messages.map((message, index) => (<Row key={index} className="mb-2">
                                            <Col
                                                className={`col-6 ${message.sender === authUser.id ? 'order-12 alert-danger text-right' : 'text-left'}`}>{message.sender}.{message.text}</Col>
                                            <Col className="col-6">

                                            </Col>
                                        </Row>))
                                    }
                                </div>
                                <div className="col-3 users">
                                    {
                                        users.map((user, index) => (
                                            <Row className={`user-card alert-${user['bootstrap_color']}`}
                                                 title={user.address} key={index}>
                                                <Col>{user.id}.{user.name}</Col>
                                            </Row>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6 offset-1">
                                    <input placeholder="start typing..." value={this.state.text}
                                           onChange={this.handleText}
                                           onKeyUp={this.sendMessage} className="d-block" style={{width: 'inherit'}}/>
                                </div>
                            </div>
                        </Fragment>
                }
            </div>
        )
    }
}

export default App;
