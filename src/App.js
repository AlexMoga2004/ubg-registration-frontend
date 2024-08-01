import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from 'react-router-dom'
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import Dashboard from './scenes/dashboard';
// import Enroll from './scenes/enroll';
// import Classes from './scenes/classes';
// import Messages from './scenes/messages';
// import FAQ from './scenes/faq';
// import ManageClasses from './scenes/global/manage_classes';
// import SignupWindows from './scenes/global/signup_windows';


function App() {
  const [theme, colorMode] = useMode(); 

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className='app'>
          <Sidebar />
          <main className='content'>
            <Topbar />
            <Routes>
              <Route path='/' element={<Dashboard />} />
              {/* <Route path='/enroll' element={<Enroll />} /> */}
              {/* <Route path='/classes' element={<Classes />} /> */}
              {/* <Route path='/messages' element={<Messages />} /> */}
              {/* <Route path='/faq' element={<FAQ />} /> */}
              {/* <Route path='/manage_modules' element={<ManageModules />} /> */}
              {/* <Route path='/signup_windows' element={<SignupWindows />} /> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
