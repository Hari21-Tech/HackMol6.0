import math
import cv2

def distance(bbox1, bbox2):
    x1, y1, w1, h1 = bbox1
    x2, y2, w2, h2 = bbox2
    
    left1, right1 = x1, x1 + w1
    top1, bottom1 = y1, y1 + h1

    left2, right2 = x2, x2 + w2
    top2, bottom2 = y2, y2 + h2

    if right1 > left2 and left1 < right2 and bottom1 > top2 and top1 < bottom2:
        return 0
    
    dx = max(left2 - right1, left1 - right2, 0)
    dy = max(top2 - bottom1, top1 - bottom2, 0)
    return math.hypot(dx, dy)


CLOSENESS_THRESHOLD = 0.2
class ObjectHistory:
    def __init__(self):
        self.timeline = {}
        self.id = {}
        self.frame_marked = []
    
    def identify(self, obj):
        print(obj)
        if obj["label"] not in self.id:
            return None
        
        min_dist = math.inf
        min_object = None
        for i in range(self.id[obj["label"]]):
            similar_object = f"{obj['label']}_{i}"
            if similar_object in self.frame_marked:
                # Already taken
                continue
            last_position_of_similar_object = self.timeline[similar_object]
            distances_from_similar_object = distance(obj["bbox"], last_position_of_similar_object)
            print(i, distances_from_similar_object, end=' ')
            if distances_from_similar_object < min_dist:
                min_dist = distances_from_similar_object
                min_object = similar_object
        
        if min_dist > CLOSENESS_THRESHOLD:
            return None
        self.frame_marked.append(min_object)
        return min_object

    def insert(self, obj):
        if obj["label"] not in self.id:
            self.id[obj["label"]] = 0
        identity = f"{obj['label']}_{self.id[obj['label']]}"
        self.id[obj["label"]] += 1
        self.timeline[identity] = obj["bbox"]
        self.frame_marked.append(identity)
        return identity
    
    def update(self, obj_id, obj):
        self.timeline[obj_id] = obj["bbox"]
    
    def clear_frame(self):
        self.frame_marked.clear()
    
    def draw_locations(self, frame):
        for identity, bbox in self.timeline.items():
            x1, y1, x2, y2 = bbox
            cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 255), 2)
            cv2.putText(frame, identity, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        return frame