	const camera_control = document.querySelector(".camera_controller");
	const camera = document.querySelector(".camera");
	const shutter = document.querySelector(".camera .shutter");
	const player = document.querySelector(".camera video");
	const submit = document.querySelector("button.button.submit");
	const canvas = document.querySelector("canvas");
	let file_inp = document.querySelector("input[type=file][name=image]");

	const dimension = Math.min(window.innerHeight, window.innerWidth);
	player.width = player.height = dimension;
	canvas.width = canvas.height = dimension;

	camera_control.addEventListener("click", async (evt)=>{
		let stream;
		try {
			stream = await navigator.mediaDevices.getUserMedia({ video: true });
		} catch(e) {
			alert(e);
		}
		player.srcObject = stream;
		camera.classList.remove("hidden");
		camera_control.classList.add("hidden");
		submit.classList.add("hidden");
		canvas.classList.add("hidden");
	});

	shutter.addEventListener("click", (evt)=>{
		const canvas_context = canvas.getContext('2d');
		canvas_context.drawImage(player, 0, 0, canvas.width, canvas.height);
		canvas.classList.remove("hidden");
		camera_control.classList.remove("hidden");
		camera_control.innerHTML = "Retake";
		camera.classList.add("hidden");
		submit.classList.remove("hidden");
		player.srcObject.getTracks().forEach(t=>t.stop());
		canvas.toBlob((blob) => {
			let file = new File([blob], "capture.jpeg", {type: "image/jpeg"});
			let dt_obj = new DataTransfer();
			dt_obj.items.add(file);
			file_inp.files = dt_obj.files;

		}, "image/jpeg");

	});
