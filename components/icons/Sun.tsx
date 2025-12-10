import type { SVGProps } from 'react';

export function Sun(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            className="icon-tema"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            {...props}
        >
            <g fill="none" stroke="white" strokeLinecap="round" strokeWidth="2">
                <path d="M12 3V2" stroke="white" strokeDasharray="1" strokeDashoffset="1">
                    <animate attributeName="stroke-dashoffset" from="1" to="0" dur="0.3s" fill="freeze" />
                </path>
                <path d="M12 22v1" stroke="white" strokeDasharray="1" strokeDashoffset="1">
                    <animate attributeName="stroke-dashoffset" from="1" to="0" dur="0.3s" begin="0.2s" fill="freeze" />
                </path>
                <path d="M21 12h1" stroke="white" strokeDasharray="1" strokeDashoffset="1">
                    <animate attributeName="stroke-dashoffset" from="1" to="0" dur="0.3s" begin="0.4s" fill="freeze" />
                </path>
                <path d="M2 12h1" stroke="white" strokeDasharray="1" strokeDashoffset="1">
                    <animate attributeName="stroke-dashoffset" from="1" to="0" dur="0.3s" begin="0.6s" fill="freeze" />
                </path>
                <path d="M19.07 4.93l.707-.707" stroke="white" strokeDasharray="1" strokeDashoffset="1">
                    <animate attributeName="stroke-dashoffset" from="1" to="0" dur="0.3s" begin="0.8s" fill="freeze" />
                </path>
                <path d="M4.93 19.07l-.707.707" stroke="white" strokeDasharray="1" strokeDashoffset="1">
                    <animate attributeName="stroke-dashoffset" from="1" to="0" dur="0.3s" begin="1s" fill="freeze" />
                </path>
                <path d="M4.93 4.93l.707-.707" stroke="white" strokeDasharray="1" strokeDashoffset="1">
                    <animate attributeName="stroke-dashoffset" from="1" to="0" dur="0.3s" begin="1.2s" fill="freeze" />
                </path>
                <path d="M19.07 19.07l.707.707" stroke="white" strokeDasharray="1" strokeDashoffset="1">
                    <animate attributeName="stroke-dashoffset" from="1" to="0" dur="0.3s" begin="1.4s" fill="freeze" />
                </path>
                <circle cx="12" cy="12" r="4" stroke="white" strokeDasharray="25.13" strokeDashoffset="25.13">
                    <animate attributeName="stroke-dashoffset" from="25.13" to="0" dur="0.4s" begin="1.6s" fill="freeze" />
                </circle>
            </g>
        </svg>
    );
}