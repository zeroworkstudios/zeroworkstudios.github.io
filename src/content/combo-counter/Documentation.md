## Quick start

Everything starts in one window: **Tools > Combo Counter Setup**. It has a card for each UI framework that shows whether the framework is installed, installs it where it can, opens its demos and adds a working combo counter to your scene.

1. Open **Tools > Combo Counter Setup**.
2. On your framework's card, click **UI DEMO** to see the finished HUD, or **WORLD DEMO** to see popups in a 3D level. If the framework is not installed yet, click **GET PLUGIN** first.
3. Open your own scene and click **SETUP IN SCENE**. A ready combo counter, already wired to the demo config, is added to the open scene and selected.
4. Call `HitCombo()` from your game code.

```csharp
using UnityEngine;
using ZeroWorkStudios.ComboCounter;

public class PlayerCombat : MonoBehaviour
{
    [SerializeField] private ComboCounterSystem combo;

    public void OnEnemyHit(Vector3 hitPoint) => combo.HitCombo(hitPoint); // count a hit, popup on the enemy
    public void OnPlayerDamaged() => combo.BreakCombo();
}
```

**SETUP IN SCENE** uses the demo `ComboConfig`, so the counter works straight away. Before you tune it, make your own: **NEW ASSET** in the Setup window, or **New** on the component's **Config** field. The demo assets live in the package, which is read-only when it is installed from Git or a registry.

Prefer to set it up by hand? Add **Combo Counter > Combo Counter** to a GameObject, pick the **Backend**, and follow the inspector: it says what the backend still needs and offers the fix. [Frameworks](#frameworks) lists what each backend needs.

### Using an AI coding agent

The package includes an agent skill, `Skills~/combo-counter/`, in the open Agent Skills format, and an `AGENTS.md` at the package root that points to it. Agents look for skills only in the project, so copy the `combo-counter` folder to `.agents/skills/` and `.claude/skills/` in your project. Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot and other agents will then use it when you ask them to work with Combo Counter. Copy it again after updating the package.

---

## The Setup window

**Tools > Combo Counter Setup** is the package's only menu entry. Each card shows the framework's installed version, a status badge and three buttons. The window refreshes by itself when packages change, a scene opens or Play Mode starts or stops.

### Card buttons

| Button | What it does |
|---|---|
| **UI DEMO** | Opens the framework's HUD demo scene. Unity first asks to save modified scenes; in Play Mode it stops Play Mode, then opens the scene. Greyed out until the framework is installed. |
| **WORLD DEMO** | Opens the framework's first-person world demo, generating it next to the UI demo the first time. **Shift**+click rebuilds it from the current UI demo. See [World demos](#world-demos). |
| **GET PLUGIN** | Installs the framework (see each framework below for how), or opens its download page when it cannot be installed automatically. |
| **SETUP IN SCENE** | Adds a combo counter for this framework to the open scene: the `ComboCounterSystem` with its backend set, the bridge and the UI it draws on, the demo `ComboConfig`, and the demos' popup area (offset `(0, -150)`, spread `(560, 190)` reference pixels). The new object is selected, and the step can be undone. |
| **IN SCENE** | Shown instead of **SETUP IN SCENE** when the open scene already has a combo counter for this framework. Click to select it; nothing is added. |
| **ⓘ** | Opens the framework's repository, store page or documentation. |

### Status badges

| Badge | Meaning |
|---|---|
| **READY** | Installed and usable. |
| **NOT INSTALLED** | The framework is not in the project. **GET PLUGIN** installs it. |
| **INSTALLING** | An install or update is running. The Console logs each step. |
| **IMPORT NEEDED** | uGUI only: TextMesh Pro's Essential Resources are not imported. The button reads **IMPORT TMP** and opens the importer. |
| **RESTART NEEDED** | NoesisGUI only: the other NoesisGUI version's native library is still loaded, so views draw nothing until the Editor restarts. |
| **D3D11 REQUIRED** | NoesisGUI 2.2 only: the Editor runs on a graphics API that NoesisGUI 2.2 cannot draw with. See [NoesisGUI 2.2](#noesisgui-22). |

The section header counts the installed frameworks.

### Framework updates

The window checks the installed frameworks for newer versions once a day when it opens, or now with **CHECK FOR UPDATES**. A framework with a newer version shows an orange `↑ v<latest>` chip beside its version. Clicking the chip:

- **OneJS** and **ReactUnity**: updates the package in place to the newest commit of its repository.
- **UniText** and **FairyGUI**: explains the manual update (both are embedded in `Packages/`, so delete the folder and click **GET PLUGIN** again).
- **NoesisGUI 4.0**: explains how to install the new tarball and opens the Noesis download page.

uGUI and UI Toolkit ship with Unity, and NoesisGUI 2.2 is no longer updated (its last release is 2.2.6), so they are not checked. Nothing in the project is deleted by an update.

### Quick access

- **DOCUMENTATION** opens this page.
- **NEW ASSET** creates a `ComboConfig`, a `LevelConfig`, a UI Toolkit HUD template (UXML) or a UI Toolkit stylesheet (USS) in the folder selected in the Project window (or `Assets/`).
- **GET GASWORKS** opens the publisher page.

Opening the window also removes the scripting define symbols Combo Counter 1.x used for its tween libraries (`USING_DOTWEEN`, `USING_LEANTWEEN`, `USING_PRIMETWEEN`, `USING_LITMOTION`).

---

## Frameworks

`ComboCounterSystem.Backend` is a `ComboBackend`: `UGUI`, `UIToolkit`, `UniText`, `FairyGUI`, `NoesisGUI`, `OneJS` or `ReactUnity`. Setting it at runtime rebuilds the adapters. NoesisGUI 2.2 and 4 share the `NoesisGUI` backend.

uGUI and UI Toolkit draw straight from the component. The other five draw through a **bridge** component on the same GameObject, and their code compiles only when the framework is installed, so the package never needs them as dependencies.

| Backend | Needs on the `ComboCounterSystem` | Bridge |
|---|---|---|
| `UGUI` | **Counter Text** (`TMP_Text`) or the legacy **Counter** (`UnityEngine.UI.Text`). Optional **Popup** template (popups copy its look and position; it is hidden at start) and **Container** (empty creates one next to the component). | none |
| `UIToolkit` | **Document** (`UIDocument`), **Counter Name** (default `combo-counter`, a Label or an element holding one) and **Popups Name** (default `combo-popups`; empty or not found uses the document root). | none |
| `UniText`, `FairyGUI`, `NoesisGUI`, `OneJS`, `ReactUnity` | nothing beyond the shared settings | the framework's bridge (see [Bridges](#bridges)) |

### uGUI (TextMesh Pro)

Canvas UI with TextMesh Pro text. TextMesh Pro is part of `com.unity.ugui` in Unity 6.

- **GET PLUGIN** adds `com.unity.ugui` through the Package Manager when it is missing. When TextMesh Pro's Essential Resources are not imported yet, the card shows **IMPORT NEEDED** and the button opens the importer.
- **SETUP IN SCENE** uses the first Canvas in the open scene, or creates a Screen Space Overlay Canvas (and an EventSystem when the scene has none). Under it, `Combo Counter - uGUI` holds the `ComboCounterSystem` (backend `UGUI`), a `Combo Counter` TMP text (64 pt, the demo font) as the counter, and a hidden `Text Popup` TMP text (42 pt) as the popup template.
- The legacy `UnityEngine.UI.Text` works too: assign it to the **Counter** field in the component's closed **Legacy Text** foldout.

### UI Toolkit

UXML / USS UI with TextCore text, built into Unity 6.

- **SETUP IN SCENE** creates `Combo Counter - UI Toolkit` with a `UIDocument` (the demo Panel Settings and `ComboCounterHUD.uxml`) and a `ComboCounterSystem` (backend `UIToolkit`) pointed at that document, its `combo-counter` label and its `combo-popups` container.
- `Runtime/UI/` has the HUD: `ComboCounterHUD.uxml`, `ComboCounter.uss` and `ComboPopup.uxml`. **NEW ASSET** creates editable copies of the UXML template and the stylesheet in your project.
- `ComboCounterElement` is a `[UxmlElement]` control, so it can be placed in UI Builder or in your own UXML:

```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" xmlns:combo="ZeroWorkStudios.ComboCounter">
    <combo:ComboCounterElement name="combo-counter-hud" class="combo-counter-hud">
        <ui:VisualElement name="counter-wrapper" class="combo-counter-container">
            <ui:Label name="combo-counter" text="0 HITS!" class="combo-counter" />
        </ui:VisualElement>
        <ui:VisualElement name="combo-popups" class="combo-popups-container" />
    </combo:ComboCounterElement>
</ui:UXML>
```

A level's `ussClassName` is added to the counter and popups while that level is active. The demo stylesheet styles `combo-level-1` to `combo-level-3`.

### UniText

Canvas UI with HarfBuzz-shaped Unicode text, from [LightSideKittens/UniText](https://github.com/LightSideKittens/UniText).

- **GET PLUGIN** clones the repository into `Packages/media.lightside.unitext` with Git (in the background, no console window; Git must be on your `PATH`). If the clone fails, it adds `https://github.com/LightSideKittens/UniText.git` through the Package Manager instead.
- **SETUP IN SCENE** uses the scene's Canvas (or creates one, as for uGUI) and adds `Combo Counter - UniText` with the `ComboCounterSystem` (backend `UniText`) and a `UniTextComboBridge`. Children: a `Combo Counter` UniText (64 pt) for the counter, and a `Popup Container` with a hidden `Popup Template` UniText (42 pt). The bridge is wired to all three.
- Per-level typography comes from the level's **UniText Font Stack** and **UniText Appearance** slots; the bridge's **Default Font Stack** and **Default Appearance** fill the gaps.
- **To update**, delete `Packages/media.lightside.unitext` and click **GET PLUGIN** again.

### FairyGUI

A standalone UI system with its own batched renderer, from [fairygui/FairyGUI-unity](https://github.com/fairygui/FairyGUI-unity).

- **GET PLUGIN**: FairyGUI-unity is a Unity project rather than a package, so the window sparse-clones only its `Assets/Scripts`, `Assets/Editor` and `Assets/Resources` folders and embeds them, with their `.meta` files, as the local package `Packages/com.fairygui.unity`. The generated `package.json` takes the upstream commit date as its version. Git versions without sparse checkout get a full shallow clone instead.
- The install also turns on FairyGUI's documented **Input System** and **TextMesh Pro** support in `FairyGUI.asmdef`: a `Unity.InputSystem` reference plus version defines for `FAIRYGUI_INPUT_SYSTEM` and `FAIRYGUI_TMPRO`. They switch on only when those packages are present, so no global scripting defines are needed. Without them, a project that uses only the Input System throws from FairyGUI's `Stage` every frame. **SETUP IN SCENE** re-applies this to an existing install.
- **SETUP IN SCENE** adds `Combo Counter - FairyGUI` with the `ComboCounterSystem`, a `FairyGUIComboBridge` and a `FairyGUIComboView` that builds the counter and popup layer in code. FairyGUI draws the `UI` layer through its own **Stage Camera**, so the setup removes the `UI` layer from the main camera and adds a Stage Camera when the scene has none.
- **To update**, delete `Packages/com.fairygui.unity` and click **GET PLUGIN** again.

#### Styles and fonts

`FairyGUITextStyle` is a ScriptableObject with face colour, outline, hard shadow, faux bold and letter spacing.

- **Counter:** keeps the bridge's **Counter Style** at every level (empty uses the yellow/red of level 3). Turn on **Tier Styles On Counter** to restyle it per level.
- **Popups:** use the level's **FairyGUI Style**. Without one, the built-in tier colours of `ComboCounter.uss` apply.
- **Outline width** works like UI Toolkit's `-unity-text-outline-width`: relative to the font, so smaller text gets a thinner outline.

Fonts resolve in this order: the style's font, the level's TMP font (`counterFont` / `popupFont`, rendered through FairyGUI's `TMPFont`), the level's legacy font, then the bridge's **Default Font**. TMP text uses the Regular weight with TMP-style faux bold, because TMP returns no glyph for a weight the font asset has no typeface for.

#### Your own FairyGUI UI

FairyGUI UIs are usually designed in the FairyGUI Editor desktop app and exported as `*_fui.bytes` packages. To drive one, assign its `UIPanel` to the bridge's **Target Panel** with the paths of the counter text (`counter`) and the popup layer (`popups`), or call `bridge.Bind(counterObject, popupLayer)` from code.

#### Rendering in URP

The demo builder and **SETUP IN SCENE** place FairyGUI's Stage Camera as a URP **Overlay** camera in the main camera's stack (as a separate base camera, its depth-only clear wiped the screen), take the `UI` layer off the main camera, and leave Screen Space Overlay uGUI canvases alone. `FairyGUIComboView` previews the HUD in the Game view in Edit Mode, which needs a Stage Camera in the scene; the preview objects are never saved.

### NoesisGUI 2.2

XAML UI with WPF-style data binding, from the [NoesisGUI 2.2 Asset Store package](https://assetstore.unity.com/packages/tools/gui/noesisgui-2-2-9282).

- **GET PLUGIN** opens the Asset Store page. Import the package from **Window > Package Manager > My Assets**.
- **SETUP IN SCENE** adds `Combo Counter - NoesisGUI 2.2` with the `ComboCounterSystem` (backend `NoesisGUI`, counter format `{0} HITS!`) and a `NoesisComboBridge`. It adds a `NoesisView` with the demo XAML to `Camera.main` (or reuses the one there), and sets the bridge's element names (`ComboCounterText`, `ComboScoreText`, `ComboMultiplierText`, `ComboRankText`, `ComboPopupCanvas`). With no main camera, no view is added; the bridge then finds the active view at runtime.

> **Caution: NoesisGUI 2.2 draws only on Direct3D 11 and OpenGL Core.** On Direct3D 12, Unity 6's default on Windows, the XAML loads but nothing is drawn, and the card shows **D3D11 REQUIRED**. Open **Project Settings > Player > Other Settings**, turn off **Auto Graphics API for Windows**, move **Direct3D11** above **Direct3D12** and restart the Editor (or start it with `-force-d3d11`). NoesisGUI 3.2 and newer support Direct3D 12.

### NoesisGUI 4.0

The current NoesisGUI, distributed by Noesis as a licensed UPM tarball (`com.noesis.noesisgui`).

- **GET PLUGIN** opens the [Noesis downloads page](https://www.noesisengine.com/developers/downloads.php). Download the Unity package (`.tgz`) and add it with **Window > Package Manager > + > Install package from tarball**. Updates are installed the same way.
- **SETUP IN SCENE** does the same as for NoesisGUI 2.2, with the NoesisGUI 4 demo XAML.

> **Caution: switching between NoesisGUI 2.2 and 4 needs an Editor restart.** The old version's `Noesis.dll` stays loaded until then, and every `NoesisView` draws nothing, without an error. The card shows **RESTART NEEDED** until you restart.

**Sprites in NoesisGUI.** NoesisGUI draws textures as premultiplied alpha. A sprite whose fully transparent pixels still carry colour (many exported PNGs are white there) shows a faint box in NoesisGUI only. Clear the colour of transparent pixels, or untick **Alpha Is Transparency** on the texture so Unity does not spread colour into them. The demo sprites are prepared this way.

`NoesisComboViewModel` implements `INotifyPropertyChanged` for your own XAML: `{Binding FormattedText}`, `{Binding ScoreText}` (`SCORE: 1,500`), `{Binding MultiplierText}` (`x2.0`), `{Binding Rank}` (`RANK: S`), `{Binding Scale}` (the punch) and `{Binding Opacity}` (always 1 for the counter).

### OneJS

React 19 TSX on UI Toolkit, from [Singtaa/OneJS](https://github.com/Singtaa/OneJS). OneJS needs **Unity 6.3** or newer and **Node.js 18** or newer on the development machine; it runs `npm install` and `npm run build` for its app folder the first time you enter Play Mode.

- **GET PLUGIN** adds `https://github.com/Singtaa/OneJS.git` through the Package Manager, as the OneJS README recommends (no branch suffix: the `onejs-v*` branches are frozen). On an older Editor it says which version is needed instead.
- **SETUP IN SCENE** adds `Combo Counter - OneJS` with the `ComboCounterSystem` (backend `OneJS`, counter format `{0} HITS!`) and a `OneJSComboBridge`, then registers the bridge in the **Globals** of the scene's first `JSRunner` under the key `combo`. Scripts read it as `globalThis.combo`. With no `JSRunner` in the scene, the Console says how to add the entry by hand; an existing `combo` entry with a value is left unchanged.
- **UI DEMO** generates the demo into `Assets/ComboCounter/OneJS Demo/` instead of opening a bundled scene (see below).

#### Why the demo is generated into Assets

A `JSRunner` loads its bundle from the folder that holds its Panel Settings asset, and that folder has to be part of the project; package folders are read-only in Git and registry installs. On first use, **UI DEMO** saves the open scene, then copies:

- `App/PanelSettings.asset`: a copy of the UI Toolkit demo's Panel Settings, so the theme and 1920×1080 scaling match.
- `App/~/`: the TSX source from `Demos/OneJS Demo/App~/`. Unity ignores `~` folders.
- `App/app.js.txt`: the prebuilt bundle, only when it is missing.

Generation never overwrites a file, so your edits in `App/~/` survive. To regenerate, delete `OneJS Demo.unity`; files you deleted from `App/~/` are copied back then.

#### Subscribing from TSX

The bridge raises `OnStateChanged` and `OnPopupsChanged` from `LateUpdate`, at most once per frame each, so QuickJS crossings are batched. Read the state inside `OnStateChanged` and the popup list inside `OnPopupsChanged` (trimmed from `App~/ComboHud.tsx`):

```tsx
const combo = (globalThis as any).combo as ComboBridge

useEffect(() => {
    const onState = () => setHud(readState(combo))
    onState()
    combo.add_OnStateChanged(onState)
    return () => combo.remove_OnStateChanged(onState)
}, [])

// Buttons call the bridge directly:
<Button onClick={() => combo.Hit()} />
```

#### Rebuilding the bundle

```
cd "Assets/ComboCounter/OneJS Demo/App/~"
npm install          # once
npm run build        # writes ../app.js.txt (App/app.js.txt)
npm run watch        # rebuilds on save; Unity hot-reloads the bundle
```

To update the prebuilt bundle that ships with the package, copy the rebuilt `App/app.js.txt` over `Demos/OneJS Demo/Bundle~/app.js.txt`. Use `NODE_ENV=production` for a release build.

#### OneJSComboBridge reference

| Member | Kind | Purpose |
|---|---|---|
| `OnStateChanged` | event | Any state value below changed (raised from `LateUpdate`). |
| `OnPopupsChanged` | event | `PopupsJson` changed. |
| `Count` | `int` | Current combo hit count. |
| `Level` | `int` | 1-based tier. The rest state is tier 1. |
| `TierClass` | `string` | USS class for the tier: `LevelConfig.ussClassName`, or `combo-level-{Level}`. |
| `FormattedText` | `string` | Counter text, e.g. `12 HITS!`. |
| `Score` | `int` | Accumulated score. |
| `Multiplier` | `float` | Current tier multiplier. |
| `ScoreText` | `string` | Stats label, e.g. `Score: 1,200`. |
| `MultiplierText` | `string` | Multiplier label, e.g. `Multiplier: 2.0x`. |
| `StatusText` | `string` | Status label (ready, milestone, broken and reset messages). |
| `TimerNormalized` | `float` | Remaining decay timer, 0 to 1. |
| `IsCounting` | `bool` | True while the combo timer runs. |
| `PunchScale` | `float` | Counter punch scale, 1 at rest. |
| `CounterAlpha` | `float` | Counter opacity, always 1 (the counter does not fade). |
| `PopupsJson` | `string` | `{"items":[{id,text,level,tierClass,x,y,rotation,scale,alpha}]}`. `x`/`y` are the popup centre in 1920×1080 reference pixels. |
| `HitAmount` | `int` | The **AMOUNT** slider, 0 to 3: HitCombo's amount (0 shows only the popup). Read and set. |
| `HitComboClicked()` | method | `HitCombo(HitAmount)` (the **HIT COMBO** button). |
| `HitComboWithSpriteClicked()` | method | `HitCombo(HitAmount, null, sprite)` (the **HIT COMBO W/ SPRITE** button). |
| `HitComboSpriteOnlyClicked()` | method | `HitCombo(HitAmount, "", sprite)` (the **HIT COMBO ONLY SPRITE** button). |
| `BreakComboClicked()` | method | `BreakCombo()` (the **BREAK COMBO** button). |
| `StatusBeforeRichText`, `StatusSprite`, `StatusAfterRichText`, `StatusCommentRichText` | `string`, `Sprite`, `string`, `string` | The status line: rich text around an inline sprite, and the comment under it. |
| `Combo` | `ComboCounterSystem` | The `ComboCounterSystem` on the bridge's GameObject. |

### ReactUnity

React and CSS on uGUI or UI Toolkit, from [ReactUnity/core](https://github.com/ReactUnity/core).

- **GET PLUGIN** clones the `upm/core` branch into `Packages/com.reactunity.core` with Git (in the background; Git must be on your `PATH`). If the clone fails, it adds `https://github.com/ReactUnity/core.git#latest` through the Package Manager instead. Clicking it again on an existing clone pulls the latest commit.
- **SETUP IN SCENE** adds `Combo Counter - ReactUnity` with the `ComboCounterSystem` (backend `ReactUnity`) and a `ReactUnityComboBridge`. It does not create a React renderer: add your own `ReactRendererUGUI` or UI Toolkit renderer, or use the demo's. The bridge's **Target Renderer**, when empty, finds the active renderer.
- The bridge publishes the combo state as React globals (prefix `combo`, set by **Globals Prefix**). Read them with `useGlobals()`:

```tsx
import React from 'react';
import { useGlobals } from '@reactunity/renderer';

export function ComboHUD() {
  const globals = useGlobals();
  const count = globals.comboCount || 0;
  const scale = globals.comboPunchScale || 1.0;
  const popups = globals.comboPopups || [];

  if (count <= 0) return null;

  return (
    <view className="combo-container" style={{ transform: `scale(${scale})` }}>
      <text className="combo-label">{globals.comboFormattedText}</text>
      <text className="combo-score">Score: {globals.comboScore}</text>

      {popups.map(p => (
        <text key={p.id} className="combo-popup" style={{ left: p.x, top: p.y, opacity: p.alpha }}>
          {p.text}
        </text>
      ))}
    </view>
  );
}
```

You can also mount the counter's prefab in JSX with `<prefab target={globals.comboCounterPrefab} />`; the bridge handles `Mount`, `Unmount`, `SetProperty` and `AddEventListener`. The demo's TSX and stylesheets are in `Demos/ReactUnity Demo/`.

#### React globals reference

| Global | Type | Purpose |
|---|---|---|
| `comboCount` | `number` | Current hit count |
| `comboLevel` | `number` | Level index (0-based) |
| `comboScore` | `number` | Accumulated score |
| `comboMultiplier` | `number` | Current score multiplier |
| `comboFormattedText` | `string` | Counter text (e.g. "50 HITS!") |
| `comboPunchScale` | `number` | Animated hit scale (1.0 to 1.3+) |
| `comboAlpha` | `number` | Counter opacity, always 1.0 (the counter does not fade) |
| `comboRemainingTime` | `number` | Remaining combo timer in seconds |
| `comboTimerNormalized`| `number` | Remaining timer, 1.0 down to 0.0 |
| `comboActive` | `boolean` | Whether the combo is running |
| `comboTierClass` | `string` | CSS class for the level (`combo-tier-0`) |
| `comboPopups` | `PopupData[]` | Active popups |
| `comboHit()` | `() => void` | `HitCombo()`: one hit with a random word |
| `comboHitBy(n)` | `(n) => void` | `HitCombo(n)`: `n` hits, one popup each |
| `comboBreak()` | `() => void` | `BreakCombo()` |
| `comboReset()` | `() => void` | `BreakCombo()` (same as `comboBreak`) |
| `comboPopUpWord()` | `() => void` | `HitCombo(0)`: a popup with a random word, no hit |
| `comboPopUp(word)` | `(word) => void` | `HitCombo(0, word)`: a popup with that word (empty: a random word), no hit |

---

## Demo scenes

Open every demo from its card in the Setup window: **UI DEMO** for the HUD, **WORLD DEMO** for the first-person level. In Play Mode, use the HUD's buttons and **AMOUNT** slider, or press `[Space]` to hit and `[R]` to break the combo. Paths are relative to `Packages/com.zeroworkstudios.combocounter/`.

| Framework | UI demo |
|---|---|
| uGUI | `Demos/uGUI-TMPro Demo/uGUI-TMPro Demo.unity` |
| UI Toolkit | `Demos/UIToolkit Demo/UIToolkit Demo.unity` |
| UniText | `Demos/UniText Demo/UniText Demo.unity` |
| FairyGUI | `Demos/FairyGUI Demo/FairyGUI Demo.unity` (previewed in the Game view in Edit Mode) |
| NoesisGUI 2.2 | `Demos/NoesisGUI 2.2 Demo/NoesisGUI 2.2 Demo.unity` (previewed in Edit Mode in URP) |
| NoesisGUI 4.0 | `Demos/NoesisGUI 4 Demo/NoesisGUI 4 Demo.unity` (previewed in Edit Mode in URP) |
| OneJS | `Assets/ComboCounter/OneJS Demo/OneJS Demo.unity`, generated on first use ([why](#why-the-demo-is-generated-into-assets)) |
| ReactUnity | `Demos/ReactUnity Demo/ReactUnity Demo.unity` |

Every demo shows the same HUD: the hit counter stays yellow and red at every level, and the word popups change colour per level.

### World demos

**WORLD DEMO** opens a small first-person yard with the framework's HUD. Look at something and click, and a popup appears at a random point inside a sphere around where you are looking (`ComboWorldDemoController.PickSpawnPoint`). The HUD switches to its world layout there: no demo buttons, and the counter, timer bar and status label move to the top right.

| Input | Action |
|---|---|
| LMB | Random hit on the sphere cast (`HitCombo(worldPos, camera: ...)`) |
| RMB | Random sprite hit on the sphere cast: a random word with a random sprite |
| Q | Random hit in screen space, near the crosshair (`HitCombo(screenPos)`) |
| E | Random sprite on the sphere cast, no hit (`HitCombo(worldPos, 0, "", sprite, -1, camera)`) |
| F | Random sprite in screen space, no hit (`HitCombo(screenPos, 0, "", sprite)`) |
| R | Reset the counter |
| WASD, Shift, Space, mouse | Walk, run, jump, look |
| Esc | Frees the cursor; click to capture it again |
| H | Hides the controls panel |

Each world demo is saved next to its UI demo. `WorldDemoSceneBuilder` builds it from the UI demo scene, and **Shift**+click on **WORLD DEMO** rebuilds it, keeping the scene's GUID. When the package folder is read-only (installed from Git or a registry), a rebuilt scene goes to `Assets/ComboCounter/World Demos/` instead. The player uses the Input System when it is the active input handler, otherwise the Input Manager.

### Shared demo assets

All demos share `Demos/Assets/`:

- `Combo Config.asset` and `Level_01..03.asset`: levels at 0 / 15 / 35 hits with ×1 / ×2 / ×4 score, each with its words, fonts, FairyGUI style and UniText font stack and appearance.
- The LEMON MILK font as TMP (`Font_1..3`, `ButtonFont`), UI Toolkit TextCore (`*_TextCore`) and Noesis (`LEMONMILK-Bold.otf`) assets, plus the ★ fallback (`StarFallback`).
- `Button.png`, the pill button sprite, and `EmojiSprites/`, the sprites on the demo buttons and popups.

Framework-specific assets (XAML, USS/UXML, TSX, UniText and FairyGUI styles) stay in each demo's folder.

**Moving or renaming demo assets.** Move them in the Project window, or keep each `.meta` file with its asset, and nothing breaks: scenes and assets reference each other by GUID, the Setup window finds package assets by GUID (`ComboDemoAssets`), USS/UXML URLs carry the asset's GUID, and XAML font paths are rewritten when files move in the Editor. The package tests (`PackageReferenceTests`) fail if any of these references stops resolving.

### Scene layout and logging

Every demo scene has the same root objects, top to bottom: the camera (`Main Camera`, or `Player` with the camera as its child in world demos), other cameras such as FairyGUI's `Stage Camera`, the `Directional Light` (world demos), the framework's UI root (`Canvas`, `UI Document` or `OneJS App`), `Combo Counter - {framework}`, `Demo Controller`, `EventSystem`, then `Environment` (world demos). Sounds play through the `AudioSource` on `Demo Controller` in the UI demos and on `Player` in the world demos.

The demo controllers derive from `ComboDemoControllerBase`, whose `Log…` methods print one `[Combo Counter]` line per event. They are hooked to the combo counter's **Events** (every event except **On Combo Timer Updated**, which fires every frame), so you can remove or re-target them in the inspector. Untick **Log Events** on the controller to silence them.

---

## Scripting API

All runtime types are in the `ZeroWorkStudios.ComboCounter` namespace. The counter punch and the popup animations use the built-in `ComboEasing` functions and run from the component's update, with no coroutines, no per-frame allocations and no tween package.

### HitCombo

```csharp
// Popups on the default stage: the counter's position plus Popup Offset and a random Popup Spread.
public void HitCombo(int amount = 1, string text = null, Sprite sprite = null, int level = -1);

// Popups that follow a world position (camera null uses Camera.main).
public void HitCombo(Vector3 worldPos, int amount = 1, string text = null, Sprite sprite = null, int level = -1, Camera camera = null);

// Popups at a screen position in pixels, origin at the bottom left.
public void HitCombo(Vector2 screenPos, int amount = 1, string text = null, Sprite sprite = null, int level = -1);
```

The rules are the same for all three:

- **`amount` 0 or less shows only the popup.** No hit is counted, the score does not change and no sound plays.
- **`amount` above 1 applies the hits one at a time.** Each increment updates the count, level and score (at the multiplier of the level it lands on), raises the events, punches the counter and shows its own popup at the level that hit landed on. After the loop the call plays at most one hit sound and one level-up sound.
- **`text` null shows a random word** from the popup level's `words`. **`""` shows no word** (a sprite alone, if one is given). Any other string is shown as is.
- **`sprite`** is optional. It sits just left of the word, so the word stays centred on the point, or is centred on its own. Atlas sprites show only their rect.
- **`level` -1 uses the current level**: the level each hit lands on, or the current level for a popup-only call. Any other value picks that level's style and words, clamped to the configured levels.
- **World popups** are re-projected every frame, so they stay on their point while the camera moves. They have their normal size at the config's **World Distance** and are scaled within **World Scale**; a point behind the camera is hidden until it is in view. Popups at an explicit world or screen point get no random spread.

```csharp
combo.HitCombo();                                         // one hit, random word, default stage
combo.HitCombo(5);                                        // five hits, five popups
combo.HitCombo(0, "BONUS!");                              // popup only, your word
combo.HitCombo(enemy.position + Vector3.up * 2f);         // one hit, popup on the enemy
combo.HitCombo(hitPoint, 1, "HEADSHOT!", headshotIcon);   // your word and sprite
combo.HitCombo(chest.position, 0, "", coinSprite);        // sprite only, no hit
combo.HitCombo(hitPoint, level: 2, camera: aimCamera);    // level 2 style, own camera
combo.HitCombo(new Vector2(Screen.width * 0.5f, 200f));   // screen position
```

> **Caution: `Input.mousePosition` is a `Vector3`.** Passing it as is selects the **world** overload and the popup is placed at that "world position". Cast it to `Vector2` for a screen popup:
>
> ```csharp
> combo.HitCombo(Input.mousePosition);            // wrong: world overload
> combo.HitCombo((Vector2)Input.mousePosition);   // screen position
> ```
>
> With the Input System, `Mouse.current.position.ReadValue()` is already a `Vector2`.

> **Caution: `HitCombo` is not in UnityEvent dropdowns.** A Button's **On Click ()** list (and any UnityEvent) can call only methods with no parameter or one parameter, and every `HitCombo` overload takes several. `BreakCombo` and `ResetScore` can be picked directly. For a hit, add a one-line method and pick that:
>
> ```csharp
> public class ComboHitButton : MonoBehaviour
> {
>     [SerializeField] private ComboCounterSystem combo;
>     public void Hit() => combo.HitCombo();
> }
> ```

### BreakCombo and ResetScore

- `BreakCombo()` resets the count, level and timer, raises `OnComboBroken` when the count was above 0, cancels the counter animation and clears the active popups. The score is kept.
- `ResetScore()` sets the score to 0 and raises `OnScoreChanged` (only when the score was not already 0).

### State

| Property | Type | Meaning |
|---|---|---|
| `Count` | `int` | Current hit count. |
| `Score` | `int` | Running score. Each hit adds `baseScorePerHit × multiplier`, rounded. |
| `CurrentLevel` | `int` | Index of the active level (0-based). |
| `CurrentMultiplier` | `float` | The active level's `scoreMultiplier` (1 with no level). |
| `RemainingTimer` | `float` | Seconds until the combo times out. |
| `RemainingTimerNormalized` | `float` | The same, 1 to 0. |
| `IsCounting` | `bool` | True while the combo timer runs. |
| `Backend` | `ComboBackend` | The selected backend (settable). |
| `Config` | `ComboConfig` | The config asset, or null for the built-in defaults (settable). |

### Events

Each event is a C# event and a UnityEvent field on the component (in the inspector's **Events** foldout).

| C# event | UnityEvent | Arguments | Raised |
|---|---|---|---|
| `OnComboHit` | `onComboHit` | `int count` | For each counted hit. |
| `OnLevelUp` | `onLevelUp` | `int level, int count` | When a hit moves the combo to another level. |
| `OnComboBroken` | `onComboBroken` | `int finalCount` | When the combo breaks (timeout or `BreakCombo`) with a count above 0. |
| `OnComboTimerUpdated` | `onComboTimerUpdated` | `float normalized` | Every frame while counting, 1 to 0. |
| `OnScoreChanged` | `onScoreChanged` | `int score` | When the score changes. |
| `OnPopupSpawned` | `onPopupSpawned` | `string word, int level` | For every popup; the word is empty for a sprite-only popup. |

```csharp
void OnEnable()  { combo.OnComboHit += HandleHit; combo.OnComboBroken += HandleBroken; }
void OnDisable() { combo.OnComboHit -= HandleHit; combo.OnComboBroken -= HandleBroken; }

void HandleHit(int count) => Debug.Log($"{count} hits, score {combo.Score}, x{combo.CurrentMultiplier}");
void HandleBroken(int finalCount) => Debug.Log($"Combo broken at {finalCount}");
```

### Backend status

| Member | Meaning |
|---|---|
| `ComboBackendStatus BackendStatus` | Whether the selected backend can draw right now. |
| `string BackendStatusMessage` | A readable description of the status. |
| `bool IsBackendReady` | `BackendStatus == ComboBackendStatus.Ready`. |

| `ComboBackendStatus` | When |
|---|---|
| `Ready` | The backend has everything it needs. |
| `FrameworkNotInstalled` | The framework package is not installed. Install it from **Tools > Combo Counter Setup**. |
| `BridgeMissing` | A third-party backend has no bridge on this GameObject. |
| `BridgeMismatch` | The bridge on this GameObject belongs to another backend. |
| `MissingReferences` | References the backend needs (counter text, document, view, panel, renderer) are not assigned, the UI Toolkit counter element is not found, or the bridge has not bound its targets yet. |

The first `HitCombo` or `BreakCombo` on a backend that is not ready logs one warning with the status message; changing the backend allows the warning again.

---

## Configuration

### Component settings

| Field | Default | Meaning |
|---|---|---|
| `counterFormat` | `{0}` | Counter text; `{0}` is the hit count (for example `{0} HITS!`). |
| `popupOffset` | zero | Offset of the default popup stage from the counter (popup template) position. |
| `popupSpread` | zero | Random ± X/Y jitter of default-stage popups, in reference pixels. |
| `audioSource` | none | Plays the levels' sounds. Empty uses an `AudioSource` on the same GameObject, if any. |

### ComboConfig

Create one with **NEW ASSET** in the Setup window, **Create > Combo Counter > Combo Configuration**, or **New** in the component's inspector. It holds every timing, scoring and animation setting and the level list. With no config, the component uses built-in defaults: no levels and no words.

| Field | Default | Meaning |
|---|---|---|
| `comboTimeout` | 2 | Seconds without a hit before the combo breaks (or decays). |
| `baseScorePerHit` | 100 | Score per hit before the level's multiplier. |
| `gradualDecay` | off | When the timer runs out, remove `decayAmount` hits and restart the timer instead of breaking the combo. |
| `decayAmount` | 1 | Hits removed per timeout with `gradualDecay`. |
| `levels` | empty | `LevelConfig` assets in ascending order of `levelBoundaryLower`. |
| `counterPunchScale` | 1.3 | Counter scale at the start of the punch. |
| `counterPunchDuration` | 0.15 | Seconds the counter takes to settle back. |
| `popupDuration` | 0.5 | Seconds a popup takes to rise and fade. |
| `popupMovement` | (0, 50, 0) | Popup travel in reference pixels, +Y up. |
| `popupCurve` | empty | Easing of the popup travel. Empty uses each backend's default ease. |
| `popupMinRotation`, `popupMaxRotation` | 0, 0 | Random Z tilt range in degrees. |
| `worldPopupReferenceDistance` | 8 | Distance at which a world popup has its normal size. 0 keeps a constant size. |
| `worldPopupScaleRange` | (0.35, 1.5) | Smallest and largest distance scale of world popups. |

The active level is the last one whose `levelBoundaryLower` is at or below the count, so the start counts must go up; the inspector flags those that do not.

### LevelConfig

Create one with **NEW ASSET** or **Create > Combo Counter > Level Configuration** and add it to a config's `levels`.

| Field | Meaning |
|---|---|
| `levelBoundaryLower` | Combo count at which this level starts. |
| `scoreMultiplier` | Score multiplier while this level is active. |
| `hitSound`, `levelUpSound` | Optional sounds for a hit at this level and for reaching it. |
| `words` | Words shown by popups at this level, one picked at random. Empty shows no word. |
| `popupScale` | Popup size at this level (1 = normal). |
| `counterFont`, `popupFont` | uGUI: TextMesh Pro fonts at this level. |
| `legacyCounterFont`, `legacyPopupFont` | uGUI: fonts for a legacy UI Text counter or template. |
| `ussClassName` | UI Toolkit: USS class added to the counter and popups at this level. |
| `textCoreCounterFont`, `textCorePopupFont` | UI Toolkit: font assets at this level. |
| `fairyGUIStyle` | FairyGUI: a `FairyGUITextStyle` for popups at this level (and the counter when the bridge's **Tier Styles On Counter** is on). |
| `uniTextFontStack` | UniText: a `UniTextFontStack` for popups at this level. |
| `uniTextAppearance` | UniText: a `UniTextAppearance` for popups at this level. |

The three framework slots are stored as `UnityEngine.Object` so the core does not reference the optional frameworks. An asset of another type is ignored at runtime; the inspector restricts the picker to the accepted type when the framework is installed and names the expected type when the asset is wrong.

---

## Inspectors and bridges

### The inspector

The `ComboCounterSystem` inspector has a header with the selected backend and a status chip, then these sections:

| Section | What it holds |
|---|---|
| **Backend** | The backend, its status message and, when there is one, a fix button: **Add … Bridge** (bridge missing), **Use …** (the bridge on this GameObject is for another framework) or **Open Setup** (framework not installed). |
| **uGUI Text** / **UI Toolkit** / **Bridge** | Only the references the selected backend needs. The legacy UI Text pair is in a closed **Legacy Text** foldout. |
| **Config** | The `ComboConfig`, with **New** when none is set. |
| **Counter and Popups** | Counter format, popup offset and spread, audio source. |
| **Events** | The six UnityEvents, collapsed. |
| **Live** (Play Mode only) | Count, level, multiplier, score and timer, with **Hit**, **Hit ×10**, **Popup** and **Break** test buttons. |

`ComboConfig`, `LevelConfig` and the bridges have inspectors in the same style. The `LevelConfig` inspector checks each framework slot: a framework that is not installed shows its slots greyed out, and an asset of the wrong type is named with the type the slot needs. The `ComboConfig` inspector flags empty level slots and levels whose start count does not go up.

### Bridges

The third-party backends draw through a bridge component on the same GameObject as the `ComboCounterSystem`. A bridge holds only scene references; the system creates the adapters for its backend and hands them to the bridge. A bridge requires a `ComboCounterSystem`, a GameObject can hold one bridge, and the system's backend must match it (the bridge's inspector offers **Use …** when it does not). **SETUP IN SCENE** adds and wires the right bridge for you.

| Bridge | Fields | Needs |
|---|---|---|
| `UniTextComboBridge` | Target UniText (empty finds one in children or the scene), Popup Template (a GameObject with a UniText component), Popup Container, Default Font Stack, Default Appearance | a UniText component for the counter |
| `FairyGUIComboBridge` | Target Panel, Counter Path (`counter`), Popup Layer Path (`popups`), Default Font, Popup Font Size (42), Counter Style, Tier Styles On Counter | a Target Panel, a `FairyGUIComboView` on the GameObject, or a call to `Bind()` |
| `NoesisComboBridge` | Target View (empty finds the active view), element names (`ComboCounterText`, `ComboScoreText`, `ComboMultiplierText`, `ComboRankText`, `ComboPopupCanvas`), Use Data Binding | a NoesisView |
| `OneJSComboBridge` | UI Document (found automatically when empty) | a `JSRunner` with the bridge in its Globals as `combo` |
| `ReactUnityComboBridge` | Target Renderer (empty finds the active renderer), Sync Globals, Globals Prefix (`combo`), Expose Globals Methods | a React renderer |

`ComboBridge.Combo` returns the `ComboCounterSystem` on the bridge's GameObject, and `ComboBridge.Backend` the backend the bridge serves.

---

## Upgrading from 1.x

Version 2.0 is a rewrite: one `ComboCounterSystem` replaces the 1.x components, and the tween libraries are gone. The step-by-step upgrade is in [CHANGELOG.md](changelog/#upgrading-from-1x).

### What was removed

| Removed | Use instead |
|---|---|
| `ComboCounter` and `TextPopup` components | `ComboCounterSystem` |
| `Increment()`, `Hit()`, `Hit(ComboPopupRequest)`, `HitAtWorld`, `HitAtScreen` | `HitCombo(...)` overloads |
| `PopUp(...)`, `PopUpAtWorld`, `PopUpAtScreen`, `ComboPopupRequest` | `HitCombo(0, ...)` (popup only) |
| `Break()` | `BreakCombo()` |
| `ComboDisplayMode`, `UseBackend(id)`, `ComboBackends` string ids | the `ComboBackend` enum and `Backend` property |
| Custom backends through a public `ComboAdapterRegistry`, `IComboUIAdapter`, `IComboPopupAdapter`, `ComboPopupSpawnArgs` | the seven built-in backends (these types are internal now) |
| `ComboTracker`, `ComboDisplay`, `ComboPopupSpawner` as separate public parts | `ComboCounterSystem` (they are internal now) |
| `SetUIToolkitTarget(...)` | the **Document** and element names on the component |
| World popup settings on the component | `worldPopupReferenceDistance` and `worldPopupScaleRange` on `ComboConfig` |
| Counter prefix and suffix | `counterFormat` (`{0}` is the count) |
| `wordsFile` text assets on `LevelConfig` | the `words` list |
| The `Tween` class, LeanTween / DOTween wrappers and their defines | the built-in animation (`ComboEasing`) |
| The tabbed IMGUI inspector | the inspectors described above |

### Renamed fields

Serialized data saved under the old field names is kept: the renamed fields carry `[FormerlySerializedAs]` (for example `tmpText` → `counterText`, `uiDocument` → `document`, `popupRandomSpread` → `popupSpread`, `onMilestoneReached` → `onLevelUp`, `outDuration` → `comboTimeout`, `comboFont` → `counterFont`).
