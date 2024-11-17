import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

const SvgPreview = ({ url }) => {
    const [svgContent, setSvgContent] = useState(null);
    const [error, setError] = useState(null);
    const [scaleInfo, setScaleInfo] = useState(null);

    useEffect(() => {
        const fetchAndAdjustSvg = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("No se pudo cargar el SVG");

                const text = await response.text();
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(text, "image/svg+xml");
                const svgElement = svgDoc.querySelector("svg");

                if (!svgElement) throw new Error("No se encontró un elemento SVG válido");

                // Crear un div temporal para medir el SVG
                const tempDiv = document.createElement("div");
                tempDiv.style.position = "absolute";
                tempDiv.style.visibility = "hidden";
                document.body.appendChild(tempDiv);
                tempDiv.innerHTML = svgElement.outerHTML;
                const svgInDom = tempDiv.querySelector("svg");

                if (svgInDom) {
                    const bbox = svgInDom.getBBox();
                    const newViewBox = `0 0 ${bbox.width} ${bbox.height}`;
                    svgElement.setAttribute("viewBox", newViewBox);

                    // Trasladar contenido al origen
                    const gElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
                    gElement.setAttribute("transform", `translate(${-bbox.x}, ${-bbox.y})`);
                    while (svgElement.firstChild) {
                        gElement.appendChild(svgElement.firstChild);
                    }
                    svgElement.appendChild(gElement);

                    // Calcular la escala
                    const pxPerCm = 37.795275591; // 1cm = 37.7953px
                    const tenCmInPx = pxPerCm * 10; // 10cm en píxeles

                    // Obtener el ancho real del contenedor
                    const containerWidth = 500; // Ancho fijo del contenedor en píxeles
                    const scaleRatio = containerWidth / bbox.width;

                    // Calcular el ancho de la barra de escala en píxeles del SVG
                    const scaleBarWidth = tenCmInPx / scaleRatio;

                    setScaleInfo({
                        svgWidth: bbox.width,
                        scaleBarWidth: scaleBarWidth
                    });
                }

                document.body.removeChild(tempDiv);

                // Configurar el SVG para que se ajuste al contenedor
                svgElement.setAttribute("width", "100%");
                svgElement.setAttribute("height", "100%");
                setSvgContent(svgElement.outerHTML);

            } catch (error) {
                console.error("Error fetching or adjusting SVG:", error);
                setError("No se pudo cargar la previsualización del SVG.");
            }
        };

        fetchAndAdjustSvg();
    }, [url]);

    if (error) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "500px",
                backgroundColor: "#f5f5f5",
                border: "1px solid #ccc",
                borderRadius: "4px",
            }}>
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "500px",
            backgroundColor: "#f5f5f5",
            border: "1px solid #ccc",
            borderRadius: "4px",
            overflow: "hidden",
        }}>
            {svgContent ? (
                <>
                    <div
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                        style={{
                            width: "500px", // Ancho fijo para mantener la escala consistente
                            height: "100%",
                            overflow: "hidden",
                        }}
                    />
                    {scaleInfo && (
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}>
                        </Box>
                    )}
                </>
            ) : (
                <Typography variant="body2">Cargando previsualización...</Typography>
            )}
        </Box>
    );
};

export default SvgPreview;