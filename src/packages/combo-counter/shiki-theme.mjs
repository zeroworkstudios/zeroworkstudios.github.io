// Syntax theme built from the Combo Counter Setup window palette (SetupWindow.uss):
// the framework accent tiles become token colours on the editor's ink well.
const c = {
  well: '#15131E',
  text: '#F4F1FA',
  muted: '#A39DB8',
  faint: '#8A84A3',
  yellow: '#E2E524',
  green: '#3DDC97',
  cyan: '#4CC9F0',
  orange: '#FF9F1C',
  pink: '#FF6B9A',
  purple: '#B388FF',
  cream: '#FFF6D6',
};

export default {
  name: 'combo-counter',
  type: 'dark',
  colors: {
    'editor.background': c.well,
    'editor.foreground': c.text,
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: c.faint, fontStyle: 'italic' } },
    { scope: ['string', 'string.quoted', 'string.template', 'markup.inline.raw'], settings: { foreground: c.green } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character'], settings: { foreground: c.orange } },
    {
      scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.operator.new', 'keyword.operator.expression'],
      settings: { foreground: c.pink },
    },
    {
      scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class', 'entity.other.inherited-class', 'storage.type.cs'],
      settings: { foreground: c.cyan },
    },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call entity.name.function'], settings: { foreground: c.yellow } },
    { scope: ['variable.parameter', 'variable.other.readwrite', 'variable'], settings: { foreground: c.text } },
    { scope: ['variable.other.property', 'variable.other.object.property', 'support.variable.property', 'entity.name.variable.property'], settings: { foreground: c.cream } },
    { scope: ['entity.name.tag', 'punctuation.definition.tag'], settings: { foreground: c.pink } },
    { scope: ['entity.other.attribute-name'], settings: { foreground: c.yellow } },
    { scope: ['support.type.property-name.json', 'meta.object-literal.key'], settings: { foreground: c.cyan } },
    { scope: ['entity.name.namespace', 'entity.name.type.namespace'], settings: { foreground: c.purple } },
    { scope: ['punctuation', 'meta.brace', 'keyword.operator'], settings: { foreground: c.muted } },
  ],
};
