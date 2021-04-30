import { useMessage } from 'context/mqtt'
import image from 'image/Wood.png'
import './App.css'

function App() {
  const { messageState, client } = useMessage()
  const isInstalled = messageState?.second === 'next'
  const onClickInstall = () => {
    client.publish('first', 'Installing', 0, false)
  }
  const resetTopic = () => {
    client.publish('second', 'reset', 0, false)
  }
  return (
    <div className='App'>
      <header className='App-header'>
        <div className='asset-container'>
          <img
            src={image}
            className={`asset ${isInstalled ? 'opacity-100' : 'opacity-50'}`}
            alt='logo'
          />
          <img
            src={image}
            className={`asset ${isInstalled ? 'opacity-50' : 'opacity-25'}`}
            alt='logo'
          />
        </div>
        <div className='asset-container'>
          <button
            className={`btn ${isInstalled && 'btn-disabled'}`}
            disable={isInstalled}
            onClick={onClickInstall}
          >
            Install
          </button>
          {isInstalled && (
            <button className='btn' onClick={resetTopic}>
              Uninstall
            </button>
          )}
        </div>
      </header>
    </div>
  )
}

export default App
