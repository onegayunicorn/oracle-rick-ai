import Header from "@layout/Header";
import DesktopSidebar from "@layout/DesktopSidebar";
import MobileDrawer from "@layout/MobileDrawer";
import MobileNav from "@layout/MobileNav";
import PromptBar from "@layout/PromptBar";
import AvatarViewport from "@viewport/AvatarViewport";
import TelemetryOverlay from "@viewport/TelemetryOverlay";

export default function App() {
  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col">
      <Header />
      <MobileDrawer />

      <div className="flex flex-1 overflow-hidden">
        <DesktopSidebar />

        <main className="flex-1 relative">
          <AvatarViewport />
          <TelemetryOverlay />
        </main>
      </div>

      <PromptBar />
      <MobileNav />
    </div>
  );
}
