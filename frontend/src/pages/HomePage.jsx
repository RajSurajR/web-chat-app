import { useChatStore } from '../store/useChatStore'
import Sidebar from '../components/Sidebar';
import NoChatContainer from '../components/NoChatContainer';
import ChatContainer from '../components/ChatContainer';


const HomePage = () => {

  const { selectedConv } = useChatStore();

  return (
    <div className='h-screen bg-base-200'>
      <div className='flex items-center justify-center pt-15 sm:px-4'>
        <div className='bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-4.5rem)]'>
          <div className='flex h-full rounded-lg overflow-hidden'>
            <Sidebar/>
            {!selectedConv ? <NoChatContainer/> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
