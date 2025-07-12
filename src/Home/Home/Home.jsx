import React from 'react'
import FactCheck from '../FactCheck/FactCheck'
import VoiceTrend from '../VoiceTrend/VoiceTrend'
import Plans from '../Plans/Plans'
import PublisherCard from '../../pages/Publisher/PublisherCard'
import PublisherList from '../../pages/Publisher/PublisherLIst'
import TrendingArticles from '../../pages/TrendingArticles/TrendingArticles'
import Statistics from '../Stat/Statistics'

const Home = () => {
  return (
    <div className='bg-stone-100'>
      <TrendingArticles></TrendingArticles>
      <Statistics></Statistics>
      <PublisherList></PublisherList>
       <Plans></Plans>
        <FactCheck></FactCheck>
        <VoiceTrend></VoiceTrend>
    </div>
  )
}

export default Home