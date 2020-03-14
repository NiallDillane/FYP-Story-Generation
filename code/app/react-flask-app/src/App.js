import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';

function App() {
	const [story, setStory] = useState(0);

	useEffect(() => {
		fetch('/getText')
		.then(res => res.json())
		.then(data => {
			setStory(data.text);
		});
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<textarea name="text"
					className="text-body"
					defaultValue={story}
				/>
			</header>
		</div>
	);
}


export default App;
