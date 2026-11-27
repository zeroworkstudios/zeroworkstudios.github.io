# License

Combo Counter © 2026 Zero Work Studios. All rights reserved.

Combo Counter is distributed through the Unity Asset Store and is licensed under the [Unity Asset Store End User License Agreement](https://unity.com/legal/as-terms) (Standard Unity Asset Store EULA). Your use of this package is governed by that agreement.

Third-party components included in this package are governed by their own licenses. See [Third Party Notices](#third-party-notices).

## Third Party Notices

Combo Counter is governed by the [Unity Asset Store EULA](https://unity.com/legal/as-terms) (see [the license above](#top)). The components below are included in this package and are governed by the licenses indicated.

UI frameworks that Combo Counter integrates with (UniText, FairyGUI, NoesisGUI, OneJS, ReactUnity) are not included; they are installed separately under their own licenses.

### Fluent Emoji (Flat style)

- **License Type:** MIT ([full text below](#mit-license))
- **Copyright:** Copyright (c) Microsoft Corporation.
- **Source:** <https://github.com/microsoft/fluentui-emoji> ([license](https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE))
- **Files:** `Demos/Assets/EmojiSprites/*.png`, the Flat SVGs rendered unmodified to 128 px PNG:
  - `Emoji_Cool.png`: Smiling face with sunglasses
  - `Emoji_Joy.png`: Face with tears of joy
  - `Emoji_Grin.png`: Beaming face with smiling eyes
  - `Emoji_HeartEyes.png`: Smiling face with heart-eyes
  - `Emoji_Repeat.png`: Counterclockwise arrows button

### The Essential Retro Video Game Sound Effects Collection [512 sounds]

- **License Type:** CC0 1.0 Universal (public domain dedication), <http://creativecommons.org/publicdomain/zero/1.0/>
- **Created by:** Juhani Junkala
- **Source:** <https://opengameart.org/content/512-sound-effects-8-bit-style>
- **Files:** `Demos/Assets/Sounds/sfx_sounds_button12.wav`, `sfx_sound_neutral11.wav`, `sfx_sounds_fanfare3.wav` (unchanged)

### React, react-reconciler, scheduler and use-sync-external-store

- **License Type:** MIT ([full text below](#mit-license))
- **Copyright:** Copyright (c) Meta Platforms, Inc. and affiliates.
- **Source:** <https://github.com/facebook/react/blob/main/LICENSE>
- **Files:** compiled into `Demos/OneJS Demo/Bundle~/app.js.txt` and `Demos/ReactUnity Demo/dist/index.js.txt` (use-sync-external-store only in the ReactUnity bundle)

### onejs-react

- **License Type:** MIT ([full text below](#mit-license))
- **Copyright:** Copyright (c) 2024 Singtaa
- **Source:** <https://github.com/Singtaa/onejs-react>
- **Files:** compiled into `Demos/OneJS Demo/Bundle~/app.js.txt` (onejs-unity is only the build tool named in `Demos/OneJS Demo/App~/package.json`; none of its code is included)

### @reactunity/renderer

- **License Type:** MIT ([full text below](#mit-license))
- **Copyright:** Copyright (c) 2020 Gökhan Kurt
- **Source:** <https://github.com/ReactUnity/renderer>
- **Files:** compiled into `Demos/ReactUnity Demo/dist/index.js.txt`

### League Spartan (Modified Version: "League Spartan Caps ExtraBold")

- **License Type:** SIL Open Font License 1.1 ([full text below](#sil-open-font-license))
- **Copyright:** Copyright 2020 The League Spartan Project Authors (<https://github.com/theleagueof/league-spartan>)
- **Files:** `Demos/Assets/LeagueSpartanCaps-ExtraBold.ttf`, `Editor/UI/Fonts/LeagueSpartanCaps-ExtraBold.ttf`, and the font assets generated from it: `Demos/Assets/Font_1..3`, `ButtonFont`, `*_TextCore`, `LeagueSpartanCaps-ExtraBold.asset`; `Demos/UniText Demo/LeagueSpartanCaps_Font.asset`
- **Modification:** a static ExtraBold (weight 800) instance of the variable font, with lowercase letters mapped to the capital glyphs, renamed "League Spartan Caps".

### License texts

#### MIT License

Applies to every MIT component above, with its own copyright line.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

#### SIL Open Font License

Applies to League Spartan Caps ExtraBold.

```text
Copyright 2020 The League Spartan Project Authors (https://github.com/theleagueof/league-spartan)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
https://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded, 
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
```
