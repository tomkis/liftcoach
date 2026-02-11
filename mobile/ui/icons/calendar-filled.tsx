import * as React from 'react'
import Svg, { Path, Rect } from 'react-native-svg'

import { theme } from '@/mobile/theme/theme'

const CalendarFilled = (props: { color: string }) => (
  <Svg width={24} height={24} fill="none">
    <Rect
      x={3}
      y={4}
      width={18}
      height={18}
      rx={2}
      fill={props.color}
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      stroke={theme.colors.newUi.backgroundLight}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10h18M8 2v4M16 2v4"
    />
  </Svg>
)

export default CalendarFilled
