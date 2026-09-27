package com.oracle.bridge.engine

import com.google.gson.Gson
import com.oracle.bridge.models.CartridgeManifest
import java.io.File
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.zip.CRC32

// Extracts the oracle_manifest tEXt chunk from a PNG cartridge.
object PngChunkParser {
    private val MAGIC = byteArrayOf(0x89.toByte(), 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A)

    fun extractManifest(file: File): CartridgeManifest? {
        val data = file.readBytes()
        if (!data.copyOfRange(0, 8).contentEquals(MAGIC)) return null
        var offset = 8
        while (offset + 8 <= data.size) {
            val length = ByteBuffer.wrap(data, offset, 4).order(ByteOrder.BIG_ENDIAN).int
            val type = String(data, offset + 4, 4, Charsets.US_ASCII)
            val chunkData = data.copyOfRange(offset + 8, offset + 8 + length)
            if (type == "tEXt") {
                val nul = chunkData.indexOf(0)
                val keyword = String(chunkData, 0, nul, Charsets.US_ASCII)
                if (keyword == "oracle_manifest") {
                    val text = String(chunkData, nul + 1, chunkData.size - nul - 1, Charsets.UTF_8)
                    return try { Gson().fromJson(text, CartridgeManifest::class.java) } catch (_: Exception) { null }
                }
            }
            if (type == "IEND") break
            offset += 12 + length
        }
        return null
    }
}
