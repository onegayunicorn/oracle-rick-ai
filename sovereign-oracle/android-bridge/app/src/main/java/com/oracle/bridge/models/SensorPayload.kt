package com.oracle.bridge.models

data class SensorPayload(
    val ts: Long,
    val lux: Float,
    val cct: Float,
    val pressure: Float,
    val pressureThreshold: Float,
    val deviceId: String,
    val battery: Int
)

data class CartridgeManifest(
    val version: String,
    val pipeline: String,
    val pressureThreshold: Float,
    val script: String
)
