import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";





const Barchart = ({ bardata }) => {

  const keys= ["After", "Before"]
  const leftAxis= "국면별 기대수익"
  const lineColors= ["#CD0D15", "#2A6800", "purple", "#0092CC", "#2A6800"]
  const barColors= ["#68A300", "#FFB100", "#0092CC", "#CD0D15", "#2A6800"]
  const height= "500px"

   const tickTheme = {
    textColor: "#eee"
  };


  return (
          <ResponsiveBar
            data={bardata}
            keys={keys}
            indexBy="id"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            groupMode="grouped"
            colors={{ scheme: 'nivo' }}
            enableLabel={false}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 0,
              tickPadding: 5,
              tickRotation: 0,
              legend: "",
              legendPosition: "middle",
              legendOffset: 32
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 3,
              tickRotation: 0,
              legendPosition: "middle",
              legendOffset: -40,
              tickValues: [-6,-4,-2,0, 2, 4, 6, 8, 10,]
            }}
            yScale={{ type: "linear", min: "auto", max: "auto" }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
            from: 'color',
            modifiers: [['darker',1.6]]}}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            enableGridY={false}
            enableGridX={false}
            isInteractive={true}
          />

  );

};
export default Barchart;