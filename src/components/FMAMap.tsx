import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

import './FMAMap.css';

import NZMapSVG from '../resources/maps/nz.svg';
import FMAMapSVG from '../resources/maps/fma.svg';

export const FMAMap: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [nzMap, setNZMap] = useState<SVGGElement | undefined>(undefined);
    const [dimensions, setDimensions] = useState<[number, number]>([0, 0]);

    // Automatically update the bounding box of the svg
    const onResize = useCallback(() => {
        if (svgRef.current) {
            setDimensions([svgRef.current.clientWidth, svgRef.current.clientHeight]);
        }
    }, [svgRef])

    // Initialize D3
    useEffect(() => {
        const svg = d3.select(svgRef.current);

        // Draw the map of New Zealand
        (async () => {
            const map = svg.append("g");
            // Draw the FMA areas
            const fmaMap = map.append("g");
            fmaMap.attr('transform', 'translate(130, 270)');
            // Extract paths
            const fmaData = await d3.xml(FMAMapSVG);
            Array.from(fmaData.getElementsByTagName("path"))
                .forEach((p, i) => {
                    const d = p.getAttribute("d");

                    fmaMap.append("path")
                        .attr('d', d!)
                        .attr('fill', '#00426e')
                        .attr('stroke', '#0068ad')
                        .attr('stroke-width', 4)
                })

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
                });
            
            setNZMap(map.node()!);
        })();

        // Setup auto detecting of box width
        window.addEventListener('resize', onResize);
        onResize();
        return () => window.removeEventListener('resize', onResize);
    }, [onResize]);

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

            const dx = (dimensions[0] - newWidth)/2 - (bbox.x * scale)
            const dy = (dimensions[1] - newHeight)/2 - (bbox.y * scale)

            // Move map fit into the screen
            d3.select(nzMap).attr('transform', `translate(${dx}, ${dy}) scale(${scale})`)
        }
    }, [nzMap, dimensions])

    return <div className="FMAMap">
        <svg width="100%" height="100%" ref={svgRef} />
    </div>
}