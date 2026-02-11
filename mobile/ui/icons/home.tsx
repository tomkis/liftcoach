import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const Home = (props: { color: string }) => {
  return (
    <Svg width={24} height={24} fill="none">
      <Path
        stroke={props.color}
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m7.088 4.762-1 .781c-1.516 1.184-2.275 1.776-2.681 2.61C3 8.988 3 9.952 3 11.88v2.091c0 3.785 0 5.677 1.172 6.853C5.343 22 7.229 22 11 22h2c3.771 0 5.657 0 6.828-1.176C21 19.648 21 17.756 21 13.971v-2.09c0-1.929 0-2.893-.407-3.728-.407-.834-1.165-1.426-2.681-2.61l-1-.78C14.552 2.92 13.372 2 12 2c-1.372 0-2.552.92-4.912 2.762Z"
      />
      <Path stroke={props.color} strokeLinejoin="round" strokeWidth={1.5} d="M15 16.5h2v2m-2-2v2h2m-2-2 2 2" />
    </Svg>
  )
}
export default Home
