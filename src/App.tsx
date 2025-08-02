import { useEffect, useState } from 'react';
import Index from './pages/Index';
import Loader from './components/Loader';

function App() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Loader visible={showLoader} />
      <main id="main">
        <nav className="w-full fixed top-0 z-[9] px-30 py-50 flex flex-wrap md:flex-nowrap justify-between items-center text-[60rem] md:text-[13rem] mix-blend-difference cursor-grab">
          <h1 className="w-full md:w-auto text-center md:text-left mb-20 md:mb-0">#infinite-img-gallery-v1</h1>
          <div className="flex gap-50 w-full md:w-auto justify-center md:justify-end">
            <a href="https://www.x.com/rikiKDev" className="hover:underline">X</a>
            <a href="https://www.linkedin.com/in/riki-kashyap" className="hover:underline">LN</a>
            <a href="https://github.com/riki-k-dev" className="hover:underline">GH</a>
          </div>
        </nav>
        <Index />
      </main>
    </>
  );
}

export default App;
