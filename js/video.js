// Wait for the DOM to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function () {
	// Get all necessary elements
	const videoContainer = document.querySelector('.floating-video-container');
	const videoElement = document.getElementById('floating-video');
	const enlargeBtn = document.querySelector('.enlarge-btn');
	const closeBtn = document.querySelector('.close-btn');

	// Check if elements exist (for error handling)
	if (!videoContainer || !videoElement || !enlargeBtn || !closeBtn) {
		console.error('One or more video elements are missing from the page');
		return;
	}

	// Toggle between expanded and normal size
	enlargeBtn.addEventListener('click', function () {
		videoContainer.classList.toggle('expanded');

		// Change icon based on state
		if (videoContainer.classList.contains('expanded')) {
			enlargeBtn.textContent = '⊟'; // Minimize icon
		} else {
			enlargeBtn.textContent = '⛶'; // Maximize icon
		}
	});

	// Close the video player
	closeBtn.addEventListener('click', function () {
		videoContainer.style.display = 'none';
		videoElement.pause();

		// Optional: Show a way to reopen the video
		createReopenButton();
	});

	// Optional: Make the video draggable
	let isDragging = false;
	let offsetX, offsetY;

	videoContainer.addEventListener('mousedown', function (e) {
		if (e.target === videoContainer || e.target === videoElement) {
			isDragging = true;
			offsetX = e.clientX - videoContainer.getBoundingClientRect().left;
			offsetY = e.clientY - videoContainer.getBoundingClientRect().top;
			videoContainer.style.cursor = 'grabbing';
		}
	});

	document.addEventListener('mousemove', function (e) {
		if (!isDragging) return;

		videoContainer.style.left = (e.clientX - offsetX) + 'px';
		videoContainer.style.top = (e.clientY - offsetY) + 'px';
		videoContainer.style.right = 'auto';
		videoContainer.style.bottom = 'auto';
	});

	document.addEventListener('mouseup', function () {
		isDragging = false;
		videoContainer.style.cursor = 'grab';
	});

	// Optional: Function to create a reopen button
	function createReopenButton() {
		// Check if button already exists
		if (document.getElementById('reopen-video-btn')) return;

		const reopenBtn = document.createElement('div');
		reopenBtn.id = 'reopen-video-btn';
		reopenBtn.textContent = '▶ Virtual Tour';
		reopenBtn.style.position = 'fixed';
		reopenBtn.style.bottom = '20px';
		reopenBtn.style.right = '20px';
		reopenBtn.style.padding = '8px 15px';
		reopenBtn.style.background = '#333';
		reopenBtn.style.color = 'white';
		reopenBtn.style.borderRadius = '4px';
		reopenBtn.style.cursor = 'pointer';
		reopenBtn.style.zIndex = '999';

		reopenBtn.addEventListener('click', function () {
			videoContainer.style.display = 'block';
			document.body.removeChild(reopenBtn);
		});

		document.body.appendChild(reopenBtn);
	}

	// Optional: Save state to localStorage
	window.addEventListener('beforeunload', function () {
		localStorage.setItem('videoState', videoContainer.style.display);
	});

	// Optional: Load saved state
	const savedState = localStorage.getItem('videoState');
	if (savedState === 'none') {
		videoContainer.style.display = 'none';
		createReopenButton();
	}
});