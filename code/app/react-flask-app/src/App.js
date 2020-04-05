import React, { useState, useEffect, useRef } from 'react';
import { createGlobalState } from 'react-hooks-global-state';

import clippy from './images/coolClippy.png';
import playButton from './images/play.svg'
import stopButton from './images/stop.svg'
import loadingIcon from './images/loadingIcon.svg'

import './App.css';


const initialState = { story: "Once upon a time " , play: false};
const { useGlobalState } = createGlobalState(initialState);


function GenStory() {
	const [story, setStory] = useGlobalState('story');

	console.log("generating");

	useEffect(() => {
		document.getElementById("loadingIcon").style.visibility = "visible"; // Loading icon display
		document.getElementById("text").style.pointerEvents = "none"; // Disable user text entry

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

			document.getElementById("loadingIcon").style.visibility = "hidden"; // Loading icon hide
			document.getElementById("text").style.pointerEvents = "auto"; // Enable user text entry
		});
	}, [story]); // callback, generate again with result

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
			onBlur={e => { setStory(e.currentTarget.innerHTML); }}>
			{story}
			{play ? <GenStory /> : ""}
		</div>
	);
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
	);
}

function LoadingIcon() {
	return (
		<img name="loadingIcon" 
			id="loadingIcon" 
			className="loadingIcon" 
			src={loadingIcon} alt="loadingIcon" />
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
