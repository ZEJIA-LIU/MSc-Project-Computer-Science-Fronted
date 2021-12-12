import 'styles/user/login.scss';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { Card, Input, Icon, Button, message } from 'antd';
import axios from 'axios';
import { apiAddress } from 'config';

// 校验邮箱格式
function checkEmail(Email) {
	var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
	if (Email && reg.test(Email)) {
		return true;
	} else {
		return false;
	}
}

class Login extends React.Component {
	state = {
		showForm: 'login',
		// showForm: 'register',
		loginEmail: '',
		loginPwd: '',
		registerNickname: '',
		registerPwd: '',
		registerEmail: '',
		mailCode: '',
		disabledGetMailCode: false,
		canGetMailCodeTime: 60
	};

	toggleForm = next => this.setState({
		showForm: next,
		loginEmail: '',
		loginPwd: '',
		registerNickname: '',
		registerPwd: '',
		registerEmail: '',
		mailCode: ''
	});

	inputChange = e => {
		let { name, value } = e.target;
		this.setState({
			[name]: value
		});
	};

	submitLogin = () => {
		let { loginEmail, loginPwd } = this.state;

		if (!loginEmail) {
			message.warn('Please fill in your email');
			return;
		}
		if (!loginPwd) {
			message.warn('Please fill in your password');
			return;
		}

		axios.post(apiAddress + '/user/login', {
			username: loginEmail,
			password: loginPwd
		})
			.then(res => {
				let { code, desc, data } = res.data;
				if (code === 0) {
					let { status, msg, token } = data;
					if (status === 0) {
						localStorage['token'] = token;
						message.success(msg);
						this.props.history.push('/');
					} else {
						message.error(msg);
					}
				} else {
					message.error(desc)
				}
			})
			.catch(error => {
				message.error('An error has occurred');
			});
	};

	getMailCode = () => {
		let { registerEmail } = this.state;

		if (!registerEmail) {
			message.warn('Please fill in your email');
			return;
		}
		if (!checkEmail(registerEmail)) {
			message.warn('Incorrect email format');
			return;
		}

		axios.post(apiAddress + '/user/getMailCode', {
			email: registerEmail
		})
			.then(res => {
				let { code, desc, data } = res.data;
				if (code === 0) {
					let { status, msg } = data;
					if (status === 0) {
						message.success(msg);
						this.closeGetMailCode();
					} else {
						message.error(msg);
					}
				} else {
					message.error(desc)
				}
			})
			.catch(error => {
				message.error('An error has occurred');
			});
	};

	closeGetMailCode = () => {
		this.setState({
			disabledGetMailCode: true
		});
		setTimeout(this.countClock, 1000);
	};

	countClock = () => {
		let { canGetMailCodeTime } = this.state;
		if (canGetMailCodeTime == 0) {
			this.setState({
				disabledGetMailCode: false,
				canGetMailCodeTime: 60
			});
			return;
		}
		this.setState({
			canGetMailCodeTime: canGetMailCodeTime - 1
		});
		setTimeout(this.countClock, 1000);
	};

	submitRegister = () => {
		let { registerEmail, registerNickname, registerPwd, mailCode } = this.state;

		if (!registerNickname) {
			message.warn('Please fill in your nickname');
			return;
		}
		if (registerNickname.length > 10) {
			message.warn('Nickname should be no more than 10 characters');
			return;
		}
		if (!registerPwd) {
			message.warn('Please fill in your password');
			return;
		}
		if (registerPwd.length > 20) {
			message.warn('Password should be no more than 20 characters');
			return;
		}
		if (!registerEmail) {
			message.warn('Please fill in your email');
			return;
		}
		if (!checkEmail(registerEmail)) {
			message.warn('Incorrect email format');
			return;
		}
		if (!mailCode) {
			message.warn('Please fill in the email verification code');
			return;
		}

		axios.post(apiAddress + '/user/register', {
			nickname: registerNickname,
			email: registerEmail,
			password: registerPwd,
			mailCode
		})
			.then(res => {
				let { code, desc, data } = res.data;
				if (code === 0) {
					let { status, msg } = data;
					if (status === 0) {
						message.success(msg);
					} else {
						message.error(msg);
					}
				} else {
					message.error(desc)
				}
			})
			.catch(error => {
				message.error('An error has occurred');
			});
	};

	render() {
		return (
			<div className="login-wrap">
				<div className="login-container">
					<h1 className="login-logo">
						<Icon type="code" />
						<span className="logo-txt">Learn Code Together</span>
					</h1>
					{
						this.state.showForm == 'login' ? (
							<Card className="user-form">
								<div className="user-form-title">Login</div>
								<div className="user-form-label">Email:</div>
								<Input name="loginEmail" value={this.state.loginEmail} onChange={this.inputChange} />
								<div className="user-form-label">Password:</div>
								<Input.Password name="loginPwd" value={this.state.loginPwd} onChange={this.inputChange} />
								<Button className="mt-20" type="primary" block onClick={this.submitLogin}>Login</Button>
								<Button className="mt-20" block onClick={() => this.toggleForm('register')}>Register</Button>
								<div className="mt-20 txt-center txt-blue">
									<NavLink to="/">Direct access</NavLink>
								</div>
							</Card>
						) : (
							<Card className="user-form">
								<div className="user-form-title">Register</div>
								<div className="user-form-label">Nickname:</div>
								<Input name="registerNickname" value={this.state.registerNickname} onChange={this.inputChange} />
								<div className="user-form-label">Password:</div>
								<Input.Password name="registerPwd" value={this.state.registerPwd} onChange={this.inputChange} />
								<div className="user-form-label">Email:</div>
								<Input name="registerEmail" value={this.state.registerEmail} onChange={this.inputChange} />
								<div className="user-form-label">Mailbox verification code:</div>
								<div className="input-btn">
									<div className="input-wrap">
										<Input name="mailCode" value={this.state.mailCode} onChange={this.inputChange} />
									</div>
									<Button type="primary" disabled={this.state.disabledGetMailCode} onClick={this.getMailCode}>
										{this.state.disabledGetMailCode ? 'Retrieve the verification code(' + this.state.canGetMailCodeTime + 's)' : 'Get verification code'}
									</Button>
								</div>
								<Button className="mt-20" type="primary" onClick={this.submitRegister} block>Register</Button>
								<Button className="mt-20" block onClick={() => this.toggleForm('login')}>Login</Button>
							</Card>
						)
					}
				</div>
			</div>
		);
	}
}


export default Login;