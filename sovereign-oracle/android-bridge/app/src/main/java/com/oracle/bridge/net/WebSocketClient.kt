package com.oracle.bridge.net

import android.content.Context
import android.util.Log
import com.google.gson.Gson
import com.oracle.bridge.models.CartridgeManifest
import org.java_websocket.client.WebSocketClient as WSClient
import org.java_websocket.handshake.ServerHandshake
import java.net.URI

class WebSocketClient(context: Context) {
    private val endpoint = System.getenv("VITE_WS_ENDPOINT") ?: "ws://10.0.2.2:3000/socket.io/"
    private var client: WSClient? = null
    private val gson = Gson()

    fun connect() {
        client = object : WSClient(URI.create(endpoint)) {
            override fun onOpen(handshakedata: ServerHandshake?) { Log.i("OracleWS", "connected") }
            override fun onMessage(message: String?) {}
            override fun onClose(code: Int, reason: String?, remote: Boolean) { Log.i("OracleWS", "closed: $reason") }
            override fun onError(ex: Exception?) { Log.e("OracleWS", "error", ex) }
        }
        client?.connect()
    }

    fun send(json: String) {
        if (client?.isOpen == true) client?.send(json)
    }

    fun sendCartridge(manifest: CartridgeManifest) {
        send(gson.toJson(mapOf("type" to "cartridge", "manifest" to manifest)))
    }

    fun close() { client?.close() }
}
