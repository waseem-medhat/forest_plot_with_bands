// ------------------------------------
// FOREST PLOT WITH HETEROGENEITY BANDS
// ------------------------------------
// Waseem Medhat
// Nov 2020

// NOTE: This script is built to be used with R through the package R2D3 as
//       it depends on values provided by the package (svg, width, height)

// DEMO: https://waseem-medhat.shinyapps.io/forest_plot_with_bands/

const margin = { top: 135, right: 20, bottom: 30, left: 350 };
const innerWidth = width - margin.right - margin.left;
const innerHeight = height - margin.top - margin.bottom;
const innerLeftMargin = margin.left - 20

const statOffset = -20
const titleOffset = -100
const subtitleOffset = -70

const xMax = d3.max(data, (d) => d.hi)
const xMin = d3.min(data, (d) => d.lo)

const xScale = d3.scaleLog()
  .domain([
    xMin > 1 ? (1 - (xMax - xMin)) : xMin,
    xMax < 1 ? (1 + (xMax - xMin)) : xMax
  ])
  .range([0, innerWidth]);

const yScale = d3.scalePoint()
  .domain(data.map((d) => d.STUDYID))
  .range([0, innerHeight])
	.padding(1);

const widthScale = d3.scaleLinear()
  .domain(d3.extent(data, d => d.n))
  .range([10, 17])

const plotG = svg
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

//
// title
//
plotG
  .append('text')
  .attr('x', -innerLeftMargin)
  .attr('y', titleOffset)
  .attr('font-size', '1.5em')
  .attr('font-weight', 'bold')
  .text('Intensive antihypertensive therapy versus standard of care')

//
// subtitle
//
plotG
  .append('text')
  .attr('x', -innerLeftMargin)
  .attr('y', subtitleOffset)
  .attr('font-size', '1.1em')
  .text('Responder analysis - patients with controlled systolic blood pressure at 1 year')

plotG
  .append('text')
  .attr('x', -innerLeftMargin)
  .attr('y', subtitleOffset)
  .attr('dy', '1.2em')
  .attr('font-size', '1.1em')
  .html('(&le; 120 mmHg)')


//
// upper line
//
plotG
  .append('line')
  .attr('x1', -innerLeftMargin)
  .attr('x2', innerWidth)
  .attr('stroke', '#555')
  .attr('stroke-width', 2)

//
// heterogeneity bands
//
plotG
  .selectAll('rect')
  .data(data.filter((_,i) => i < data.length - 2))
  .enter()
  .append('rect')
  .classed('heterogeneity-band', true)
  .attr('x', (d) => xScale(d.lo))
	.attr('width', (d) => xScale(d.hi) - xScale(d.lo))
	.attr('height', innerHeight)
	.attr('opacity', 0.05 + (1 / data.length))

//
// studies
//
const gSub = plotG
  .selectAll('g')
  .data(data.filter((_,i) => i < data.length - 2))
  .enter()
  .append('g')

//
// confint
//
gSub
  .append('line')
	.classed('mark', true)
  .attr('transform', (d) => `translate(0,${yScale(d.STUDYID)})`)
  .attr('x1', (d) => xScale(d.lo))
  .attr('x2', (d) => xScale(d.hi))

//
// stats area
//
const textG = gSub
  .append('g')

textG
  .append('text')
  .text(d => d.STUDYID)
  .attr('x', -innerLeftMargin)
  .attr('y', (d) => yScale(d.STUDYID))
  .attr('dy', '0.32em')
  .attr('text-anchor', 'start')

textG
  .append('text')
  .text(d => (
    `${d.point.toFixed(2)} [ ${d.lo.toFixed(2)} - ${d.hi.toFixed(2)} ]`
  ))
  .attr('x', -innerLeftMargin * 0.6)
  .attr('y', (d) => yScale(d.STUDYID))
  .attr('dy', '0.32em')

//
// ID label
//
plotG
  .append('text')
  .text('Study ID')
  .attr('x', -innerLeftMargin)
  .attr('y', statOffset)
  .attr('dy', '0.32em')
  .attr('text-anchor', 'start')

plotG
  .append('text')
  .attr('x', xScale(1))
  .attr('y', statOffset)
  .attr('dy', '0.32em')
  .attr('text-anchor', 'end')
  .attr('font-size', '0.9em')
  .html('&#8592; Favors intensive therapy')

//
// stat label
//
const smDict = {OR: 'Odds ratio', RR: 'Risk ratio'}

plotG
  .append('text')
  .text(`${smDict[data[0].sm]} [95% CI]`)
  .attr('x', -innerLeftMargin * 0.6)
  .attr('y', statOffset)
  .attr('dy', '0.32em')
  .attr('text-anchor', 'start')

//
// study rectangle
//
gSub
  .append('rect')
  .attr('x', (d) => xScale(d.point) - widthScale(d.n) / 2)
  .attr('y', (d) => yScale(d.STUDYID) - widthScale(d.n) / 2)
  .attr('width', d => widthScale(d.n))
  .attr('height', d => widthScale(d.n))
  .classed('mark', true)

//
// x axis line
//
plotG
  .append('line')
  .attr('transform', `translate(0,${innerHeight})`)
  .attr('x1', -innerLeftMargin)
  .attr('x2', innerWidth)
  .attr('stroke', '#555')
  .attr('stroke-width', 2)

//
// x axis text
//
xAxis = plotG.append('g')

const xTicks = [0.1, 0.5, 0.8, 1, 5, 10].filter(t => xScale(t) > 0)

xAxis
  .selectAll('text')
  .data(xTicks)
  .enter()
  .append('text')
  .attr('x', d => xScale(d))
  .attr('y', innerHeight + 15)
  .attr('dy', '0.32em')
  .attr('text-anchor', 'middle')
  .text(d => d)

//
// x axis ticks  
//
xAxis
  .selectAll('line')
  .data(xTicks)
  .enter()
  .append('line')
  .attr('transform', d => `translate(${xScale(d)},${innerHeight - 5})`)
  .attr('y2', 10)
  .attr('stroke', '#555')
  .attr('stroke-width', '2')

//
// y axis line
//
plotG
  .append('line')
  .attr('transform', `translate(${xScale(1)},0)`)
  .attr('y2', innerHeight)
  .attr('stroke', '#555')
  .attr('stroke-width', 2)

//
// pooled
//
pooledG = plotG
  .append('g')
  .attr('transform', `translate(0,${yScale.step() / 4 })`)

pooledGSub = pooledG
  .selectAll('g')
  .data(data.filter((_,i) => i >= data.length - 2))
  .enter()
  .append('g')

pooledGSub
  .append('polygon')
  .classed('mark', true)
  .attr('points', d => `
    ${xScale(d.lo)}, ${yScale(d.STUDYID)}
    ${xScale(d.point)}, ${yScale(d.STUDYID) + yScale.step() / 4}
    ${xScale(d.hi)}, ${yScale(d.STUDYID)}
    ${xScale(d.point)}, ${yScale(d.STUDYID) - yScale.step() / 4}
  `)

pooledGSub
  .append('text')
  .text(d => d.STUDYID)
  .attr('x', -innerLeftMargin)
  .attr('y', (d) => yScale(d.STUDYID))
  .attr('dy', '0.32em')
  .attr('text-anchor', 'start')

pooledGSub
  .append('text')
  .text(d => (
    `${d.point.toFixed(2)} [ ${d.lo.toFixed(2)} - ${d.hi.toFixed(2)} ]`
  ))
  .attr('x', -innerLeftMargin * 0.6)
  .attr('y', (d) => yScale(d.STUDYID))
  .attr('dy', '0.32em')
