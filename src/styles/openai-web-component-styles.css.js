/* eslint-disable no-unused-vars */
import { css } from 'lit';

export const styles = css`:host {
  --_container-color: var(--primary, #f5f5f5);
  --_label-text-color: var(--on-primary, #201f23);
  --_surface-color: var(--surface, #fff);
  --_outline-container-color: var(--on-surface, #bcbcbc);
  --_outline-control-color: var(--outline-primary, #e7e7e7);
  display: block;
  margin: auto;
  width: max(40rem, 50%);
  box-sizing: border-box;
  color: var(--_label-text-color);
  background-color: var(--_container-color);
  border: var(--_outline-container-color) solid 0.0625rem;
  border-radius: 0.125rem;
  padding: 2rem;
}

:host([hidden]),
[hidden] {
  display: none !important;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

.sr-only {
  position: absolute;
  width: 0.0625rem;
  height: 0.0625rem;
  padding: 0;
  margin: -0.0625rem;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.control,
.textbox {
  width: 100%;
}

form {
  display: flex;
  flex-direction: column;
  align-items: start;
}
form > * {
  -webkit-margin-after: calc(var(--space-size) * 1.5);
          margin-block-end: calc(var(--space-size) * 1.5);
}

label {
  display: block;
  cursor: pointer;
}

.control {
  block-size: calc(var(--space-size) * 4);
}

button {
  block-size: calc(var(--space-size) * 6);
  align-self: center;
}

button,
.control {
  font: inherit;
  cursor: pointer;
  font-size: 0.875rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  resize: none;
  background-color: var(--_surface-color);
  line-height: 1;
  border: 0.0625rem solid var(--_outline-control-color);
  outline: var(--_surface-color) dashed 0.0625rem;
  outline-offset: -0.125rem;
  transition: outline-color 0.2s ease 0s;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
  color: var(--_label-text-color);
  padding-block: 0;
  padding-inline: calc(var(--space-size) * 1);
  min-inline-size: calc(var(--space-size) * 40);
}
button:focus-visible,
.control:focus-visible {
  outline-color: var(--_outline-container-color);
}
button:focus:not(:focus-visible),
.control:focus:not(:focus-visible) {
  outline: none;
}

.textbox {
  display: flex;
  flex-direction: column;
  min-block-size: calc(var(--space-size) * 11);
  -webkit-margin-after: calc(var(--space-size) * 4);
          margin-block-end: calc(var(--space-size) * 4);
}

figure:not([data-empty]),
.textbox {
  border: var(--_outline-container-color) dashed 0.0625rem;
  padding: 1rem;
}

figure:not([data-empty]) {
  background-color: var(--_surface-color);
}

img {
  width: 100%;
}

img,
svg {
  display: block;
  margin: auto;
}

circle {
  fill: none;
  stroke-linecap: round;
  stroke-width: 0.5rem;
  stroke: var(--_outline-container-color);
  opacity: 0.5;
}

.loader-svg {
  stroke-width: 0.3125rem;
  stroke: var(--_outline-container-color);
  stroke-dasharray: 242;
  transform: scaleX(-1);
  transform-origin: center;
  animation: stroke-animation 800ms linear 0s infinite;
}

@keyframes stroke-animation {
  0% {
    stroke-dasharray: 40 242;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 142;
    stroke-dashoffset: 142;
  }
  100% {
    stroke-dasharray: 40 242;
    stroke-dashoffset: 282;
  }
}`;
