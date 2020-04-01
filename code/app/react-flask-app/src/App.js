import React, { useState, useEffect, useRef } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import clippy from './images/coolClippy.png';
import playButton from './images/play-button.png'
import pauseButton from './images/pause-button.png'
import './App.css';


const initialState = { story: "Once upon a time in Hollywoo County, I lived in a" , play: false};
const { useGlobalState } = createGlobalState(initialState);


function GenStory() {
	const [story, setStory] = useGlobalState('story');

	console.log("story based on: " + story)

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
			onInput={e => {
				setStory(e.currentTarget.innerText);

			var el = document.getElementById("text");
			var range = document.createRange();
			var sel = window.getSelection();

			range.setStart(el, 1);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);
			el.focus();
					
				console.log("doing stuff");
			}}>
			{story}
			{play ? <GenStory /> : ""}
		</div>
	)
}

function PlayButton(){
	const [play, setPlay] = useGlobalState('play');
	if (play) {
		return (
			<div name="pauseButton"	className="playPause">
				<img src={pauseButton} alt="pauseButton" onClick={() => setPlay(false)} />
			</div>
		)
	}
	return (
		<div name="playButton" className="playPause">
			<img src={playButton} alt="playButton" onClick={() => setPlay(true)} />
		</div>
	)
}

function Title() {
	return(
		<div className="title">
			<img src={clippy} alt="logo" />
		</div>
	)
}

function App() {
	return (
		<div className="App">
			<div className="col sidebar">
				<Title />
				<PlayButton />
			</div>
			<div className="col story">
				<StoryPane />
			</div>
		</div>
	);
}


export default App;
