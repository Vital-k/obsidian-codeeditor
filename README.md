![image](https://user-images.githubusercontent.com/14358394/132259364-9ea50ed5-0603-43fa-b802-bb31ff468350.png)

A minimalistic solution to view js and css files in Obsidian.

In settings you can set up a mirror folder for css snippets and themes. With this, you can make them available for edit within Obsidian.

You can configure the styling of code mirror with a css snippet. More on CodeMirror styling [here](https://codemirror.net/lib/codemirror.css).

```css
.CodeView .cm-header {color: var(--cm-header) !important;}
.CodeView .cm-negative {color: var(--cm-negative) !important;}
.CodeView .cm-positive {color: var(--cm-positive) !important;}

.CodeView .cm-header {font-weight: bold;} 
.CodeView .cm-strong {font-weight: bold;}
.CodeView .cm-em {font-style: italic;}
.CodeView .cm-link {text-decoration: underline;}
.CodeView .cm-strikethrough {text-decoration: line-through;}

.CodeView .cm-keyword {color: var(--cm-keyword) !important;}
.CodeView .cm-atom {color: var(--cm-atom) !important;}
.CodeView .cm-number {color: var(--cm-number) !important;}
.CodeView .cm-def {color: var(--cm-def) !important;}
.CodeView .cm-variable {color: var(--cm-variable) !important;}
.CodeView .cm-property {color: var(--cm-property) !important;}
.CodeView .cm-operator {color: var(--cm-operator) !important;}
.CodeView .cm-variable-2 {color: var(--cm-variable-2) !important;}
.CodeView .cm-variable-3 {color: var(--cm-variable-3) !important;} 
.CodeView .cm-type {color: var(--cm-type) !important;}
.CodeView .cm-comment {color: var(--cm-comment) !important;}
.CodeView .cm-string {color: var(--cm-string) !important;}
.CodeView .cm-string-2 {color: var(--cm-string-2) !important;}
.CodeView .cm-meta {color: var(--cm-meta) !important;}
.CodeView .cm-qualifier {color: var(--cm-qualifier) !important;}
.CodeView .cm-builtin {color: var(--cm-builtin) !important;}
.CodeView .cm-bracket {color: var(--cm-bracket) !important;}
.CodeView .cm-tag {color: var(--cm-tag) !important;}
.CodeView .cm-attribute {color: var(--cm-attribute) !important;}
.CodeView .cm-hr {color: var(--cm-hr) !important;}
.CodeView .cm-link {color: var(--cm-link) !important;}
.CodeView .cm-error {color: var(--cm-error) !important; background: var(--cm-error-bg) !important;}
.CodeView .cm-invalidchar {color: var(--cm-invalidchar) !important;}

.CodeView .cm-active-line-background-color {background: var(--cm-active-line-background-color) !important;}
.CodeView .cm-attribute-in-comment {color: var(--cm-attribute-in-comment) !important;}
.CodeView .cm-callee {color: var(--cm-callee) !important;}
.CodeView .cm-definition {color: var(--cm-definition) !important;}
.CodeView .cm-tag-in-comment {color: var(--cm-tag-in-comment) !important;}
```