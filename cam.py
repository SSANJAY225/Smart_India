import cv2
def detect_heads(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    frontal_faces = frontal_face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30),  
        flags=cv2.CASCADE_SCALE_IMAGE
    )
    profile_faces = profile_face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30),  
        flags=cv2.CASCADE_SCALE_IMAGE
    )
    head_id = 1
    for (x, y, w, h) in frontal_faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(frame, f'Head ID: {head_id} (Frontal)', (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        head_id += 1
    for (x, y, w, h) in profile_faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
        cv2.putText(frame, f'Head ID: {head_id} (Profile)', (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        head_id += 1
    total_heads = len(frontal_faces) + len(profile_faces)
    cv2.putText(frame, f'Total Heads Detected: {total_heads}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)
    cv2.imshow('Head Detection from Any Side', frame)

def detect_from_webcam():
    video_stream = cv2.VideoCapture(0)
    print('Detecting heads... Press "q" to quit.')
    while True:
        check, frame = video_stream.read()
        if not check:
            print("Failed to crab web-cam")
            break
        frame=cv2.flip(frame,1)
        detect_heads(frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    video_stream.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    frontal_face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    profile_face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')
    detect_from_webcam()
