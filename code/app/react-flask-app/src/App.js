import React, { useState, useEffect, Fragment } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import Slider from 'react-input-slider';

import logo from './images/arrow.svg';
import playButton from './images/play.svg'
import stopButton from './images/stop.svg'
import loadingIcon from './images/loadingIcon.svg'

import './App.css';


const initialState = { play: false };
const { useGlobalState } = createGlobalState(initialState);


function getParams() {
	var text = document.getElementById("text").innerText;
	var temp = parseFloat(document.getElementById("temperature").innerText.split(' ')[1]);
	var length = parseFloat(document.getElementById("length").innerText.split(' ')[1]);
	
	var seedStr = document.getElementById("seed").value;
	var seed = 0;
	var i = seedStr.length;
	while (i--) {
		seed += seedStr.charCodeAt(i);
	}

	return [text, temp, length, seed];
}

function GenStory() {
	var params = getParams();
	const [story, setStory] = useState(params[0]);

	console.log("generating from: \n" + story);

	useEffect(() => {
		// begin generation -> show loading icon and disable text entry
		document.getElementById("loadingIcon").style.visibility = "visible"; 
		document.getElementById("text").style.pointerEvents = "none"; 

		fetch('/getText', {
			method:"POST",
			cache: "no-cache",
			headers:{
				"content_type":"application/json",
			},
			body:JSON.stringify([story, params]), // maintaining callback
			}
		)
		.then(res => res.json())
		.then(data => {
			setStory(data.text.slice(0, -1));
			
			// loading finished -> hide icon and enable text entry
			document.getElementById("loadingIcon").style.visibility = "hidden"; 
			document.getElementById("text").style.pointerEvents = "auto"; 
		});
		document.getElementById("text").innerHTML = story;
		console.log("setting story to: \n" + story);
	}, [story]); // callback, generate again with result

	return null;
}

function StoryPane() {
	const [story, setStory] = useState("Once upon a time ");	
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
	);
}

function Title() {
	return(
		<div className="title">
			<img src={logo} alt="logo" />
		</div>
	);
}

function Options() {
	return(
		<div className="options">
			<Temperature /> <br /><br />
			<Length /><br /><br />
			<Seed />
		</div>
	);
}

function Temperature() {
	const [temp, setTemp] = useState(1);
  
	return (
	  <Fragment>
		<div id="temperature">
			{'temperature: ' + temp.toFixed(2)}
		</div>
		<Slider
		  axis="x"
		  xstep={0.01}
		  xmin={0}
		  xmax={3}
		  x={temp}
		  onChange={x => setTemp(parseFloat(x.x.toFixed(2)))}
		  styles={{
			track: {
			  backgroundColor: '#90CAF9',
			  height: 2
			},
			active: {
			  backgroundColor: '#ef9a9a'
			},
			thumb: {
				height: 10,
				width: 10
			}
		  }}
		/>
	  </Fragment>
	);
}

function Length() {
	const [length, setLength] = useState(1.5);
  
	return (
	  <Fragment>
		<div id="length">
			{'length: ' + length.toFixed(2)}
		</div>
		<Slider
		  axis="x"
		  xstep={0.01}
		  xmin={1.1}
		  xmax={5}
		  x={length}
		  onChange={x => setLength(parseFloat(x.x.toFixed(2)))}
		  styles={{
			track: {
			  backgroundColor: '#BDBDBD',
			  height: 2
			},
			active: {
			  backgroundColor: '#424242'
			},
			thumb: {
				height: 10,
				width: 10
			}
		  }}
		/>
	  </Fragment>
	);
}

function Seed() {
	return(
		<form>
			<label>seed: </label><br />
			<input type="text" id="seed" name="seed" placeholder="seed" />
		</form>
	);
}

function PlayButton() {
	const [play, setPlay] = useGlobalState('play');
	if (play) {
		return (
			<div name="pauseButton"	className="playPause">
				<img src={stopButton} alt="pauseButton" 
					onClick={() => setPlay(false)} />
			</div>
		)
	}
	return (
		<div name="playButton" className="playPause">
			<img src={playButton} alt="playButton" 
				onClick={() => setPlay(true)} />
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
