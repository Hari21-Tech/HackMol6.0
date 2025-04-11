# core/backtracker.py

import csv
from datetime import datetime, timedelta
from collections import defaultdict

class Backtracker:
    def __init__(self, log_file):
        self.log_file = log_file
        self.events = []
        self.load_log()

    def load_log(self):
        with open(self.log_file, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                row['timestamp'] = datetime.strptime(row['timestamp'], "%d-%m-%Y %H:%M:%S.%f")
                self.events.append(row)

    def filter_objects(self, object_type):
        object_dict = defaultdict(list)
        for e in self.events:
            if object_type not in e['details']:
                continue

            # Try extracting object labels
            if e['event_type'] in ['objects_with_person', 'objects_removed']:
                try:
                    _, objects_str = e['details'].split(': ', 1)
                    objects = objects_str.split(', ')
                except ValueError:
                    continue
            elif e['event_type'] in ['objects_abandoned', 'abandoned_objects_picked']:
                objects = e['details'].split(', ')
            else:
                continue

            for obj in objects:
                if obj.startswith(object_type):
                    object_dict[obj].append(e)
        return object_dict


    def find_nearest_person(self, abandon_time, cam_id):
        window = timedelta(seconds=10)
        closest_event = None
        min_diff = timedelta.max

        for e in self.events:
            if e['event_type'] == 'person_detected' and e['camera'] == cam_id:
                time_diff = abs(e['timestamp'] - abandon_time)
                if time_diff < min_diff and time_diff <= window:
                    closest_event = e
                    min_diff = time_diff

        return closest_event['details'] if closest_event else None

    def backtrack_by_type(self, object_type):
        print(f"\n🔍 Backtracking all '{object_type}' objects...\n")
        objects = self.filter_objects(object_type)

        if not objects:
            print(f"⚠️ No objects of type '{object_type}' found.")
            return

        for obj_id, events in objects.items():
            print(f"\n📦 Object: {obj_id}")
            last_holder = None
            last_camera = None
            last_removed_time = None

            for e in events:
                ts = e['timestamp'].strftime('%H:%M:%S')
                etype = e['event_type']
                details = e['details']

                if etype == 'objects_with_person':
                    person_id, _ = details.split(': ', 1)
                    last_holder = person_id
                    last_camera = e['camera']
                    print(f"  [{ts}] picked up by {person_id}")
                
                elif etype == 'objects_removed':
                    person_id, _ = details.split(': ', 1)
                    last_removed_time = e['timestamp']
                    last_holder = person_id
                    last_camera = e['camera']
                    print(f"  [{ts}] removed from {person_id}")
                    print(f"  🚨 Considered abandoned by {person_id} on Camera {last_camera} at {ts}")
            
            if last_holder and last_removed_time:
                final_ts = last_removed_time.strftime('%d-%m-%Y %H:%M:%S')
                print(f"  📌 Final Holder: {last_holder}")
                print(f"  🕒 Last Seen: {final_ts}")
                print(f"  📷 Camera: {last_camera}")
            else:
                print("  ⚠️ No valid removal data to determine abandonment.")
