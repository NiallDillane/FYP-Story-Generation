import React, { useState, useEffect } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import clippy from './images/coolClippy.png';
import playButton from './images/play-button.png'
import pauseButton from './images/pause-button.png'
import './App.css';


const initialState = { story: "Once upon a time in Hollywoo" , play: false};
const { useGlobalState } = createGlobalState(initialState);


function GenStory() {
	const [story, setStory] = useGlobalState('story');

	useEffect(() => {
		fetch('/getText', {
			method:"POST",
			cache: "no-cache",
			headers:{
				"content_type":"application/json",
			},
			body:JSON.stringify(story)
			}
		)
		.then(res => res.json())
		.then(data => {
			console.log(data)
			setStory(data.text.slice(0, -1));
		});
	}, []);

	return null;

	// return (
	// 	<div name="text"
	// 		contentEditable="true"
	// 		className="text-body"
	// 		defaultValue={story}>
	// 	</div>
	// );
}

function StoryPane() {
	const [story, setStory] = useGlobalState('story');	
	const [play, setPlay] = useGlobalState('play');

	return(
		<div name="text"
			ref={r=>this.ref = r}
			contentEditable="true"
			className="text-body"
			onChange={() => setStory(this.ref.innerHTML)}>
			{story}
			{play ? <GenStory /> : ""}
		</div>
	)
}

// function StoryContent() {
// 	return "Once upon a time ";
// }

function PlayButton(){
	const [play, setPlay] = useGlobalState('play');
	if (play) {
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
