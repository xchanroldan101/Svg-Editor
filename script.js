const xmlInput = document.getElementById('xmlInput');
const exportBtn = document.getElementById('exportBtn');
const themeBtn = document.getElementById('themeBtn');
const fileInput = document.getElementById('fileInput');
const errorLog = document.getElementById('errorLog');
const canvasContainer = document.getElementById('canvasContainer');
const canvasNode = document.getElementById('canvasNode');
const fileNameInput = document.getElememtById('Filename');

let isDarkGrid = false;

function processXML() {
    const rawXml = xmlInput.value;
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawXml, "image/svg+xml");
    const parserError = doc.querySelector("parsererror");
    
    if (parserError) {
        errorLog.textContent = parserError.textContent;
        errorLog.style.display = "block";
        return null;
    } else {
        errorLog.style.display = "none";
        const rootElement = doc.documentElement;
        if (!rootElement.getAttribute("xmlns")) {
            rootElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        }
        canvasNode.innerHTML = "";
        canvasNode.appendChild(rootElement.cloneNode(true));
        return rawXml;
    }
}

xmlInput.addEventListener('input', processXML);

themeBtn.addEventListener('click', () => {
    isDarkGrid = !isDarkGrid;
    if (isDarkGrid) {
        document.documentElement.style.setProperty('--grid-light', '#334155');
        document.documentElement.style.setProperty('--grid-bg', '#1e293b');
        themeBtn.textContent = 'Light Grid';
    } else {
        document.documentElement.style.setProperty('--grid-light', '#cbd5e1');
        document.documentElement.style.setProperty('--grid-bg', '#f8fafc');
        themeBtn.textContent = 'Dark Grid';
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        xmlInput.value = event.target.result;
        processXML();
    };
    reader.readAsText(file);
});

exportBtn.addEventListener('click', () => {
    const validContent = processXML();
    if(!validContent) return alert("Fix XML issues before downloading.");

    const blob = new Blob([validContent], {type: "image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(blob);

    let fileName = fileNameInput.value.trim() || 'vector-manifest';
    downloader.href = url;
    downloader.download = fileNameInput.value + ".svg";
    document.body.appendChild(downloader);
    downloader.click();
    document.body.removeChild(downloader);
    URL.revokeObjectURL(url);
});
// 1. Automatically inject the required styling layout directly into the page
const style = document.createElement('style');
style.textContent = `
  /* This rule hides the raw text so you can see the color spans underneath */
  #editing {
    color: transparent !important;
    caret-color: #ffffff !important; /* Keeps your flashing text cursor visible */
    background: transparent !important;
  }
  /* Color rules for tokens */
  .xml-tag     { color: #569cd6 !important; }
  .xml-attr    { color: #9cdcfe !important; }
  .xml-string  { color: #ce9178 !important; }
  .xml-comment { color: #6a9955 !important; }
  .xml-bracket { color: #808080 !important; }
`;
document.head.appendChild(style);// Run initial execution pass
processXML();
