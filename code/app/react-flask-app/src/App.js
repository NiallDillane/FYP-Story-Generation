import React, { useState, useEffect } from 'react';
import clippy from './images/coolClippy.png';
import playButton from './images/play-button.png'
import pauseButton from './images/pause-button.png'
import './App.css';

function GenStory() {
	const [story, setStory] = useState(StoryContent());

	// useEffect(() => {
	// 	fetch('/getText', {
	// 		method:"POST",
	// 		cache: "no-cache",
	// 		headers:{
	// 			"content_type":"application/json",
	// 		},
	// 		body:JSON.stringify(story)
	// 		}
	// 	)
	// 	.then(res => res.json())
	// 	.then(data => {
	// 		console.log(data)
	// 		setStory(data.text.slice(0, -1));
	// 	});
	// }, []);

	return (
		<div name="text"
			contentEditable="true"
			className="text-body"
			defaultValue={story}>
		</div>
	);
}

function StoryPane() {
	return(
		<div name="text"
			contentEditable="true"
			className="text-body">
			<StoryContent />
		</div>
	)
}

function StoryContent() {
	return "Once upon a time ";
}

function PlayButton(){
	const [play, setPlay] = useState(false);
	while (play) {
		console.log({play});
		return (
			<div name="pauseButton"	className="playPause">
				<img src={pauseButton} onClick={() => setPlay(false)} />
			</div>
		)
	}
	return (
		<div name="playButton" className="playPause">
			<img src={playButton} onClick={() => setPlay(true)} />
		</div>
	)
}

function Title() {
	return(
		<div className="title">
			<img src={clippy} />
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
