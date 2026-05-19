import { Outlet } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import FocusModeOverlay from './FocusModeOverlay'

export default function Layout() {
  const { isFocusMode } = useStore()

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      {isFocusMode && <FocusModeOverlay />}
    </div>
  )
}