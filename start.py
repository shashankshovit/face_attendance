from flask import Flask, render_template, redirect, request, url_for

import face_recognition
import json

app = Flask(__name__)

@app.route('/')
def index():
	return render_template("index.html", retry=request.args.get('retry'))

@app.route('/record', methods=["POST"])
def process_attendance():
	uploaded_image = face_recognition.load_image_file(request.files['image'])
	try:
		uploaded_encoding = face_recognition.face_encodings(uploaded_image)[0]
	except Exception as e:
		print('\nWarning: No face detected in the uploaded image.', e)
		return redirect(url_for("index", retry=True))

	with open("user_image_map.json") as jsonfile:
		try:
			user_image_map_dict = json.load(jsonfile)
		except Exception as e:
			raise Exception("Error reading json.")
	for person, image_path in user_image_map_dict.items():
		file_path = url_for("static", filename=image_path)[1:]
		stored_image = face_recognition.load_image_file(file_path)
		try:
			stored_encoding = face_recognition.face_encodings(stored_image)[0]
		except Exception as e:
			print('\nError: File: "{file}" has no face.'.format(file=file_path))
			return redirect(url_for("error"))

		is_match = face_recognition.compare_faces([uploaded_encoding], stored_encoding)[0]
		if is_match:
			return render_template("success.html", name=person)

	return redirect(url_for("index", retry=True))


@app.route('/error')
def error():
	return render_template("error.html")

if __name__ == '__main__':
	app.run(debug=True)