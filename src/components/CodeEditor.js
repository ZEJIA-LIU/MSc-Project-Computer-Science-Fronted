import 'styles/code-editor.scss';
import React from 'react';
import { Button, Select, Icon, Input, Tabs, message, Spin } from 'antd';
import axios from 'axios';
import { apiAddress } from '../config';
import languages from '../constant/languages';
import defaultTexts from '../constant/defaultTexts';
import { observer, inject } from "mobx-react";
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/lucario.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/oceanic-next.css';
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/fold/indent-fold.js';

// 编辑器实例
let editor;
// 编程语言

// 默认模板

// 编辑器主题
let themes = [
	'3024-day',
	'3024-night',
	'dracula',
	'lucario',
	'material',
	'oceanic-next'
]

let tabSizes = [
	1,
	2,
	4,
	8
];

let fileTypes = {
	'C': '.c',
	'C++': '.cpp',
	'Java': '.java',
	'JavaScript(Node)': '.js',
	'Python2.7': '.py',
	'Python3': '.py'
};

let RunningMsg = (
	<span><span className="mr-5">running</span><Spin /></span>
);

// let _createObjectUrl = window.URL.createObjectURL;
@inject("singleEditorStore")
@observer
class CodeEditor extends React.Component {


	stdPanelChange = key => {
		const { singleEditorStore } = this.props
		singleEditorStore.setActiveStdPanel(key)

	};

	stdinChange = e => {
		const { singleEditorStore } = this.props
		singleEditorStore.setStdin(e.target.value)
	};

	submitCode = () => {
		const { singleEditorStore } = this.props
		let { language, stdin, beforeSummit, runSuccess, status1Or2, statusLarger2, setRunBtnLoading, runError } = singleEditorStore
		beforeSummit()
		axios.post(apiAddress + '/run', {
			code: editor.getValue(),
			language,
			stdin
		}).then(res => {
			let { status, msg, data } = res.data;
			if (status == 0) {
				let { time, memory, stdout } = data;
				runSuccess(status, time, memory, stdout)
			}
			if (status == 1 || status == 2) {
				status1Or2(msg, status, data.error)
			}
			if (status > 2) {
				statusLarger2(status, msg)
			}
			setRunBtnLoading(false)
		})
			.catch(error => {
				message.error('An error has occurred');
				runError(error.message)
			});

	};

	exportCode = () => {
		let content = editor.getValue();
		const { singleEditorStore } = this.props
		let { language, stdin, beforeSummit, runSuccess, status1Or2, statusLarger2, setRunBtnLoading, runError } = singleEditorStore
		this.downloadCode(content, 'super-code' + fileTypes[language]);
	};

	downloadCode(content, fileName) {
		let a = document.createElement("a"),
			blob = new Blob([content]);
		a.download = fileName;
		// a.href = _createObjectUrl(blob);
		a.href = URL.createObjectURL(blob);
		a.click();
	}

	languageChange = (value, el) => {
		const { singleEditorStore } = this.props
		let { setLanguage, reset } = singleEditorStore
		let language = el.props.children;
		if (value.indexOf('python') == 0) value = 'python';
		editor.setOption('mode', value);
		editor.setValue(defaultTexts[language]);
		setLanguage(language)
		reset()
	};

	themeChange(next) {
		editor.setOption('theme', next);
	}

	tabSizeChange(next) {
		editor.setOption('tabSize', next);
	}

	componentDidMount() {
		const { singleEditorStore } = this.props
		let { code, setCode, language } = singleEditorStore
		editor = CodeMirror.fromTextArea(
			document.getElementById('editor'),
			{
				mode: "text/x-csrc",
				lineNumbers: true,
				theme: 'oceanic-next',
				gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
				foldGutter: true
			}
		);
		const defaultValue = code || defaultTexts[language]
		editor.setValue(defaultValue)
		editor.setSize('auto', '400px');
		editor.on('change', editorObj => {
			setCode(editorObj.getValue())
		});
	}

	render() {
		// layout: 'horizontal', 'vertical'
		let { layout = 'horizontal' } = this.props;
		const { singleEditorStore } = this.props
		let {
			runStateTxt,
			runState,
			runTime,
			runMemory,
			runStdout,
			errorTxt,
			activeStdPanel,
			language,
			runBtnLoading
		} = singleEditorStore;

		// console.log(runState)

		let editorStdPanel = (
			<div className={"editor-std-panel editor-std-panel-" + layout}>
				<Tabs activeKey={activeStdPanel} type="card" onChange={this.stdPanelChange}>
					<TabPane tab="Output" key="1">
						<div className="std-content">
							<p>add input: </p>
							<TextArea onChange={this.stdinChange} rows={7} />
						</div>
					</TabPane>
					<TabPane tab="Result" key="2">
						{
							runState == -1 || runState == -2 ? (
								<div className="std-content">
									<div>status: {runStateTxt === 'img' ? RunningMsg : runStateTxt}</div>
								</div>
							) : (
								runState == 0 ? (
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

		const initLanguage = languages.filter(lan => lan.tag === language)[0].value
		return (
			<div className="editor-container">
				<div className="editor-panel">
					<textarea id="editor"></textarea>
					<div className="editor-menu">
						<Select defaultValue={initLanguage} dropdownMatchSelectWidth={false} onChange={this.languageChange}>
							{
								languages.map((item, index) => <Option value={item.value} key={index}>{item.tag}</Option>)
							}
						</Select>
						<span> Theme: </span>
						<Select defaultValue="oceanic-next" style={{ width: 120 }} onChange={this.themeChange}>
							{
								themes.map((item, index) => <Option value={item} key={index}>{item}</Option>)
							}
						</Select>
						<span> TabSize: </span>
						<Select defaultValue="4" onChange={this.tabSizeChange}>
							{
								tabSizes.map((item, index) => <Option value={item} key={index}>{item}</Option>)
							}
						</Select>
						<Button className="float-r" type="primary" loading={runBtnLoading} onClick={this.submitCode}>
							{runBtnLoading ? 'Loading' : (<span><Icon type="bug" /> Run</span>)}
						</Button>
						<Button className="float-r mr-5" onClick={this.exportCode}><Icon type="export" />export</Button>
					</div>
					{layout === 'vertical' && editorStdPanel}
				</div>
				{layout === 'horizontal' && editorStdPanel}
			</div>
		);
	}
}

export default CodeEditor