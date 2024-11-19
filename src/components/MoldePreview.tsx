import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

const SvgPreview: React.FC<{ url: string }> = ({ url }) => {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAndAdjustSvg = async () => {
            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("No se pudo cargar el SVG");
                }

                const text = await response.text();

                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(text, "image/svg+xml");
                const svgElement = svgDoc.querySelector("svg");

                if (svgElement) {
                    const tempDiv = document.createElement("div");
                    tempDiv.style.position = "absolute";
                    tempDiv.style.visibility = "hidden";
                    document.body.appendChild(tempDiv);

                    tempDiv.innerHTML = svgElement.outerHTML;
                    const svgInDom = tempDiv.querySelector("svg");

                    if (svgInDom) {
                        const bbox = svgInDom.getBBox();
                        const newViewBox = `0 0 ${bbox.width} ${bbox.height}`;

                        // Ajustar viewBox al contenido
                        svgElement.setAttribute("viewBox", newViewBox);

                        // Trasladar contenido al origen (0, 0)
                        const gElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        gElement.setAttribute("transform", `translate(${-bbox.x}, ${-bbox.y})`);
                        while (svgElement.firstChild) {
                            gElement.appendChild(svgElement.firstChild);
                        }
                        svgElement.appendChild(gElement);
                    }

                    document.body.removeChild(tempDiv);

                    svgElement.setAttribute("width", "100%");
                    svgElement.setAttribute("height", "100%");
                    setSvgContent(svgElement.outerHTML);
                } else {
                    throw new Error("No se encontró un elemento SVG válido");
                }
            } catch (error) {
                console.error("Error fetching or adjusting SVG:", error);
                setError("No se pudo cargar la previsualización del SVG.");
            }
        };

        fetchAndAdjustSvg();
    }, [url]);

    if (error) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "auto",
                    height: "500px",
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                }}
            >
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "auto",
                height: "500px",
                backgroundColor: "#f5f5f5",
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
            }}
        >
            {svgContent ? (
                <>
                    <div
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                        style={{
                            width: "100%",
                            height: "100%",
                            overflow: "hidden",
                        }}
                    />
                </>
            ) : (
                <Typography variant="body2">Cargando previsualización...</Typography>
            )}
        </Box>
    );
};

export default SvgPreview;
