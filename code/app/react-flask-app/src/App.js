import React, { useState, useEffect, useRef } from 'react';
import { createGlobalState } from 'react-hooks-global-state';

import clippy from './images/coolClippy.png';
import playButton from './images/play.svg'
import stopButton from './images/stop.svg'
import loadingIcon from './images/loadingIcon.svg'

import './App.css';


const initialState = { story: "Once upon a time in Hollywoo County, I lived in a" , play: false, gen: false};
const { useGlobalState } = createGlobalState(initialState);


function GenStory() {
	const [story, setStory] = useGlobalState('story');
	const [gen, setGen] = useGlobalState('gen');

	setGen(true);

	useEffect(() => {
		fetch('/getText', {
			method:"POST",
			cache: "no-cache",
			headers:{
				"content_type":"application/json",
			},
			body:JSON.stringify(story),
			}
		)
		.then(res => res.json())
		.then(data => {
			console.log("result = ");
			console.log(data);
			setStory(data.text.slice(0, -1));
			setGen(false);
		});
	}, [story]); // callback

	return null;
}

function StoryPane() {
	const [story, setStory] = useGlobalState('story');	
	const [play, setPlay] = useGlobalState('play');

	return(
		<div name="text"
			id="text"
			contentEditable="true"
			suppressContentEditableWarning={true}
			className="text-body"
			onBlur={e => { setStory(e.currentTarget.innerText); }}>
			{story}
			{play ? <GenStory /> : ""}
		</div>
	)
}

function Title() {
	return(
		<div className="title">
			<img src={clippy} alt="logo" />
		</div>
	);
}

function Options() {
	return(
		<div className="options">
			A<br />
			B<br />
			C
		</div>
	);
}

function PlayButton() {
	const [play, setPlay] = useGlobalState('play');
	if (play) {
		return (
			<div name="pauseButton"	className="playPause">
				<img src={stopButton} alt="pauseButton" onClick={() => setPlay(false)} />
			</div>
		)
	}
	return (
		<div name="playButton" className="playPause">
			<img src={playButton} alt="playButton" onClick={() => setPlay(true)} />
		</div>
	)
}

function LoadingIcon() {
	const [gen, setGen] = useGlobalState('gen');
	
	return (
		<div name="loadingIcon" className="loadingIcon" hidden={gen}>
			<img src={loadingIcon} alt="loadingIcon" />
		</div>
	);
}

function App() {
	return (
		<div className="App">
			<div className="col sidebar">
				<Title />
				<Options />
				<PlayButton />
				<LoadingIcon />
			</div>
			<div className="col story">
				<StoryPane />
			</div>
		</div>
	);
}


export default App;
