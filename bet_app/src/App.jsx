import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import CreateBet from './pages/CreateBet'
import Login from './pages/Login'
import SiginUp from './pages/Sigin'
import Home from './pages/Home'
import CardList from './components/OpenCardList'
import ReqestBetList from './components/ReqestBetList'
import WinList from './components/WinList'
import LoseList from './components/LoseList'
import History from './components/History'

function App() {
 

  return (
    <>
      <div className='flex justify-center items-center'>
          <BrowserRouter>
          <Routes>
            <Route path='/' Component={SiginUp}></Route>
            <Route path='/login' Component={Login}></Route>
            <Route path='/createBet' Component={CreateBet}></Route>
            <Route path='/home' Component={Home}>
              <Route path='/home/open' Component={CardList}></Route>
              <Route path='/home/request' Component={ReqestBetList}></Route>
              <Route path='/home/wins' Component={WinList}></Route>
              <Route path='/home/lose' Component={LoseList}></Route>
              <Route path='/home/history' Component={History}></Route>
            </Route>
          </Routes>
          </BrowserRouter>
       </div>

    </>
  )
}

export default App
