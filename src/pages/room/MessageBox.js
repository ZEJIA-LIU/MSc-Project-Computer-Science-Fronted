import React from 'react';
import { Button, Card, Avatar, Input, Tooltip, message } from 'antd';

class MessageFromOhter extends React.Component {
	render() {
		let { username, avatar, content } = this.props;
		return (
			<div className="message-other message-item">
				<Tooltip title={username} text>
					<Avatar className="message-avatar" shape="square" src={avatar} />
				</Tooltip>
				<div className="message-content">{content}</div>
			</div>
		);
	}
}

class MessageFromMe extends React.Component {
	render() {
		let { username, avatar, content } = this.props;
		return (
			<div className="message-me message-item">
				<div className="message-content">{content}</div>
				<Tooltip title={username} text>
					<Avatar className="message-avatar" shape="square" src={avatar} />
				</Tooltip>
			</div>
		);
	}
}

export default class MessageBox extends React.Component {
	state = {
		myUserId: localStorage['userId'],
		msgInput: ''
	};

	msgInputChange = e => {
		this.setState({
			msgInput: e.target.value
		});
	};

	sendMsg = () => {
		let { msgInput } = this.state;
		if (!msgInput) {
			message.warn('Please enter the message');
			return;
		}
		this.setState({
			msgInput: ''
		});
		this.props.sendMsg(msgInput);
	};

	render() {
		let { myUserId, msgInput } = this.state;
		let { msgList } = this.props;
		// console.log(msgList);
		return (
			<Card title="message" className="room-message-list" size="small">
				<div className="message-list">
					{
						msgList.map((msg, index) => {
							let { userInfo, content } = msg;
							return userInfo.userId == myUserId ? (
								<MessageFromMe avatar={userInfo.avatar} username={userInfo.nickname} content={content.replace(/ /g, "\u00a0")} key={index} />
							) : (
								<MessageFromOhter avatar={userInfo.avatar} username={userInfo.nickname} content={content.replace(/ /g, "\u00a0")} key={index} />
							);
						})
					}
				</div>
				<div className="room-message-send input-btn">
					<div className="input-wrap">
						<Input value={msgInput} onChange={this.msgInputChange} />
					</div>
					<Button type="primary" onClick={this.sendMsg}>send</Button>
				</div>
			</Card>
		);
	}
}
