import { ChangeEventHandler } from "react";
import styled from "styled-components";

const SliderInput: React.FC<{ value: number; onChange: ChangeEventHandler, min: number, max: number }> = (
    props
) => {
  return <Input type="range" {...props} />;
};

const Input = styled.input`
  background-color: transparent;
  appearance: none;
  width: 100%;

  cursor: pointer;
  outline-offset: 6px;

  ::-webkit-slider-runnable-track {
    width: calc(100% - 16px);
    height: 3px;
    background: hsl(225deg, 8%, 80%);
    border-radius: 1.5px;
    margin: 8px 0px;
  }

  ::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50px;
    background: hsl(225deg, 25%, 20%);
    cursor: grab;
    transform: translateY(calc(-50% + 1.5px));
    outline: 2px solid hsl(0deg, 0%, 95%);
  }

  :focus::-webkit-slider-thumb {
    background: linear-gradient(0deg, rgb(0, 42, 255), rgb(102, 102, 255));
  }
`;

export default SliderInput;
