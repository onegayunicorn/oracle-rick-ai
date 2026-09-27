package com.oracle.bridge.service

import android.app.Service
import android.content.Intent
import android.os.FileObserver
import android.os.IBinder
import com.oracle.bridge.engine.PngChunkParser
import com.oracle.bridge.net.WebSocketClient
import java.io.File

// Foreground inotify FileObserver: watches the cartridge directory for new PNG
// cartridges, parses the embedded tEXt manifest, and pushes it to the nexus.
class CartridgeWatcherService : Service() {
    private var observer: FileObserver? = null
    private lateinit var ws: WebSocketClient
    private val watchDir = File(getExternalFilesDir(null), "cartridges")

    override fun onCreate() {
        super.onCreate()
        watchDir.mkdirs()
        ws = WebSocketClient(this)
        ws.connect()
        observer = object : FileObserver(watchDir.path, CREATE or CLOSE_WRITE) {
            override fun onEvent(event: Int, path: String?) {
                path ?: return
                val f = File(watchDir, path)
                if (f.extension.lowercase() == "png") {
                    val manifest = PngChunkParser.extractManifest(f)
                    if (manifest != null) ws.sendCartridge(manifest)
                }
            }
        }
        observer?.startWatching()
    }

    override fun onBind(intent: Intent?): IBinder? = null
    override fun onDestroy() { observer?.stopWatching(); ws.close(); super.onDestroy() }
}
