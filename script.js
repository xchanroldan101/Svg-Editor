const xmlInput = document.getElementById('xmlInput');
const exportBtn = document.getElementById('exportBtn');
const themeBtn = document.getElementById('themeBtn');
const fileInput = document.getElementById('fileInput');
const errorLog = document.getElementById('errorLog');
const canvasContainer = document.getElementById('canvasContainer');
const canvasNode = document.getElementById('canvasNode');

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
    const downloader = document.createElement("a");
    downloader.href = url;
    downloader.download = "vector-manifest.svg";
    document.body.appendChild(downloader);
    downloader.click();
    document.body.removeChild(downloader);
    URL.revokeObjectURL(url);
});

function updateHighlight() {
  const textarea = document.getElementById("editing");
  const highlightContent = document.getElementById("highlighting-content");
    
  let code = textarea.value;
  code = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  code = code.replace(
    /(&lt;!--[\s\S]*?--&gt;)|(&lt;\/?[a-zA-Z0-9:-]+)|(\s[a-zA-Z0-9:-]+=)|("[\s\S]*?")|(&gt;|&lt;|\/&gt;)/g,
    function(match, comment, tag, attr, string, bracket) {
      if (comment) return `<span class="xml-comment">${comment}</span>`;
      if (tag)     return `<span class="xml-tag">${tag}</span>`;
      if (attr)    return `<span class="xml-attr">${attr}</span>`;
      if (string)  return `<span class="xml-string">${string}</span>`;
      if (bracket) return `<span class="xml-bracket">${bracket}</span>`;
      return match;
    }
  );
  highlightContent.innerHTML = code;
    
// Run initial execution pass
processXML();
