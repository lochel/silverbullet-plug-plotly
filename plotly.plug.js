var b=Object.defineProperty;var w=(e,r)=>{for(var t in r)b(e,t,{get:r[t],enumerable:!0})};function g(e){let r=atob(e),t=r.length,o=new Uint8Array(t);for(let i=0;i<t;i++)o[i]=r.charCodeAt(i);return o}function d(e){typeof e=="string"&&(e=new TextEncoder().encode(e));let r="",t=e.byteLength;for(let o=0;o<t;o++)r+=String.fromCharCode(e[o]);return btoa(r)}var u=e=>{throw new Error("Not initialized yet")},f=typeof window>"u"&&typeof globalThis.WebSocketPair>"u";typeof Deno>"u"&&(self.Deno={args:[],build:{arch:"x86_64"},env:{get(){}}});var p=new Map,m=0;f&&(globalThis.syscall=async(e,...r)=>await new Promise((t,o)=>{m++,p.set(m,{resolve:t,reject:o}),u({type:"sys",id:m,name:e,args:r})}));function y(e,r,t){f&&(u=t,self.addEventListener("message",o=>{(async()=>{let i=o.data;switch(i.type){case"inv":{let a=e[i.name];if(!a)throw new Error(`Function not loaded: ${i.name}`);try{let s=await Promise.resolve(a(...i.args||[]));u({type:"invr",id:i.id,result:s})}catch(s){console.error("An exception was thrown as a result of invoking function",i.name,"error:",s.message),u({type:"invr",id:i.id,error:s.message})}}break;case"sysr":{let a=i.id,s=p.get(a);if(!s)throw Error("Invalid request id");p.delete(a),i.error?s.reject(new Error(i.error)):s.resolve(i.result)}break}})().catch(console.error)}),u({type:"manifest",manifest:r}))}async function M(e,r){if(typeof e!="string"){let t=new Uint8Array(await e.arrayBuffer()),o=t.length>0?d(t):void 0;r={method:e.method,headers:Object.fromEntries(e.headers.entries()),base64Body:o},e=e.url}return syscall("sandboxFetch.fetch",e,r)}globalThis.nativeFetch=globalThis.fetch;function S(){globalThis.fetch=async function(e,r){let t=r&&r.body?d(new Uint8Array(await new Response(r.body).arrayBuffer())):void 0,o=await M(e,r&&{method:r.method,headers:r.headers,base64Body:t});return new Response(o.base64Body?g(o.base64Body):null,{status:o.status,headers:o.headers})}}f&&S();typeof self>"u"&&(self={syscall:()=>{throw new Error("Not implemented here")}});function n(e,...r){return globalThis.syscall(e,...r)}var c={};w(c,{parse:()=>j,stringify:()=>B});function j(e){return n("yaml.parse",e)}function B(e){return n("yaml.stringify",e)}async function x(e,r){let t=await c.parse(e),o={title:t.title,plot_bgcolor:"#fff",paper_bgcolor:"#fff",font:{family:"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",color:"#222"}},i={title:t.title,plot_bgcolor:"#111",paper_bgcolor:"#111",font:{family:"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",color:"#fff"}},a,s="plotly-chart";if(t.type==="bar")a=[{x:t.labels,y:t.values,type:"bar",name:t.name}];else if(t.type==="line")Array.isArray(t.trace)?a=t.trace.map((l,v)=>({x:l.x,y:l.y,type:"scatter",mode:"lines+markers",name:l.name||`Trace ${v+1}`})):a=[{x:t.x,y:t.y,type:"scatter",mode:"lines+markers",name:t.name}];else return{html:"**Error:** Unsupported chart type. Use 'bar' or 'line'."};return{html:`
      <div id="${s}" style="width:100%;height:400px;"></div>`,script:`
      function getTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
          return 'dark';
        }
        return 'light';
      }
      loadJsByUrl('https://cdn.plot.ly/plotly-latest.min.js').then(() => {
        const traces = ${JSON.stringify(a)};
        const layoutLight = ${JSON.stringify(o)};
        const layoutDark = ${JSON.stringify(i)};
        function renderPlot() {
          const theme = getTheme();
          const layout = theme === 'dark' ? layoutDark : layoutLight;
          Plotly.newPlot('${s}', traces, layout, {responsive: true});
        }
        renderPlot();
        if (window.matchMedia) {
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', renderPlot);
        }
        const observer = new MutationObserver(renderPlot);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      });
    `}}var P={plotly:x},h={name:"plotly",functions:{plotly:{path:"plotly.ts:plotly",codeWidget:"plotly"}},assets:{}},be={manifest:h,functionMapping:P};y(P,h,self.postMessage);export{be as plug};
