import { YAML, editor } from "@silverbulletmd/silverbullet/syscalls";

export async function plotly(
  bodyText: string,
  pageName: string
): Promise<CodeWidgetContent> {
  const chartData = await YAML.parse(bodyText);

  // Default layouts
  const defaultLayoutLight = {
    title: chartData.title,
    plot_bgcolor: "#fff",
    paper_bgcolor: "#fff",
    font: { family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif", color: "#222" }
  };
  const defaultLayoutDark = {
    title: chartData.title,
    plot_bgcolor: "#111",
    paper_bgcolor: "#111",
    font: { family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif", color: "#fff" }
  };

  let traces;
  const chartDivId = "plotly-chart";
  if (chartData.type === "bar") {
    traces = [
      {
        x: chartData.labels,
        y: chartData.values,
        type: "bar",
        name: chartData.name
      }
    ];
  } else if (chartData.type === "line") {
    if (Array.isArray(chartData.trace)) {
      traces = chartData.trace.map((t, i) => ({
        x: t.x,
        y: t.y,
        type: "scatter",
        mode: "lines+markers",
        name: t.name || `Trace ${i + 1}`
      }));
    } else {
      traces = [
        {
          x: chartData.x,
          y: chartData.y,
          type: "scatter",
          mode: "lines+markers",
          name: chartData.name
        }
      ];
    }
  } else {
    return { html: `**Error:** Unsupported chart type. Use 'bar' or 'line'.` };
  }

  return {
    html: `
      <div id="${chartDivId}" style="width:100%;height:400px;"></div>`,
    script: `
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
        const traces = ${JSON.stringify(traces)};
        const layoutLight = ${JSON.stringify(defaultLayoutLight)};
        const layoutDark = ${JSON.stringify(defaultLayoutDark)};
        function renderPlot() {
          const theme = getTheme();
          const layout = theme === 'dark' ? layoutDark : layoutLight;
          Plotly.newPlot('${chartDivId}', traces, layout, {responsive: true});
        }
        renderPlot();
        if (window.matchMedia) {
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', renderPlot);
        }
        const observer = new MutationObserver(renderPlot);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      });
    `
  };
}
