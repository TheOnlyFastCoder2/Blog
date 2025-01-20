import EditorJS from '@editorjs/editorjs';
import Prism from 'prismjs';
import './themes/Dracula.css';

const extensions = [
  "javascript", "js",
    "python", "py",
    "java",
    "c", "cpp", "csharp", "cs", "dotnet",
    "ruby", "rb",
    "php",
    "swift",
    "go",
    "rust",
    "typescript", "ts",
    "html",
    "css",
    "markdown", "md",
    "sql",
    "bash", "sh",
    "kotlin", "kt",
    "r",
    "dart",
    "scala",
    "haskell", "hs",
    "perl",
    "lua",
    "groovy",
    "elixir",
    "clojure",
    "objectivec", "objc",
    "visual-basic", "vb", "vba",
    "xml",
    "json",
    "yaml", "yml",
    "markdown"
];

class PrismCodeTool {
  static get toolbox() {
    return {
      title: 'Code',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-code"><path d="M10 9.5 8 12l2 2.5"/><path d="m14 9.5 2 2.5-2 2.5"/><rect width="18" height="18" x="3" y="3" rx="2"/></svg>', // Добавьте иконку по вашему выбору
    };
  }
  
  constructor({data,...props}) {
    this.isReadOnly = props.readOnly;
    this.data = data?.code ? data : { code: '', language: 'javascript' };
    this.wrapper = undefined;
    this.codeDisplay = undefined;
  }


  toCreateOption() {
    const option = document.createElement('option');
    option.setAttribute('style', `
      background: var(--main);
      padding: 5px 10px;
      border: 1px solid var(--BGBorder);
      border-radius: 0;
      height: 60px;
    `);
    return option;
  }

  toCreateSelect() {
    const select = document.createElement('select');
    select.setAttribute('style', `
      min-width: 200px;
      height: 100%;
      background: var(--main);
      border: 1px solid var(--border);
      padding: 0 10px;
      border-radius: 4px;
    `);
    return select;
  }


  toCreateSearchInput() {
    const searchInput = document.createElement('input');
    searchInput.setAttribute('placeholder', 'Search language...');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('style', `
      width: 100%;
      margin-bottom: 10px;
      padding: 5px;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: var(--main);
      outline: none;
      height: 100%;
      color: white;
    `);
    return searchInput;
  }


  toCreateTextArea() {
    const textarea = document.createElement('textarea');
    textarea.value = this.data.code;
    textarea.setAttribute('style', `
      width: 100%;
      margin-top: 10px;
      margin-bottom: 10px;
      background: var(--main);
      border: 1px solid var(--border);
      padding: 5px 10px;
      outline: none;
    `);

    return textarea;
  }

  toCreateWrapperFlex(select, search) {
    const div = document.createElement('div');
    div.appendChild(select);
    div.appendChild(search);
    div.setAttribute("style", `
      display:flex;
      gap: 4px; 
      height: 60px;
    `);
    return div;
  }

  toBuildSelect() {
    const select = this.toCreateSelect();
    const languages = extensions;
    languages.forEach((lang) => {
      const option = this.toCreateOption();
      option.value = lang;
      option.textContent = lang;
      if (lang === this.data.language) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    return select;
  }

  toCreateCodeBlock() {
    this.codeDisplay = document.createElement('pre');
    this.codeDisplay.classList.add('language-' + this.data.language);
    this.updateHighlightedCode(this.data.code, this.data.language);
  }

  render() {
    return this.isReadOnly ? this.renderReadOnly() : this.renderEditable();
  }
  
  renderEditable() {
    const select = this.toBuildSelect();
    const textarea = this.toCreateTextArea();
    const searchInput = this.toCreateSearchInput();
    const wrapperFlex = this.toCreateWrapperFlex(select, searchInput);
    
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('prism-code-tool');

    this.toCreateCodeBlock();

    textarea.addEventListener('input', () => {
      this.data.code = textarea.value;
      this.updateHighlightedCode(textarea.value, select.value);
    });

    select.addEventListener('change', () => {
      this.data.language = select.value;
      this.updateHighlightedCode(textarea.value, select.value);
    });

    searchInput.addEventListener('input', () => {
      const filter = searchInput.value.toLowerCase();
      Array.from(select.options).forEach(option => {
        option.style.display = option.text.toLowerCase().includes(filter) ? 'block' : 'none';
      });
    });
    
    this.wrapper.appendChild(wrapperFlex);
    this.wrapper.appendChild(textarea);
    this.wrapper.appendChild(this.codeDisplay);

    return this.wrapper;
  }

  renderReadOnly() {
    const readOnlyWrapper = document.createElement('div');
    readOnlyWrapper.classList.add('prism-code-tool-read-only');
    
    this.toCreateCodeBlock();

    readOnlyWrapper.appendChild(this.codeDisplay);
    return readOnlyWrapper;
  }

  updateHighlightedCode(code, language) {
    if (!Prism.languages[language]) {
      console.error(`Language "${language}" is not defined in Prism.js`);
      return;
    }
    const highlightedCode = Prism.highlight(code, Prism.languages[language], language);
    this.codeDisplay.innerHTML = highlightedCode;
  }

  static get isReadOnlySupported() {
    return true;
  }

  save(blockContent) {
    return {
      code: this.data.code,
      language: this.data.language,
    };
  }

  static get sanitize() {
    return {
      code: true,
      language: true,
    };
  }
}

export default PrismCodeTool;
