import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

// Layout is the shell that wraps every page.
// It shows the Sidebar (left) + Navbar (top) + whatever page content is passed as "children"
export default function Layout({ children, darkMode }) {
  const [activeTab, setActiveTab] = useState('For You')

  // We clone children to pass the activeTab prop down to them
  const childWithProps = children
    ? { ...children, props: { ...children.props, activeTab, setActiveTab } }
    : null

  return (
    <div className={`animated-bg min-h-screen ${darkMode ? '' : 'brightness-110'}`}>
      {/* Left sidebar */}
      <Sidebar />

      {/* Top navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content area — pushed right of sidebar and below navbar */}
      <main
        style={{
          marginLeft: '220px',
          paddingTop: '68px',
          minHeight: '100vh',
        }}
      >
        {childWithProps}
      </main>
    </div>
  )
}
