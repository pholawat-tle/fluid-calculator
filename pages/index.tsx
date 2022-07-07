import type { NextPage } from "next";
import { ChangeEvent, useReducer } from "react";
import styled from "styled-components";
import LineChart from "../components/LineChart";
import SliderInput from "../components/SliderInput/SliderInput";

function reducer(state: any, action: any) {
  return { ...state, ...action };
}

const Home: NextPage = () => {
  const [{ minSize, maxSize, minViewport, maxViewport }, _update] = useReducer(
    reducer,
    {
      minSize: 2,
      maxSize: 5,
      minViewport: 300,
      maxViewport: 600,
    }
  );

  const data = [
    { x: 0, y: minSize / 10 },
    { x: minViewport, y: minSize / 10 },
    { x: maxViewport, y: maxSize / 10 },
    { x: maxViewport + minViewport, y: maxSize / 10 },
  ];

  return (
    <MaxWidthWrapper>
      <Card>
        <h1>Fluid Calculator</h1>
        <StyledLineChart data={data} />
        <Controls>
          <SliderInput
            min={0}
            max={1920}
            value={minViewport}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              _update({ minViewport: parseInt(event.target.value) || 0 })
            }
          />
          <SliderInput
            min={0}
            max={1920}
            value={maxViewport}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              _update({ maxViewport: parseInt(event.target.value) || 1 })
            }
          />
          <SliderInput
            min={0}
            max={50}
            value={minSize}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              _update({ minSize: parseInt(event.target.value) || 0 })
            }
          />
          <SliderInput
            min={0}
            max={50}
            value={maxSize}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              _update({ maxSize: parseInt(event.target.value) || 1 })
            }
          />
        </Controls>
      </Card>
    </MaxWidthWrapper>
  );
};

const MaxWidthWrapper = styled.main`
  height: 100%;
  overflow: auto;

  max-width: 1080px;
  padding: 0 32px;
  margin: 0 auto;

  display: flex;
  align-items: flex-start;
`;

const Card = styled.div`
  margin: 64px 0;
  padding: 32px 64px;
  border-radius: 16px;
  width: 100%;

  background-color: hsl(0deg, 0%, 95%);
`;

const StyledLineChart = styled(LineChart)`
  height: 450px;
`;

const Controls = styled.div`
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(auto-fit, minmax(min(100px, 100%), 1fr));
`;

export default Home;
