# Contents

- [General Information](index.md#how-it-works) — this page.
- [Useful Tips](Tips.md) — start with this page.
- [Creating Models](Creating%20a%20New%20Model.md).


# How It Works

Two orthographic cameras are used.
The primary camera displays sprites and the shadow map.
The secondary camera looks at proxy meshes and generates the shadow map. The secondary camera updates the shadow map only when the camera moves (updating shadows during zoom is not necessary) or when requested by BP logic. Proxy meshes do not use complex materials and can be very low quality — their purpose is to create shadows and serve as a reference for drawing perspective.

3D characters have been added to the demo scene. Although the developer will spend most of the time around the proxy meshes, the 3D characters are located next to the sprites. This makes navigation calculations more convenient. 
3D characters can cast regular shadows rather than proxy shadows. This approach allows updating the shadow map infrequently and VERY significantly increases performance. 

Overall, frame time should be under 10ms.

![[Pasted image 20261002104428.png]]

## Asset Strengths

You can very quickly (using AI) create a large number of sprites that look like 3D objects in a consistent style. Since meshes are only needed for shadows, you can make them ultra low-poly with very messy topology, and it will still work great.

You don't need to create high-quality materials or PBR textures — a 2D sprite is enough.

The asset supports dynamic lighting. 

You don't need an expensive model to create sprites. Personally, I use Luna from ChatGPT.

## Asset Weaknesses:

The asset uses two cameras: the primary camera
![[Pasted image 20260928103516.png]]
and the shadow camera
![[Pasted image 20260928103644.png]]

By default, the secondary camera updates the image every 0.3 seconds. If there are no dynamic objects in the frame, baking shadows just once is enough.


All the challenges revolve around 3D characters. 
You will have to choose between quality and performance.
![[Pasted image 20260928103347.png]]
In performance mode:
The shadow camera updates every 0.3 seconds, and dynamic 3D characters (the one walking) stop using proxy shadows and switch to regular shadows. Logic for dynamic objects is also disabled. For example, doors will always stay open.
Relatively static 3D characters (standing or sitting) continue to use high-quality shadows. Updating shadows every 0.3 seconds is sufficient for them.

In quality mode:
The shadow camera updates every game frame.
Dynamic 3D characters use shadows from proxy meshes. Dynamic objects start working, such as doors.

There are issues when 3D objects interact with 2D objects.
https://youtu.be/tTf1qSkUecU
Video recorded in "quality" mode.

https://youtu.be/sWyqWHh1D8M
This video is in "performance" mode.

In both cases there are issues.
It is very difficult to place a character perfectly in a narrow doorway:
![[Pasted image 20260928103132.png]]

In the second case, the FPS is much better, but shadows from objects are projected on top of the character.
