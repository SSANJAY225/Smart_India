import cv2

def detect_heads(frame):
    # Convert the frame to grayscale for Haar Cascade detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect frontal faces
    frontal_faces = frontal_face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30),  # Minimum size for a detected face
        flags=cv2.CASCADE_SCALE_IMAGE
    )

    # Detect profile faces
    profile_faces = profile_face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30),  # Minimum size for a detected face
        flags=cv2.CASCADE_SCALE_IMAGE
    )

    # Initialize head count
    head_id = 1

    # Draw bounding boxes and IDs around detected frontal faces
    for (x, y, w, h) in frontal_faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(frame, f'Head ID: {head_id} (Frontal)', (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        head_id += 1

    # Draw bounding boxes and IDs around detected profile faces
    for (x, y, w, h) in profile_faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
        cv2.putText(frame, f'Head ID: {head_id} (Profile)', (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        head_id += 1

    # Display total number of heads detected
    total_heads = len(frontal_faces) + len(profile_faces)
    cv2.putText(frame, f'Total Heads Detected: {total_heads}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)

    # Show the output frame with detected heads and their IDs
    cv2.imshow('Head Detection from Any Side', frame)

def detect_from_webcam():
    # Open a connection to the webcam
    video_stream = cv2.VideoCapture(0)
    print('Detecting heads... Press "q" to quit.')

    while True:
        # Read a frame from the webcam
        check, frame = video_stream.read()
        if not check:
            print("Failed to crab web-cam")
            break
        frame=cv2.flip(frame,1)
        # Detect heads in the current frame
        detect_heads(frame)

        # Break the loop if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the webcam and close all OpenCV windows
    video_stream.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    # Load the pre-trained Haar Cascades for frontal and profile face detection
    frontal_face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    profile_face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')

    # Start detecting heads using the webcam
    detect_from_webcam()
