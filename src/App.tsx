import { useState, lazy, Suspense } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import "./App.css";
import styles from "./App.module.css";
import UpdateNotification from "./components/UpdateNotification";
import Copyright from "./components/Copyright";
import background from "./img/bg.jpg";

// Lazy load Player component for code-splitting
const Player = lazy(() => import("./components/Player/Player"));

const App = () => {
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  // Register service worker with update detection
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.log("Service Worker registered:", swUrl);
      console.log("App version:", __APP_VERSION__);

      // Check for updates every hour
      if (registration) {
        setInterval(
          () => {
            console.log("Checking for service worker updates...");
            registration.update();
          },
          60 * 60 * 1000,
        ); // 1 hour
      }
    },
    onRegisterError(error) {
      console.error("Service Worker registration error:", error);
    },
    onNeedRefresh() {
      console.log("New version available!");
      setShowUpdateNotification(true);
    },
    onOfflineReady() {
      console.log("App is ready to work offline");
    },
  });

  const handleUpdate = async () => {
    setShowUpdateNotification(false);
    await updateServiceWorker(true); // true = reload page after update
  };

  const handleCloseNotification = () => {
    setShowUpdateNotification(false);
  };

  return (
    <div
      className={`App ${styles.appBackground}`}
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <header className="App-header">
        <Suspense
          fallback={<div className={styles.loadingFallback}>Loading...</div>}
        >
          <Player />
        </Suspense>
        <Copyright />
      </header>
      <UpdateNotification
        open={showUpdateNotification || needRefresh}
        onUpdate={handleUpdate}
        onClose={handleCloseNotification}
      />
    </div>
  );
};

export default App;
