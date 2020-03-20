import React, { useState, useEffect } from 'react';
import clippy from './images/coolClippy.png';
import './App.css';

function Story() {
	const [story, setStory] = useState('One stormy night in Arkansas');

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
		<textarea name="text"
			className="text-body"
			value={story}
		/>
	);
}

function App() {
	return (
		<div className="App">
			<div className="col sidebar">
				<div className="title">
					<img src={clippy} />
				</div>
			</div>
			<div className="col story">
				<Story />
			</div>
		</div>
	);
}


export default App;
