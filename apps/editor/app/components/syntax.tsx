// import "highlight.js/styles/github.css";

const numberClass = "text-orange-400";
const keyClass = "text-purple-400";
const stringClass = "text-green-400";
const booleanClass = "text-pink-400";
const nullClass = "text-teal-400";

function syntaxHighlight(json) {
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = numberClass;
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = keyClass;
        } else {
          cls = stringClass;
        }
      } else if (/true|false/.test(match)) {
        cls = booleanClass;
      } else if (/null/.test(match)) {
        cls = nullClass;
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}

export default function Syntax({ children }: { children: any }) {
  return (
    <div className="h-full overflow-auto rounded border border-slate-200 bg-slate-900 text-white">
      <pre
        className="p-4 text-xs"
        dangerouslySetInnerHTML={{
          __html: syntaxHighlight(JSON.stringify(children, null, 2)),
        }}
      />
    </div>
  );
}
