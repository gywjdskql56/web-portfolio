import { ResponsiveLine } from '@nivo/line'
// ========================================================

// ========================================================

const Line = ({
  linedata
}) => {

const data = [
  {
    "id": "japan",
    "color": "hsl(342, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 211
      },
      {
        "x": "helicopter",
        "y": 2
      },
      {
        "x": "boat",
        "y": 213
      },
      {
        "x": "train",
        "y": 204
      },
      {
        "x": "subway",
        "y": 29
      },
      {
        "x": "bus",
        "y": 11
      },
      {
        "x": "car",
        "y": 74
      },
      {
        "x": "moto",
        "y": 145
      },
      {
        "x": "bicycle",
        "y": 43
      },
      {
        "x": "horse",
        "y": 264
      },
      {
        "x": "skateboard",
        "y": 70
      },
      {
        "x": "others",
        "y": 24
      }
    ]
  },
  {
    "id": "france",
    "color": "hsl(236, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 18
      },
      {
        "x": "helicopter",
        "y": 110
      },
      {
        "x": "boat",
        "y": 133
      },
      {
        "x": "train",
        "y": 243
      },
      {
        "x": "subway",
        "y": 172
      },
      {
        "x": "bus",
        "y": 6
      },
      {
        "x": "car",
        "y": 12
      },
      {
        "x": "moto",
        "y": 155
      },
      {
        "x": "bicycle",
        "y": 57
      },
      {
        "x": "horse",
        "y": 92
      },
      {
        "x": "skateboard",
        "y": 201
      },
      {
        "x": "others",
        "y": 108
      }
    ]
  },
  {
    "id": "us",
    "color": "hsl(287, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 139
      },
      {
        "x": "helicopter",
        "y": 173
      },
      {
        "x": "boat",
        "y": 48
      },
      {
        "x": "train",
        "y": 15
      },
      {
        "x": "subway",
        "y": 58
      },
      {
        "x": "bus",
        "y": 266
      },
      {
        "x": "car",
        "y": 107
      },
      {
        "x": "moto",
        "y": 206
      },
      {
        "x": "bicycle",
        "y": 291
      },
      {
        "x": "horse",
        "y": 105
      },
      {
        "x": "skateboard",
        "y": 137
      },
      {
        "x": "others",
        "y": 81
      }
    ]
  },
  {
    "id": "germany",
    "color": "hsl(110, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 35
      },
      {
        "x": "helicopter",
        "y": 56
      },
      {
        "x": "boat",
        "y": 4
      },
      {
        "x": "train",
        "y": 252
      },
      {
        "x": "subway",
        "y": 228
      },
      {
        "x": "bus",
        "y": 11
      },
      {
        "x": "car",
        "y": 21
      },
      {
        "x": "moto",
        "y": 43
      },
      {
        "x": "bicycle",
        "y": 151
      },
      {
        "x": "horse",
        "y": 210
      },
      {
        "x": "skateboard",
        "y": 237
      },
      {
        "x": "others",
        "y": 209
      }
    ]
  },
  {
    "id": "norway",
    "color": "hsl(303, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 170
      },
      {
        "x": "helicopter",
        "y": 100
      },
      {
        "x": "boat",
        "y": 32
      },
      {
        "x": "train",
        "y": 148
      },
      {
        "x": "subway",
        "y": 1
      },
      {
        "x": "bus",
        "y": 40
      },
      {
        "x": "car",
        "y": 226
      },
      {
        "x": "moto",
        "y": 59
      },
      {
        "x": "bicycle",
        "y": 5
      },
      {
        "x": "horse",
        "y": 122
      },
      {
        "x": "skateboard",
        "y": 228
      },
      {
        "x": "others",
        "y": 130
      }
    ]
  }
]
  return   <ResponsiveLine
        data={linedata}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 2,
            tickPadding: 1,
            tickRotation: 90,
            legend: '',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        pointSize={1}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
};
export default Line;