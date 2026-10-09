
# Bookmarks
Use Bookmarks to quickly switch between scenes.
To do this, press Ctrl+Number, for example Ctrl+1. In the future, simply pressing 1 will switch the viewport camera to the saved location.

# Game Camera View

https://youtu.be/ZHhmq6dMqx4

Create an additional Viewport and select CameraActor in it to see the scene from the game camera.
To move CameraActor to a new location, simply press Play, fly to wherever you need, and press Esc. After that, on Camera, use RestoreEditorCameraState.
There will still be issues with character shadows, but overall everything will be fine.


# GlobalOffset
You can change the distance between the primary camera and the proxy camera by adjusting GlobalOffset in BP_CameraController.

