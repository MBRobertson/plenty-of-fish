import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

import './FMAMap.css';
import { FMA } from '../resources/data';

import NZMapSVG from '../resources/maps/nz_hires.svg';
import FMAMapSVG from '../resources/maps/fma.svg';
import { ColorLegend } from './ColorLegend';


// Offset the helper text when the center isn't very useful
const customTextOffsets: { [K in FMA]: [number, number] } = {
    [FMA.FMA1]: [30, -20],
    [FMA.FMA2]: [-20, 40],
    [FMA.FMA3]: [70, 0],
    [FMA.FMA4]: [0, 0],
    [FMA.FMA5]: [-80, 0],
    [FMA.FMA6]: [0, 0],
    [FMA.FMA7]: [0, 30],
    [FMA.FMA8]: [-80, -80],
    [FMA.FMA9]: [-130, 30],
    [FMA.FMA10]: [0, 0]
}

const DEFAULT_COLOUR = '#00426e';
const DEFAULT_BORDER_COLOUR = '#0068ad';
const DEFAULT_OPACITY = 0.6;

export interface MapHighlight {
    fill?: string,
    border?: string,
    opacity?: number,
    tooltipTitle?: string,
    tooltipDescription?: string
}

interface IFMAMap {
    onMouseEnter?: (fma: FMA) => any,
    onMouseLeave?: (fma: FMA) => any,
    onMouseClick?: (fma: FMA) => any,
    highlights?: {[K in FMA]? : MapHighlight}
}

export const FMAMap: React.FC<IFMAMap> = ({ onMouseEnter, onMouseLeave, onMouseClick, highlights }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [nzMap, setNZMap] = useState<SVGGElement | undefined>(undefined);
    const [dimensions, setDimensions] = useState<[number, number]>([0, 0]);
    const [fmas, setFMAs] = useState<SVGPathElement[]>([]);

    // Automatically update the bounding box of the svg
    const onResize = useCallback(() => {
        if (svgRef.current) {
            setDimensions([svgRef.current.clientWidth, svgRef.current.clientHeight]);
        }
    }, [svgRef])

    const setTooltipPos = useCallback((x, y) => {
        if (!tooltipRef.current) return;
        const tooltip = d3.select(tooltipRef.current);
        tooltip.style("top", (y + 5) + "px").style("left", (x + 15) + "px");
    }, [tooltipRef])

    const setTooltipEnabled = useCallback((enabled) => {
        if (!tooltipRef.current) return;
        const tooltip = d3.select(tooltipRef.current);
        tooltip.style("opacity", enabled ? 1 : 0);
    }, [tooltipRef])

    const setTooltipContent = useCallback(({ title, desc }: { title?: string, desc?: string}) => {
        if (!tooltipRef.current) return;
        const tooltip = d3.select(tooltipRef.current);
        tooltip.select(".title").html(title !== undefined ? title : "FMA");
        tooltip.select(".desc").html(desc !== undefined ? desc : "");
    }, [tooltipRef])

    // Initialize D3
    useEffect(() => {
        const svg = d3.select(svgRef.current);

        svg.select('g').remove();

        // Draw the map of New Zealand
        (async () => {
            const map = svg.append("g");
            // Draw the FMA areas
            const fmaMap = map.append("g");
            fmaMap.attr('transform', 'translate(130, 270)');
            // Extract paths
            const fmaData = await d3.xml(FMAMapSVG);
            const fmas = Array.from(fmaData.getElementsByTagName("path"))
                .map((p, i) => {
                    const d = p.getAttribute("d");

                    const fma = fmaMap.append("path")
                        .attr('d', d!)
                        .attr('fill', DEFAULT_COLOUR)
                        .attr('stroke', DEFAULT_BORDER_COLOUR)
                        .attr('stroke-width', 4)
                        .attr('opacity', DEFAULT_OPACITY)

                    const bbox = fma.node()!.getBBox()
                    // Show fma title
                    fmaMap.append("text")
                        .text(FMA[i])
                        .attr('x', bbox.x + bbox.width / 2 + customTextOffsets[i as FMA][0])
                        .attr('y', bbox.y + bbox.height / 2 + customTextOffsets[i as FMA][1])
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        .style('font-size', 50)
                        .style('font-weight', 'bold')
                        .style('text-shadow', '1px 1px 3px rgba(0, 0, 0, 0.9)')
                        .style('fill', 'whitesmoke')
                        .style('pointer-events', 'none')

                    return fma.node()!;
                });

            setFMAs(fmas);

            // Create a new group to store the NZ map
            const nzMap = map.append("g");
            // Extract paths 
            const mapData = await d3.xml(NZMapSVG);
            Array.from(mapData.getElementsByTagName("path"))
                .forEach(p => {
                    // Append path info to SVG
                    const d = p.getAttribute("d");

                    nzMap.append("path")
                        .attr('d', d!)
                        .attr('fill', 'black')
                        .attr('stroke', '#0068ad')
                        .attr('stroke-width', 3)
                });

            setNZMap(map.node()!);
        })();

        // Setup auto detecting of box width
        window.addEventListener('resize', onResize);
        onResize();
        return () => window.removeEventListener('resize', onResize);
    }, [onResize]);

    // Setup onclick
    useEffect(() => {
        fmas.forEach((f, i) => {
            const fma = d3.select(f);
            // Clear any existing events
            fma.on('click', null);
            fma.on('mouseover', null);
            fma.on('mouseout', null);
            fma.on('mousemove', null);

            // Setup hover effects
            fma.on('mouseover', () => {
                fma.transition()
                    .duration(200)
                    .attr('opacity', 1);
                if (onMouseEnter) onMouseEnter(i as FMA);
            })

            fma.on('mouseout', () => {
                fma.transition()
                    .duration(200)
                    .attr('opacity', (highlights![Number(i) as FMA])?.opacity ?? DEFAULT_OPACITY);
                setTooltipEnabled(false);
                if (onMouseLeave) onMouseLeave(i as FMA);
            })

            fma.on('mousemove', (d) => {
                let title = FMA[i]
                let desc = ""
                if (highlights) {
                    const data = highlights[i as FMA]
                    if (data) {
                        title = data.tooltipTitle ? data.tooltipTitle : title;
                        desc = data.tooltipDescription ? data.tooltipDescription : desc;
                    }
                }
                
                setTooltipPos(d3.event.pageX, d3.event.pageY);
                setTooltipContent({ title, desc })
                setTooltipEnabled(true);
            })

            fma.on('click', () => {
                if (onMouseClick) onMouseClick(i as FMA);
            })
        })
    }, [fmas, onMouseClick, onMouseEnter, onMouseLeave, highlights, setTooltipPos, setTooltipEnabled, setTooltipContent])

    // Automativally update scales when a resize is detected
    useEffect(() => {
        if (nzMap && dimensions) {
            const bbox = nzMap.getBBox();
            // Compute scale (select small to fit either horizontally or vertically)
            const scale = Math.min(
                dimensions[0] / bbox.width,
                dimensions[1] / bbox.height
            )

            const newWidth = bbox.width * scale;
            const newHeight = bbox.height * scale;

            const dx = (dimensions[0] - newWidth) / 2 - (bbox.x * scale)
            const dy = (dimensions[1] - newHeight) / 2 - (bbox.y * scale)

            // Move map fit into the screen
            d3.select(nzMap).attr('transform', `translate(${dx}, ${dy}) scale(${scale})`)
        }
    }, [nzMap, dimensions]);

    // Update colors where provided
    useEffect(() => {
        if (highlights) {
            Object.values(FMA).forEach(value => {
                const fma = d3.select(fmas[Number(value)]);
                if (highlights[Number(value) as FMA]) {
                    fma.transition()
                        .duration(150)
                        .attr('fill', highlights[Number(value) as FMA]!.fill ?? DEFAULT_COLOUR)
                        .attr('stroke', highlights[Number(value) as FMA]!.border ?? DEFAULT_BORDER_COLOUR)
                        .attr('opacity', highlights[Number(value) as FMA]!.opacity ?? DEFAULT_OPACITY)
                } else {
                    fma.transition()
                        .duration(150)
                        .attr('fill', DEFAULT_COLOUR)
                        .attr('stroke', DEFAULT_BORDER_COLOUR)
                        .attr('opacity', DEFAULT_OPACITY ?? DEFAULT_OPACITY)
                }
            })
        }
    }, [fmas, highlights])

    return <div className="FMAMap">
        <svg width="100%" height="100%" ref={svgRef} />
        <div className="FMAMap-legend">
            <ColorLegend scale={d3.interpolateYlGnBu} domain={[0, 1]}/>
        </div>
        <div ref={tooltipRef} className="FMAMap-tooltip" style={{ "opacity": 0 }}>
            <span className="title">Title</span>
            <span className="desc">Data</span>
        </div>
    </div>
}