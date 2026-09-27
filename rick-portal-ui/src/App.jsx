import Header from "@layout/Header";
import Sidebar from "@layout/Sidebar";
import AvatarStage from "@viewport/AvatarStage";
import RightColumn from "@panels/RightColumn";
import BottomRow from "@layout/BottomRow";
import MobileDrawer from "@layout/MobileDrawer";
import MobileNav from "@layout/MobileNav";
import WidgetSuite from "@components/widgets/WidgetSuite";
import DesignSystemShowcase from "@components/design/DesignSystemShowcase";
import { useUIStore } from "@state/useUIStore";

export default function App() {
  const panel = useUIStore((s) => s.activePanel);

  let center = <AvatarStage />;
  if (panel === "widgets" || panel === "settings") center = <div style={{ gridArea: "center" }} className="overflow-y-auto"><DesignSystemShowcase /></div>;
  if (panel === "memory" || panel === "dimensions" || panel === "devices") center = <div style={{ gridArea: "center" }} className="overflow-y-auto"><WidgetSuite /></div>;

  return (
    <div className="dash-grid h-screen bg-black text-white">
      <Header />
      <MobileDrawer />
      <Sidebar />
      {center}
      <RightColumn />
      <BottomRow />
      <MobileNav />
    </div>
  );
}
