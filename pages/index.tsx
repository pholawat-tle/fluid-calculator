import type { NextPage } from "next";
import styled from "styled-components";
import LineChart from "../components/LineChart";

const data = [
  { x: 0, y: 2 },
  { x: 450, y: 2 },
  { x: 1920, y: 3 },
  { x: 1920 + 450, y: 3 },
];

const Home: NextPage = () => {
  return (
    <MaxWidthWrapper>
      <Card>
        <h1>Fluid Calculator</h1>
        <StyledLineChart data={data} />
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

export default Home;
