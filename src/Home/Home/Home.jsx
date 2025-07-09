import React from 'react'
import FactCheck from '../FactCheck/FactCheck'
import VoiceTrend from '../VoiceTrend/VoiceTrend'
import Plans from '../Plans/Plans'

const Home = () => {
  return (
    <div>
       <Plans></Plans>
        <FactCheck></FactCheck>
        <VoiceTrend></VoiceTrend>
    </div>
  )
}

export default Home