import * as React from 'react'
import Svg, { Path, Rect } from 'react-native-svg'

import { theme } from '@/mobile/theme/theme'

const ClipboardFilled = (props: { color: string }) => (
  <Svg width={24} height={24} fill="none">
    <Path
      d="M9 2h6a1 1 0 0 1 1 1v1H8V3a1 1 0 0 1 1-1Z"
      fill={props.color}
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect
      x={4}
      y={4}
      width={16}
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
      d="M8 10h8M8 14h5"
    />
  </Svg>
)

export default ClipboardFilled
