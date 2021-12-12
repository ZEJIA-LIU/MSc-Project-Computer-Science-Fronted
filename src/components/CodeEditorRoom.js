import 'styles/code-editor.scss';
import React, { Component } from 'react';
import { Button, Select, Icon, Input, Tabs, message, Spin } from 'antd';
import { observer, inject } from "mobx-react";
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;
import languages from '../constant/languages';
import defaultTexts from '../constant/defaultTexts';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/theme/oceanic-next.css';


// 编辑器实例
let editor;

let RunningMsg = (
	<span><span className="mr-5">running</span><Spin /></span>
);

@inject("homeStore")
@observer
class CodeEditorRoom extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeStdPanel: '1',
			language: 'C',
			stdin: '',
			stdout: '',
			runBtnLoading: false,
			runStateTxt: 'Not started',
			runTime: '',
			runMemory: '',
			editorCode: props.editorCode,
			editable: props.editable
		};
	}

	stdPanelChange = key => {
		this.setState({
			activeStdPanel: key
		});
	};

	stdinChange = e => {
		this.setState({
			stdin: e.target.value
		});
	};

	runCode = () => {
		this.props.updateEditorStatus({
			activePanel: '2',
			isRunning: true
		});
	};

	languageChange = (mode, el) => {
		let language = el.props.children;
		if (mode.indexOf('python') == 0) mode = 'python';
		this.changeEditorMode(mode);
		editor.setValue(defaultTexts[language]);
		this.setState({
			language: language
		});
		this.props.updateEditorStatus({
			language,
			editorMode: mode
		});
	};

	changeEditorMode(mode) {
		editor.setOption('mode', mode);
	}

	componentDidMount() {
		let { editorCode, editable } = this.state;
		let { editorStatus: { editorMode } } = this.props;
		editor = CodeMirror.fromTextArea(
			document.getElementById('editor'),
			{
				mode: editorMode,
				lineNumbers: true,
				theme: 'oceanic-next',
				gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
				foldGutter: true,
				readOnly: editable ? false : 'nocursor'
			}
		);
		// editor.setValue(defaultTexts['C']);
		editor.setValue(editorCode);
		editor.setSize('auto', '400px');
		editor.on('change', editorObj => {
			this.props.editorCodeChange(editorObj.getValue());
		});
	}

	componentDidUpdate(prevProps, prevState) {
		let { props, state } = this;

		if (props.editable !== state.editable) {
			this.setState({
				editable: props.editable
			});
			editor.setOption('readOnly', props.editable ? false : 'nocursor');
			// this.editableChange(props.editable);
		}


		if (props.editorCode !== state.editorCode) {
			this.setState({
				editorCode: props.editorCode
			});
			editor.setValue(props.editorCode);
		}

		let { editorMode } = props.editorStatus;
		if (editorMode !== editor.getOption('mode')) {
			this.changeEditorMode(editorMode);
		}

	}

	render() {
		// layout: 'horizontal', 'vertical'
		let {
			layout = 'horizontal',
			updateEditorStatus,
			editorStatus } = this.props;
		let { editable } = this.state;
		let editorStdPanel = (
			<EditorStdPanel
				layout={layout}
				editable={editable}
				updateEditorStatus={updateEditorStatus}
				editorStatus={editorStatus} />
		);

		return (
			<div className="editor-container">
				<div className="editor-panel">
					<textarea id="editor"></textarea>
					<div className="editor-menu">
						<Select
							disabled={!editable}
							// defaultValue="text/x-csrc"
							value={editorStatus.editorMode}
							dropdownMatchSelectWidth={false}
							onChange={this.languageChange}>
							{
								languages.map((item, index) => <Option value={item.value} key={index}>{item.tag}</Option>)
							}
						</Select>
						<Button
							className="float-r"
							type="primary"
							disabled={!editable}
							loading={editorStatus.isRunning}
							onClick={this.runCode}>
							{editorStatus.isRunning ? 'Loading' : (<span><Icon type="bug" /> Run</span>)}
						</Button>
					</div>
					{layout === 'vertical' && editorStdPanel}
				</div>
				{layout === 'horizontal' && editorStdPanel}
			</div>
		);
	}
}

@inject("homeStore")
@observer
class EditorStdPanel extends Component {
	constructor(props) {
		super(props)
		let { editorStatus } = props;
		let { activePanel, stdin, runResult, isRunning } = editorStatus;
		this.state = {
			activePanel
		}
	}

	activePanelChange = key => {
		let { homeStore } = this.props;
		const { roomInfo, setEditorStatus } = homeStore
		setEditorStatus(Object.assign(roomInfo.editorStatus, {
			activePanel: key
		}))
		this.props.updateEditorStatus({
			activePanel: key
		});
	};

	stdinChange = e => {
		// this.props.stdinChange(e.target.value);
		this.props.updateEditorStatus({
			stdin: e.target.value
		});
	};

	render() {

		let { layout, editable, editorStatus, homeStore } = this.props;
		const { roomInfo } = homeStore
		const mobxStatus = roomInfo.editorStatus
		const { activePanel } = mobxStatus
		let { stdin, runResult, isRunning } = editorStatus;

		let runStateTxt = '',
			runTime = '',
			runMemory = '',
			runStdout = '',
			errorTxt = '';
		if (!runResult || isRunning) {
			runStateTxt = isRunning ? RunningMsg : 'Not started';
		} else {
			let { status, msg, data } = runResult;
			if (status == 0) {
				let { time, memory, stdout } = data;
				runStateTxt = 'Success';
				runTime = time;
				runMemory = memory;
				runStdout = stdout;
			}
			if (status == 1 || status == 2) {
				runStateTxt = msg;
				errorTxt = data.error;
			}
			if (status > 2) {
				runStateTxt = "An error has occurred";
				errorTxt = msg;
			}
		}

		return (

			<div className={"editor-std-panel editor-std-panel-" + layout}>
				<Tabs activeKey={activePanel} type="card" onChange={this.activePanelChange}>
					<TabPane tab="Output" key="1" disabled={!editable} >
						<div className="std-content">
							<p>add input: </p>
							<TextArea
								disabled={!editable}
								value={stdin}
								onChange={this.stdinChange}
								rows={7} />
						</div>
					</TabPane>
					<TabPane tab="Result" key="2" disabled={!editable}>
						{
							(!runResult || isRunning) ? (
								<div className="std-content">
									<p>status: {runStateTxt}</p>
								</div>
							) : (
								runResult.status == 0 ? (
									<div className="std-content">
										<p>status: {runStateTxt}</p>
										<p>running time: {runTime}</p>
										<p>memory usage: {runMemory}</p>
										<p>output: </p>
										<p>{runStdout}</p>
									</div>
								) : (
									<div className="std-content">
										<p>status: {runStateTxt}</p>
										<p>error logs: </p>
										<p>{errorTxt}</p>
									</div>
								)
							)
						}
					</TabPane>
				</Tabs>
			</div>
		);
	}
}


export default CodeEditorRoom;