import 'styles/user/user-info.scss';

import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';
import { Skeleton, Modal, Avatar, Menu, Button, Icon, Card, Upload, message, Input, Radio } from 'antd';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import axios from 'axios';
import { apiAddress } from 'config';

function getBase64(img, callback) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
}

function checkImg(file) {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		message.error('You can only upload images in JPG/PNG format!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		message.error('Images must be less than 2MB!');
	}
	return isJpgOrPng && isLt2M;
}

class AvatarModal extends React.Component {
	state = {
		imgSrc: this.props.currentAvatar,
		// fileList: [],
		visible: false
	};
	cropper = React.createRef();

	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	closeModal = e => {
		this.setState({
			visible: false,
		});
	};

	imgChange = info => {
		let { file } = info;
		if (checkImg(file)) {
			getBase64(info.file, imgBase64 => {
				this.setState({
					imgSrc: imgBase64
				});
			});
		}
	};

	submitImg = () => {
		let imgData = this.cropper.current.getCroppedCanvas().toDataURL();
		let { userId } = localStorage;

		axios.post(apiAddress + '/user/avatar', {
			userId,
			imgData
		})
			.then(res => {
				let { code, desc, data } = res.data;
				if (code === 0) {
					let { status, msg } = data;
					if (status === 0) {
						message.success(msg);
						setTimeout(() => location.reload(), 500);
					} else {
						message.error(msg);
					}
				} else {
					message.error(desc)
				}
			})
			.catch(error => {
				message.error('发生错误');
			});
	};

	render() {
		let { visible, imgSrc } = this.state;
		return (
			<div>
				<Button onClick={this.showModal} className="mt-10" type="primary">Modify avatar</Button>
				<Modal
					title="Modify avatar"
					visible={visible}
					// onOk={this.handleOk}
					onCancel={this.closeModal}
					footer={null}
				>
					<div>
						<Cropper
							ref={this.cropper}
							src={imgSrc}
							style={{ height: 300, width: '100%' }}
							// Cropper.js options
							// crop={this._crop.bind(this)}
							aspectRatio={1}
							guides={false} />
					</div>
					<div className="avatar-madal-btns-wrap">
						<Upload
							className="mr-10"
							accept="image/*"
							beforeUpload={() => false}
							showUploadList={false}
							onChange={this.imgChange}>
							<Button className="button-noborder">
								<Icon type="upload" />Select image
							</Button>
						</Upload>
						<Button type="primary" onClick={this.submitImg}>Confirm Upload</Button>
					</div>
				</Modal>
			</div>
		)
	}
}

class InfoItem extends React.Component {
	constructor(props) {
		super(props);
		let { value, editBtn = true } = props;
		this.state = {
			isEdit: false,
			editBtnVisible: value == null && editBtn
		};
	}

	showEditBtn = () => {
		this.setState({
			editBtnVisible: true
		});
	};

	hideEditBtn = () => {
		this.setState({
			editBtnVisible: false
		});
	};

	showEdit = () => {
		let { editBtnClick } = this.props;
		if (editBtnClick) {
			// console.log(editBtnClick)
			editBtnClick();
			return;
		}
		this.setState({
			editBtnVisible: this.props.value == null,
			isEdit: true
		});
	};

	cancelEdit = () => {
		this.setState({
			isEdit: false
		});
	};

	saveClick = e => {
		if (this.props.saveClick) this.props.saveClick(e);
	};

	render() {
		let { name, value, children, className, editBtn = true } = this.props;
		let { isEdit, editBtnVisible } = this.state;

		return (
			<div className={'info-item' + (className ? ' ' + className : '')}>
				<div className="item-name">{name}</div>
				{isEdit ? (
					<div className="edit-box">
						{children}
						<Button className="mr-5" type="primary" onClick={this.saveClick}>Save</Button>
						<Button onClick={this.cancelEdit}>Cancel</Button>
					</div>
				) : (
					<div className="item-value"
						onMouseOver={value == null || editBtn == false ? null : this.showEditBtn}
						onMouseOut={value == null || editBtn == false ? null : this.hideEditBtn}>
						{value !== null && (<span className="value-content">{value}</span>)}
						<a
							onClick={this.showEdit}
							style={{ display: editBtnVisible ? 'inline' : 'none' }}
							className="edit-btn">
							<Icon type="edit" />
							<span>Modify</span>
						</a>
					</div>
				)}
			</div>
		);
	}
}

async function sumbitInfo(infoName, value) {
	try {
		let res = await axios.post(apiAddress + '/user/info/change', {
			userId: localStorage['userId'],
			infoName,
			value
		});
		let { code, desc, data } = res.data;
		if (code === 0) {
			let { status, msg } = data;
			if (status === 0) {
				return msg;
			} else {
				return Promise.rej(new Error(msg));
			}
		} else {
			return Promise.rej(new Error(desc));
		}
	} catch (err) {
		return Promise.rej(err);
	}
}

class NicknameItem extends Component {
	state = {
		value: this.props.value,
		nickname: this.props.value
	};

	inputChange = e => {
		this.setState({
			nickname: e.target.value
		});
	};

	save = async () => {
		let { nickname } = this.state;
		if (!nickname) {
			message.warn('Please enter your nickname');
		}
		try {
			let msg = await sumbitInfo('nickname', nickname);
			message.success(msg);
			// this.setState({
			// 	value: nickname,
			// 	nickname: ''
			// });
			setTimeout(() => location.reload(), 500);
		} catch (err) {
			message.error(err.message);
		}
	};

	render() {
		let { nickname, value } = this.state;
		return (
			<InfoItem name="Nickname" value={value} className="nickname-item" saveClick={this.save}>
				<Input value={nickname} onChange={this.inputChange} />
			</InfoItem>
		);
	}
}

class SexItem extends Component {
	state = {
		value: this.props.value,
		sex: this.props.value
	};

	onChange = e => {
		this.setState({
			sex: e.target.value
		});
	};

	save = async () => {
		let { sex } = this.state;
		if (sex == null) {
			message.warn('Please select a gender');
		}
		try {
			let msg = await sumbitInfo('sex', sex);
			message.success(msg);
			setTimeout(() => location.reload(), 500);
		} catch (err) {
			message.error(err.message);
		}
	};

	render() {
		let { sex, value } = this.state;
		// let { value } = this.props;
		return (
			<InfoItem name="Gender" value={value == null ? null : (value ? 'female' : 'male')} className="nickname-item" saveClick={this.save}>
				<Radio.Group onChange={this.onChange} value={sex}>
					<Radio value={0}>male</Radio>
					<Radio value={1}>feamle</Radio>
				</Radio.Group>
			</InfoItem>
		);
	}
}

class IntroduceItem extends Component {
	state = {
		value: this.props.value,
		introduce: this.props.value
	};

	inputChange = e => {
		this.setState({
			introduce: e.target.value
		});
	};

	save = async () => {
		let { introduce } = this.state;
		if (!introduce) {
			message.warn('Please enter your introduce');
		}
		try {
			let msg = await sumbitInfo('introduce', introduce);
			message.success(msg);
			setTimeout(() => location.reload(), 500);
		} catch (err) {
			message.error(err.message);
		}
	};

	render() {
		let { introduce, value } = this.state;
		return (
			<InfoItem name="Introduce" value={value} className="introduce-item" saveClick={this.save}>
				<Input.TextArea rows={4} value={introduce} onChange={this.inputChange} />
			</InfoItem>
		);
	}
}

const pathMap = {
	'/user': 'info',
	'/user/account': 'account'
};

export default class UserInfo extends React.Component {
	constructor(props) {
		super(props);
		let { pathname } = this.props.history.location;
		this.state = {
			currentPage: pathMap[pathname],
			isGetInfo: true,
			userInfo: {}
		}
	}

	menuClick = e => {
		// console.log(e.key)
		this.setState({
			currentPage: e.key
		});
	};

	componentDidMount() {
		axios.post(apiAddress + '/user/info', {
			userId: localStorage['userId']
		})
			.then(res => {
				let { code, desc, data } = res.data;
				if (code === 0) {
					let { status, msg, userInfo } = data;
					if (status === 0) {
						this.setState({
							userInfo
						});
					} else {
						message.error(msg);
					}
				} else {
					message.error(desc)
				}
				this.setState({
					isGetInfo: false
				});
			})
			.catch(error => {
				message.error('An error has occurred');
				this.setState({
					isGetInfo: false
				});
			});
	}

	render() {
		let { currentPage, userInfo, isGetInfo } = this.state;
		return (
			<div className="user-info-wrap">
				<div className="user-info-menu">
					<Menu onClick={this.menuClick} selectedKeys={[currentPage]} mode="inline">
						<Menu.Item key="info">
							<NavLink to="/user"><Icon type="edit" />Personal information</NavLink>
						</Menu.Item>
						<Menu.Item key="account">
							<NavLink to="/user/account"><Icon type="user" />Account Information</NavLink>
						</Menu.Item>
					</Menu>
				</div>
				<div className="user-info-content">
					<Route path="/user" exact render={() => <Info isGetInfo={isGetInfo} userInfo={userInfo} />} />
					<Route path="/user/account" exact render={() => <Account isGetInfo={isGetInfo} userInfo={userInfo} />} />
				</div>
			</div>
		);
	}
}

class Info extends React.Component {
	render() {
		let { isGetInfo, userInfo } = this.props;
		console.log(userInfo.avatar, 'iii')
		return (
			<Card title="Personal information" size="small">
				<div className="info-pannel-wrap">
					{isGetInfo ? (
						<Skeleton active />
					) : (
						<div className="info-pannel">
							<div className="avatar-wrap">

								<Avatar size={100} shape="square" src={userInfo.avatar} />
								<AvatarModal currentAvatar={userInfo.avatar} />
							</div>
							<div className="info-wrap">
								<NicknameItem value={userInfo.nickname} />
								<SexItem value={userInfo.sex} />
								<IntroduceItem value={userInfo.introduce} />
							</div>
						</div>
					)}
				</div>
			</Card>
		)
	}
}

class Account extends React.Component {
	state = {
		pwdModalVisible: false,
		oldPwd: '',
		newPwd: '',
		newPwdAgain: ''
	};

	inputChange = e => {
		let { name, value } = e.target;
		this.setState({
			[name]: value
		});
	};

	showModal = e => {
		this.setState({
			pwdModalVisible: true,
		});
	};

	closeModal = e => {
		this.setState({
			pwdModalVisible: false,
			oldPwd: '',
			newPwd: '',
			newPwdAgain: ''
		});
	};

	handleOk = e => {
		let { oldPwd, newPwd, newPwdAgain } = this.state;
		if (!oldPwd) {
			message.warn('Please enter your old password');
			return;
		}
		if (!newPwd) {
			message.warn('Please enter your new password');
			return;
		}
		if (!newPwdAgain) {
			message.warn('Please confirm your new password');
			return;
		}
		if (oldPwd == newPwd) {
			message.warn('The old password cannot be the same as the new password');
			return;
		}
		axios.post(apiAddress + '/user/pwd', {
			userId: localStorage['userId'],
			oldPwd,
			newPwd
		})
			.then(res => {
				let { code, desc, data } = res.data;
				if (code === 0) {
					let { status, msg } = data;
					if (status === 0) {
						message.success(msg);
						this.closeModal();
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
		let { isGetInfo, userInfo } = this.props;
		let { pwdModalVisible, oldPwd, newPwd, newPwdAgain } = this.state;
		return (
			<Card title="Account Information" size="small">
				<div className="info-pannel-wrap">
					{isGetInfo ? (
						<Skeleton active />
					) : (
						<div>
							<InfoItem name="Email" value={userInfo.email} editBtn={false} />
							<InfoItem name="Password" value={"************"} editBtnClick={this.showModal} />
							<Modal
								title="Change password"
								visible={pwdModalVisible}
								onOk={this.handleOk}
								onCancel={this.closeModal}
								okText="Save"
								cancelText="Cancel"
							>
								<div>
									<p>Old Password</p>
									<Input.Password name="oldPwd" value={oldPwd} onChange={this.inputChange} />
									<p className="mt-10">New Password</p>
									<Input.Password name="newPwd" value={newPwd} onChange={this.inputChange} />
									<p className="mt-10">New Password Confirmed</p>
									<Input.Password name="newPwdAgain" value={newPwdAgain} onChange={this.inputChange} />
								</div>
							</Modal>
						</div>
					)}
				</div>
			</Card>
		)
	}
}
