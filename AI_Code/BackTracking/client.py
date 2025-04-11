import socketio
import subprocess
import json
import os

# Initialize Socket.IO server (client in this case)
sio = socketio.Client()

# This should match your backend server endpoint
SERVER_URL = "http://172.20.10.7:5000"  # Adjust as needed

@sio.event
def connect():
    print("✅ Connected to server")

@sio.event
def disconnect():
    print("🔌 Disconnected from server")

# Custom event for object backtracking
@sio.on("track_object")
def handle_track_object(data):
    object_label = data.get("object")         # e.g., "cell phone"
    user_id = data.get("user_id")             # e.g., "Person_001"
    log_path = data.get("log", "data/track_log.csv")

    print(f"📨 Request to backtrack '{object_label}' for {user_id}")

    try:
        # Run backtracking logic as subprocess and capture output
        result = subprocess.run(
            ["python", "main.py", "--backtrack", "--object", object_label, "--log", log_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        output_lines = result.stdout.splitlines()
        last_holder = None
        last_seen_time = None
        last_camera = None

        for line in output_lines:
            if "📌 Final Holder" in line:
                last_holder = line.split(": ")[1].strip()
            elif "🕒 Last Seen" in line:
                last_seen_time = line.split(": ")[1].strip()
            elif "📷 Camera" in line:
                last_camera = line.split(": ")[1].strip()

        response = {
            "requested_by": user_id,
            "object": object_label,
            "last_holder": last_holder,
            "last_seen_time": last_seen_time,
            "last_camera": last_camera
        }

        print(f"📤 Emitting backtrack result: {response}")
        sio.emit("track_result", response)

    except Exception as e:
        print(f"❌ Error during backtrack: {str(e)}")
        sio.emit("track_result", {
            "requested_by": user_id,
            "object": object_label,
            "error": str(e)
        })

if __name__ == "__main__":
    connected = False
    while not connected:
        try:
            sio.connect(SERVER_URL)
            connected = True
        except Exception as e:
            print(f"❌ Connection failed: {e}")
