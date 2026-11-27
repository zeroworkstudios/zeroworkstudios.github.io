# Changelog

All notable changes to Combo Counter are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

## [2.0] - 2026-11-04

A ground-up rewrite. Version 1.x was a folder under `Assets/ComboSystem` with two uGUI components (`ComboCounter` and `TextPopup`) animated through LeanTween or DOTween. Version 2.0 is a Unity Package Manager package (`com.zeroworkstudios.combocounter`) with one component, `ComboCounterSystem`, that draws through one of seven UI backends and needs no tween library.

### Added

- **Seven UI backends**, chosen with the `ComboBackend` enum on `ComboCounterSystem` (`Backend`): `UGUI` (TextMesh Pro or legacy Text), `UIToolkit`, `UniText`, `FairyGUI`, `NoesisGUI` (2.2 and 4), `OneJS` and `ReactUnity`. Version 1.x supported uGUI with TextMesh Pro only. The third-party backends activate only when their framework is installed, and each draws through a bridge component on the same GameObject (`UniTextComboBridge`, `FairyGUIComboBridge`, `NoesisComboBridge`, `OneJSComboBridge`, `ReactUnityComboBridge`, all deriving from `ComboBridge`).
- **Backend status:** `BackendStatus` (`ComboBackendStatus`: `Ready`, `FrameworkNotInstalled`, `BridgeMissing`, `BridgeMismatch`, `MissingReferences`), `BackendStatusMessage` and `IsBackendReady`. The first hit or break on a backend that is not ready logs one warning saying why.
- **`HitCombo`**, with overloads for the default stage, a world position (`Vector3`, followed while the camera moves, scaled by distance, hidden behind the camera) and a screen position (`Vector2`). `amount` 0 or less shows only the popup; `amount` above 1 applies the hits one at a time, each with its own popup at the level it lands on; `text` null is a random word and `""` is no word; `level` -1 is the current level. Popups can carry a sprite.
- **`BreakCombo()`** and **`ResetScore()`**; `BreakCombo` keeps the score.
- **Combo timer:** the combo breaks by itself when no hit lands within `comboTimeout` (`RemainingTimer`, `RemainingTimerNormalized`, `IsCounting`). In 1.x the counter only reset when its shrink animation finished or `Break()` was called.
- **Gradual decay:** optionally removes a few hits per timeout instead of breaking the combo (`gradualDecay`, `decayAmount`).
- **Counter level look** (`CounterFollowsLevels`, **Follow Levels** in the Inspector, on by default): the hit counter takes each level's counter font, USS class or framework style, on every backend. Turn it off to keep the counter's scene look at every level.
- **Scoring** with per-level multipliers (`Score`, `CurrentMultiplier`), and the live state `Count` and `CurrentLevel`.
- **Events:** `OnComboHit`, `OnLevelUp`, `OnComboBroken`, `OnComboTimerUpdated`, `OnScoreChanged` and `OnPopupSpawned`, as C# events and UnityEvents.
- **Sounds:** a hit sound, a level-up sound and a break sound per level.
- **Several popups at once:** popups are pooled (`UnityEngine.Pool`) and each animates on its own. 1.x had one popup text that every new word restarted.
- **`ComboConfig`** holds all timing, scoring and animation settings, world popup sizing and the level list; a component with no config uses built-in defaults.
- **`LevelConfig`** gained a score multiplier, sounds, a `words` list, legacy Text and UI Toolkit fonts, a USS class, and named slots for a FairyGUI style and a UniText font stack and appearance.
- **Inspectors** for `ComboCounterSystem`, `ComboConfig`, `LevelConfig` and the bridges: a backend status chip with the fix (add the bridge, switch to the bridge's backend, or open the Setup window), only the references the selected backend needs, a Play Mode readout with test buttons, framework slot checks on `LevelConfig`, and level-order checks on `ComboConfig`.
- **UI Toolkit:** the `ComboCounterElement` control (`[UxmlElement]`, UI Builder) and a ready UXML/USS HUD.
- **Combo Counter Setup window** (**Tools > Combo Counter Setup**): shows which UI frameworks are installed, installs them where possible, adds a ready combo counter to the open scene, and opens or plays each demo. It replaces the 1.x tween setup window.
- **Framework update check** in the Setup window: each installed framework card shows an `↑ v<latest>` chip when a newer version exists (checked once a day, or with **CHECK FOR UPDATES**). Clicking it re-adds OneJS and ReactUnity through the Package Manager, or explains how to update UniText, FairyGUI and NoesisGUI 4.0 by hand. Built-in uGUI / UI Toolkit and the discontinued NoesisGUI 2.2 are not checked.
- **Demo scenes** for every framework, plus a **World Demo** for each (**WORLD DEMO** on its Setup card): a first-person level that pops words and sprites up around the aim point or at the crosshair. The OneJS demo is generated into `Assets/ComboCounter/OneJS Demo` on first use, because OneJS only loads Panel Settings from `Assets/`. NoesisGUI 2.2 and 4 demos have an Edit Mode preview (URP). Every demo shows the same HUD: the word popups change colour per level; the hit counter stays yellow and red in the UI demos and changes with the level in the world demos. The demo levels play hit, level-up and break sounds from Juhani Junkala's Essential Retro Video Game Sound Effects Collection (CC0).
- **Edit Mode tests**, plus a reference fixer that keeps USS URLs and XAML font and image paths valid when package files move.
- **Agent skill for AI coding agents:** `Skills~/combo-counter/` is an open Agent Skills folder (`SKILL.md` plus `references/`) covering the API, the backends and the usual mistakes, and `AGENTS.md` / `CLAUDE.md` at the package root point to it. Copy the folder to a project's `.agents/skills/` or `.claude/skills/` so agents such as Claude Code, Codex, Cursor, Gemini CLI and GitHub Copilot find it.

### Changed

- **Packaging:** distributed as a UPM package with its own assemblies (`ZeroWorkStudios.ComboCounter.Runtime`, `ZeroWorkStudios.ComboCounter.Editor`) instead of loose scripts under `Assets/ComboSystem`. The minimum Unity version is now Unity 6 (6000.0). The OneJS demo needs Unity 6.3 (6000.3), because OneJS itself does.
- **Namespace:** `ComboSystem.Scripts` and `ComboSystem.Scripts.ScriptableObjects` became `ZeroWorkStudios.ComboCounter` (editor tools in `ZeroWorkStudios.ComboCounter.Editor`, demo scripts in `ZeroWorkStudios.ComboCounter.Demos`).
- **One component:** `ComboCounterSystem` does the work of `ComboCounter` and `TextPopup`.
- **Animation:** the counter and popup animations use built-in, allocation-free easing instead of LeanTween or DOTween. No scripting define symbols need setting. After a hit the counter punches its scale and does not fade; popups rise and fade.
- **Counter text:** `counterFormat` (`{0}` is the count, for example `{0} HITS!`) replaces the `preCounterFormat` and `postCounterFormat` fields.
- **Words:** each level's words are a `words` list on `LevelConfig` instead of a line-separated `.txt` file.
- **`LevelConfig` fields:** `comboFont` is now `counterFont`, `popUpFont` is `popupFont` and `popUpMaximumScale` is `popupScale`. Existing assets keep their values.
- **Create menus:** **Create > Combo Counter** instead of **Create > Combo System**.

### Removed

- **`ComboCounter` and `TextPopup`** components, with `Increment()`, `Break()` and `PopUpWord(int level)`. Use `ComboCounterSystem` with `HitCombo()` and `BreakCombo()`.
- **`TweenConfig`**, replaced by `ComboConfig`. The counter's random scale range (`minScale`, `maxScale`) is gone; the counter now punches by `counterPunchScale`.
- **Tween libraries:** the static `Tween` wrapper over LeanTween and DOTween, the `USING_LEANTWEEN` / `USING_DOTWEEN` scripting defines and the **Tools > ComboSystem** tween setup window. The new Setup window removes the leftover defines.
- **`LevelConfig.wordsFile`**; type or paste the words into the `words` list.
- **The `Demo_1` and `Demo_2` scenes**, replaced by the per-framework demos.

### Upgrading from 1.x

Version 2.0 isn't a drop-in update:

1. **Remove the old folder.** Delete `Assets/ComboSystem` before installing the package, but keep your own `LevelConfig` assets (move them out first if they are inside that folder). Assembly definitions that referenced the old scripts need to reference `ZeroWorkStudios.ComboCounter.Runtime`.
2. **Replace the components.** `ComboCounter` and `TextPopup` show as missing scripts after the update. Remove them, add **Combo Counter > Combo Counter** from the Add Component menu (or use **Tools > Combo Counter Setup**) and assign your counter text and a popup text to it.
3. **Update code.**
   - Use the `ZeroWorkStudios.ComboCounter` namespace.
   - Replace `ComboCounter` with `ComboCounterSystem`, `Increment()` with `HitCombo()` and `Break()` with `BreakCombo()`. `HitCombo()` already shows a popup, so calls to `TextPopup.PopUpWord(level)` go away; to show only a popup, call `HitCombo(0, level: level)`.
   - A UnityEvent (a Button's On Click, for example) cannot list `HitCombo`, because it takes several parameters. Point the event at a one-line method of your own that calls it.
   - Pass `Input.mousePosition` as `(Vector2)Input.mousePosition` for a screen popup; as a `Vector3` it selects the world overload.
   - Remove calls to the static `Tween` class.
4. **Re-create settings.** `TweenConfig` assets do not carry over: create a `ComboConfig` (**Create > Combo Counter > Combo Configuration**), set its timing and animation, and list your levels in it. `LevelConfig` assets keep their boundary, fonts and popup scale; copy each word file's lines into the level's `words` list.

## [1.17.2] - 2023-09-20

Last version of the original Combo Counter on the Unity Asset Store (Unity 2019.4 and 2020.3; Built-in, URP and HDRP): the `ComboCounter` and `TextPopup` uGUI components, animated through LeanTween or DOTween.
