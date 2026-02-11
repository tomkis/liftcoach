import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const WorkoutStretchingFilled = (props: { color: string }) => {
  return (
    <Svg width={24} height={24} fill="none">
      <Path
        fill={props.color}
        stroke={props.color}
        strokeWidth={1.5}
        d="M16 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
      />
      <Path
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M10.726 8.214C8.226 10.714 7 17.632 7 21m3.726-12.786C8.877 6.966 8.452 4.69 9.75 3m.975 5.214L13.372 10m0 0 2.06 1.39c1.02.689 1.53 1.033 1.565 1.48.006.07.003.14-.009.208-.072.443-.61.754-1.684 1.376L14.36 15m-.987-5a15.585 15.585 0 0 0-1.77 2.894c-.44.927-.659 1.39-.618 1.92M15 21c-.973-1.135-1.974-2.7-2.95-4.142-.683-1.01-1.025-1.516-1.066-2.045m0 0L8 14"
      />
    </Svg>
  )
}

export default WorkoutStretchingFilled
