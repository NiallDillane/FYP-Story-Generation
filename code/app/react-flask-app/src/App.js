import React, { useState, useEffect } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import Slider, {createSliderWithTooltip} from 'rc-slider';

import logo from './images/robot.svg';
import playButton from './images/play.svg'
import stopButton from './images/stop.svg'
import loadingIcon from './images/loadingIcon.svg'
import tempIcon from './images/temperature.svg'
import lengthIcon from './images/length.svg'
import seedIcon from './images/seed.svg'

import './App.css';
import 'rc-slider/assets/index.css';


// Global state for [play] boolean, giving all functions access
const initialState = { play: false };
const { useGlobalState } = createGlobalState(initialState);
const SliderToolTip = createSliderWithTooltip(Slider);


/**
 * Hide/show loading icon; enable/disable text editing
 * @param {bool} loading If text is being generated
 */
function setLoading(loading){
	if(loading){
		document.getElementById("loadingIcon").style.visibility = "visible"; 
		document.getElementById("text").style.pointerEvents = "none"; 
	}
	else {
		document.getElementById("loadingIcon").style.visibility = "hidden"; 
		document.getElementById("text").style.pointerEvents = "auto"; 
	}
}

/**
 * Return parameters for generation
 */
function getParams() {
	var text = document.getElementById("text").innerHTML;
	var temp = parseFloat(document.getElementById("temperature").innerText);
	var length = parseFloat(document.getElementById("length").innerText);
	
	// Convert seed (string) into number by summing characters. Imperfect
	var seedStr = document.getElementById("seed").value;
	var seed = 0;
	var i = seedStr.length;
	while (i--) {
		seed += seedStr.charCodeAt(i);
	}

	return [text, temp, length, seed];
}

/**
 * Call API, generate story and insert into StoryPane
 */
function GenStory() {
	var params = getParams();
	// How state is used, with an array of getter/setter
	const [story, setStory] = useState(params[0]);

	useEffect(() => {
		setLoading(true);

		// API call to api.py with parameters
		fetch('/getText', {
			method:"POST",
			cache: "no-cache",
			headers:{
				"content_type":"application/json",
			},
			// Convert HTML linebreaks, maintain callback using story 
			body:JSON.stringify([story, params]),
			}
		)
		.then(res => res.json())
		.then(data => {
			// Updating the state 
			setStory(data.text);
			setLoading(false);
		});
		document.getElementById("text").innerHTML = story;
		console.log("setting story to: \n" + story);
	}, [story]); // callback, generate again with result

	return null;
}

/**
 * Writing environment for generation and manual editing
 * Story Generation called when global state [play] is true
 */
function StoryPane() {
	const [story, setStory] = useState("Once upon a time ");	
	const [play, setPlay] = useGlobalState('play');

	return(
		<div name="text"
			id="text"
			contentEditable="true" // Allows user input
			suppressContentEditableWarning={true}
			className="text-body"
			// onBlur so change only grabbed when user clicks out
			onBlur={e => { setStory(e.currentTarget.innerHTML); }}>
			{story}
			{play ? <GenStory /> : ""}
		</div>
	);
}

/**
 * Title section with logo
 */
function Title() {
	return(
		<div className="title">
			<img src={logo} alt="logo" />
		</div>
	);
}

/**
 * Container for parameter tuners
 */
function Options() {
	return(
		<div className="options">
			<Temperature /> <br /><br />
			<Length /><br /><br />
			<Seed />
		</div>
	);
}

/**
 * Slider for temperature, using rc-slider
 * Lower = heavier sampling from data, more consistent but less creative
 * Higher = more unique output, possibly nonsensical
 */
function Temperature() {
	const [temp, setTemp] = useState(1);

	return (
	  <div>
		<img src={tempIcon} alt="temperature" title={"temperature ("  + temp.toFixed(2) + ")"} />
		<div id="temperature" hidden>{temp}</div>
		<SliderToolTip
		  step={0.01}
		  min={0}
		  max={3}
		  defaultValue={temp}
		  className="slider"
		  onAfterChange={v => setTemp(parseFloat(v.toFixed(2)))}
          railStyle={{
			height: 2,
			backgroundColor: "#90caf9"
          }}
          handleStyle={{
            backgroundColor: "white",
            border: 0
          }}
          trackStyle={{
            background: "#ef9a9a" //90CAF9 ef9a9a
		  }}
		/>
	  </div>
	);
}

/**
 * How long the generation will be, relatively
 */
function Length() {
	const [length, setLength] = useState(1.5);
  
	return (
	  <div>
		<img src={lengthIcon} alt="length" title={"length ("  + length.toFixed(2) + ")"} />
		<div id="length" hidden>{length}</div>
		<SliderToolTip
		  step={0.01}
		  min={1.1}
		  max={5}
		  defaultValue={length}
		  className="slider"
		  onAfterChange={v => setLength(parseFloat(v.toFixed(2)))}
          railStyle={{
			height: 2,
			background: "#bdbdbd"
          }}
          handleStyle={{
            backgroundColor: "white",
            border: 0
          }}
          trackStyle={{
            background: "#424242"
		  }}
		/>
	  </div>
	);
}

/**
 * Seed to initialise generation, using same seed will generate same text
 */
function Seed() {
	return(
		<div>
			<img src={seedIcon} alt="seed" title="seed" />
			<input type="text" id="seed" name="seed" className="seed" placeholder="seed" />
		</div>
	);
}

/**
 * Play/puase buttons, clicking changes global [play] state
 */
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

/**
 * Loading animation to display during generation
 */
function LoadingIcon() {
	return (
		<img name="loadingIcon" 
			id="loadingIcon" 
			className="loadingIcon" 
			src={loadingIcon} alt="loadingIcon" />
	);
}

/**
 * Overall app
 */
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
