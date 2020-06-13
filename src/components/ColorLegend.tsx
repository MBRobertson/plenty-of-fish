import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

import './ColorLegend.css';

interface IColorLegend {
    title?: string
    scale: (n: number) => string,
    domain: [number, number],
    disabled?: boolean
}

const legendHeight = 20;
const legendWidth = 250;

export const ColorLegend: React.FC<IColorLegend> = ({ title, scale, domain, disabled }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = d3.select(canvasRef.current)
        canvas
            .style("width", `${legendWidth}px`)
            .style("height", `${legendHeight}px`)
            .attr("height",  1)
            .attr("width", legendWidth)

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        console.log("got context")

        const image = ctx.createImageData(legendWidth, 1);
        d3.range(legendWidth).forEach((i) => {
            const c = d3.rgb(scale(1 - i/legendWidth))
            image.data[4*i] = c.r;
            image.data[4*i + 1] = c.g;
            image.data[4*i + 2] = c.b;
            image.data[4*i + 3] = 255;
        })

        ctx.putImageData(image, 0, 0);

    }, [canvasRef, scale])

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current)
        svg.selectAll("g").remove() // Clean up any previous markers

        const drawLine = (parent: d3.Selection<SVGGElement, any, any , any>, a: [number, number], b: [number, number]) => {
            return parent.append("line")
                .attr("x1", a[0])
                .attr("y1", a[1])
                .attr("x2", b[0])
                .attr("y2", b[1])
                .attr("stroke", "rgb(150, 150, 150)")
                .attr("stroke-width", 2)
        }

        const drawText = (parent: d3.Selection<SVGGElement, any, any , any>, value: string, a: [number, number]) => {
            return parent.append("text")
                .attr("x", a[0])
                .attr("y", a[1])
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "top")
                .html(value)
                .attr("fill", "rgb(225, 225, 225)")
                .style("font-weight", "bold")
                .style("font-size", "13px")
        }

        const ticks = svg.append("g")
        drawLine(ticks, [20, 0], [20, 5])
        drawLine(ticks, [legendWidth + 20, 0], [legendWidth + 20, 5])
        drawText(ticks, domain[0].toFixed(0), [20, 18])
        drawText(ticks, domain[1].toFixed(0), [legendWidth + 20, 18])
        
        
        
    }, [svgRef, domain])

    return <div  className={`ColorLegend ${disabled ? 'disabled' : ''}`}>
        <div className="title">{ title ?? "Legend" }</div>
        <canvas ref={canvasRef}/>
        <svg width={`${legendWidth + 40}px`} height="25px" ref={svgRef} />
    </div>
}