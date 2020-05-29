import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

import './FMAMap.css';

import NZMapSVG from '../resources/maps/nz_hires.svg';
import FMAMapSVG from '../resources/maps/fma.svg';

// Maps the index of the paths in the SVG file to FMAs
export enum FMA {
    FMA1 = 8,
    FMA2 = 6,
    FMA3 = 3,
    FMA4 = 4,
    FMA5 = 1,
    FMA6 = 2,
    FMA7 = 0,
    FMA8 = 5,
    FMA9 = 7,
    FMA10 = -1 // To be assigned
}

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

interface IFMAMap {
    onMouseEnter?: (fma: FMA) => any,
    onMouseLeave?: (fma: FMA) => any,
    onMouseClick?: (fma: FMA) => any,
    highlights?: {[K in FMA]? : string}

}

export const FMAMap: React.FC<IFMAMap> = ({ onMouseEnter, onMouseLeave, onMouseClick, highlights }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [nzMap, setNZMap] = useState<SVGGElement | undefined>(undefined);
    const [dimensions, setDimensions] = useState<[number, number]>([0, 0]);
    const [fmas, setFMAs] = useState<SVGPathElement[]>([]);

    // Automatically update the bounding box of the svg
    const onResize = useCallback(() => {
        if (svgRef.current) {
            setDimensions([svgRef.current.clientWidth, svgRef.current.clientHeight]);
        }
    }, [svgRef])

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
                        .attr('stroke', '#0068ad')
                        .attr('stroke-width', 4)
                        .attr('opacity', 0.6)

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
                    .attr('opacity', 0.6);
                if (onMouseLeave) onMouseLeave(i as FMA);
            })

            fma.on('click', () => {
                if (onMouseClick) onMouseClick(i as FMA);
            })
        })
    }, [fmas, onMouseClick, onMouseEnter, onMouseLeave])

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
                        .attr('fill', highlights[Number(value) as FMA]!)
                } else {
                    fma.transition()
                        .duration(150)
                        .attr('fill', DEFAULT_COLOUR)
                }
            })
        }
    }, [fmas, highlights])

    return <div className="FMAMap">
        <svg width="100%" height="100%" ref={svgRef} />
    </div>
}