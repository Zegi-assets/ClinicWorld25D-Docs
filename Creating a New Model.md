# Before You Begin

All prompts in this guide are suggestions. You can freely modify them to suit your goals, style, and workflow.

The Meshy step is optional: you can use Tripo or another similar service instead, or create the 3D models manually. Adapt the relevant steps and prompts to your chosen tools.

Using an AI agent is strongly recommended. Set your Unreal Engine project folder (the folder containing the `.uproject` file) as the agent's main working folder so it can work directly with the project files. You can also follow this guide manually and copy all files to the appropriate folders yourself.

## Fully Automated Workflow

An AI agent can carry out all steps in this guide independently, including assembling the scene. Starting with Unreal Engine 5.8, you can connect a compatible agent to the editor through [Unreal MCP](https://dev.epicgames.com/documentation/unreal-engine/unreal-mcp-in-unreal-editor). Once the agent is connected and has access to the project folder and the necessary services, give it a link to this documentation and describe the desired result. With that setup, you can delegate the entire workflow without manually performing each step.

However, full automation can consume tens of times more tokens than a workflow where you perform some steps yourself, and potentially even hundreds of times more. These are possible magnitudes, not a guaranteed ratio: actual usage depends on the agent, the task, and the number of iterations.

The result may not match your preferences, especially the scene layout and composition. Decide in advance how each sprite should be oriented in the scene. Since its perspective is baked into the image, changing that orientation later may require regenerating individual sprites, which can be tedious and consume additional tokens.

# Folder Preparation

Download `ClinicWorld25D_AdditionalFiles.zip` from the asset's **Additional Files** section on Fab and extract it directly into the root of your Unreal Engine project — the folder containing the `.uproject` file, `Content`, and `Config`.

After extraction, the `Script` and `Files` folders must be directly inside the project root, without an extra `ClinicWorld25D_AdditionalFiles` folder around them. The archive includes helper scripts and source files: FBX models, reference images, perspective screenshots, sprites, processed textures, and style images.

All `Files\...` and `Script\...` paths in this guide are relative to the project root. For script requirements and usage, see `Script\README.md`. If these folders already exist, merge them carefully and preserve your own files.

If you have already created new models and sprites, you need to clean up the New folders. To do this, run the script `Script\move_new_mesh_files.bat` with a double-click.

# Creating a Concept
You will need a concept for the overall style of your environment.
Generate the concept using any convenient method and place it in `Files\Styles`.

Example prompt:
```
Draw a concept of a clinic reception area. Use high detail. Isometric camera with angles (Pitch=-35.264000,Yaw=45.000000,Roll=0.000000)
```

# Creating Models


## Creating References

You will need references for your future sprites.
Use an example prompt like this:

```
Create references that will be used to generate 3D models. On a clean background, without shadows.
The style for the references is located in this folder: 

Files\Styles\

Give the generated files proper names in English without spaces.
Place the results in:
Files\Meshes\Reference\New

If the folder Files\Meshes\Reference\New already contains files, warn me about it. The proper way to clear the folder is to run Script\move_new_mesh_files.bat

Create:
```

## Creating 3D Models

You need 3D models for two purposes:
1. So the AI understands the perspective
2. To generate shadows
You do not need high-quality models. You can even assemble something similar from primitives right inside UE and it will work.

However, it is much easier and faster to use AI to generate models. 
Referral links will be added here.
### Setting Up the Meshy API Key

Create a key in the **API Keys** section of the Meshy Developer Platform and copy it. See the [Meshy instructions](https://docs.meshy.ai/en/api/authentication) for details.

The key is usually stored in the `MESHY_API_KEY` environment variable, which the agent or script reads when calling the API. This name is used in the [Meshy example](https://docs.meshy.ai/en/api/quick-start); if your tool expects a different name, use the name specified in its settings.

In Windows, you can do this through the interface:

1. Open the Start menu and search for “Edit environment variables for your account”.
2. Under **User variables**, click **New** (or **Edit** if the variable already exists).
3. Set **Variable name** to `MESHY_API_KEY`.
4. Paste the key itself into **Variable value**, without quotation marks or the `Bearer` prefix.
5. Save the changes with **OK**, then fully restart the agent application and the terminal you will use to access Meshy: processes that are already running retain their previous environment.

A user variable persists between launches and does not require administrator rights. See the [Microsoft documentation](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables) for more about environment variables.

To check that the key is present in a new PowerShell window without displaying its value:

```powershell
-not [string]::IsNullOrWhiteSpace($env:MESHY_API_KEY)
```

`True` means the variable is available to that process. This does not yet verify that the key is valid or that API access works.

You can also simply ask your agent to set up the key :-)

```text
Help me save my Meshy API key in the MESHY_API_KEY environment variable for the current Windows user. Arrange for me to enter the key locally myself, without sending it in chat. Do not display the key or save it in project files or documentation. Check that the variable exists without displaying its value, and tell me which application needs to be restarted.
```


Generation prompt:

```

Create 3D models using the Meshy API (Meshy-7, the price will be 25 credits per model, I grant permission for this)

Model parameters:

{
  "ai_model": "latest",
  "geometry_resolution": "2k",
  "model_type": "standard",
  "should_texture": false,
  "should_remesh": true,
  "decimation_mode": 2,
  "topology": "triangle",
  "target_formats": ["fbx"],
  "origin_at": "bottom",
  "auto_size": true,
  "image_enhancement": true
}


and place the fbx files in Files\Meshes\Fbx\New

take references for meshy-7 from here: Files\Meshes\Reference\New

Give the files the same names as the references, but with the prefix SM.
do not verify how the fbx generated — I will check it myself.

```


### Placing 3D Models

Move the fbx files into any folder in your project, for example `/ClinicWorld25D/Meshes/Proxy`.
In `BP_SpriteProxyBase`, clear `Sprite` and assign the new 3D mesh.
Adjust `ZRotation` until you are satisfied with the result. You can create multiple copies of an item with different `ZRotation` values.

> [!info] Important
>  The Rotation Z value from SM_ProxyShadow will be written into the name of the future sprite.
>  This value will be used later to correctly position the proxy mesh.


Make sure that `PerspectiveShear` and `SpriteOffset` are set to 0.

https://youtu.be/ASfTrTJzeUY

After that, in `BP_CaptureSpawner`, click **FillSprite** and **SpawnMeshes**. The actor will collect all `BP_SpriteProxyBase` instances without a Sprite and position the 3D meshes in an orientation suitable for screenshots.

![[Pasted image 20260925162139.png|700]]

Then press Play.

https://youtu.be/drQFPAa5MlY

Screenshots will be located in `Files\Meshes\Screens\New`.

Don't forget to delete the created meshes from the scene; to do this, click 
**Destroy Spawned Meshes**.
![[Pasted image 20260925162550.png]]
## Creating Textures

Use approximately the following prompt to generate textures:

```
take the images in Files\Meshes\Screens\New 

Draw detailed textures without shadows strictly in the same proportions, in the same perspective, and at the same resolution (2048x2048) as the 3D model screenshot. Take file names into account to understand what is depicted in the screenshot.
Textures must be on a solid, uniform contrasting background #FF00FF. However, if the image generator produces images without a background right away, that is great! Do not force-add a background.

Reference images with the same name are located here: Files\Meshes\Reference\New. Use them to create the texture in the required projection.

Place finished png files in Files\Meshes\Sprites\New.
The name of the new png must contain t_ItemName.png. It is very important to preserve Yaw and its value in the file name.
```

Depending on your image generation model, you may get perfect textures without any background, or with a `#FF00FF` background.
If there is no background, run:
`\Script\Prepare Transparent Textures.bat`
If the textures have a background, run:
`\Script\Prepare Chroma Textures.bat`

In either case, the result will look roughly like this:

![[Pasted image 20260926100901.png]]

Then, from Unreal Engine, run the script `import_processed_sprites.py`:

![[Pasted image 20260926102949.png]]

### Assigning the Sprite

https://youtu.be/8qln9bvIU1o

Simply drag and drop the `SPR_` sprite into the `Sprite` field and click **FixAll**.
![[Pasted image 20260926104105.png]]


### Sprite Adjustment

The AI image generator might occasionally make an error with perspective. This is rare, but it happens.


You can manually adjust the sprite right in UE (the result will be better in Photoshop, but UE's built-in tools are usually sufficient).

The video clearly shows the issue and how to fix it:

https://youtu.be/2n6UNE6s4u0

#### ZOrder
Much more often, you will need to adjust the distance from the sprite to the camera. Simply change the `ZOrder` value:

https://youtu.be/ZF_KgzIgENA

#### Scale

Adjusted just like ZOrder — simply change the `NewScale` value.

## Cleaning Up New Folders

Simply run `Script\move_new_mesh_files.bat` and the files from the `New` folders will be moved one level up.


### 3D Model Optimization

You can make models ultra low-poly. And since the models don't have complex materials with transparency, you can use Nanite. Sometimes Nanite even helps eliminate problematic areas:

https://youtu.be/h_3f4ejzNa0
