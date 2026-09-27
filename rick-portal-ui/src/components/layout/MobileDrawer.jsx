import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@state/useUIStore";

const items = ["History", "Inventions", "Status", "Projects", "Downloads", "Settings"];

export default function MobileDrawer() {
  const open = useUIStore((state) => state.mobileMenuOpen);
  const close = useUIStore((state) => state.closeMobileMenu);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed left-0 top-0 h-full w-72 bg-zinc-950 z-50 border-r border-cyan-400/20"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "tween", duration: 0.25 }}
          >
            <div className="p-6">
              <h2 className="text-portal-green mb-8 font-telemetry">Portal Navigation</h2>
              {items.map((item) => (
                <button
                  key={item}
                  className="block w-full text-left py-4 text-text-secondary hover:text-portal-green"
                  onClick={close}
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
