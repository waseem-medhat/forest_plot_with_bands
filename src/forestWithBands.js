// ------------------------------------
// FOREST PLOT WITH HETEROGENEITY BANDS
// ------------------------------------
// Waseem Medhat
// Nov 2020

// NOTE: This script is built to be used with R through the package R2D3 as
//       it depends on values provided by the package (svg, width, height)

const margin = { top: 35, right: 20, bottom: 30, left: 350 };
const innerWidth = width - margin.right - margin.left;
const innerHeight = height - margin.top - margin.bottom;
const innerLeftMargin = margin.left - 20

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
  .attr('y', -20)
  .attr('dy', '0.32em')
  .attr('text-anchor', 'start')

plotG
  .append('text')
  .attr('x', innerWidth)
  .attr('y', -20)
  .attr('dy', '0.32em')
  .attr('text-anchor', 'end')
  .html('&#129144; Favors treatment')

//
// stat label
//
plotG
  .append('text')
  .text(`${data[0].sm} [95% CI]`)
  .attr('x', -innerLeftMargin * 0.6)
  .attr('y', -20)
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

xAxis
  .append('text')
  .attr('x', xScale(1))
  .attr('y', innerHeight + 15)
  .attr('dy', '0.32em')
  .attr('text-anchor', 'middle')
  .text("1")

//
// x axis ticks  
//
xAxis
  .selectAll('line')
  .data([1])
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
  	