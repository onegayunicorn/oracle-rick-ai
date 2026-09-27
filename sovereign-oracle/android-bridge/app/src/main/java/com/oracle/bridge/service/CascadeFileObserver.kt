package com.oracle.bridge.service

import android.os.FileObserver
import java.io.File

// Recursive FileObserver wrapper (cascade across subdirectories).
class CascadeFileObserver(root: File, private val onEvent: (File) -> Unit) {
    private val observers = mutableListOf<FileObserver>()

    init {
        register(root)
    }

    private fun register(dir: File) {
        if (!dir.isDirectory) return
        observers.add(object : FileObserver(dir.path, FileObserver.CLOSE_WRITE) {
            override fun onEvent(event: Int, path: String?) {
                path ?: return
                onEvent(File(dir, path))
            }
        })
        dir.listFiles()?.filter { it.isDirectory }?.forEach { register(it) }
    }

    fun start() = observers.forEach { it.startWatching() }
    fun stop() = observers.forEach { it.stopWatching() }
}
